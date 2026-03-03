import type { Task } from "../types";
import {
    useDeleteTask,
    useUpdateTask,
    useTasks,
    useCreateTask,
} from "../taskHooks";
import { useState } from "react";
import type { TaskTypeForForm } from "../types";
import { TaskForm } from "./taskForm";
import { useAppStore } from "../store";
import { getDescendantIds } from "../utils";

interface PropeType {
    taskItem: Task;
}

export const TaskItemCard = ({ taskItem }: PropeType) => {
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [isEditingSubtask, setIsEditingSubtask] = useState(false);

    const isSelected = useAppStore((state) =>
        state.selectedTaskIds.includes(taskItem.id),
    );
    const toggleSelection = useAppStore((state) => state.toggleTaskSelection);

    const { data: tasksList } = useTasks();

    const childTasks =
        tasksList?.filter((t) => t.parentId === taskItem.id) || [];

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();

    const handleAddSubtask = (formData: TaskTypeForForm) => {
        const newSubtask: Task = {
            ...formData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString().split("T")[0],
            parentId: taskItem.id,
        };

        createMutation.mutate(newSubtask, {
            onSuccess: () => setIsAddingSubtask(false),
        });
    };

    const handleEditTask = (formData: TaskTypeForForm) => {
        const editedTask: Task = {
            ...taskItem,
            ...formData, // overwrites
        };

        updateMutation.mutate(editedTask, {
            onSuccess: () => setIsAddingSubtask(false),
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();

        const descendantIds = getDescendantIds(taskItem.id, tasksList || []);

        const confirmMessage =
            "Are you sure you want to delete this task AND all its subtasks?";

        if (window.confirm(confirmMessage)) {
            deleteMutation.mutate(taskItem.id);

            descendantIds.forEach((id) => {
                deleteMutation.mutate(id);
            });
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* CHANGED: bg-white -> bg-card, added transition-colors */}
            <div className="relative bg-card rounded-xl p-5 shadow-sm border-l-4 border-l-blue-500 transition-colors">
                <div>
                    {!(isAddingSubtask || isEditingSubtask) && (
                        <div className="absolute top-4 right-4 flex gap-2">
                            {/* CHANGED: Added dark mode variants for buttons */}
                            <button
                                className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 rounded hover:bg-blue-600 hover:text-white transition-all"
                                onClick={() => setIsAddingSubtask(true)}
                            >
                                Add
                            </button>
                            <button
                                className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 rounded hover:bg-amber-600 hover:text-white transition-all"
                                onClick={() => setIsEditingSubtask(true)}
                            >
                                Edit
                            </button>
                            <button
                                className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 rounded hover:bg-red-600 hover:text-white transition-all"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    {isEditingSubtask && (
                        <div className="mt-4 pt-4 animate-in fade-in slide-in-from-top-2">
                            <TaskForm
                                onSave={handleEditTask}
                                onCancel={() => setIsEditingSubtask(false)}
                            />
                        </div>
                    )}

                    {!isEditingSubtask && (
                        <div>
                            {/* <div className="top-4 left-4">
                                
                            </div> */}
                            <div className="mb-3 pr-40">
                                {" "}
                                <input
                                    className="top-4 left-4 w-5 h-5 cursor-pointer accent-blue-600"
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                        toggleSelection(taskItem.id)
                                    }
                                />
                                {/* CHANGED: text-gray-900 -> text-main-text */}
                                <h3 className="text-xl font-bold text-main-text tracking-tight">
                                    {taskItem.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    {/* CHANGED: text-gray-400 -> text-text-muted */}
                                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">
                                        Created
                                    </span>
                                    {/* CHANGED: text-gray-500 -> text-text-muted */}
                                    <span className="text-xs font-medium text-text-muted">
                                        {taskItem.createdAt}
                                    </span>
                                </div>
                            </div>

                            {/* CHANGED: text-gray-600 -> text-text-muted */}
                            <p className="text-text-muted text-sm leading-relaxed mb-6">
                                {taskItem.description}
                            </p>

                            {/* CHANGED: border-gray-100 -> border-border-base */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-base">
                                <div className="flex flex-col gap-0.5">
                                    {/* CHANGED: text-gray-400 -> text-text-muted */}
                                    <span className="text-[10px] text-text-muted uppercase font-extrabold tracking-tighter">
                                        Deadline
                                    </span>
                                    {/* CHANGED: Added dark:text-red-400 */}
                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        {taskItem.deadline}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    {/* CHANGED: text-gray-400 -> text-text-muted */}
                                    <span className="text-[10px] text-text-muted uppercase font-extrabold tracking-tighter">
                                        Assignee
                                    </span>
                                    {/* CHANGED: Added dark mode variants for badge */}
                                    <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                        {taskItem.assignedId}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    {/* CHANGED: text-gray-400 -> text-text-muted */}
                                    <span className="text-[10px] text-text-muted uppercase font-extrabold tracking-tighter">
                                        Category
                                    </span>
                                    {/* CHANGED: Added dark mode variants for badge */}
                                    <span className="text-sm font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded w-fit border border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                                        {taskItem.typeId}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isAddingSubtask && (
                <div className="mt-4 pt-4 animate-in fade-in slide-in-from-top-2">
                    <TaskForm
                        onSave={handleAddSubtask}
                        onCancel={() => setIsAddingSubtask(false)}
                    />
                </div>
            )}

            {childTasks.length > 0 && (
                <div className="ml-8 pl-6 border-l-2 border-blue-100 dark:border-blue-900 flex flex-col gap-4 mt-2">
                    {childTasks.map((child) => (
                        <TaskItemCard key={child.id} taskItem={child} />
                    ))}
                </div>
            )}
        </div>
    );
};
