export type TaskStatus = "a fazer" | "em progresso" | "concluido";

export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
}

export interface ColumnConfig {
  key: TaskStatus;
  label: string;
  bg: string;
  accent: string;
}

export type TaskFormData = Omit<Task, "id">
