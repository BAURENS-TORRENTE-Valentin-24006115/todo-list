import {Etats} from "../DataHolder/Etats";
import {useState} from "react";

export function FilterForm({ onSubmit, onCancel, folders, initialFilter }) {
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
                        {Object.values(Etats).map(s => <option key={s} value={s}>{s}</option>)}
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