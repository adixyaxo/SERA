import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERA_SYSTEM_PROMPT = `You are SERA (Smart Everyday Routine Assistant), an intelligent AI assistant that helps users manage their tasks, schedules, habits, notes, and daily routines.

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no extra text.

Your capabilities:
1. Task Management: Create, update, reschedule, complete, and delete tasks
2. Event Management: Create, update, and delete calendar events
3. Habit Management: Create and delete habits
4. Note Management: Create and update notes
5. Smart Scheduling: Suggest optimal times and priorities
6. Analytics & Insights: Answer questions about productivity stats
7. Conversational: Respond naturally while extracting actionable information

For task-related requests, extract:
- intent: create_task | update_task | reschedule_task | complete_task | delete_task | query_tasks
- title, description, priority (high|medium|low), deadline (ISO date), gtd_status (NOW|NEXT|LATER), project

For event-related requests, extract:
- intent: create_event | update_event | delete_event
- title, description, start_time (ISO datetime), end_time (ISO datetime), all_day (boolean), color

For habit-related requests, extract:
- intent: create_habit | delete_habit
- name, category, frequency (daily|weekly)

For note-related requests, extract:
- intent: create_note | update_note
- title, content

For general queries:
- intent: general_chat | query_tasks | query_events | query_habits | query_analytics

ALWAYS respond with this exact JSON structure:
{"message":"Your friendly response here","action":{"intent":"intent_type","data":{"title":"","description":"","priority":"medium","deadline":null,"gtd_status":"NEXT","start_time":null,"end_time":null,"all_day":false,"name":"","category":"","frequency":"daily","content":"","color":null},"confidence":0.95}}

For general chat/greetings:
{"message":"Your friendly response","action":{"intent":"general_chat","confidence":1.0}}

Current date: ${new Date().toISOString()}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user context in parallel
    const [tasksRes, eventsRes, habitsRes, notesRes] = await Promise.all([
      supabaseClient
        .from('cards')
        .select('title, status, priority, gtd_status, deadline')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .limit(10),
      supabaseClient
        .from('events')
        .select('title, start_time, end_time, all_day')
        .eq('user_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5),
      supabaseClient
        .from('habits')
        .select('name, category, frequency')
        .eq('user_id', user.id)
        .eq('archived', false)
        .limit(10),
      supabaseClient
        .from('notes')
        .select('title')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5),
    ]);

    let context = '';

    const tasks = tasksRes.data || [];
    if (tasks.length > 0) {
      context += `\n\nUser's active tasks:\n${tasks.map(t => 
        `- ${t.title} (${t.gtd_status}, ${t.priority} priority${t.deadline ? `, due: ${t.deadline}` : ''})`
      ).join('\n')}`;
    } else {
      context += '\n\nUser has no active tasks.';
    }

    const events = eventsRes.data || [];
    if (events.length > 0) {
      context += `\n\nUpcoming events:\n${events.map(e => 
        `- ${e.title} (${e.start_time}${e.all_day ? ', all day' : ''})`
      ).join('\n')}`;
    }

    const habits = habitsRes.data || [];
    if (habits.length > 0) {
      context += `\n\nUser's habits:\n${habits.map(h => 
        `- ${h.name} (${h.frequency}, ${h.category || 'General'})`
      ).join('\n')}`;
    }

    const notes = notesRes.data || [];
    if (notes.length > 0) {
      context += `\n\nRecent notes: ${notes.map(n => n.title).join(', ')}`;
    }

    const messages = [
      { role: 'system', content: SERA_SYSTEM_PROMPT + context },
      ...conversationHistory.slice(-10),
      { role: 'user', content: message }
    ];

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI service error');
    }

    const aiData = await aiResponse.json();
    let assistantMessage = aiData.choices?.[0]?.message?.content;

    if (!assistantMessage) throw new Error('No response from AI');

    // Clean up markdown formatting
    assistantMessage = assistantMessage.trim();
    if (assistantMessage.startsWith('```json')) assistantMessage = assistantMessage.slice(7);
    else if (assistantMessage.startsWith('```')) assistantMessage = assistantMessage.slice(3);
    if (assistantMessage.endsWith('```')) assistantMessage = assistantMessage.slice(0, -3);
    assistantMessage = assistantMessage.trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(assistantMessage);
      if (!parsedResponse.message) parsedResponse.message = "I understand. Let me help you with that.";
      if (!parsedResponse.action) parsedResponse.action = { intent: 'general_chat', confidence: 1.0 };
    } catch {
      parsedResponse = {
        message: assistantMessage,
        action: { intent: 'general_chat', confidence: 1.0 }
      };
    }

    console.log('SERA response:', JSON.stringify(parsedResponse, null, 2));

    return new Response(
      JSON.stringify({ success: true, response: parsedResponse, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SERA error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
