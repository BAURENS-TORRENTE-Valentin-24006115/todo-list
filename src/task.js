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
    const [isEditing, setIsEditing] = useState(false);

    // Local state for immediate feedback
    const [localEtat, setLocalEtat] = useState(model.etat);

    // Edit form states
    const [editTitle, setEditTitle] = useState(model.title);
    const [editDescription, setEditDescription] = useState(model.description);
    const [editDate, setEditDate] = useState(model.date_echeance ? model.date_echeance.toISOString().split('T')[0] : '');
    const [editEquipiers, setEditEquipiers] = useState((model.equipiers || []).map(e => (typeof e === 'object' ? e.name : e)).join(', '));

    const handleStatusChange = (e) => {
        e.stopPropagation();
        const newEtat = e.target.value;
        model.updateEtat(newEtat);
        setLocalEtat(newEtat);
    };

    const handleSave = () => {
        model.title = editTitle;
        model.description = editDescription;
        model.date_echeance = editDate ? new Date(editDate) : undefined;
        model.equipiers = editEquipiers.split(',').map(e => e.trim()).filter(Boolean);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(model.title);
        setEditDescription(model.description);
        setEditDate(model.date_echeance ? model.date_echeance.toISOString().split('T')[0] : '');
        setEditEquipiers((model.equipiers || []).map(e => (typeof e === 'object' ? e.name : e)).join(', '));
        setIsEditing(false);
    };

    const due = model.date_echeance ? model.date_echeance.toLocaleDateString() : 'N/A';
    const created = model.date_creation ? model.date_creation.toLocaleDateString() : 'N/A';
    const equipiersDisplay = (model.equipiers || []).map(e => (e && typeof e === 'object' ? (e.name || '') : e)).filter(Boolean).join(', ') || '—';

    return (
        <article className={`task bubble ${expanded ? 'expanded' : ''}`}>
            <div className="task-header" onClick={() => setExpanded(!expanded)}>
                <span className="arrow">{expanded ? '▼' : '▶'}</span>
                <h2>{isEditing ? 'Modification : ' + model.title : model.title}</h2>
                <select
                    value={localEtat}
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleStatusChange}
                    className={`status-badge ${
                        localEtat === ETATS.REUSSI ? 'completed' :
                        localEtat === ETATS.ABANDONNE ? 'gave-up' : ''
                    }`}
                    style={{
                        border: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        textAlign: 'center'
                    }}
                >
                    {Object.values(ETATS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            {expanded && (
                <div className="task-details">
                    {!isEditing ? (
                        <>
                            <p className="description">{model.description || 'Aucune description'}</p>
                            <div className="meta-info">
                                <p><strong>Créé le :</strong> {created}</p>
                                <p><strong>Échéance :</strong> {due}</p>
                                <p><strong>Équipe :</strong> {equipiersDisplay}</p>
                            </div>
                            <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
                                <button onClick={() => setIsEditing(true)}>Modifier</button>
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
                                <label>Date d'échéance</label>
                                <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Équipe (séparée par des virgules)</label>
                                <input value={editEquipiers} onChange={e => setEditEquipiers(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={handleCancel}>Annuler</button>
                                <button onClick={handleSave}>Enregistrer</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}