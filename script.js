const incomeDisplay = document.getElementById('income');
const expensesDisplay = document.getElementById('expenses');
const balanceDisplay = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const addTransactionBtn = document.getElementById('addTransaction');
const expenseChartCanvas = document.getElementById('expenseChart');

const transactions = [];

function updateDisplay() {
    let income = 0;
    let expenses = 0;
    transactions.forEach((transaction) => {
        if (transaction.amount > 0) {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    }

    incomeDisplay.textContent = income.toFixed(2);
    expensesDisplay.textContent = expenses.toFixed(2);
    balanceDisplay.textContent = (income + expenses).toFixed(2);

    updateTransactionsList();
    createPieChart();
}

function updateTransactionsList() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const item = document.createElement('li');
        item.classList.add(transaction.amount > 0 ? 'income' : 'expense');
        item.innerHTML = `${transaction.text} (${transaction.category}) <span>${transaction.amount.toFixed(2)}</span> <button onclick="deleteTransaction(${index})">X</button>`;
        transactionList.appendChild(item);
    });
}

function createPieChart() {
    const expenseData = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc - transaction.amount, 0);
    const incomeData = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const ctx = expenseChartCanvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Expenses', 'Income'],
            datasets: [{
                data: [expenseData, incomeData],
                backgroundColor: ['#FF5733', '#33FF57'],
            }],
        },
    });
}

function addTransaction() {
    const text = textInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (text.trim() === '' || isNaN(amount)) {
        alert('Please enter valid text and amount.');
        return;
    }

    transactions.push({ text, amount, category });
    textInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';

    updateDisplay();
    saveTransactionsToLocalStorage();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateDisplay();
    saveTransactionsToLocalStorage();
}

function saveTransactionsToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactionsFromLocalStorage() {
    const transactionsFromLocalStorage = JSON.parse(localStorage.getItem('transactions'));
    if (transactionsFromLocalStorage) {
        transactions.push(...transactionsFromLocalStorage);
    }
}

addTransactionBtn.addEventListener('click', addTransaction);
loadTransactionsFromLocalStorage();
updateDisplay();
