import {useState} from "react";

export function FolderForm({ onSubmit, onCancel, tasks}) {
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