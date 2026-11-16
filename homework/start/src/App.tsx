import { useState } from "react"
import {
    createTask,
    Filter,
    isBlankTitle,
    openCount,
    renameTask,
    seedTasks,
    Task,
    visibleTasks,
} from "./tasks"

const FILTERS: Array<{ id: Filter; label: string }> = [
    { id: "all", label: "Все" },
    { id: "open", label: "Открытые" },
    { id: "done", label: "Готовые" },
]

export function App() {
    const [tasks, setTasks] = useState<Task[]>(seedTasks)
    const [filter, setFilter] = useState<Filter>("all")
    const [draft, setDraft] = useState("")
    const [error, setError] = useState("")

    function add() {
        const next = createTask(tasks.length + 1, draft)
        if (next === undefined) {
            setError("Название не может быть пустым")
            return
        }
        setTasks([...tasks, next])
        setDraft("")
        setError("")
    }

    function rename(task: Task) {
        const title = window.prompt("Название", task.title)
        if (title == null) return
        if (isBlankTitle(title)) {
            setError("Название не может быть пустым")
            return
        }
        setTasks(renameTask(tasks, task.id, title))
        setError("")
    }

    const shown = visibleTasks(tasks, filter)

    return (
        <div style={{ fontFamily: "system-ui", maxWidth: 640, margin: "40px auto", padding: 16 }}>
            <h1 style={{ margin: "0 0 4px" }}>Мои задачи</h1>
            <p style={{ margin: "0 0 16px", color: "#555" }}>
                Открытых: {openCount(tasks)}
            </p>
            {error !== "" && (
                <p style={{ margin: "0 0 16px", color: "#a00" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        style={{ fontWeight: filter === f.id ? 700 : 400 }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {shown.map((task) => (
                    <li
                        key={task.id}
                        style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid #eee" }}
                    >
                        <span style={{ flex: 1, textDecoration: task.done ? "line-through" : "none" }}>
                            {task.title}
                        </span>
                        <button onClick={() => rename(task)}>Переименовать</button>
                    </li>
                ))}
            </ul>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Новая задача"
                    style={{ flex: 1, padding: 8 }}
                />
                <button onClick={add}>Добавить</button>
            </div>
        </div>
    )
}
