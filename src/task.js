import {ETATS} from "./etats";
import {Component} from "react";
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
        const due = this.date_echeance ? this.date_echeance.toLocaleDateString() : 'N/A';
        const created = this.date_creation ? this.date_creation.toLocaleDateString() : 'N/A';
        const equipiersDisplay = (this.equipiers || []).map(e => (e && typeof e === 'object' ? (e.name || '') : e)).filter(Boolean).join(', ') || '—';

        return <article className="task">
                <h2>{this.title}</h2>
                <p>{this.description}</p>
                <p>Created on: {created}</p>
                <p>Due by: {due}</p>
                <p>Status: {this.etat}</p>
                <p>Team members: {equipiersDisplay}</p>
            </article>;
    }
}