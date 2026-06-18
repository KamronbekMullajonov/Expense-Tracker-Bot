const DATA_KEY = "_expense_tracker_data";

const DEFAULT_STRUCTURE = {
    transactions: [
        {id: "1", type: "income", amount: 4500, category: "Salary", date: "2026-06-01", description: "Primary Paycheck"},
        {id: "2", type: "expense", amount: 150, category: "Food & Dining", date: "2026-06-10", description: "Team Supper"},
        {id: "3", type: "expense", amount: 90, category: "Utilities", date: "2026-06-12", description: "Electricity Node Grid"}
    ],
    budgets: [
        {category: "Food & Dining", limit: 500},
        {category: "Utilities", limit: 200}
    ],
    goals: [
        {id: "1", name: "High-Yield Reserve Savings Vault", target: 5000, current: 2800}
    ],
    systemSettings: {
        currentLang: "en",
        brandName: "ApexFinance"
    }
};

export const storageEngine = {
    init() {
        let current = localStorage.getItem(DATA_KEY);
        if (!current) {
            localStorage.setItem(DATA_KEY, JSON.stringify(DEFAULT_STRUCTURE));
            return DEFAULT_STRUCTURE;
        }
        
        // Ensure systemSettings node structure is safely backfilled
        let parsed = JSON.parse(current);
        if (!parsed.systemSettings) {
            parsed.systemSettings = { currentLang: "en", brandName: "ApexFinance" };
            localStorage.setItem(DATA_KEY, JSON.stringify(parsed));
        }
        return parsed;
    },
    getState() {
        return this.init();
    },
    saveState(data) {
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    },
    purgeStateData() {
        localStorage.removeItem(DATA_KEY);
        this.init();
    }
};