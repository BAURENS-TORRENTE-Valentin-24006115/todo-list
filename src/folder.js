import {Component} from "react";

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

    removeTask(task) {
        this.tasks = this.tasks.filter(t => t !== task);
    }

    getTasks() {
        return this.tasks;
    }

    render() {
        return <div className="folder">
                <h1>{this.title}</h1>
                <div className="tasks">
                    {this.tasks.map((task, index) => (
                        <div key={index} className="task">
                            <h2>{task.title}</h2>
                            <p>{task.description}</p>
                            <p>Created on: {task.date_creation ? task.date_creation.toLocaleDateString() : 'N/A'}</p>
                            <p>Due by: {task.date_echeance ? task.date_echeance.toLocaleDateString() : 'N/A'}</p>
                            <p>Status: {task.etat}</p>
                            <p>Team members: {(task.equipiers || []).map(e => (e && e.name) || e).join(', ')}</p>
                        </div>
                    ))}
                </div>
            </div>;
    }
}