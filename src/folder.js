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

    render() {
        return <FolderView model={this} />;
    }
}

function FolderView({ model }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`folder bubble ${expanded ? 'expanded' : ''}`}>
             <div className="folder-header" onClick={() => setExpanded(!expanded)}>
                <span className="arrow">{expanded ? '▼' : '▶'}</span>
                <h1>{model.title}</h1>
                <span className="count-badge">{model.tasks.length} tasks</span>
            </div>
            {expanded && (
                <div className="folder-content">
                    <p className="description">{model.description}</p>
                    <div className="tasks-list">
                        {model.tasks.map(task => React.cloneElement(task.render(), {key: task.id}))}
                    </div>
                </div>
            )}
        </div>
    );
}