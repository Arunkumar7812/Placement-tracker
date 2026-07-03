export interface User {
  id: number;
  name: string;
  email: string;
  headline?: string | null;
  bio?: string | null;
  avatar_color?: string | null;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string | null;
  tech_stack?: string | null;
  repo_url?: string | null;
  live_url?: string | null;
  status: "planned" | "in_progress" | "completed";
  created_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  due_date?: string | null;
  created_at: string;
}

export interface Resource {
  id: number;
  title: string;
  category: string;
  url?: string | null;
  notes?: string | null;
  status: "to_study" | "studying" | "completed";
  created_at: string;
}

export interface WeeklyGoal {
  id: number;
  title: string;
  week_start: string;
  target_value: number;
  current_value: number;
  unit: string;
  created_at: string;
}
