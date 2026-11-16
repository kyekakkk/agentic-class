import { describe, expect, it } from "vitest"
import { createTask, visibleTasks, seedTasks, openCount, renameTask } from "./tasks"

// Два теста, с которыми поставляется стартер. Они проходят и не покрывают
// поведение, описанное в ISSUE-7.md.
describe("базовая доска", () => {
    it("создаёт задачу и обрезает название", () => {
        const task = createTask(9, "  Купить хлеб  ")
        expect(task?.title).toBe("Купить хлеб")
    })

    it("фильтрует готовые задачи", () => {
        expect(visibleTasks(seedTasks, "done").map((task) => task.id)).toEqual([2])
    })

    it("не считает пустую задачу открытой", () => {
        expect(openCount(seedTasks)).toBe(1)
    })

    it("скрывает пустую задачу", () => {
        expect(visibleTasks(seedTasks, "all").map((task) => task.id)).toEqual([1, 2])
    })

    it("не учитывает пустую задачу в фильтре на открытые", () => {
        expect(visibleTasks(seedTasks, "open").map((task) => task.id)).toEqual([1])
    })

    it("возвращает пустому переименованию старое название", () => {
        expect(renameTask(seedTasks, 1, "    ")).toEqual(seedTasks)
        expect(renameTask(seedTasks, 1, "")).toEqual(seedTasks)
        expect(renameTask(seedTasks, 1, "\t")).toEqual(seedTasks)
        expect(renameTask(seedTasks, 1, "\n")).toEqual(seedTasks)
        expect(renameTask(seedTasks, 1, "\u00A0")).toEqual(seedTasks)
        expect(renameTask(seedTasks, 1, "\u00A0\t")).toEqual(seedTasks)
        expect(renameTask(seedTasks, 1, "\u00A0\n")).toEqual(seedTasks)
    })

    it("возвращает обрезанное название при переименование", () => {
        expect(renameTask(seedTasks, 1, "  Купить хлеб  ")[0].title).toBe("Купить хлеб")
        expect(renameTask(seedTasks, 1, "\tКупить хлеб\t")[0].title).toBe("Купить хлеб")
        expect(renameTask(seedTasks, 1, "\nКупить хлеб\n")[0].title).toBe("Купить хлеб")
        expect(renameTask(seedTasks, 1, "\u00A0Купить хлеб\u00A0")[0].title).toBe("Купить хлеб")
    })

    it("отклоняет переименование в U+200B", () => {
        expect(renameTask(seedTasks, 1, "\u200B")).toEqual(seedTasks)
    })
})
