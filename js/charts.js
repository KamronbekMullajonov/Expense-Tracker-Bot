export const chartingEngine = {
    generatePie(canvasId, labels, dataValues) {
        const ctx = document.getElementById(canvasId);
        if(!ctx) return null;
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: ['#6366f1', '#10b981', '#f43f5e', '#a855f7', '#f59e0b', '#06b6d4'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
            }
        });
    },
    generateBar(canvasId, labels, incomeVals, expenseVals) {
        const ctx = document.getElementById(canvasId);
        if(!ctx) return null;
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Inflows', data: incomeVals, backgroundColor: '#10b981', borderRadius: 6 },
                    { label: 'Outflows', data: expenseVals, backgroundColor: '#f43f5e', borderRadius: 6 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
            }
        });
    }
};