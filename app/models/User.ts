export class User {
    name: string;
    balance: number;
    debts: Record<string, number>;

    constructor(name: string) {
        this.name = name;
        this.balance = 0;
        this.debts = {};
    }

    addBalance(amount: number) {
        this.balance += amount;
    }

    deductBalance(amount: number) {
        this.balance -= amount;
    }

    addDebt(creditor: string, amount: number) {
        this.debts[creditor] = (this.debts[creditor] || 0) + amount;
    }

    clearDebt(creditor: string, amount: number): number {
        if (!this.debts[creditor]) return amount;

        const payAmount = Math.min(this.debts[creditor], amount);
        this.debts[creditor] -= payAmount;

        if (this.debts[creditor] === 0) delete this.debts[creditor];
        return amount - payAmount;
    }
}
