-- Enhanced Executive Management Portal Database Schema
-- Production-ready schema with security, audit trails, and AI features
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For better indexing

-- Create enhanced custom types
CREATE TYPE user_role AS ENUM ('board_chairman', 'ceo', 'cfo', 'cto', 'executive', 'board_member', 'admin', 'viewer');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'blocked');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE event_type AS ENUM ('milestone', 'meeting', 'deadline', 'launch', 'strategic_initiative', 'board_meeting', 'review', 'audit');
CREATE TYPE event_status AS ENUM ('completed', 'in_progress', 'planned', 'cancelled');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'error', 'success', 'urgent');
CREATE TYPE ai_query_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'approve', 'reject');

-- Enhanced Users table with theme preferences and security
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'executive',
  avatar_url TEXT,
  department TEXT,
  phone TEXT,
  
  -- Theme and accessibility preferences
  theme_preferences JSONB DEFAULT '{
    "mode": "light",
    "fontSize": "medium",
    "motionPreference": "full",
    "highContrast": false,
    "reducedTransparency": false,
    "focusRingVisible": true,
    "colorBlindnessSupport": false
  }'::jsonb,
  
  -- Security settings
  mfa_enabled BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Permissions and access control
  permissions JSONB DEFAULT '[]'::jsonb,
  access_level INTEGER DEFAULT 1 CHECK (access_level >= 1 AND access_level <= 10),
  
  -- Metadata
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'planning',
  priority priority_level NOT NULL DEFAULT 'medium',
  start_date DATE NOT NULL,
  end_date DATE,
  actual_end_date DATE,
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_to UUID REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  approved_by UUID REFERENCES public.users(id),
  
  -- Enhanced project data
  stakeholders JSONB DEFAULT '[]'::jsonb,
  objectives JSONB DEFAULT '[]'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  milestones JSONB DEFAULT '[]'::jsonb,
  kpis JSONB DEFAULT '{}'::jsonb,
  
  -- Business metadata
  company_id UUID, -- For multi-company support
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Search and indexing
  search_vector tsvector,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority priority_level NOT NULL DEFAULT 'medium',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  
  -- Enhanced task data
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Dependencies and relationships
  depends_on UUID[] DEFAULT '{}', -- Task IDs this task depends on
  blocks UUID[] DEFAULT '{}', -- Task IDs this task blocks
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]'::jsonb,
  checklist JSONB DEFAULT '[]'::jsonb,
  
  -- Search
  search_vector tsvector,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Timeline Events table
CREATE TABLE public.timeline_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE, -- For multi-day events
  event_type event_type NOT NULL DEFAULT 'milestone',
  status event_status NOT NULL DEFAULT 'planned',
  priority priority_level NOT NULL DEFAULT 'medium',
  
  -- Enhanced event data
  stakeholders JSONB DEFAULT '[]'::jsonb,
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  outcomes JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Meeting/Event specific
  location TEXT,
  virtual_meeting_url TEXT,
  duration_hours DECIMAL(4,2),
  attendees JSONB DEFAULT '[]'::jsonb,
  agenda JSONB DEFAULT '[]'::jsonb,
  
  -- Approval workflow
  board_approval BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES public.users(id),
  approval_date TIMESTAMP WITH TIME ZONE,
  
  -- Relationships
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  parent_event_id UUID REFERENCES public.timeline_events(id) ON DELETE SET NULL,
  
  -- Metadata
  created_by UUID REFERENCES public.users(id) NOT NULL,
  search_vector tsvector,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Comments table with threading and reactions
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('task', 'project', 'timeline_event', 'kpi', 'user')),
  entity_id UUID NOT NULL,
  author_id UUID REFERENCES public.users(id) NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,

