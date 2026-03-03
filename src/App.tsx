import "./App.css";
import { TaskList } from "./Components/taskList";

import { useAppStore } from "./store";
import { useEffect } from "react";

function App() {
    const theme = useAppStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <div className="min-h-screen bg-main text-main-text transition-colors duration-300">
            <TaskList />
        </div>
    );
}

export default App;
