import axios from 'axios';
import type { Task, User, TaskType} from './types';

const API_URL = 'http://localhost:3000';

export const getTasks = async (): Promise<Task[]> => {
    const response = await axios.get<Task[]>(`${API_URL}/tasks`);
    return response.data;
};

export const createTask = async (task: Task): Promise<Task> => {
    const response = await axios.post<Task>(`${API_URL}/tasks`, task);
    return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
};

export const updateTask = async (task: Task): Promise<Task> => {
    const response = await axios.put<Task>(`${API_URL}/tasks/${task.id}`, task);
    return response.data;
};

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_URL}/users`);
    return response.data;
}

export const getTaskTypes = async (): Promise<TaskType[]> => {
    const response = await axios.get<TaskType[]>(`${API_URL}/taskTypes`);
    return response.data;
}