import React, { useState } from 'react';
import {Component} from 'react';

export class Folder extends Component{
    static LastId = 0;
    constructor(title, description) {
        super();
        Folder.LastId = (Folder.LastId || 0) + 1;
        this.id = Folder.LastId;
        this.title = title;
        this.description = description;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    addTasks(tasks) {
        this.tasks.push(...tasks);
    }

    removeTask(task) {
        this.tasks = this.tasks.filter(t => t !== task);
    }

    getTasks() {
        return this.tasks;
    }

    render(allTasks) {
        return <FolderView model={this} allTasks={allTasks} />;
    }
}

function FolderView({ model, allTasks }) {
    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form states
    const [editTitle, setEditTitle] = useState(model.title);
    const [editDescription, setEditDescription] = useState(model.description);
    const [editTaskIds, setEditTaskIds] = useState(model.tasks.map(t => String(t.id)));

    const handleSave = () => {
        model.title = editTitle;
        model.description = editDescription;

        // Update tasks list based on selection
        if (allTasks) {
            const selectedTasks = allTasks.filter(t => editTaskIds.includes(String(t.id)));
            model.tasks = selectedTasks;
        }

        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(model.title);
        setEditDescription(model.description);
        setEditTaskIds(model.tasks.map(t => String(t.id)));
        setIsEditing(false);
    };

    const toggleTaskSelection = (taskId) => {
        const idStr = String(taskId);
        if (editTaskIds.includes(idStr)) {
            setEditTaskIds(editTaskIds.filter(id => id !== idStr));
        } else {
            setEditTaskIds([...editTaskIds, idStr]);
        }
    };

    return (
        <div className={`folder bubble ${expanded ? 'expanded' : ''}`}>
             <div className="folder-header" onClick={() => setExpanded(!expanded)}>
                <span className="arrow">{expanded ? '▼' : '▶'}</span>
                <h1>{isEditing ? 'Modification : ' + model.title : model.title}</h1>
                <span className="count-badge">{model.tasks.length} tâches</span>
            </div>
            {expanded && (
                <div className="folder-content">
                    {!isEditing ? (
                        <>
                            <p className="description">{model.description || 'Aucune description'}</p>
                            <div className="tasks-list">
                                {model.tasks.map(task => React.cloneElement(task.render(), {key: task.id}))}
                            </div>
                            <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
                                <button onClick={() => {
                                    setIsEditing(true);
                                    // Reset/Sync state when entering edit mode ensure latest model data
                                    setEditTitle(model.title);
                                    setEditDescription(model.description);
                                    setEditTaskIds(model.tasks.map(t => String(t.id)));
                                }}>Modifier</button>
                            </div>
                        </>
                    ) : (
                        <div className="edit-form" onClick={e => e.stopPropagation()}>
                            <div className="form-group">
                                <label>Titre</label>
                                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Tâches</label>
                                <div className="tasks-scroll-container" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                                    {allTasks && allTasks.map(task => (
                                        <div key={task.id} className="task-checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`folder-edit-task-${model.id}-${task.id}`}
                                                checked={editTaskIds.includes(String(task.id))}
                                                onChange={() => toggleTaskSelection(task.id)}
                                            />
                                            <label htmlFor={`folder-edit-task-${model.id}-${task.id}`}>{task.title}</label>
                                        </div>
                                    ))}
                                    {(!allTasks || allTasks.length === 0) && <p className="empty-tasks-message">Aucune tâche disponible.</p>}
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={handleCancel}>Annuler</button>
                                <button onClick={handleSave}>Enregistrer</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}