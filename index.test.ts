
import { ATM } from './index';

describe('ATM Class Tests', () => {
    let atm: ATM;

    beforeEach(() => {
        atm = new ATM();
    });

    test('should login user and display balance', () => {
        atm.login('John');
        expect(atm['currentUser']?.name).toBe('John');
        expect(atm['currentUser']?.balance).toBe(0);
    });

    test('should handle login error when no name is provided', () => {
        console.log = jest.fn();
        atm.login('');
        expect(console.log).toHaveBeenCalledWith('Error: Please provide a valid name to login.');
    });

    test('should deposit amount and increase balance', () => {
        atm.login('John');
        atm.deposit(100);
        expect(atm['currentUser']?.balance).toBe(100);
    });

    test('should reject invalid deposit amount', () => {
        console.log = jest.fn();
        atm.login('John');
        atm.deposit(-100);
        expect(console.log).toHaveBeenCalledWith('Error: Enter a valid number.');
    });

    test('should withdraw amount and reduce balance', () => {
        atm.login('John');
        atm.deposit(100);
        atm.withdraw(50);
        expect(atm['currentUser']?.balance).toBe(50);
    });

    test('should handle withdrawal with insufficient funds', () => {
        console.log = jest.fn();
        atm.login('John');
        atm.withdraw(50);
        expect(console.log).toHaveBeenCalledWith('Insufficient funds.');
    });

    test('should transfer amount between users', () => {
        atm.login('John');
        atm.deposit(100);
        atm['users'].set('Jane', { name: 'Jane', balance: 50, debts: {} });
        atm.transfer('Jane', 30);
        expect(atm['currentUser']?.balance).toBe(70);
        expect(atm['users'].get('Jane')?.balance).toBe(80);
    });

    test('should handle transfer when insufficient funds and create debt', () => {
        console.log = jest.fn();
        atm.login('John');
        atm.deposit(50);
        atm['users'].set('Jane', { name: 'Jane', balance: 50, debts: {} });
        atm.transfer('Jane', 100);
        expect(console.log).toHaveBeenCalledWith('Transferred $50 to Jane, Owed $50');
        expect(atm['users'].get('Jane')?.debts['John']).toBe(50);
    });

    test('should reject transfer to non-existent user', () => {
        console.log = jest.fn();
        atm.login('John');
        atm.deposit(100);
        atm.transfer('NonExistent', 50);
        expect(console.log).toHaveBeenCalledWith('User NonExistent does not exist.');
    });

    test('should logout user successfully', () => {
        atm.login('John');
        atm.logout();
        expect(atm['currentUser']).toBeNull();
    });

    test('should handle logout when no user is logged in', () => {
        console.log = jest.fn();
        atm.logout();
        expect(console.log).toHaveBeenCalledWith('No user logged in.');
    });

    test('should reject invalid transactions when no user is logged in', () => {
        console.log = jest.fn();
        atm.deposit(100);
        atm.withdraw(50);
        expect(console.log).toHaveBeenCalledWith('No user logged in.');
    });

    test('should show debts for the user', () => {
        atm.login('John');
        atm['currentUser']!.debts = { 'Jane': 50 };
        console.log = jest.fn();
        atm['displayDebts']();
        expect(console.log).toHaveBeenCalledWith('Owed $50 to Jane');
    });

    test('should handle invalid deposit amount as not a number', () => {
        console.log = jest.fn();
        atm.login('John');
        atm.deposit(NaN);
        expect(console.log).toHaveBeenCalledWith('Error: Enter a valid number.');
    });
});