CREATE TABLE private.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  content TEXT NOT NULL, 
  entity_type TEXT NOT NULL CHECK (entity_type IN ('task', 'project', 'timeline_event', 'kpi', 'user')), 
  entity_id UUID NOT NULL, 
  author_id UUID REFERENCES public.users(id) NOT NULL, 
  parent_id(UUID REFERENCES private.comments(id) ON DELETE CASCADE)
  attachments JSONB DEFAULT '[]' ::jsonb, 
  mentions JSONB DEFAULT '[]', 
  reactions JSONB DEFAULT '{}'::jsonb, 
  is_private BOOLEAN DEFAULT TRUE,
  is resolved BOOLEAN DEFAULT FALSE, 
  resolved_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  search_vector tsvector,
  visibility INTEGER DEFAULT 1, 
  PRIMARY KEY (id, is private), 
  UNIQUE (entity_type, entity_id, author_id, parent_id), 
  CONSTRAINT CHECK (is_private = TRUE), 
  CONSTRAINT CHECK (visibility >= 1 AND visibility <= 4), 
  CONSTRAINT CHECK (entity_type IN ('task', 'project', 'timeline_event', 'kpi', 'user'))
  CONSTRAINT CHECK (is_resolved = FALSE), 
  UNIQUE (entity_type, entity_id), 
  created_by UUID REFERENCES public.users(id)
)
  
  -- Enhanced comment features
  attachments JSONB DEFAULT '[]'::jsonb,
  mentions JSONB DEFAULT '[]'::jsonb, -- User IDs mentioned in comment
  reactions JSONB DEFAULT '{}'::jsonb, -- {emoji: [user_ids]}
  is_private BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Visibility control
  visibility_level INTEGER DEFAULT 1, -- 1=public, 2=team, 3=executives, 4=board
  
  -- Search
  search_vector tsvector,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced KPIs table with historical tracking
CREATE TABLE public.kpis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  value DECIMAL(15,4) NOT NULL,
  target DECIMAL(15,4),
  previous_value DECIMAL(15,4),
  unit TEXT DEFAULT '',
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- Time series data
  period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
  date DATE NOT NULL,
  
  -- Calculation metadata
  calculation_method TEXT,
  data_sources JSONB DEFAULT '[]'::jsonb,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Thresholds and alerts
  warning_threshold DECIMAL(15,4),
  critical_threshold DECIMAL(15,4),
  is_higher_better BOOLEAN DEFAULT TRUE,
  
  -- Business context
  owner_id UUID REFERENCES public.users(id),
  stakeholders JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint for time series
  UNIQUE(name, category, period, date)
);

-- Notifications table for real-time updates
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  
  -- Related entity
  entity_type TEXT,
  entity_id UUID,
  
  -- Notification state
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  is_urgent BOOLEAN DEFAULT FALSE,
  
  -- Delivery
  delivery_method TEXT[] DEFAULT '{in_app}', -- in_app, email, sms, push
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID REFERENCES public.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Query Log for tracking and improving AI responses
CREATE TABLE public.ai_queries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  response TEXT,
  status ai_query_status NOT NULL DEFAULT 'pending',
  
  -- Context and filters
  context_filters JSONB DEFAULT '{}'::jsonb,
  query_type TEXT, -- 'summary', 'analysis', 'recommendation', 'anomaly_detection'
  
  -- Performance metrics
  processing_time_ms INTEGER,
  confidence_score DECIMAL(3,2),
  tokens_used INTEGER,
  
  -- Feedback
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Sessions table for enhanced security
CREATE TABLE public.user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT UNIQUE,
  
  -- Session data
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  location_info JSONB,
  
  -- Security
  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES public.users(id),
  revoke_reason TEXT,
  
  -- Timestamps
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Trail table for compliance and security
CREATE TABLE public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
  
  -- Action details
  action audit_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,
  
  -- Risk assessment
  risk_score INTEGER CHECK (risk_score >= 1 AND risk_score <= 10),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File Storage metadata
CREATE TABLE public.files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Security
  uploaded_by UUID REFERENCES public.users(id) NOT NULL,
  access_level INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Relationships
  entity_type TEXT,
  entity_id UUID,
  
  -- File metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  checksum TEXT,
  
  -- Lifecycle
  expires_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biometric Credentials table for WebAuthn
