import { ATMService } from "./app/services/ATM";

let atm: ATMService;

beforeEach(() => {
    atm = new ATMService();
});

describe("ATMService", () => {

    test("User should be able to login and start with a balance of $0", () => {
        expect(atm.login("Alice")).toMatch(/^Hello, Alice!\nYour balance is \$0\s*$/);
    });

    test("User should be able to deposit money", () => {
        atm.login("Alice");
        expect(atm.deposit(100)).toBe("Your balance is $100");
    });

    test("User should be able to withdraw money", () => {
        atm.login("Alice");
        atm.deposit(100);
        expect(atm.withdraw(50)).toBe("Your balance is $50");
    });

    test("User should not be able to withdraw more than available balance", () => {
        atm.login("Alice");
        expect(atm.withdraw(50)).toBe("Insufficient funds.");
    });

    test("User should be able to transfer money", () => {
        atm.login("Alice");
        atm.deposit(100);
        atm.login("Bob");
        atm.deposit(50);
        atm.login("Alice");
        expect(atm.transfer("Bob", 50)).toBe("Transferred $50 to Bob\nYour balance is $50");
    });

    test("User should be able to transfer partially and owe remaining amount", () => {
        atm.login("Bob");
        atm.deposit(30); 
        atm.login("Alice");
        atm.deposit(100);
    
        atm.login("Bob");
        expect(atm.transfer("Alice", 50)).toBe("Transferred $30 to Alice\nYour balance is $0\nOwed $20 to Alice");
    });

    test("User should be able to logout", () => {
        atm.login("Alice");
        expect(atm.logout()).toBe("Goodbye, Alice!");
    });
});
