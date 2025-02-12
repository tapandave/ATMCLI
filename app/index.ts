import * as readline from "readline";
import { ATMService } from "./services/ATM";

const atm = new ATMService();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Welcome to the ATM. Type a command:");
rl.on("line", (input) => {
    const [command, ...args] = input.split(" ");
    let output = "";

    switch (command) {
        case "login": output = atm.login(args[0]); break;
        case "deposit": output = atm.deposit(Number(args[0])); break;
        case "withdraw": output = atm.withdraw(Number(args[0])); break;
        case "transfer": output = atm.transfer(args[0], Number(args[1])); break;
        case "logout": output = atm.logout(); break;
        case "exit": rl.close(); return;
        default: output = "Unknown command.";
    }

    console.log(output);
});
