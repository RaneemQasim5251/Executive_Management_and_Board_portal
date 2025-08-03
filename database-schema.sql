-- Executive Management Portal Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('board_chairman', 'ceo', 'cfo', 'cto', 'executive', 'board_member');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed', 'on_hold');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE event_type AS ENUM ('milestone', 'meeting', 'deadline', 'launch', 'strategic_initiative', 'board_meeting');
CREATE TYPE event_status AS ENUM ('completed', 'in_progress', 'planned');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'executive',
  avatar_url TEXT,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'planning',
  priority priority_level NOT NULL DEFAULT 'medium',
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(15,2),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_to UUID REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  stakeholders TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  risks TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority priority_level NOT NULL DEFAULT 'medium',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.users(id),
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  tags TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline Events table
CREATE TABLE public.timeline_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type event_type NOT NULL DEFAULT 'milestone',
  status event_status NOT NULL DEFAULT 'planned',
  priority priority_level NOT NULL DEFAULT 'medium',
  stakeholders TEXT[] DEFAULT '{}',
  budget DECIMAL(15,2),
  outcomes TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  location TEXT,
  duration_hours INTEGER,
  board_approval BOOLEAN DEFAULT FALSE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table (for tasks, projects, and timeline events)
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('task', 'project', 'timeline_event')),
  entity_id UUID NOT NULL,
  author_id UUID REFERENCES public.users(id) NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KPIs table (for dashboard metrics)
CREATE TABLE public.kpis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  target DECIMAL(15,2),
  unit TEXT DEFAULT '',
  category TEXT NOT NULL,
  period TEXT NOT NULL, -- 'monthly', 'quarterly', 'yearly'
  date DATE NOT NULL,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_assigned_to ON public.projects(assigned_to);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);
CREATE INDEX idx_projects_start_date ON public.projects(start_date);

CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

CREATE INDEX idx_timeline_events_date ON public.timeline_events(event_date);
CREATE INDEX idx_timeline_events_status ON public.timeline_events(status);
CREATE INDEX idx_timeline_events_type ON public.timeline_events(event_type);

CREATE INDEX idx_comments_entity ON public.comments(entity_type, entity_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);

CREATE INDEX idx_kpis_category_date ON public.kpis(category, date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (all authenticated users can access - suitable for executive portal)
CREATE POLICY "Authenticated users can view all users" ON public.users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view all projects" ON public.projects
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all tasks" ON public.tasks
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all timeline events" ON public.timeline_events
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all comments" ON public.comments
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view all KPIs" ON public.kpis
  FOR ALL TO authenticated USING (true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_events_updated_at BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO public.users (id, email, name, role, department) VALUES
  (uuid_generate_v4(), 'board@company.com', 'Board Chairman', 'board_chairman', 'Board of Directors'),
  (uuid_generate_v4(), 'ceo@company.com', 'Chief Executive Officer', 'ceo', 'Executive'),
  (uuid_generate_v4(), 'cfo@company.com', 'Chief Financial Officer', 'cfo', 'Finance'),
  (uuid_generate_v4(), 'cto@company.com', 'Chief Technology Officer', 'cto', 'Technology');

-- Insert sample projects
WITH user_ids AS (
  SELECT id, email FROM public.users WHERE email = 'ceo@company.com'
)
INSERT INTO public.projects (title, description, status, priority, start_date, end_date, budget, progress, created_by)
SELECT 
  'Digital Transformation Initiative',
  'Company-wide digital transformation program with focus on AI integration and process automation',
  'in_progress',
  'critical',
  '2024-01-15',
  '2024-12-31',
  2500000.00,
  65,
  user_ids.id
FROM user_ids;

-- Insert sample timeline events
WITH user_ids AS (
  SELECT id, email FROM public.users WHERE email = 'board@company.com'
)
INSERT INTO public.timeline_events (title, description, event_date, event_type, status, priority, stakeholders, board_approval, created_by)
SELECT 
  'Q1 Board Meeting - Strategic Review',
  'Quarterly board meeting: 23% revenue growth approved, strategic initiatives reviewed, and market expansion strategy finalized for APAC region',
  '2024-03-20',
  'board_meeting',
  'completed',
  'critical',
  ARRAY['Board of Directors', 'C-Suite Leadership'],
  true,
  user_ids.id
FROM user_ids;

-- Insert sample KPIs
WITH user_ids AS (
  SELECT id, email FROM public.users WHERE email = 'ceo@company.com'
)
INSERT INTO public.kpis (name, value, target, unit, category, period, date, created_by)
SELECT * FROM (VALUES
  ('Total Revenue', 68000000.00, 75000000.00, 'USD', 'Financial', 'yearly', '2024-01-01'),
  ('Active Projects', 28, 35, 'count', 'Operations', 'monthly', '2024-01-01'),
  ('Team Members', 250, 300, 'count', 'HR', 'monthly', '2024-01-01'),
  ('Success Rate', 94.5, 90.0, '%', 'Performance', 'quarterly', '2024-01-01')
) AS kpi_data(name, value, target, unit, category, period, date)
CROSS JOIN user_ids;