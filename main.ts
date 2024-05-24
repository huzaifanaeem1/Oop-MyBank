#!/usr/bin/env node
// Oop MyBank Project

import inquirer from "inquirer";
import chalk from "chalk";

// Bank account interface

interface IBankAccount {
    accountNumber: number;
    balance: number;
    withdrawl(amount: number): void;
    deposit(amount: number): void;
    checkBalance(): void;
}

// Bank account class
class BankAccount implements IBankAccount {
    accountNumber: number;
    balance: number;

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    // debit money
    withdrawl(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(chalk.green(`Withdrawal of $${amount} successful. Remaining balance: $${this.balance}`));
        } else {
            console.log(chalk.red("Insufficient balance"));
        }
    }

    // credit money
    deposit(amount: number): void {
        if (amount > 100) {
            amount -= 1; // $1 fee charged if more than $100 is deposited
        }
        this.balance += amount;
        console.log(chalk.green(`Deposit of $${amount} successful. Remaining balance: $${this.balance}`));
    }

    // check balance
    checkBalance(): void {
        console.log(chalk.blue(`Current balance: $${this.balance}`));
    }
}

// Customer class
class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: number;
    account: BankAccount;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobileNumber: number, account: BankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}

// Create bank accounts
const accounts: BankAccount[] = [
    new BankAccount(1001, 1000),
    new BankAccount(1002, 2000),
    new BankAccount(1003, 3000)
];

// Create customers
const customers: Customer[] = [
    new Customer("Huzaifa", "Naeem", "Male", 17, 3351848651, accounts[0]),
    new Customer("Haseeb", "Sadiq", "Male", 18, 3331118866, accounts[1]),
    new Customer("Aliyan", "Saleem", "Male", 18, 3335558866, accounts[2])
];

// Function to interact with bank account
async function service() {
    do {
        const accountNumberInput = await inquirer.prompt({
            name: "accountNumber",
            type: "number",
            message: "Enter your account number:"
        });

        const customer = customers.find(customer => customer.account.accountNumber === accountNumberInput.accountNumber);
        if (customer) {
            console.log(chalk.yellow(`Welcome, ${customer.firstName} ${customer.lastName}!\n`));
            const result = await inquirer.prompt([
                {
                    name: "select",
                    type: "list",
                    message: "Select an operation",
                    choices: [
                        "Deposit", "Withdrawl", "Check Balance", "Exit"
                    ]
                }
            ]);

            switch (result.select) {
                case "Deposit":
                    const depositAmount = await inquirer.prompt([{
                        name: "amount",
                        type: "number",
                        message: "Enter the amount to deposit:"
                    }]);
                    customer.account.deposit(depositAmount.amount);
                    break;

                case "Withdrawl":
                    const withdrawlAmount = await inquirer.prompt([{
                        name: "amount",
                        type: "number",
                        message: "Enter the amount to withdraw:"
                    }]);
                    customer.account.withdrawl(withdrawlAmount.amount);
                    break;

                case "Check Balance":
                    customer.account.checkBalance();
                    break;

                case "Exit":
                    console.log(chalk.magenta("Exiting Bank Program..."));
                    console.log(chalk.cyan("\nThank you for using our bank services"));
                    return;
            }
        } else {
            console.log(chalk.red("Invalid account number. Please try again."));
        }
    } while (true);
}

service();
