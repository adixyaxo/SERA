import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const since = new Date(Date.now() - 14 * 86400 * 1000).toISOString().slice(0, 10);
    const [{ data: tasks }, { data: journals }, { data: checkins }] = await Promise.all([
      supabase.from('monk_tasks').select('plan_date, completed_at, priority, postpone_count, estimate_minutes').eq('user_id', user.id).gte('plan_date', since),
      supabase.from('monk_journal_entries').select('entry_date, energy, clarity, mood, went_well, time_wasted').eq('user_id', user.id).gte('entry_date', since),
      supabase.from('monk_schedule_checkins').select('check_date, status').eq('user_id', user.id).gte('check_date', since),
    ]);

    const summary = {
      window_days: 14,
      total_tasks: tasks?.length ?? 0,
      completed_tasks: tasks?.filter(t => t.completed_at).length ?? 0,
      avg_postpone: tasks?.length ? (tasks.reduce((s, t) => s + (t.postpone_count || 0), 0) / tasks.length).toFixed(2) : 0,
      frogs_attempted: tasks?.filter(t => t.priority === 'frog').length ?? 0,
      frogs_completed: tasks?.filter(t => t.priority === 'frog' && t.completed_at).length ?? 0,
      schedule_followed: checkins?.filter(c => c.status === 'followed').length ?? 0,
      schedule_skipped: checkins?.filter(c => c.status === 'skipped').length ?? 0,
      journal_days: journals?.length ?? 0,
      energy_avg: journals?.length ? (journals.reduce((s, j) => s + (j.energy || 0), 0) / journals.length).toFixed(1) : null,
      clarity_avg: journals?.length ? (journals.reduce((s, j) => s + (j.clarity || 0), 0) / journals.length).toFixed(1) : null,
      recent_struggles: journals?.map(j => j.time_wasted).filter(Boolean).slice(0, 5),
      recent_wins: journals?.map(j => j.went_well).filter(Boolean).slice(0, 5),
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const prompt = `You are a calm, honest discipline coach inside the user's productivity OS. Analyze the user's last 14 days and return 3 short paragraphs (no headers, no markdown, ~80 words total):
1) The single clearest pattern in their execution.
2) What's most likely silently sabotaging them.
3) One concrete change to try tomorrow.

Be direct. No fluff, no flattery. If data is sparse, say so plainly and suggest what to track.

Data:
${JSON.stringify(summary, null, 2)}`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ error: 'AI error', detail: txt }), { status: aiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const aiJson = await aiRes.json();
    const insight = aiJson.choices?.[0]?.message?.content ?? 'No insight returned.';

    return new Response(JSON.stringify({ insight, summary }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