CREATE TABLE public.biometric_credentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- WebAuthn credential data
  credential_id TEXT UNIQUE NOT NULL,
  public_key BYTEA NOT NULL,
  counter BIGINT DEFAULT 0,
  
  -- Device information
  device_name TEXT,
  device_type TEXT DEFAULT 'biometric', -- biometric, security_key, platform
  authenticator_attachment TEXT, -- platform, cross-platform
  transport_methods TEXT[] DEFAULT '{}', -- internal, usb, nfc, ble, hybrid
  
  -- WebAuthn specific data
  aaguid UUID,
  attestation_type TEXT, -- none, basic, self, attca
  attestation_format TEXT, -- packed, tpm, android-key, etc.
  
  -- Security metadata
  backup_eligible BOOLEAN DEFAULT FALSE,
  backup_state BOOLEAN DEFAULT FALSE,
  user_verified BOOLEAN DEFAULT FALSE,
  
  -- Usage tracking
  last_used_at TIMESTAMP WITH TIME ZONE,
  use_count INTEGER DEFAULT 0,
  
  -- Administrative
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table for multi-tenant support
CREATE TABLE public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  
  -- Business info
  industry TEXT,
  website TEXT,
  headquarters TEXT,
  
  -- Financial data
  annual_revenue DECIMAL(15,2),
  employee_count INTEGER,
  
  -- Configuration
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_last_active ON public.users(last_active_at);
CREATE INDEX idx_users_theme_mode ON public.users USING GIN((theme_preferences->>'mode'));

-- Projects indexes
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_priority ON public.projects(priority);
CREATE INDEX idx_projects_assigned_to ON public.projects(assigned_to);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);
CREATE INDEX idx_projects_dates ON public.projects(start_date, end_date);
CREATE INDEX idx_projects_search ON public.projects USING GIN(search_vector);
CREATE INDEX idx_projects_company ON public.projects(company_id);
CREATE INDEX idx_projects_tags ON public.projects USING GIN(tags);

-- Tasks indexes
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_search ON public.tasks USING GIN(search_vector);
CREATE INDEX idx_tasks_depends_on ON public.tasks USING GIN(depends_on);

-- Timeline events indexes
CREATE INDEX idx_timeline_events_date ON public.timeline_events(event_date);
CREATE INDEX idx_timeline_events_status ON public.timeline_events(status);
CREATE INDEX idx_timeline_events_type ON public.timeline_events(event_type);
CREATE INDEX idx_timeline_events_project ON public.timeline_events(project_id);
CREATE INDEX idx_timeline_events_search ON public.timeline_events USING GIN(search_vector);

