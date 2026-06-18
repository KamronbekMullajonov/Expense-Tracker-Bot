import { storageEngine } from './storage.js';

export const i18nDictionary = {
    en: {
        dashboard: "Dashboard", analytics: "Analytics", budgets: "Budgets", goals: "Goals", settings: "Settings",
        welcome: "Welcome Back, Financial Maestro", overview: "Overview of your real-time financial health index.",
        health: "Financial Health", netBalance: "Net Total Balance", monthlyIncome: "Monthly Income",
        monthlyExpenses: "Monthly Expenses", netSavings: "Net Savings", recentEntries: "Recent Ledger Entries",
        addTx: "Add Transaction", searchPlaceholder: "Search entries...", allTypes: "All Types",
        incomes: "Incomes", expenses: "Expenses", desc: "Description", cat: "Category", date: "Date",
        amt: "Amount", actions: "Actions", insightsTitle: "Smart Financial Insights", insightsOk: "Systems Healthy. Your allocations look highly optimal this sequence period.",
        longTermGoals: "Long-term Savings Milestones", initMilestone: "Initialize Milestone Goal", secured: "Secured", topUp: "Quick Top-Up",
        sysConfig: "System Configuration Management", dataDiagnostics: "Data Pipeline Diagnostics Engine",
        dataDiagDesc: "Manage underlying infrastructure nodes and application state cache arrays manually.",
        factoryReset: "Factory Hard Reset Local Storage", changeBrand: "Configure Custom Dashboard Branding Name",
        selectLang: "Change Dashboard Language Option Mode", commitBrand: "Update Title Identity",
        budgetLimitTitle: "Dynamic Limits & Budgets", configureLimit: "Configure Limit", utilized: "Utilized Allocation"
    },
    uz: {
        dashboard: "Boshqaruv paneli", analytics: "Tahlillar", budgets: "Byudjetlar", goals: "Maqsadlar", settings: "Sozlamalar",
        welcome: "Xush kelibsiz, Moliyaviy Maestro", overview: "Sizning real vaqtdagi moliyaviy holatingiz indeksi.",
        health: "Moliyaviy salomatlik", netBalance: "Sof umumiy balans", monthlyIncome: "Aylik daromad",
        monthlyExpenses: "Aylik xarajatlar", netSavings: "Sof jamg'armalar", recentEntries: "Yaqindagi o'tkazmalar",
        addTx: "Tranzaksiya qo'shish", searchPlaceholder: "Qidirish...", allTypes: "Barcha turlar",
        incomes: "Daromadlar", expenses: "Xarajatlar", desc: "Tavsif", cat: "Kategoriya", date: "Sana",
        amt: "Miqdor", actions: "Amallar", insightsTitle: "Aqlli moliyaviy tahlillar", insightsOk: "Tizim barqaror. Xarajatlar taqsimoti hozircha ideal holatda.",
        longTermGoals: "Uzoq muddatli jamg'arma maqsadlari", initMilestone: "Yangi maqsad qo'shish", secured: "To'plandi", topUp: "Balansni to'ldirish",
        sysConfig: "Tizim sozlamalarini boshqarish", dataDiagnostics: "Ma'lumotlar ombori diagnostikasi",
        dataDiagDesc: "Ilova ma'lumotlar keshini va mahalliy xotirani qo'lda boshqarish yoki tozalash.",
        factoryReset: "Xotirani to'liq tozalash (Reset)", changeBrand: "Ilova brend nomini o'zgartirish",
        selectLang: "Tizim tilini tanlang", commitBrand: "Nomni yangilash",
        budgetLimitTitle: "Aylik cheklovlar va Byudjetlar", configureLimit: "Cheklov o'rnatish", utilized: "Ishlatilgan qism"
    },
    ru: {
        dashboard: "Панель управления", analytics: "Аналитика", budgets: "Бюджеты", goals: "Цели", settings: "Настройки",
        welcome: "С возвращением, Финансовый Маэстро", overview: "Обзор вашего финансового состояния в реальном времени.",
        health: "Финансовое здоровье", netBalance: "Чистый общий баланс", monthlyIncome: "Ежемесячный доход",
        monthlyExpenses: "Ежемесячные расходы", netSavings: "Чистые сбережения", recentEntries: "Последние записи реестра",
        addTx: "Добавить транзакцию", searchPlaceholder: "Поиск записей...", allTypes: "Все типы",
        incomes: "Доходы", expenses: "Расходы", desc: "Описание", cat: "Категория", date: "Дата",
        amt: "Сумма", actions: "Действия", insightsTitle: "Умная финансовая аналитика", insightsOk: "Система в норме. Распределение средств оптимально.",
        longTermGoals: "Долгосрочные финансовые цели", initMilestone: "Создать новую цель", secured: "Обеспечено", topUp: "Пополнить",
        sysConfig: "Управление конфигурацией системы", dataDiagnostics: "Диагностика конвейера данных",
        dataDiagDesc: "Управление узлами инфраструктуры и массивами кэша состояния приложения вручную.",
        factoryReset: "Заводской сброс локального хранилища", changeBrand: "Изменить название личного бренда",
        selectLang: "Выбрать языковой режим приложения", commitBrand: "Обновить название",
        budgetLimitTitle: "Лимиты и Бюджеты", configureLimit: "Настроить лимит", utilized: "Использовано"
    }
};

export const uiManager = {
    formatCurrency(amount, symbol = '$') {
        return `${symbol}${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    syncGlobalTheme() {
        const isDark = localStorage.getItem('__theme') !== 'light';
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if(toggleBtn) toggleBtn.checked = isDark;
    },
    translatePage() {
        const state = storageEngine.getState();
        const lang = state.systemSettings.currentLang || 'en';
        const dict = i18nDictionary[lang];

        // Apply customized branding title directly safely
        const brandLabel = document.getElementById('app-brand-text-render');
        if (brandLabel) {
            brandLabel.textContent = state.systemSettings.brandName || "ApexFinance";
        }

        // Translate matching static language placeholder UI tags inside DOM mapping
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', dict[key]);
                } else {
                    el.textContent = dict[key];
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    uiManager.syncGlobalTheme();
    uiManager.translatePage();
    const toggle = document.getElementById('theme-toggle-btn');
    if(toggle) {
        toggle.addEventListener('change', (e) => {
            localStorage.setItem('__theme', e.target.checked ? 'dark' : 'light');
            uiManager.syncGlobalTheme();
        });
    }
});