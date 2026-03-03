export interface TaskType {
  id: string;
  label: string;
}

export interface User {
    id: string;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    createdAt: string;
    assignedId: string;
    typeId: string;
    parentId: string | null;
}

export type TaskTypeForForm = Omit<Task, 'id' | 'createdAt' | 'parentId'>;