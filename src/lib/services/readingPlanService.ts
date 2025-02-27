import { createClient } from '@supabase/supabase-js';
import type { ReadingPlan, UserPlanProgress } from '@/lib/types/readingPlan';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getReadingPlan(planId: string): Promise<ReadingPlan | null> {
  try {
    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('reading_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;
    if (!plan) return null;

    // Get plan content
    const { data: content, error: contentError } = await supabase
      .from('plan_content')
      .select('*')
      .eq('plan_id', planId)
      .order('day');

    if (contentError) throw contentError;

    return {
      ...plan,
      content: content || []
    };
  } catch (error) {
    console.error('Error fetching reading plan:', error);
    return null;
  }
}

export async function getUserPlanProgress(planId: string): Promise<UserPlanProgress | null> {
  try {
    const { data: progress, error } = await supabase
      .from('user_plan_progress')
      .select('*')
      .eq('plan_id', planId)
      .single();

    if (error) throw error;
    return progress;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return null;
  }
}

export async function startPlan(planId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_plan_progress')
      .insert({
        plan_id: planId,
        current_day: 1,
        completed: false,
        completed_days: []
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error starting plan:', error);
    return false;
  }
}

export async function markDayComplete(planId: string, day: number): Promise<boolean> {
  try {
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_plan_progress')
      .select('completed_days, days')
      .eq('plan_id', planId)
      .single();

    if (fetchError) throw fetchError;

    const completedDays = [...new Set([...currentProgress.completed_days, day])];
    const isCompleted = completedDays.length === currentProgress.days;

    const { error: updateError } = await supabase
      .from('user_plan_progress')
      .update({
        current_day: isCompleted ? currentProgress.days : Math.min(day + 1, currentProgress.days),
        completed_days: completedDays,
        completed: isCompleted,
        last_read_date: new Date().toISOString()
      })
      .eq('plan_id', planId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error marking day complete:', error);
    return false;
  }
}

export async function searchPlans(query: string, category?: string): Promise<ReadingPlan[]> {
  try {
    let supabaseQuery = supabase
      .from('reading_plans')
      .select('*');

    if (category && category !== 'All') {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching plans:', error);
    return [];
  }
}
