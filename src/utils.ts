import type { Task } from "./types";

export const getDescendantIds = (parentId: string, taskList: Task[]): string[] => {
    let ids: string[] = [];

    const children = taskList.filter((t) => t.parentId === parentId);

    children.forEach((child) => {
        ids.push(child.id);
        ids = [...ids, ...getDescendantIds(child.id, taskList)];
    });

    return ids;
};