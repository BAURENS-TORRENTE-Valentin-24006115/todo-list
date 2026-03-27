import React from "react";
import {Task} from "./Task";
import {Folder} from "./Folder";
import {ETAT_TERMINE} from "./Etats";

export function JSONToTask(data) {
    const tasks = [];
    for (const taskData of (data.tasks || [])) {
        const title = taskData.title || '';
        const description = taskData.description || '';
        const dateEcheance = taskData.date_echeance ? new Date(taskData.date_echeance) : null;
        const equipiers = taskData.equipiers || [];
        const task = new Task(
            title,
            description,
            dateEcheance,
            taskData.etat,
            equipiers
        );
        // Important: override the auto-generated ID with the one from JSON to allow linking
        if (taskData.id) {
            task.id = taskData.id;
            Task.lastId = Math.max(Task.lastId, task.id);
        }
        tasks.push(task);
    }
    return tasks;
}

export function JSONtoFolder(existingTasks, data) {
    const folders = [];
    const taskMap = new Map();
    const folderMap = new Map();

    // use existing tasks if provided, otherwise create new
    const tasks = existingTasks || JSONToTask();
    for (const task of tasks) {
        taskMap.set(task.id, task);
    }

    // Create all folders and map them by ID
    for (const folderData of (data.dossiers || [])) {
        const title = folderData.title || '';
        const description = folderData.description || '';
        const folder = new Folder(title, description);
        if (folderData.id) {
            folder.id = folderData.id;
            // update static counter
            Folder.LastId = Math.max(Folder.LastId || 0, folder.id);
        }
        folders.push(folder);
        folderMap.set(folder.id, folder);
    }

    // Link tasks to folders using relations
    for (const relation of (data.relations || [])) {
        const task = taskMap.get(relation.tache);
        const folder = folderMap.get(relation.dossier);

        if (task && folder) {
            folder.addTask(task);
        }
    }

    return folders;
}

export function JSONToTaskHTML({ tasks, filter, sort, folders }) {
    if (!tasks) return null;

    let filteredTasks = [...tasks];


    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);
    filteredTasks = filteredTasks.filter(t => {
        if (!t.date_echeance) return true;
        return t.date_echeance > twoWeeksAgo;
    });

    if (filter) {
        if (filter.folderId && folders) {
            const folder = folders.find(f => String(f.id) === String(filter.folderId));
            if (folder) {
                // Match by ID since instances might differ
                const folderTaskIds = new Set(folder.tasks.map(t => t.id));
                filteredTasks = filteredTasks.filter(t => folderTaskIds.has(t.id));
            } else {
                filteredTasks = [];
            }
        }

        if (filter.onlyInProgress) {
            filteredTasks = filteredTasks.filter(t => !ETAT_TERMINE.includes(t.etat));
        } else if (filter.etat) {
            filteredTasks = filteredTasks.filter(t => t.etat === filter.etat);
        }
    }

    if (sort) {
        filteredTasks.sort((a, b) => {
            let res;
            if (sort.sortBy === 'title') {
                res = a.title.localeCompare(b.title);
            } else if (sort.sortBy === 'date_echeance') {
                const dateA = a.date_echeance ? a.date_echeance.getTime() : 0;
                const dateB = b.date_echeance ? b.date_echeance.getTime() : 0;
                res = dateA - dateB;
            } else { // date_creation
                const dateA = a.date_creation ? a.date_creation.getTime() : 0;
                const dateB = b.date_creation ? b.date_creation.getTime() : 0;
                res = dateA - dateB;
            }
            return sort.descending ? -res : res;
        });
    }

    return (
        <>
            {filteredTasks.map(task => React.cloneElement(task.render(), {key: task.id}))}
        </>
    );
}

export function JSONtoFolderHTML({ folders, allTasks }) {
    if (!folders) return null;
    return (
        <>
            {folders.map(folder => React.cloneElement(folder.render(allTasks), {key: folder.id}))}
        </>
    );
}