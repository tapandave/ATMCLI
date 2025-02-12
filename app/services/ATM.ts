import { User } from "../models/User";

export class ATMService {
    private users: Map<string, User> = new Map();
    private currentUser: User | null = null;

    login(name: string): string {
        if (!name) return "Error: Provide a valid name.";
        if (!this.users.has(name)) this.users.set(name, new User(name));
        this.currentUser = this.users.get(name)!;

        return `Hello, ${name}!\nYour balance is $${this.currentUser.balance}\n${this.displayDebts()}`;
    }

    deposit(amount: number): string {
        if (!this.validateTransaction(amount)) return "Invalid transaction.";
    
        let remainingAmount = amount;
    
        // Pay off debts first
        for (const [creditor, amountOwed] of Object.entries(this.currentUser!.debts)) {
            const amountToPay = Math.min(amountOwed, remainingAmount);
            
            // Update creditor's balance
            this.users.get(creditor)!.addBalance(amountToPay);
    
            // Deduct from remaining deposit
            remainingAmount -= amountToPay;
    
            // Remove or reduce debt
            if (amountToPay === amountOwed) {
                delete this.currentUser!.debts[creditor]; // Debt fully cleared
            } else {
                this.currentUser!.debts[creditor] -= amountToPay; // Partial payment
            }
    
            if (remainingAmount === 0) break; // Stop if all deposit is used
        }
    
        // Add remaining deposit to user's balance
        this.currentUser!.addBalance(remainingAmount);
        return `Your balance is $${this.currentUser!.balance}`;
    }
    

    withdraw(amount: number): string {
        if (!this.validateTransaction(amount)) return "Invalid transaction.";
        if (this.currentUser!.balance < amount) return "Insufficient funds.";

        this.currentUser!.deductBalance(amount);
        return `Your balance is $${this.currentUser!.balance}`;
    }

    transfer(targetName: string, amount: number): string {
        if (!this.validateTransaction(amount)) return "Invalid transaction.";
        if (!this.users.has(targetName)) return `User ${targetName} does not exist.`;
    
        const targetUser = this.users.get(targetName)!;
        let remainingAmount = amount;
    
        // First, clear any existing debts
        for (const creditor in this.currentUser!.debts) {
            remainingAmount = this.currentUser!.clearDebt(creditor, remainingAmount);
        }
    
        if (this.currentUser!.balance >= remainingAmount) {
            // If enough balance, transfer directly
            this.currentUser!.deductBalance(remainingAmount);
            targetUser.addBalance(remainingAmount);
            return `Transferred $${remainingAmount} to ${targetUser.name}\nYour balance is $${this.currentUser!.balance}`;
        } else {
            // If not enough balance, transfer what is available and record debt
            const transferable = this.currentUser!.balance;
            this.currentUser!.deductBalance(transferable);
            targetUser.addBalance(transferable);
            
            const remainingDebt = amount - transferable;
            if (remainingDebt > 0) {
                // Ensure both users have the correct debt record
                this.currentUser!.debts[targetUser.name] = 
                    (this.currentUser!.debts[targetUser.name] || 0) + remainingDebt;
                targetUser.debts[this.currentUser!.name] = 
                    (targetUser.debts[this.currentUser!.name] || 0) + remainingDebt;
            }
            
            return `Transferred $${transferable} to ${targetUser.name}\nYour balance is $${this.currentUser!.balance}\nOwed $${remainingDebt} to ${targetUser.name}`;
        }
    }
    

    logout(): string {
        if (!this.currentUser) return "No user logged in.";
        const message = `Goodbye, ${this.currentUser.name}!`;
        this.currentUser = null;
        return message;
    }

    private validateTransaction(amount: number): boolean {
        return !!this.currentUser && !isNaN(amount) && amount > 0;
    }

    private displayDebts(): string {
        return Object.entries(this.currentUser!.debts)
            .map(([creditor, amount]) => `Owed $${amount} to ${creditor}`)
            .join("\n") || "";
    }
}
