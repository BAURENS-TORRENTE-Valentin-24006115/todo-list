import React, {useState} from "react";

export function SortForm({ onSubmit, onCancel, initialSort }) {
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