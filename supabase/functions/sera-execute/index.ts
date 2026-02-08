import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const executeActionSchema = z.object({
  intent: z.enum([
    'create_task', 'update_task', 'complete_task', 'delete_task', 'reschedule_task',
    'create_event', 'update_event', 'delete_event',
    'create_habit', 'delete_habit',
    'create_note', 'update_note',
  ]),
  data: z.record(z.any()),
});

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

    const body = await req.json();
    const validation = executeActionSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { intent, data } = validation.data;
    let result;

    switch (intent) {
      // ===== TASK OPERATIONS =====
      case 'create_task': {
        const card_id = `sera_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const { data: newTask, error } = await supabaseClient
          .from('cards')
          .insert({
            card_id,
            user_id: user.id,
            type: 'task',
            title: data.title || 'Untitled Task',
            description: data.description || '',
            priority: data.priority || 'medium',
            gtd_status: data.gtd_status || 'NEXT',
            deadline: data.deadline || null,
            project_id: data.project_id || null,
            status: 'pending',
          })
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Task created', task: newTask };
        break;
      }

      case 'update_task': {
        const { card_id, updates, ...updateFields } = data;
        const actualUpdates = updates || updateFields;
        const { data: updatedTask, error } = await supabaseClient
          .from('cards')
          .update(actualUpdates)
          .eq('card_id', card_id)
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Task updated', task: updatedTask };
        break;
      }

      case 'complete_task': {
        const { data: completedTask, error } = await supabaseClient
          .from('cards')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('card_id', data.card_id)
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Task completed', task: completedTask };
        break;
      }

      case 'delete_task': {
        const { error } = await supabaseClient
          .from('cards')
          .delete()
          .eq('card_id', data.card_id)
          .eq('user_id', user.id);
        if (error) throw error;
        result = { action: 'Task deleted', card_id: data.card_id };
        break;
      }

      case 'reschedule_task': {
        const updates: Record<string, any> = {};
        if (data.new_deadline || data.deadline) updates.deadline = data.new_deadline || data.deadline;
        if (data.new_gtd_status || data.gtd_status) updates.gtd_status = data.new_gtd_status || data.gtd_status;
        const { data: rescheduled, error } = await supabaseClient
          .from('cards')
          .update(updates)
          .eq('card_id', data.card_id)
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Task rescheduled', task: rescheduled };
        break;
      }

      // ===== EVENT OPERATIONS =====
      case 'create_event': {
        const { data: newEvent, error } = await supabaseClient
          .from('events')
          .insert({
            user_id: user.id,
            title: data.title || 'Untitled Event',
            description: data.description || '',
            start_time: data.start_time || new Date().toISOString(),
            end_time: data.end_time || null,
            all_day: data.all_day || false,
            color: data.color || null,
          })
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Event created', event: newEvent };
        break;
      }

      case 'update_event': {
        const { id, ...eventUpdates } = data;
        const { data: updatedEvent, error } = await supabaseClient
          .from('events')
          .update(eventUpdates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Event updated', event: updatedEvent };
        break;
      }

      case 'delete_event': {
        const { error } = await supabaseClient
          .from('events')
          .delete()
          .eq('id', data.id)
          .eq('user_id', user.id);
        if (error) throw error;
        result = { action: 'Event deleted', id: data.id };
        break;
      }

      // ===== HABIT OPERATIONS =====
      case 'create_habit': {
        const { data: newHabit, error } = await supabaseClient
          .from('habits')
          .insert({
            user_id: user.id,
            name: data.name || 'New Habit',
            category: data.category || 'General',
            frequency: data.frequency || 'daily',
            start_date: new Date().toISOString().split('T')[0],
          })
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Habit created', habit: newHabit };
        break;
      }

      case 'delete_habit': {
        const { error } = await supabaseClient
          .from('habits')
          .delete()
          .eq('id', data.id)
          .eq('user_id', user.id);
        if (error) throw error;
        result = { action: 'Habit deleted', id: data.id };
        break;
      }

      // ===== NOTE OPERATIONS =====
      case 'create_note': {
        const { data: newNote, error } = await supabaseClient
          .from('notes')
          .insert({
            user_id: user.id,
            title: data.title || 'Untitled Note',
            content: data.content || '',
          })
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Note created', note: newNote };
        break;
      }

      case 'update_note': {
        const { id, ...noteUpdates } = data;
        const { data: updatedNote, error } = await supabaseClient
          .from('notes')
          .update(noteUpdates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) throw error;
        result = { action: 'Note updated', note: updatedNote };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown intent' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log('SERA Execute:', JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify({ success: true, result, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SERA Execute error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
