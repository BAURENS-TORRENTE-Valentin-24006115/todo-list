import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Task} from './DataHolder/Task';
import data from './data.json';
import {Folder} from "./DataHolder/Folder";
import {ETAT_TERMINE} from "./DataHolder/Etats";
import {JSONToTask, JSONtoFolderHTML, JSONtoFolder, JSONToTaskHTML} from "./DataHolder/JsonHandling";
import {TaskForm} from "./Forms/TaskForm";
import {FolderForm} from "./Forms/FolderForm";
import {FilterForm} from "./Forms/FilterForm";
import {SortForm} from "./Forms/SortForm";

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
            const loadedTasks = JSONToTask(data);
            setTasks(loadedTasks);
            setFolders(JSONtoFolder(loadedTasks, data));
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
                <JSONtoFolderHTML folders={folders} allTasks={tasks}/>
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
