import { useForm } from "react-hook-form";
import { useUsers, useTaskTypes } from "../taskHooks";
import type { TaskTypeForForm } from "../types";

interface Props {
    onSave: (data: TaskTypeForForm) => void;
    onCancel: () => void;
    defaultValues?: Partial<TaskTypeForForm>;
}

export const TaskForm = ({ onSave, onCancel, defaultValues }: Props) => {
    const { data: users, isLoading: isUsersLoading } = useUsers();
    const { data: types, isLoading: isTaskTypesLoading } = useTaskTypes();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskTypeForForm>({ defaultValues });

    if (isUsersLoading || isTaskTypesLoading)
        return (
            <div className="p-6 text-center text-text-muted">
                Loading options...
            </div>
        );

    return (
        <form
            onSubmit={handleSubmit(onSave)}
            className="space-y-4 p-6 bg-card border border-border-base rounded-xl shadow-inner transition-colors"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                        Title
                    </label>
                    <input
                        {...register("title", {
                            required: "Title is required",
                        })}
                        // CHANGED: Used bg-input and text-main-text instead of dark: classes
                        className="w-full p-2 border border-border-base rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-input text-main-text placeholder-gray-400"
                        placeholder="Task Name"
                    />
                    {errors.title && (
                        <span className="text-red-500 text-xs mt-1 block">
                            {errors.title.message}
                        </span>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                        Description
                    </label>
                    <textarea
                        {...register("description", {
                            required: "Description is required",
                        })}
                        className="w-full p-2 border border-border-base rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-input text-main-text"
                        rows={3}
                    />
                    {errors.description && (
                        <span className="text-red-500 text-xs mt-1 block">
                            {errors.description.message}
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                        Deadline
                    </label>
                    <input
                        type="date"
                        {...register("deadline", {
                            required: "Deadline is required",
                        })}
                        className="w-full p-2 border border-border-base rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-input text-main-text"
                    />
                    {errors.deadline && (
                        <span className="text-red-500 text-xs mt-1 block">
                            {errors.deadline.message}
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                        Assigned To
                    </label>
                    <select
                        {...register("assignedId", {
                            required: "Assignee is required",
                        })}
                        className="w-full p-2 border border-border-base rounded bg-input text-main-text focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="">Select User...</option>
                        {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    {errors.assignedId && (
                        <span className="text-red-500 text-xs mt-1 block">
                            {errors.assignedId.message}
                        </span>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                        Task Category
                    </label>
                    <select
                        {...register("typeId", {
                            required: "Task Type is required",
                        })}
                        className="w-full p-2 border border-border-base rounded bg-input text-main-text focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="">Select Type...</option>
                        {types?.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                    {errors.typeId && (
                        <span className="text-red-500 text-xs mt-1 block">
                            {errors.typeId.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-bold text-text-muted hover:text-main-text hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-md active:scale-95 transition-all"
                >
                    Save Task
                </button>
            </div>
        </form>
    );
};