-- Comments indexes
CREATE INDEX idx_comments_entity ON public.comments(entity_type, entity_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_comments_visibility ON public.comments(visibility_level);
CREATE INDEX idx_comments_search ON public.comments USING GIN(search_vector);

-- KPIs indexes
CREATE INDEX idx_kpis_category_date ON public.kpis(category, date DESC);
CREATE INDEX idx_kpis_name_date ON public.kpis(name, date DESC);
CREATE INDEX idx_kpis_owner ON public.kpis(owner_id);
CREATE INDEX idx_kpis_period ON public.kpis(period, date DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(recipient_id) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_entity ON public.notifications(entity_type, entity_id);
CREATE INDEX idx_notifications_urgent ON public.notifications(recipient_id) WHERE is_urgent = TRUE;

-- AI queries indexes
CREATE INDEX idx_ai_queries_user ON public.ai_queries(user_id, created_at DESC);
CREATE INDEX idx_ai_queries_status ON public.ai_queries(status);
CREATE INDEX idx_ai_queries_type ON public.ai_queries(query_type);

-- Sessions indexes
CREATE INDEX idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(user_id, is_active, expires_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_risk ON public.audit_logs(risk_score DESC, created_at DESC);

-- Files indexes
CREATE INDEX idx_files_entity ON public.files(entity_type, entity_id);
CREATE INDEX idx_files_uploader ON public.files(uploaded_by);
CREATE INDEX idx_files_access ON public.files(access_level);

-- Biometric credentials indexes
CREATE INDEX idx_biometric_credentials_user ON public.biometric_credentials(user_id);
CREATE INDEX idx_biometric_credentials_credential_id ON public.biometric_credentials(credential_id);
CREATE INDEX idx_biometric_credentials_active ON public.biometric_credentials(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_biometric_credentials_last_used ON public.biometric_credentials(last_used_at DESC);
CREATE INDEX idx_biometric_credentials_device_type ON public.biometric_credentials(device_type);

-- ============================================
-- FULL-TEXT SEARCH TRIGGERS
-- ============================================

-- Function to update search vectors
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'projects' THEN
    NEW.search_vector = to_tsvector('english', 
      COALESCE(NEW.title, '') || ' ' || 
      COALESCE(NEW.description, '') || ' ' ||
      COALESCE(array_to_string(NEW.tags, ' '), '')
    );
  ELSIF TG_TABLE_NAME = 'tasks' THEN
    NEW.search_vector = to_tsvector('english',
      COALESCE(NEW.title, '') || ' ' ||
      COALESCE(NEW.description, '') || ' ' ||
      COALESCE(array_to_string(NEW.tags, ' '), '')
    );
  ELSIF TG_TABLE_NAME = 'timeline_events' THEN
    NEW.search_vector = to_tsvector('english',
      COALESCE(NEW.title, '') || ' ' ||
      COALESCE(NEW.description, '') || ' ' ||
      COALESCE(NEW.location, '')
    );
  ELSIF TG_TABLE_NAME = 'comments' THEN
    NEW.search_vector = to_tsvector('english', COALESCE(NEW.content, ''));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create search triggers
CREATE TRIGGER projects_search_trigger
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER tasks_search_trigger
  BEFORE INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER timeline_events_search_trigger
  BEFORE INSERT OR UPDATE ON public.timeline_events
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER comments_search_trigger
  BEFORE INSERT OR UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_credentials ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  SELECT role INTO user_role_result
  FROM public.users
  WHERE id = user_uuid;
  
  RETURN COALESCE(user_role_result, 'viewer'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is executive level
CREATE OR REPLACE FUNCTION public.is_executive_role(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
BEGIN
  user_role_val := public.get_user_role(user_uuid);
  RETURN user_role_val IN ('board_chairman', 'ceo', 'cfo', 'cto', 'executive', 'board_member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for Users
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- RLS Policies for Projects (Executive access)
CREATE POLICY "Executives can view all projects" ON public.projects
  FOR SELECT TO authenticated USING (public.is_executive_role(auth.uid()));

CREATE POLICY "Executives can manage projects" ON public.projects
  FOR ALL TO authenticated USING (public.is_executive_role(auth.uid()));

-- RLS Policies for Tasks
CREATE POLICY "Users can view assigned tasks" ON public.tasks
  FOR SELECT TO authenticated USING (
    assigned_to = auth.uid() OR 
    created_by = auth.uid() OR 
    public.is_executive_role(auth.uid())
  );

CREATE POLICY "Users can manage own tasks" ON public.tasks
  FOR ALL TO authenticated USING (
    assigned_to = auth.uid() OR 
    created_by = auth.uid() OR 
    public.is_executive_role(auth.uid())
  );

-- RLS Policies for Timeline Events
CREATE POLICY "Authenticated users can view timeline events" ON public.timeline_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Executives can manage timeline events" ON public.timeline_events
  FOR ALL TO authenticated USING (public.is_executive_role(auth.uid()));

-- RLS Policies for Comments
CREATE POLICY "Users can view comments based on visibility" ON public.comments
  FOR SELECT TO authenticated USING (
    visibility_level = 1 OR 
    author_id = auth.uid() OR
    (visibility_level = 3 AND public.is_executive_role(auth.uid())) OR
    (visibility_level = 4 AND public.get_user_role(auth.uid()) IN ('board_chairman', 'board_member'))
  );

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE TO authenticated USING (author_id = auth.uid());

-- RLS Policies for KPIs
CREATE POLICY "Executives can view all KPIs" ON public.kpis
  FOR SELECT TO authenticated USING (public.is_executive_role(auth.uid()));

CREATE POLICY "KPI owners can manage their KPIs" ON public.kpis
  FOR ALL TO authenticated USING (
    owner_id = auth.uid() OR 
    public.get_user_role(auth.uid()) IN ('board_chairman', 'ceo', 'cfo')
  );

-- RLS Policies for Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (recipient_id = auth.uid());

-- RLS Policies for AI Queries
CREATE POLICY "Users can view own AI queries" ON public.ai_queries
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create AI queries" ON public.ai_queries
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for Sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- RLS Policies for Audit Logs (Read-only for executives)
CREATE POLICY "Executives can view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (
    public.get_user_role(auth.uid()) IN ('board_chairman', 'ceo', 'admin')
  );

-- RLS Policies for Files
CREATE POLICY "Users can view accessible files" ON public.files
  FOR SELECT TO authenticated USING (
    is_public = true OR 
    uploaded_by = auth.uid() OR
    access_level <= (
      CASE public.get_user_role(auth.uid())
        WHEN 'board_chairman' THEN 10
        WHEN 'ceo' THEN 9
        WHEN 'cfo' THEN 8
        WHEN 'cto' THEN 8
        WHEN 'executive' THEN 7
        WHEN 'board_member' THEN 6
        ELSE 1
      END
    )
  );

-- RLS Policies for Biometric Credentials
CREATE POLICY "Users can view own biometric credentials" ON public.biometric_credentials
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can manage own biometric credentials" ON public.biometric_credentials
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can view all biometric credentials" ON public.biometric_credentials
  FOR SELECT TO authenticated USING (
    public.get_user_role(auth.uid()) IN ('board_chairman', 'ceo', 'admin')
  );

-- ============================================
-- TRIGGERS FOR AUDIT AND MAINTENANCE
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
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

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logging trigger function
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
DECLARE
  action_type audit_action;
  old_data JSONB;
  new_data JSONB;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
    old_data := NULL;
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update';
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
    old_data := to_jsonb(OLD);
    new_data := NULL;
  END IF;

  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    risk_score
  ) VALUES (
    auth.uid(),
    action_type,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    old_data,
    new_data,
    inet_client_addr(),
    CASE 
      WHEN action_type = 'delete' THEN 8
      WHEN action_type = 'update' THEN 3
      ELSE 2
    END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_projects_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_kpis_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.kpis
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_biometric_credentials_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.biometric_credentials
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- ============================================
-- INITIAL DATA AND CONFIGURATION
-- ============================================

-- Insert default companies (Al Jeri Group)
INSERT INTO public.companies (name, code, description, industry, website) VALUES
('Al Jeri Transportation Co.', 'JTC', 'Leading transportation and logistics company in Saudi Arabia', 'Transportation & Logistics', 'https://jtc.com.sa'),
('J:Oil Petroleum', 'JOIL', 'Petroleum products and fuel distribution', 'Energy & Petroleum', 'https://joil.com.sa'),
('Shaheen Rent a Car', 'SHAHEEN', 'Premium car rental services', 'Automotive Services', 'https://shaheen.com.sa'),
('45degrees Cafe', '45DEG', 'Premium coffee and cafe chain', 'Food & Beverage', 'https://45degrees.com.sa'),
('Al Jeri Energy', 'ENERGY', 'Renewable energy and power solutions', 'Energy & Utilities', 'https://energy.aljeri.com');

-- Create default admin user (will be updated with real user data)
-- This is handled by Supabase Auth, but we can set up the profile

-- Insert sample KPI categories and initial data
INSERT INTO public.kpis (name, value, target, unit, category, period, date, created_by) 
SELECT 
  kpi_name, 
  kpi_value, 
  kpi_target, 
  kpi_unit, 
  kpi_category, 
  'monthly', 
  CURRENT_DATE,
  (SELECT id FROM auth.users LIMIT 1)
FROM (VALUES
  ('Total Revenue', 68000000.00, 75000000.00, 'USD', 'Financial'),
  ('Active Projects', 28, 35, 'count', 'Operations'),
  ('Team Members', 250, 300, 'count', 'HR'),
  ('Customer Satisfaction', 94.5, 90.0, '%', 'Quality'),
  ('Operational Efficiency', 87.2, 85.0, '%', 'Operations'),
  ('Market Share', 23.5, 25.0, '%', 'Business'),
  ('Safety Score', 98.1, 95.0, '%', 'Safety'),
  ('Digital Transformation Progress', 72.0, 80.0, '%', 'Technology')
) AS sample_kpis(kpi_name, kpi_value, kpi_target, kpi_unit, kpi_category)
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Executive Dashboard Summary View
CREATE OR REPLACE VIEW public.executive_dashboard AS
SELECT 
  -- Current month KPIs
  (SELECT COUNT(*) FROM public.projects WHERE status = 'in_progress') as active_projects,
  (SELECT COUNT(*) FROM public.tasks WHERE status IN ('todo', 'in_progress')) as pending_tasks,
  (SELECT COUNT(*) FROM public.timeline_events WHERE event_date >= CURRENT_DATE AND event_date <= CURRENT_DATE + INTERVAL '30 days') as upcoming_events,
  (SELECT COUNT(*) FROM public.notifications WHERE read_at IS NULL) as unread_notifications,
  
  -- Financial KPIs (latest month)
  (SELECT value FROM public.kpis WHERE name = 'Total Revenue' AND category = 'Financial' ORDER BY date DESC LIMIT 1) as current_revenue,
  (SELECT target FROM public.kpis WHERE name = 'Total Revenue' AND category = 'Financial' ORDER BY date DESC LIMIT 1) as revenue_target,
  
  -- Operational metrics
  (SELECT value FROM public.kpis WHERE name = 'Operational Efficiency' ORDER BY date DESC LIMIT 1) as efficiency_score,
  (SELECT value FROM public.kpis WHERE name = 'Customer Satisfaction' ORDER BY date DESC LIMIT 1) as satisfaction_score;

-- Project Performance View
CREATE OR REPLACE VIEW public.project_performance AS
SELECT 
  p.id,
  p.title,
  p.status,
  p.priority,
  p.progress,
  p.budget,
  p.actual_cost,
  CASE 
    WHEN p.actual_cost > p.budget THEN 'over_budget'
    WHEN p.actual_cost > p.budget * 0.9 THEN 'near_budget'
    ELSE 'on_budget'
  END as budget_status,
  CASE
    WHEN p.end_date < CURRENT_DATE AND p.status != 'completed' THEN 'overdue'
    WHEN p.end_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'due_soon'
    ELSE 'on_track'
  END as schedule_status,
  (SELECT COUNT(*) FROM public.tasks WHERE project_id = p.id) as total_tasks,
  (SELECT COUNT(*) FROM public.tasks WHERE project_id = p.id AND status = 'done') as completed_tasks,
  u.name as assigned_to_name,
  p.created_at,
  p.updated_at
FROM public.projects p
LEFT JOIN public.users u ON p.assigned_to = u.id;

-- Recent Activity View
CREATE OR REPLACE VIEW public.recent_activity AS
SELECT 
  'project' as entity_type,
  p.id as entity_id,
  p.title as title,
  'Project ' || p.status as activity,
  p.updated_at as activity_date,
  u.name as user_name
FROM public.projects p
JOIN public.users u ON p.created_by = u.id
WHERE p.updated_at >= CURRENT_DATE - INTERVAL '7 days'

UNION ALL

SELECT 
  'task' as entity_type,
  t.id as entity_id,
  t.title as title,
  'Task ' || t.status as activity,
  t.updated_at as activity_date,
  u.name as user_name
FROM public.tasks t
JOIN public.users u ON t.created_by = u.id
WHERE t.updated_at >= CURRENT_DATE - INTERVAL '7 days'

ORDER BY activity_date DESC
LIMIT 50;

-- ============================================
-- FUNCTIONS FOR API ENDPOINTS
-- ============================================

-- Search function
CREATE OR REPLACE FUNCTION public.search_content(
  search_query TEXT,
  entity_types TEXT[] DEFAULT ARRAY['projects', 'tasks', 'timeline_events', 'comments'],
  limit_results INTEGER DEFAULT 50
)
RETURNS TABLE(
  entity_type TEXT,
  entity_id UUID,
  title TEXT,
  content TEXT,
  rank REAL,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'projects'::TEXT,
    p.id,
    p.title,
    p.description,
    ts_rank(p.search_vector, plainto_tsquery('english', search_query)),
    p.created_at
  FROM public.projects p
  WHERE 'projects' = ANY(entity_types)
    AND p.search_vector @@ plainto_tsquery('english', search_query)
    AND public.is_executive_role(auth.uid())
  
  UNION ALL
  
  SELECT 
    'tasks'::TEXT,
    t.id,
    t.title,
    COALESCE(t.description, ''),
    ts_rank(t.search_vector, plainto_tsquery('english', search_query)),
    t.created_at
  FROM public.tasks t
  WHERE 'tasks' = ANY(entity_types)
    AND t.search_vector @@ plainto_tsquery('english', search_query)
    AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid() OR public.is_executive_role(auth.uid()))
  
  UNION ALL
  
  SELECT 
    'timeline_events'::TEXT,
    te.id,
    te.title,
    te.description,
    ts_rank(te.search_vector, plainto_tsquery('english', search_query)),
    te.created_at
  FROM public.timeline_events te
  WHERE 'timeline_events' = ANY(entity_types)
    AND te.search_vector @@ plainto_tsquery('english', search_query)
  
  UNION ALL
  
  SELECT 
    'comments'::TEXT,
    c.id,
    'Comment on ' || c.entity_type,
    c.content,
    ts_rank(c.search_vector, plainto_tsquery('english', search_query)),
    c.created_at
  FROM public.comments c
  WHERE 'comments' = ANY(entity_types)
    AND c.search_vector @@ plainto_tsquery('english', search_query)
    AND (
      c.visibility_level = 1 OR 
      c.author_id = auth.uid() OR
      (c.visibility_level = 3 AND public.is_executive_role(auth.uid())) OR
      (c.visibility_level = 4 AND public.get_user_role(auth.uid()) IN ('board_chairman', 'board_member'))
    )
  
  ORDER BY rank DESC, created_at DESC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- KPI Analysis function
CREATE OR REPLACE FUNCTION public.analyze_kpi_trends(
  kpi_name_param TEXT,
  months_back INTEGER DEFAULT 12
)
RETURNS TABLE(
  month DATE,
  value DECIMAL(15,4),
  target DECIMAL(15,4),
  variance_percent DECIMAL(5,2),
  trend TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH kpi_data AS (
    SELECT 
      k.date,
      k.value,
      k.target,
      LAG(k.value) OVER (ORDER BY k.date) as prev_value
    FROM public.kpis k
    WHERE k.name = kpi_name_param
      AND k.date >= CURRENT_DATE - (months_back || ' months')::INTERVAL
      AND public.is_executive_role(auth.uid())
    ORDER BY k.date
  )
  SELECT 
    kd.date,
    kd.value,
    kd.target,
    CASE 
      WHEN kd.target > 0 THEN ROUND(((kd.value - kd.target) / kd.target * 100)::NUMERIC, 2)
      ELSE 0
    END,
    CASE
      WHEN kd.prev_value IS NULL THEN 'baseline'
      WHEN kd.value > kd.prev_value THEN 'up'
      WHEN kd.value < kd.prev_value THEN 'down'
      ELSE 'stable'
    END
  FROM kpi_data kd;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON DATABASE postgres IS 'Enhanced Executive Management Portal Database - Production Ready with Security, Audit Trails, and AI Features';
