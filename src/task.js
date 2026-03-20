import {ETATS} from "./etats";
import {Component} from "react";
import React, { useState } from 'react';
export class Task extends Component{
    static lastId = 0;

    constructor(title, description, date_echeance, etat, equipiers) {
        super();
        Task.lastId = (Task.lastId || 0) + 1;
        this.id = Task.lastId;
        this.title = title;
        this.description = description;
        this.date_creation = new Date();
        this.date_echeance = date_echeance;
        if (!Object.values(ETATS).includes(etat)) {
            throw new Error(`Invalid etat: ${etat}`);
        }
        this.etat = etat;
        this.equipiers = equipiers || [];
    }

    updateEtat(newEtat) {
        this.etat = newEtat;
    }

    addEquipier(equipier) {
        this.equipiers.push(equipier);
    }

    removeEquipier(equipier) {
        this.equipiers = this.equipiers.filter(e => e !== equipier);
    }

    getDetails() {
        return {
            title: this.title,
            description: this.description,
            date_creation: this.date_creation,
            date_echeance: this.date_echeance,
            etat: this.etat,
            equipiers: this.equipiers
        };
    }

    render() {
        return <TaskView model={this} />;
    }
}

function TaskView({ model }) {
    const [expanded, setExpanded] = useState(false);

    const due = model.date_echeance ? model.date_echeance.toLocaleDateString() : 'N/A';
    const created = model.date_creation ? model.date_creation.toLocaleDateString() : 'N/A';
    const equipiersDisplay = (model.equipiers || []).map(e => (e && typeof e === 'object' ? (e.name || '') : e)).filter(Boolean).join(', ') || '—';

    return (
        <article className={`task bubble ${expanded ? 'expanded' : ''}`}>
            <div className="task-header" onClick={() => setExpanded(!expanded)}>
                <span className="arrow">{expanded ? '▼' : '▶'}</span>
                <h2>{model.title}</h2>
                <span className={`status-badge ${
                    model.etat === ETATS.REUSSI ? 'completed' :
                    model.etat === ETATS.ABANDONNE ? 'gave-up' : ''
                }`}>{model.etat}</span>
            </div>
            {expanded && (
                <div className="task-details">
                    <p className="description">{model.description || 'No description'}</p>
                    <div className="meta-info">
                        <p><strong>Created:</strong> {created}</p>
                        <p><strong>Due:</strong> {due}</p>
                        <p><strong>Team:</strong> {equipiersDisplay}</p>
                    </div>
                </div>
            )}
        </article>
    );
}