
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  TASKS = 'TASKS',
  PAMPER = 'PAMPER'
}

export interface VoiceSessionState {
  isActive: boolean;
  isThinking: boolean;
}
