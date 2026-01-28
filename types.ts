
export type PersonaType = 'YI_SUN_SIN' | 'SOCRATES' | 'JEONG_YAK_YONG' | 'NIETZSCHE' | 'HWANG_JIN_I';

export interface Persona {
  id: PersonaType;
  name: string;
  title: string;
  tags: string[];
  description: string;
  avatar: string;
  command: string;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  persona?: PersonaType;
  isFormatting?: boolean;
}
