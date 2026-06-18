import { storageEngine } from './storage.js';
import { uiManager, i18nDictionary } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    storageEngine.init();
    
    const balanceText = document.getElementById('total-balance-display');
    const incomeText = document.getElementById('monthly-income-display');
    const expenseText = document.getElementById('monthly-expense-display');
    const savingsText = document.getElementById('net-savings-display');
    const tableBody = document.getElementById('dashboard-tx-table-body');
    const form = document.getElementById('tx-entry-form');
    const searchInput = document.getElementById('tx-search-input');
    const typeFilter = document.getElementById('tx-type-filter');

    function render() {
        const activeState = storageEngine.getState();
        let query = searchInput ? searchInput.value.toLowerCase() : "";
        let filterVal = typeFilter ? typeFilter.value : "all";

        let totalIncome = 0, totalExpense = 0;
        activeState.transactions.forEach(t => {
            if(t.type === 'income') totalIncome += parseFloat(t.amount);
            else totalExpense += parseFloat(t.amount);
        });

        const netBalance = totalIncome - totalExpense;

        if(balanceText) balanceText.textContent = uiManager.formatCurrency(netBalance);
        if(incomeText) incomeText.textContent = uiManager.formatCurrency(totalIncome);
        if(expenseText) expenseText.textContent = uiManager.formatCurrency(totalExpense);
        if(savingsText) savingsText.textContent = uiManager.formatCurrency(netBalance > 0 ? netBalance * 0.4 : 0);

        if(tableBody) {
            tableBody.innerHTML = "";
            const filtered = activeState.transactions.filter(t => {
                const matchQuery = t.description.toLowerCase().includes(query) || t.category.toLowerCase().includes(query);
                const matchType = filterVal === 'all' || t.type === filterVal;
                return matchQuery && matchType;
            });

            filtered.forEach(t => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${t.description}</strong></td>
                    <td><span class="category-tag">${t.category}</span></td>
                    <td>${t.date}</td>
                    <td class="${t.type === 'income' ? 'text-green' : 'text-rose'}">
                        ${t.type === 'income' ? '+' : '-'}${uiManager.formatCurrency(t.amount)}
                    </td>
                    <td>
                        <button class="action-btn delete-row-btn" data-id="${t.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
        generateInsights(activeState);
    }

    function generateInsights(appState) {
        const stack = document.getElementById('insights-dynamic-stack');
        if(!stack) return;
        stack.innerHTML = "";
        const lang = appState.systemSettings.currentLang || 'en';
        
        appState.budgets.forEach(b => {
            const catSpent = appState.transactions
                .filter(t => t.type === 'expense' && t.category === b.category)
                .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
            if(catSpent > b.limit) {
                stack.innerHTML += `
                    <div class="insight-card warning-insight">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <strong>${b.category}:</strong> Over limit by ${uiManager.formatCurrency(catSpent - b.limit)}.
                    </div>`;
            }
        });

        if(stack.innerHTML === "") {
            stack.innerHTML = `<div class="insight-card"><i class="fa-solid fa-circle-check" style="color:var(--emerald-accent)"></i> ${i18nDictionary[lang].insightsOk}</div>`;
        }
    }

    const modal = document.getElementById('tx-modal');
    if(document.getElementById('open-tx-modal-btn')) {
        document.getElementById('open-tx-modal-btn').onclick = () => modal.style.display = 'flex';
    }
    if(document.getElementById('close-tx-modal-btn')) {
        document.getElementById('close-tx-modal-btn').onclick = () => modal.style.display = 'none';
    }

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentData = storageEngine.getState();
            const newTx = {
                id: Date.now().toString(),
                type: document.querySelector('input[name="tx-type"]:checked').value,
                amount: parseFloat(document.getElementById('tx-amount').value),
                category: document.getElementById('tx-category').value,
                date: document.getElementById('tx-date').value,
                description: document.getElementById('tx-desc').value
            };
            currentData.transactions.unshift(newTx);
            storageEngine.saveState(currentData);
            form.reset();
            modal.style.display = 'none';
            render();
        });
    }

    if(tableBody) {
        tableBody.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-row-btn');
            if(deleteBtn) {
                const targetId = deleteBtn.getAttribute('data-id');
                const data = storageEngine.getState();
                data.transactions = data.transactions.filter(t => t.id !== targetId);
                storageEngine.saveState(data);
                render();
            }
        });
    }

    if(searchInput) searchInput.addEventListener('input', render);
    if(typeFilter) typeFilter.addEventListener('change', render);

    render();
});