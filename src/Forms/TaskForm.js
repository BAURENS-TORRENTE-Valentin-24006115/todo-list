import React, {useState} from "react";
import {Etats} from "../DataHolder/Etats";

export function TaskForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [etat, setEtat] = useState(Etats.NOUVEAU);
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
        setEtat(Etats.NOUVEAU);
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
                    {Object.values(Etats).map(s => <option key={s} value={s}>{s}</option>)}
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