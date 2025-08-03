import { createClient } from "@supabase/supabase-js";

// Supabase configuration with demo fallback
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://demo.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "demo-anon-key";

// For demo purposes, create a mock client if no real Supabase config
const createSupabaseClient = () => {
  // Check if we have valid Supabase configuration
  const hasValidConfig = SUPABASE_URL !== "https://demo.supabase.co" && 
                        SUPABASE_ANON_KEY !== "demo-anon-key" &&
                        SUPABASE_URL.includes('supabase.co');
  
  if (!hasValidConfig) {
    console.warn('Demo mode: Using mock Supabase client');
    // Return a basic client for demo - will be handled by auth provider
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-my-custom-header': 'executive-portal'
      }
    }
  });
};

export const supabase = createSupabaseClient();

// Database Types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
          priority: 'low' | 'medium' | 'high' | 'critical';
          start_date: string;
          end_date?: string;
          budget?: number;
          assigned_to?: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
          priority: 'low' | 'medium' | 'high' | 'critical';
          start_date: string;
          end_date?: string;
          budget?: number;
          assigned_to?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'planning' | 'in_progress' | 'completed' | 'on_hold';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          start_date?: string;
          end_date?: string;
          budget?: number;
          assigned_to?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description?: string;
          status: 'todo' | 'in_progress' | 'review' | 'done';
          priority: 'low' | 'medium' | 'high' | 'critical';
          project_id?: string;
          assigned_to?: string;
          due_date?: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          status: 'todo' | 'in_progress' | 'review' | 'done';
          priority: 'low' | 'medium' | 'high' | 'critical';
          project_id?: string;
          assigned_to?: string;
          due_date?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'todo' | 'in_progress' | 'review' | 'done';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          project_id?: string;
          assigned_to?: string;
          due_date?: string;
          updated_at?: string;
        };
      };
      timeline_events: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          event_type: 'milestone' | 'meeting' | 'deadline' | 'launch';
          status: 'completed' | 'in_progress' | 'planned';
          priority: 'low' | 'medium' | 'high' | 'critical';
          stakeholders: string[];
          budget?: number;
          outcomes?: string[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          event_date: string;
          event_type: 'milestone' | 'meeting' | 'deadline' | 'launch';
          status: 'completed' | 'in_progress' | 'planned';
          priority: 'low' | 'medium' | 'high' | 'critical';
          stakeholders: string[];
          budget?: number;
          outcomes?: string[];
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          event_date?: string;
          event_type?: 'milestone' | 'meeting' | 'deadline' | 'launch';
          status?: 'completed' | 'in_progress' | 'planned';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          stakeholders?: string[];
          budget?: number;
          outcomes?: string[];
          updated_at?: string;
        };
      };
    };
  };
}