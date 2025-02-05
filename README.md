
```markdown
# ATM CLI Application

## Overview

This is a Command Line Interface (CLI) application that simulates an ATM interaction with a retail bank.
It allows users to perform various banking operations, including deposits, withdrawals, and transfers.
The system ensures proper validation, debt handling, and session management.

## Features

- **User Authentication**: Users can log in with a name. If the user does not exist, they are automatically created.
- **Deposits**: Users can deposit money into their account, with debts automatically resolved first.
- **Withdrawals**: Users can withdraw money from their account if sufficient funds are available.
- **Transfers**: Users can transfer money to other users. If insufficient funds are available, a debt is recorded.
- **Debt Handling**: If a user owes money, deposits automatically settle debts before adding funds to their balance.
- **Session Management**: Users can log out and switch between accounts.

## Installation & Setup

Ensure you have Node.js installed.

## Clone this repository

git clone <repository_url>
cd atm-cli

## Install dependencies:

npm install

## Run the application:

./start.sh

## Commands

- `login [name]`: Logs in as a customer, creating an account if needed.
- `deposit [amount]`: Deposits funds into the logged-in user's account.
- `withdraw [amount]`: Withdraws funds if sufficient balance is available.
- `transfer [target] [amount]`: Transfers funds to another user. If insufficient balance, a debt is recorded.
- `logout`: Logs out the current user.
- `exit`: Exits the CLI application.

## Example Usage

```bash
$ login Alice
Hello, Alice!
Your balance is $0

$ deposit 100
Your balance is $100

$ logout
Goodbye, Alice!

$ login Bob
Hello, Bob!
Your balance is $0

$ deposit 80
Your balance is $80

$ transfer Alice 50
Transferred $50 to Alice
Your balance is $30

$ logout
Goodbye, Bob!
```

## Testing

Run the following command to execute unit tests:

```bash
npm test
```

## License

This project is licensed under the MIT License.
