export interface Company {
  id: string;
  name: string;
  logo?: string;
  sector: string;
}

export interface Quarter {
  id: string;
  year: number;
  label: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  closed: boolean;
  startDate: Date;
  endDate: Date;
}

export interface Task {
  id: string;
  title: string;
  start: Date;
  end: Date;
  owner: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  directives: Directive[];
}

export interface Directive {
  id: string;
  meetingId: string;
  text: string;
  createdBy: string;
  resolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  companyId: string;
  quarterId: string;
  agenda: Task[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  attendanceUrl?: string;
  presentationUrl?: string;
  location?: string;
  description?: string;
  attendees: Attendee[];
  votes: Vote[];
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  role: 'secretary' | 'executive' | 'viewer';
  status: 'pending' | 'accepted' | 'declined';
  joinedAt?: Date;
  reason?: string;
}

export interface Vote {
  id: string;
  meetingId: string;
  userId: string;
  vote: 'approve' | 'decline';
  comment?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  meetingId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'directive' | 'system';
}

export interface KPI {
  id: string;
  quarterId: string;
  companyId: string;
  revenue: number;
  customerSatisfaction: number;
  pendingDirectives: number;
  completedTasks: number;
  rating: number;
}

export type UserRole = 'secretary' | 'executive' | 'viewer';

export interface SecretaryWorkspaceState {
  selectedDate: Date;
  selectedQuarter: Quarter;
  meetings: Meeting[];
  tasks: Task[];
  companies: Company[];
  quarters: Quarter[];
  currentUser: {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
  };
}