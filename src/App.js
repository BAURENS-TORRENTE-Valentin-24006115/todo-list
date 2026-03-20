import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Task} from './task';
import data from './data.json';
import {Folder} from "./folder";

function JSONToTask() {
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

function JSONtoFolder() {
    const folders = [];
    const taskMap = new Map();
    const folderMap = new Map();

    // Create all tasks and map them by ID
    const tasks = JSONToTask();
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

function JSONToTaskHTML() {
    const tasks = JSONToTask();
    return (
        <>
            {tasks.map(task => React.cloneElement(task.render(), {key: task.id}))}
        </>
    );
}

function JSONtoFolderHTML() {
    const folders = JSONtoFolder();
    return (
        <>
            {folders.map(folder => React.cloneElement(folder.render(), {key: folder.id}))}
        </>
    );
}

function App() {
    const [showTasks, setShowTasks] = useState(true);
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="Menu-Burger">
            <div className="Barre"></div>
            <div className="Barre"></div>
            <div className="Barre"></div>
        </div>
      </header>
      <main>
        <nav>
            <button>Trier</button>
            <button>Filtre</button>
        </nav>
        <section style={{display: showTasks ? 'block' : 'none'}}>
            <JSONToTaskHTML/>
        </section>
        <section style={{display: showTasks ? 'none' : 'block'}}>
            <JSONtoFolderHTML/>
        </section>
      </main>
      <footer className="App-footer">
        <button onClick={() => setShowTasks(true)}>Taches</button>
        <button onClick={() => setShowTasks(false)}>Dossiers</button>
      </footer>
      </div>
  );
}

export default App;
