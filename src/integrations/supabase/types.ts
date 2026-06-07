export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      card_tags: {
        Row: {
          card_id: string | null
          created_at: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_tags_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["card_id"]
          },
          {
            foreignKeyName: "card_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          alternatives: Json | null
          card_id: string
          completed_at: string | null
          confidence: number | null
          created_at: string | null
          deadline: string | null
          description: string | null
          gtd_status: string | null
          id: string
          metadata: Json | null
          primary_action: Json | null
          priority: string | null
          project_id: string | null
          status: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          alternatives?: Json | null
          card_id: string
          completed_at?: string | null
          confidence?: number | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          gtd_status?: string | null
          id?: string
          metadata?: Json | null
          primary_action?: Json | null
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          alternatives?: Json | null
          card_id?: string
          completed_at?: string | null
          confidence?: number | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          gtd_status?: string | null
          id?: string
          metadata?: Json | null
          primary_action?: Json | null
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          all_day: boolean | null
          color: string | null
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          date_string: string
          habit_id: string
          id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date_string: string
          habit_id: string
          id?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date_string?: string
          habit_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          archived: boolean
          category: string | null
          created_at: string
          frequency: string
          id: string
          name: string
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          category?: string | null
          created_at?: string
          frequency?: string
          id?: string
          name: string
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          category?: string | null
          created_at?: string
          frequency?: string
          id?: string
          name?: string
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      monk_daily_plans: {
        Row: {
          created_at: string
          energy_forecast: number | null
          frog_task_id: string | null
          id: string
          intention: string | null
          plan_date: string
          planned_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          energy_forecast?: number | null
          frog_task_id?: string | null
          id?: string
          intention?: string | null
          plan_date: string
          planned_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          energy_forecast?: number | null
          frog_task_id?: string | null
          id?: string
          intention?: string | null
          plan_date?: string
          planned_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monk_daily_plans_frog_task_id_fkey"
            columns: ["frog_task_id"]
            isOneToOne: false
            referencedRelation: "monk_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      monk_journal_entries: {
        Row: {
          clarity: number | null
          created_at: string
          energy: number | null
          entry_date: string
          free_form: string | null
          id: string
          improve_tomorrow: string | null
          mood: string | null
          time_wasted: string | null
          updated_at: string
          user_id: string
          went_well: string | null
        }
        Insert: {
          clarity?: number | null
          created_at?: string
          energy?: number | null
          entry_date: string
          free_form?: string | null
          id?: string
          improve_tomorrow?: string | null
          mood?: string | null
          time_wasted?: string | null
          updated_at?: string
          user_id: string
          went_well?: string | null
        }
        Update: {
          clarity?: number | null
          created_at?: string
          energy?: number | null
          entry_date?: string
          free_form?: string | null
          id?: string
          improve_tomorrow?: string | null
          mood?: string | null
          time_wasted?: string | null
          updated_at?: string
          user_id?: string
          went_well?: string | null
        }
        Relationships: []
      }
      monk_schedule_checkins: {
        Row: {
          check_date: string
          created_at: string
          id: string
          note: string | null
          status: string
          timetable_entry_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          check_date: string
          created_at?: string
          id?: string
          note?: string | null
          status?: string
          timetable_entry_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          check_date?: string
          created_at?: string
          id?: string
          note?: string | null
          status?: string
          timetable_entry_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      monk_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          estimate_minutes: number | null
          id: string
          notes: string | null
          order_index: number
          origin_date: string
          plan_date: string
          postpone_count: number
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          estimate_minutes?: number | null
          id?: string
          notes?: string | null
          order_index?: number
          origin_date?: string
          plan_date: string
          postpone_count?: number
          priority?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          estimate_minutes?: number | null
          id?: string
          notes?: string | null
          order_index?: number
          origin_date?: string
          plan_date?: string
          postpone_count?: number
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          notification_email: boolean | null
          notification_push: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          notification_email?: boolean | null
          notification_push?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          notification_email?: boolean | null
          notification_push?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      timetable_entries: {
        Row: {
          color: string | null
          created_at: string
          day_of_week: number
          description: string | null
          end_time: string
          id: string
          location: string | null
          repeat_type: string | null
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          day_of_week: number
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          repeat_type?: string | null
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          day_of_week?: number
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          repeat_type?: string | null
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_calibration: {
        Row: {
          blackout_hours: Json | null
          buffer_minutes: number | null
          chronotype: Database["public"]["Enums"]["chronotype_type"] | null
          communication_style:
            | Database["public"]["Enums"]["communication_style"]
            | null
          commute: Database["public"]["Enums"]["commute_type"] | null
          commute_duration_minutes: number | null
          created_at: string
          deep_work_end: number | null
          deep_work_start: number | null
          energy_windows: Json | null
          id: string
          max_focus_hours: number | null
          methodology: Database["public"]["Enums"]["methodology_type"] | null
          notes_destination: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          open_loop_handling: string | null
          primary_calendar: string | null
          priority_contacts: Json | null
          proactivity: Database["public"]["Enums"]["proactivity_type"] | null
          scenario_response: string | null
          slump_end: number | null
          slump_start: number | null
          updated_at: string
          urgency_threshold_minutes: number | null
          user_id: string
          voice_mode_on_transit: boolean | null
          wake_time: string | null
          wind_down_time: string | null
        }
        Insert: {
          blackout_hours?: Json | null
          buffer_minutes?: number | null
          chronotype?: Database["public"]["Enums"]["chronotype_type"] | null
          communication_style?:
            | Database["public"]["Enums"]["communication_style"]
            | null
          commute?: Database["public"]["Enums"]["commute_type"] | null
          commute_duration_minutes?: number | null
          created_at?: string
          deep_work_end?: number | null
          deep_work_start?: number | null
          energy_windows?: Json | null
          id?: string
          max_focus_hours?: number | null
          methodology?: Database["public"]["Enums"]["methodology_type"] | null
          notes_destination?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          open_loop_handling?: string | null
          primary_calendar?: string | null
          priority_contacts?: Json | null
          proactivity?: Database["public"]["Enums"]["proactivity_type"] | null
          scenario_response?: string | null
          slump_end?: number | null
          slump_start?: number | null
          updated_at?: string
          urgency_threshold_minutes?: number | null
          user_id: string
          voice_mode_on_transit?: boolean | null
          wake_time?: string | null
          wind_down_time?: string | null
        }
        Update: {
          blackout_hours?: Json | null
          buffer_minutes?: number | null
          chronotype?: Database["public"]["Enums"]["chronotype_type"] | null
          communication_style?:
            | Database["public"]["Enums"]["communication_style"]
            | null
          commute?: Database["public"]["Enums"]["commute_type"] | null
          commute_duration_minutes?: number | null
          created_at?: string
          deep_work_end?: number | null
          deep_work_start?: number | null
          energy_windows?: Json | null
          id?: string
          max_focus_hours?: number | null
          methodology?: Database["public"]["Enums"]["methodology_type"] | null
          notes_destination?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          open_loop_handling?: string | null
          primary_calendar?: string | null
          priority_contacts?: Json | null
          proactivity?: Database["public"]["Enums"]["proactivity_type"] | null
          scenario_response?: string | null
          slump_end?: number | null
          slump_start?: number | null
          updated_at?: string
          urgency_threshold_minutes?: number | null
          user_id?: string
          voice_mode_on_transit?: boolean | null
          wake_time?: string | null
          wind_down_time?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          cards: Json | null
          created_at: string | null
          id: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          cards?: Json | null
          created_at?: string | null
          id?: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          cards?: Json | null
          created_at?: string | null
          id?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      monk_carry_forward: {
        Args: { _from_date: string; _to_date: string; _user_id: string }
        Returns: number
      }
    }
    Enums: {
      chronotype_type: "morning_lark" | "night_owl" | "third_bird"
      communication_style: "concise" | "conversational"
      commute_type: "walking" | "driving" | "public_transit" | "remote"
      methodology_type:
        | "gtd"
        | "time_blocking"
        | "nuke_the_day"
        | "pomodoro"
        | "organic"
      proactivity_type: "co_pilot" | "chief_of_staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      chronotype_type: ["morning_lark", "night_owl", "third_bird"],
      communication_style: ["concise", "conversational"],
      commute_type: ["walking", "driving", "public_transit", "remote"],
      methodology_type: [
        "gtd",
        "time_blocking",
        "nuke_the_day",
        "pomodoro",
        "organic",
      ],
      proactivity_type: ["co_pilot", "chief_of_staff"],
    },
  },
} as const
