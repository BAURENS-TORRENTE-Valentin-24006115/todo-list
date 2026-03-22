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
    const [equipiers, setEquipiers] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            date_echeance: date ? new Date(date) : undefined,
            etat,
            equipiers
        });
        setTitle('');
        setDescription('');
        setDate('');
        setEtat(ETATS.NOUVEAU);
        setEquipiers('');
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
            <div className="form-group">
                <label>Équipiers</label>
                <input required value={equipiers} onChange={e => setEquipiers(e.target.value)} placeholder="Paul, Didier" />
            </div>
            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
                <button type="submit">Ajouter</button>
            </div>
        </form>
    );
}

function FolderForm({ onSubmit, onCancel, tasks}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [chosenTasks, setChoosenTasks] = useState([]);

    const toggleTask = (taskId) => {
        const idStr = String(taskId);
        if (chosenTasks.includes(idStr)) {
            setChoosenTasks(chosenTasks.filter(id => id !== idStr));
        } else {
            setChoosenTasks([...chosenTasks, idStr]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description, chosenTasks });
        setTitle('');
        setDescription('');
        setChoosenTasks([]);
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
            <div className="form-group">
                <label>Tâches</label>
                <div className="tasks-scroll-container">
                    {tasks.map(task => (
                        <div key={task.id} className="task-checkbox-item">
                            <input
                                type="checkbox"
                                id={`task-check-${task.id}`}
                                checked={chosenTasks.includes(String(task.id))}
                                onChange={() => toggleTask(task.id)}
                            />
                            <label htmlFor={`task-check-${task.id}`}>{task.title}</label>
                        </div>
                    ))}
                    {tasks.length === 0 && <p className="empty-tasks-message">Aucune tâche disponible.</p>}
                </div>
            </div>
            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
                <button type="submit">Ajouter</button>
            </div>
        </form>
    );
}

