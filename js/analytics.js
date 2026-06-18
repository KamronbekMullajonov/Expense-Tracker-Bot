import { storageEngine } from './storage.js';
import { chartingEngine } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
    const data = storageEngine.getState();
    
    const categoryMap = {};
    data.transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + parseFloat(t.amount);
    });

    chartingEngine.generatePie(
        'pieDistributionChart', 
        Object.keys(categoryMap), 
        Object.values(categoryMap)
    );

    chartingEngine.generateBar(
        'barRunRateChart',
        ['Apr', 'May', 'Jun'],
        [3200, 4100, 4500],
        [2100, 2900, 1850]
    );
});