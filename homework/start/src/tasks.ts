export type Filter = "all" | "open" | "done"

export interface Task {
    id: number
    title: string
    done: boolean
}

/**
 * Доска в том виде, в каком она приходит из хранилища. Строку 3 сохранила старая
 * форма ещё до issue #7: это название из одних пробелов, и оно всё ещё здесь.
 */
export const seedTasks: Task[] = [
    { id: 1, title: "Сдать лабораторную", done: false },
    { id: 2, title: "Купить продукты", done: true },
    { id: 3, title: "   ", done: false },
]

/**
 * Пустое название: не остаётся символов, кроме пробелов и U+200B.
 * Ноль-ширинный пробел trim() не снимает, поэтому он убирается отдельно.
 */
export function isBlankTitle(title: string): boolean {
    return title.replace(/\u200B/g, "").trim().length === 0
}

/**
 * Создание задачи. Форма создания проверяла название всегда — проблема в пути
 * переименования ниже: старая форма сохраняла название без проверки.
 */
export function createTask(id: number, title: string): Task | undefined {
    if (isBlankTitle(title)) return undefined
    return { id, title: title.trim(), done: false }
}

/** Переименование. Пустое название не сохраняется, пробелы по краям обрезаются. */
export function renameTask(tasks: Task[], id: number, title: string): Task[] {
    if (isBlankTitle(title)) return tasks
    return tasks.map((task) => (task.id === id ? { ...task, title: title.trim() } : task))
}

export function visibleTasks(tasks: Task[], filter: Filter): Task[] {
    const titled = tasks.filter((task) => !isBlankTitle(task.title))
    if (filter === "open") return titled.filter((task) => !task.done)
    if (filter === "done") return titled.filter((task) => task.done)
    return titled
}

/** Счётчик в шапке: только открытые задачи с непустым названием. */
export function openCount(tasks: Task[]): number {
    return tasks.filter((task) => !task.done && !isBlankTitle(task.title)).length
}
