import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask, getUsers, getTaskTypes } from './taskService';

export const useTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: getTasks,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTask,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers
    });
}
export const useTaskTypes = () => {
    return useQuery({
        queryKey: ['taskTypes'],
        queryFn: getTaskTypes 
    });
}