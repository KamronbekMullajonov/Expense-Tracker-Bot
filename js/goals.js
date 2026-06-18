import { storageEngine } from './storage.js';
import { uiManager, i18nDictionary } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('goals-anchor-row');
    const modal = document.getElementById('goal-modal');
    const form = document.getElementById('goal-creation-form');

    function renderGoals() {
        if(!container) return;
        const state = storageEngine.getState();
        const lang = state.systemSettings.currentLang || 'en';
        container.innerHTML = "";

        state.goals.forEach(g => {
            const ratio = Math.min((g.current / g.target) * 100, 100);
            const card = document.createElement('div');
            card.className = "budget-progress-card glass-card";
            card.innerHTML = `
                <div class="budget-meta">
                    <h4>${g.name}</h4>
                    <span>${uiManager.formatCurrency(g.current)} / ${uiManager.formatCurrency(g.target)}</span>
                </div>
                <div class="progress-track-bar">
                    <div class="progress-fill-node" style="width: ${ratio}%; background: var(--emerald-accent)"></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; font-size:12px; color:var(--text-muted); gap:10px; margin-top:4px;">
                    <span>${ratio.toFixed(0)}% ${i18nDictionary[lang].secured}</span>
                    <button class="inject-fund-btn" data-id="${g.id}" style="background:none; border:none; color:var(--indigo-accent); cursor:pointer; font-weight:600; font-size:12px;"><i class="fa-solid fa-plus-circle"></i> ${i18nDictionary[lang].topUp}</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    if(document.getElementById('open-goal-modal-btn')) {
        document.getElementById('open-goal-modal-btn').onclick = () => modal.style.display = 'flex';
    }
    if(document.getElementById('close-goal-modal-btn')) {
        document.getElementById('close-goal-modal-btn').onclick = () => modal.style.display = 'none';
    }

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const state = storageEngine.getState();
            state.goals.push({
                id: Date.now().toString(),
                name: document.getElementById('goal-name-field').value,
                target: parseFloat(document.getElementById('goal-target-field').value),
                current: parseFloat(document.getElementById('goal-current-field').value || 0)
            });
            storageEngine.saveState(state);
            form.reset();
            modal.style.display = 'none';
            renderGoals();
        });
    }

    if(container) {
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.inject-fund-btn');
            if(btn) {
                const id = btn.getAttribute('data-id');
                const amt = prompt("Amount ($):");
                if(amt && !isNaN(amt)) {
                    const state = storageEngine.getState();
                    const targetGoal = state.goals.find(g => g.id === id);
                    if(targetGoal) {
                        targetGoal.current += parseFloat(amt);
                        storageEngine.saveState(state);
                        renderGoals();
                    }
                }
            }
        });
    }
    renderGoals();
});