function FilterForm({ onSubmit, onCancel, folders, initialFilter }) {
    const [selectedFolderId, setSelectedFolderId] = useState(initialFilter?.folderId || '');
    const [onlyInProgress, setOnlyInProgress] = useState(initialFilter?.onlyInProgress !== undefined ? initialFilter.onlyInProgress : true);
    const [selectedEtat, setSelectedEtat] = useState(initialFilter?.etat || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            folderId: selectedFolderId,
            onlyInProgress,
            etat: selectedEtat
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Dossier</label>
                <select value={selectedFolderId} onChange={e => setSelectedFolderId(e.target.value)}>
                    <option value="">Tous les dossiers</option>
                    {folders && folders.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={onlyInProgress}
                        onChange={e => setOnlyInProgress(e.target.checked)}
                        className="checkbox-input"
                    />
                    En cours seulement
                </label>
            </div>
            {!onlyInProgress && (
                <div className="form-group">
                    <label>État spécifique</label>
                    <select value={selectedEtat} onChange={e => setSelectedEtat(e.target.value)}>
                        <option value="">Tous les états</option>
                        {Object.values(ETATS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            )}
            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
                <button type="submit">Appliquer</button>
            </div>
        </form>
    );
}

function SortForm({ onSubmit, onCancel, initialSort }) {
    const [sortBy, setSortBy] = useState(initialSort?.sortBy || 'date_creation');
    const [descending, setDescending] = useState(initialSort?.descending || false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ sortBy, descending });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Trier par</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="date_creation">Date de création</option>
                    <option value="date_echeance">Date d'échéance</option>
                    <option value="title">Nom</option>
                </select>
            </div>
            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={descending}
                        onChange={e => setDescending(e.target.checked)}
                        className="checkbox-input"
                    />
                    Décroissant
                </label>
            </div>
            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Annuler</button>
                <button type="submit">Appliquer</button>
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

function JSONtoFolder(existingTasks) {
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

function JSONToTaskHTML({ tasks, filter, sort, folders }) {
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
    const [tasks, setTasks] = useState([]);
    const [folders, setFolders] = useState([]);
    const [filter, setFilter] = useState({ onlyInProgress: true });
    const [sort, setSort] = useState({sortBy: 'date_echeance', descending: true});

    const [showLoadData, setShowLoadData] = useState(true);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddFolder, setShowAddFolder] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const handleLoadData = (load) => {
        if (load) {
            const loadedTasks = JSONToTask();
            setTasks(loadedTasks);
            setFolders(JSONtoFolder(loadedTasks));
        }
        setShowLoadData(false);
    };

    const handleAddTask = (taskData) => {
        const newTask = new Task(
            taskData.title,
            taskData.description,
            taskData.date_echeance,
            taskData.etat,
            taskData.equipiers.split(', ').map(e => e.trim()).filter(Boolean)
        );
        setTasks([...tasks, newTask]);
        setShowAddTask(false);
    };

    const handleAddFolder = (folderData) => {
        const newFolder = new Folder(
            folderData.title,
            folderData.description
        );
        const selectedTasks = tasks.filter(task => folderData.chosenTasks.includes(String(task.id)));
        for (const task of selectedTasks) {
            newFolder.addTask(task);
        }
        setFolders([...folders, newFolder]);
        setShowAddFolder(false);
    };

    const handleFilter = (filterData) => {
        setFilter(filterData);
        setShowFilter(false);
    }

    const handleSort = (sortData) => {
        setSort(sortData);
        setShowSort(false);
    }

    return (
      <div className="App">
          <Modal isOpen={showLoadData} onClose={() => handleLoadData(false)} title="Données initiales">
              <p>Voulez-vous charger les données depuis le fichier JSON ?</p>
              <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => handleLoadData(false)}>Non</button>
                  <button onClick={() => handleLoadData(true)}>Oui</button>
              </div>
          </Modal>

          <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Nouvelle Tâche">
              <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddTask(false)}/>
          </Modal>

          <Modal isOpen={showAddFolder} onClose={() => setShowAddFolder(false)} title="Nouveau Dossier">
              <FolderForm onSubmit={handleAddFolder} onCancel={() => setShowAddFolder(false)} tasks={tasks}/>
          </Modal>

          <Modal isOpen={showFilter} onClose={() => setShowFilter(false)} title="Filtrer Tâches">
                <FilterForm onSubmit={handleFilter} onCancel={() => setShowFilter(false)} folders={folders} initialFilter={filter}/>
          </Modal>

          <Modal isOpen={showSort} onClose={() => setShowSort(false)} title="Trier Tâches">
                <SortForm onSubmit={handleSort} onCancel={() => setShowSort(false)} initialSort={sort} />
          </Modal>

          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
              <div className="Task-Stats">
                  <p className="count-badge">Tâches : {tasks.length}</p>
                  <p className="count-badge">À faire : {tasks.length - tasks.filter(t => ETAT_TERMINE.includes(t.etat)).length}</p>
              </div>
            <div className={`Menu-Burger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="Barre"></div>
                <div className="Barre"></div>
                <div className="Barre"></div>
            </div>
              <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                  <button onClick={() => {setShowTasks(true); setIsMenuOpen(false)}}>Tâches</button>
                  <button onClick={() => {setShowTasks(false); setIsMenuOpen(false)}}>Dossiers</button>
              </nav>
          </header>
          <main>
            <nav>
                <button onClick={() => {setShowSort(true)}}>Trier</button>
                <button onClick={() => {setShowFilter(true)}}>Filtrer</button>
            </nav>
            <section style={{display: showTasks ? 'block' : 'none'}}>
                <JSONToTaskHTML tasks={tasks} filter={filter} sort={sort} folders={folders}/>
            </section>
            <section style={{display: showTasks ? 'none' : 'block'}}>
                <JSONtoFolderHTML folders={folders}/>
            </section>
          </main>
          <footer className="App-footer">
            <button onClick={() => setShowAddTask(true)}>Ajouter Tâche</button>
            <button onClick={() => setShowAddFolder(true)}>Ajouter Dossier</button>
          </footer>
      </div>
  );
}

export default App;
