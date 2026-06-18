import { storageEngine } from './storage.js';
import { uiManager } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('budgets-target-anchor');
    const modal = document.getElementById('budget-modal');
    const form = document.getElementById('budget-config-form');

    function renderBudgets() {
        if(!container) return;
        const state = storageEngine.getState();
        container.innerHTML = "";

        state.budgets.forEach(b => {
            const currentSpent = state.transactions
                .filter(t => t.type === 'expense' && t.category === b.category)
                .reduce((sum, current) => sum + parseFloat(current.amount), 0);

            const ratio = Math.min((currentSpent / b.limit) * 100, 100);
            const card = document.createElement('div');
            card.className = "budget-progress-card glass-card";
            card.innerHTML = `
                <div class="budget-meta">
                    <h4>${b.category}</h4>
                    <span>${uiManager.formatCurrency(currentSpent)} / ${uiManager.formatCurrency(b.limit)}</span>
                </div>
                <div class="progress-track-bar">
                    <div class="progress-fill-node ${ratio >= 100 ? 'danger-alert' : ''}" style="width: ${ratio}%"></div>
                </div>
                <small style="color: var(--text-muted)">Allocation Threshold: ${ratio.toFixed(0)}% Utilized</small>
            `;
            container.appendChild(card);
        });
    }

    if(document.getElementById('add-budget-trigger-btn')) {
        document.getElementById('add-budget-trigger-btn').onclick = () => modal.style.display = 'flex';
    }
    if(document.getElementById('close-budget-modal-btn')) {
        document.getElementById('close-budget-modal-btn').onclick = () => modal.style.display = 'none';
    }

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const state = storageEngine.getState();
            const targetCat = document.getElementById('budget-category-selector').value;
            const targetLimit = parseFloat(document.getElementById('budget-amount-limit').value);

            const searchIndex = state.budgets.findIndex(b => b.category === targetCat);
            if(searchIndex > -1) state.budgets[searchIndex].limit = targetLimit;
            else state.budgets.push({ category: targetCat, limit: targetLimit });

            storageEngine.saveState(state);
            form.reset();
            modal.style.display = 'none';
            renderBudgets();
        });
    }
    renderBudgets();
});