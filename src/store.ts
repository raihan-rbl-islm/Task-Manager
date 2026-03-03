import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    theme: 'light' | 'dark';
    selectedTaskIds: string[];

    toggleTheme: () => void;
    toggleTaskSelection: (taskId: string) => void;
    clearSelection: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'light',
            selectedTaskIds: [],

            toggleTheme: () =>
                set((state) => ({ 
                    theme: state.theme === 'light' ? 'dark' : 'light',
                })),

            toggleTaskSelection: (taskId) =>
                set((state) => {
                    const isSelected = state.selectedTaskIds.includes(taskId);

                    return {
                        selectedTaskIds: isSelected ?
                            state.selectedTaskIds.filter((id) => id !== taskId) : [...state.selectedTaskIds, taskId],
                    };
                }   
            ),

            clearSelection: () => set({ selectedTaskIds: [] }),
        }),


        {
            name: 'task-manager-storage',
            partialize: (state) => ({ 
                theme: state.theme, 
            }),
        }
    )
);