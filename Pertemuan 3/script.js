const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
const showFormBtn = document.getElementById("showFormBtn");
const formContainer = document.getElementById("formContainer");
const amountInput = document.getElementById("amount");
const overlay = document.getElementById("overlay");

// FIX: key localStorage sebelumnya typo "transacAtions", sekarang konsisten "transactions"
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let currentFilter = "all";

function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {
        if (item.type === "income") {
            income += item.amount;
        } else {
            expense += item.amount;
        }
    });

    const balance = income - expense;

    document.getElementById("income").textContent = formatRupiah(income);
    document.getElementById("expense").textContent = formatRupiah(expense);
    document.getElementById("balance").textContent = formatRupiah(balance);
}

function renderTransactions(filter = currentFilter) {

    currentFilter = filter;
    transactionList.innerHTML = "";

    let filteredTransactions = transactions;

    if (filter !== "all") {
        filteredTransactions = transactions.filter(item => item.type === filter);
    }

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `<div class="card">Belum ada transaksi.</div>`;
        updateSummary();
        return;
    }

    filteredTransactions
        .slice()
        .reverse()
        .forEach(transaction => {

            const card = document.createElement("div");
            card.className = "transaction-card";

            card.innerHTML = `
                <div class="transaction-info">
                    <h3>${transaction.title}</h3>
                    <p>${transaction.date}</p>
                </div>
                <div class="transaction-right">
                    <span class="${transaction.type === "income" ? "amount-income" : "amount-expense"}">
                        ${transaction.type === "income" ? "+" : "-"}
                        ${formatRupiah(transaction.amount)}
                    </span>
                    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
                        Hapus
                    </button>
                </div>
            `;

            transactionList.appendChild(card);
        });

    updateSummary();
}

function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    saveData();
    renderTransactions(currentFilter);
}

// Buka form
showFormBtn.addEventListener("click", () => {
    formContainer.classList.remove("hidden");
    overlay.classList.remove("hidden");
});

// Tutup form saat klik overlay
overlay.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    overlay.classList.add("hidden");
});

// FIX: filter buttons - sekarang berfungsi karena elemen sudah ada saat script jalan
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTransactions(btn.dataset.filter);
    });
});

// Format input nominal otomatis
amountInput.addEventListener("input", function () {
    let value = this.value.replace(/[^\d]/g, "");
    if (value === "") {
        this.value = "";
        return;
    }
    this.value = Number(value).toLocaleString("id-ID");
});

// Submit form tambah transaksi
form.addEventListener("submit", function (e) {

    e.preventDefault();

    const rawAmount = document.getElementById("amount").value;
    const amount = parseInt(rawAmount.replace(/[^\d]/g, ""));

    const transaction = {
        id: Date.now(),
        date: document.getElementById("date").value,
        title: document.getElementById("title").value,
        type: document.getElementById("type").value,
        amount: amount
    };

    transactions.push(transaction);

    saveData();
    renderTransactions(currentFilter);

    form.reset();

    formContainer.classList.add("hidden");
    overlay.classList.add("hidden");
});

// Render awal
renderTransactions();