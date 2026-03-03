
# Task Manager
## How to clone the project and Run
```bash
git clone <your-repo-url>
cd task-manager
npm install
npx json-server db.json --port 3000 (install json server if not installed)
```
Now open a second terminal:
```bash
npm run dev
```
## Optmizations

1. react mempo (component wrapper)
   - Applied to: TaskItemCard and TaskForm.
   - Mechanism: It creates a "snapshot" of the component based on its props. When the parent re-renders, React compares the new props with the old ones.
    
2. useCallback (function wrapper)
   - Applied to: Event handlers (handleDelete, handleCreate, etc.) in TaskList and TaskItemCard.
   - Mechanism: In React, functions are recreated on every render. the memoization (memo) fails because a "new" function is seen as a prop change.

3. Zustand (persist) (state level)
   - Applied to: useAppStore(state => state.theme)
   - Result: Persist helps to keeping the current data to local storage so even after reloading, all the states doesn't change

4. react query caching (network level)
   - Applied to: useTasks, useUsers, useTaskTypes.
   - Mechanism: It stores API results in a global cache.
   - Result: When a component unmounts and remounts (like closing and opening a form), it pulls data from the cache instantly instead of making a new HTTP request to port 3000.

[Note: Used CSS variable for theme control]
