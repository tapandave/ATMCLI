import * as readline from 'readline';

// Interface to represent a User in the ATM system
export interface User {
    name: string;
    balance: number;
    debts: Record<string, number>;
}

// ATM Class that handles the ATM operations
export class ATM {
    private users: Map<string, User> = new Map();
    private currentUser: User | null = null;

    // Login method that allows users to log in, or creates a new user if not found
    login(name?: string): void {
        if (!name) return console.log('Error: Please provide a valid name to login.');
        
        // If user does not exist, create a new user with initial balance of 0
        if (!this.users.has(name)) this.users.set(name, { name, balance: 0, debts: {} });
        
        // Set the current user
        this.currentUser = this.users.get(name)!;
        
        console.log(`Hello, ${name}!\nYour balance is $${this.currentUser.balance}`);
        
        // Display any debts the user has
        this.displayDebts();
    }

    // Method to deposit funds into the current user's account
    deposit(amount: number): void {
        if (!this.validateTransaction(amount)) return;

        let remainingAmount = amount;
    
        // Resolve debts first before adding to balance
        for (const debtor in this.currentUser!.debts) {
            if (remainingAmount <= 0) break;
            remainingAmount = this.resolveDebt(debtor, remainingAmount); // Adjust the remaining amount
        }
    
        // Add the remaining amount to the current user's balance
        this.currentUser!.balance += remainingAmount;
        console.log(`Your balance is $${this.currentUser!.balance}`);
    }

    // Method to withdraw money from the current user's account
    withdraw(amount: number): void {
        if (!this.validateTransaction(amount) || this.currentUser!.balance < amount) {
            console.log('Insufficient funds.');
            return;
        }
        this.currentUser!.balance -= amount;
        console.log(`Your balance is $${this.currentUser!.balance}`);
    }

    // Method to transfer funds to another user
    transfer(targetName: string, amount: number): void {
        if (!this.validateTransaction(amount) || !this.users.has(targetName)) {
            console.log(`User ${targetName} does not exist.`);
            return;
        }
        const targetUser = this.users.get(targetName)!;
        this.executeTransfer(targetUser, amount);
    }

    // Method to log out the current user
    logout(): void {
        if (!this.currentUser) return console.log('No user logged in.');
        console.log(`Goodbye, ${this.currentUser.name}!`);
        this.currentUser = null;
    }

    // Private method to validate transactions (ensure logged-in user and valid amount)
    private validateTransaction(amount: number): boolean {
        if (!this.currentUser) return console.log('No user logged in.'), false;
        if (isNaN(amount) || amount <= 0) return console.log('Error: Enter a valid number.'), false;
        return true;
    }

    // Private method to resolve debts by paying off the debtor with available amount
    private resolveDebt(debtor: string, amount: number): number {
        if (!this.users.has(debtor)) {
            console.log(`Error: Debtor ${debtor} not found.`);
            return amount; // Return remaining amount if debtor is not found
        }
    
        const payAmount = Math.min(amount, this.currentUser!.debts[debtor]);
        this.currentUser!.debts[debtor] -= payAmount;
    
        // Ensure debtor exists before accessing their balance
        const debtorUser = this.users.get(debtor)!;
        debtorUser.balance += payAmount;
    
        // If the debt to a debtor is fully paid, remove them from the debts list
        if (this.currentUser!.debts[debtor] === 0) delete this.currentUser!.debts[debtor];
    
        console.log(`Transferred $${payAmount} to ${debtor}`);
        return amount - payAmount;
    }

    // Private method to execute a transfer from the current user to another user
    private executeTransfer(targetUser: User, amount: number): void {
        let amountToTransfer = amount;

        // First, use available balance to pay off any existing debt
        for (const debtor in this.currentUser!.debts) {
            if (amountToTransfer <= 0) break;
            amountToTransfer = this.resolveDebt(debtor, amountToTransfer); // Adjust the remaining amount
        }

        // Now, if there's still a remaining amount to transfer, check if it's possible
        if (this.currentUser!.balance >= amountToTransfer) {
            this.currentUser!.balance -= amountToTransfer;
            targetUser.balance += amountToTransfer;
            console.log(`Transferred $${amountToTransfer} to ${targetUser.name}`);
        } else {
            const transferable = this.currentUser!.balance;
            this.currentUser!.balance = 0;
            targetUser.balance += transferable;
            targetUser.debts[this.currentUser!.name] = (targetUser.debts[this.currentUser!.name] || 0) + (amount - transferable);
            console.log(`Transferred $${transferable} to ${targetUser.name}, Owed $${amount - transferable}`);
        }
        console.log(`Your balance is $${this.currentUser!.balance}`);
    }

    // Private method to display debts of the current user
    private displayDebts(): void {
        Object.entries(this.currentUser!.debts).forEach(([creditor, amount]) => console.log(`Owed $${amount} to ${creditor}`));
    }
}

// Create an instance of the ATM class and a readline interface to accept commands
const atm = new ATM();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Display a welcome message and accept commands
console.log('Welcome to the ATM. Type a command:');
rl.on('line', (input) => {
    const [command, ...args] = input.split(' ');
    switch (command) {
        case 'login': atm.login(args[0]); break; // Login command
        case 'deposit': atm.deposit(Number(args[0])); break; // Deposit command
        case 'withdraw': atm.withdraw(Number(args[0])); break; // Withdraw command
        case 'transfer': atm.transfer(args[0], Number(args[1])); break; // Transfer command
        case 'logout': atm.logout(); break; // Logout command
        case 'exit': rl.close(); break; // Exit command
        default: console.log('Unknown command.'); // Unknown command handler
    }
});
