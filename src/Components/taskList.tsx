import { useTasks, useCreateTask, useDeleteTask } from "../taskHooks";
import { TaskItemCard } from "./taskItem";
import { TaskForm } from "./taskForm";
import type { TaskTypeForForm, Task } from "../types";
import { useState } from "react";
import { getDescendantIds } from "../utils";
import { useAppStore } from "../store";

export const TaskList = () => {
    const theme = useAppStore((state) => state.theme);
    const toggleTheme = useAppStore((state) => state.toggleTheme);

    const { data: taskList, isLoading, isError, error } = useTasks();
    const createTaskMutation = useCreateTask();
    const [isCreating, setIsCreating] = useState(false);

    const selectedTaskIds = useAppStore((state) => state.selectedTaskIds);
    const clearSelection = useAppStore((state) => state.clearSelection);
    const deleteMutation = useDeleteTask();

    const handleSelectedDelete = () => {
        if (!taskList) return;
        if (window.confirm(`Delete ${selectedTaskIds.length} tasks?`)) {
            const ids = new Set<string>();

            selectedTaskIds.forEach((id) => {
                ids.add(id);

                const descendantIds = getDescendantIds(id, taskList);
                descendantIds.forEach((dId) => {
                    ids.add(dId);
                });
            });

            ids.forEach((id) => deleteMutation.mutate(id));

            clearSelection();
        }
    };

    const handleCreateTask = (formData: TaskTypeForForm) => {
        const newTask: Task = {
            ...formData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString().split("T")[0],
            parentId: null,
        };

        createTaskMutation.mutate(newTask, {
            onSuccess: () => setIsCreating(false),
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-lg font-medium text-gray-500 dark:text-gray-400 animate-pulse">
                    Loading tasks...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div className="text-red-700 dark:text-red-300 font-medium">
                    {(error as Error).message}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 relative">
            {selectedTaskIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4 border border-transparent dark:border-gray-700">
                    <span className="font-bold text-sm">
                        {selectedTaskIds.length} selected
                    </span>
                    <div className="h-4 w-[1px] bg-gray-600"></div>
                    <button
                        onClick={handleSelectedDelete}
                        className="text-red-400 hover:text-red-300 font-bold text-sm uppercase tracking-wider"
                    >
                        Delete All
                    </button>
                    <button
                        onClick={clearSelection}
                        className="text-gray-400 hover:text-white text-xs"
                    >
                        Cancel
                    </button>
                </div>
            )}
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-main-text tracking-tight transition-colors">
                        Task Manager
                    </h1>
                    <button
                        onClick={toggleTheme}
                        className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                    >
                        Switch to {theme === "dark" ? "light" : "dark"}
                    </button>
                </div>

                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-5 py-2.5 rounded-lg font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                    >
                        Add New Task
                    </button>
                )}
            </header>

            {isCreating && (
                <div className="mb-10 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 transition-colors">
                    <TaskForm
                        onSave={handleCreateTask}
                        onCancel={() => setIsCreating(false)}
                    />
                </div>
            )}

            {!taskList || taskList.length === 0 ? (
                <div className="max-w-2xl mx-auto mt-8 p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 transition-colors">
                    <p className="text-gray-500 text-lg font-medium">
                        Your task list is empty
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Click "Add New Task" to start.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {taskList
                        ?.filter((task) => !task.parentId)
                        .map((task) => (
                            <TaskItemCard key={task.id} taskItem={task} />
                        ))}
                </div>
            )}
        </div>
    );
};
