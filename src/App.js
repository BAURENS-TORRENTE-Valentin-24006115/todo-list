import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Task} from './task';
import data from './data.json';
import {Folder} from "./folder";
import {ETAT_TERMINE, ETATS} from "./etats";

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

function TaskForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [etat, setEtat] = useState(ETATS.NOUVEAU);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            date_echeance: date ? new Date(date) : undefined,
            etat
        });
        setTitle('');
        setDescription('');
        setDate('');
        setEtat(ETATS.NOUVEAU);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Titre</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre de la tâche" />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3} />
            </div>
            <div className="form-group">
                <label>Date d'échéance</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label>État</label>
                <select value={etat} onChange={e => setEtat(e.target.value)}>
                    {Object.values(ETATS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
                <button type="submit">Ajouter</button>
            </div>
        </form>
    );
}

function FolderForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description });
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Titre</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Nom du dossier" />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3} />
            </div>
            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
                <button type="submit">Ajouter</button>
            </div>
        </form>
    );
}

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

function JSONToTaskHTML({ tasks }) {
    if (!tasks) return null;
    return (
        <>
            {tasks.map(task => React.cloneElement(task.render(), {key: task.id}))}
        </>
    );
}

function JSONtoFolderHTML({ folders }) {
    if (!folders) return null;
    return (
        <>
            {folders.map(folder => React.cloneElement(folder.render(), {key: folder.id}))}
        </>
    );
}

function App() {
    const [showTasks, setShowTasks] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tasks, setTasks] = useState(JSONToTask());
    const [folders, setFolders] = useState(JSONtoFolder());

    // Modal states
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddFolder, setShowAddFolder] = useState(false);

    const handleAddTask = (taskData) => {
        const newTask = new Task(
            taskData.title,
            taskData.description,
            taskData.date_echeance,
            taskData.etat,
            []
        );
        setTasks([...tasks, newTask]);
        setShowAddTask(false);
    };

    const handleAddFolder = (folderData) => {
        const newFolder = new Folder(
            folderData.title,
            folderData.description
        );
        setFolders([...folders, newFolder]);
        setShowAddFolder(false);
    };

    return (
      <div className="App">
          {/* Modals */}
          <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Nouvelle Tâche">
              <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddTask(false)} />
          </Modal>

          <Modal isOpen={showAddFolder} onClose={() => setShowAddFolder(false)} title="Nouveau Dossier">
              <FolderForm onSubmit={handleAddFolder} onCancel={() => setShowAddFolder(false)} />
          </Modal>

          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
              <div className="Task-Stats">
                  <p className="count-badge">Tache: {tasks.length}</p>
                  <p className="count-badge">Tache Non Faite: {tasks.length - tasks.filter(t => ETAT_TERMINE.includes(t.etat)).length}</p>
              </div>
            <div className={`Menu-Burger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="Barre"></div>
                <div className="Barre"></div>
                <div className="Barre"></div>
            </div>
              <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                  <button onClick={() => {setShowTasks(true); setIsMenuOpen(false)}}>Taches</button>
                  <button onClick={() => {setShowTasks(false); setIsMenuOpen(false)}}>Dossiers</button>
              </nav>
          </header>
          <main>
            <nav>
                <button>Trier</button>
                <button>Filtre</button>
            </nav>
            <section style={{display: showTasks ? 'block' : 'none'}}>
                <JSONToTaskHTML tasks={tasks}/>
            </section>
            <section style={{display: showTasks ? 'none' : 'block'}}>
                <JSONtoFolderHTML folders={folders}/>
            </section>
          </main>
          <footer className="App-footer">
            <button onClick={() => setShowAddTask(true)}>Ajouter Tache</button>
            <button onClick={() => setShowAddFolder(true)}>Ajouter Dossier</button>
          </footer>
      </div>
  );
}

export default App;
