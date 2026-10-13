/**
 * Application State & Master Data
 */
const CHART_OF_ACCOUNTS = [
    { code: "1010", name: "Kas Utama", category: "Aset Lancar" },
    { code: "1020", name: "Bank BCA - 8800129381", category: "Aset Lancar" },
    { code: "1030", name: "Kas Kecil (Petty Cash)", category: "Aset Lancar" },
    { code: "1300", name: "Perlengkapan Kantor", category: "Aset Lancar" },
    { code: "1400", name: "Uang Muka Operasional", category: "Aset Lancar" },
    { code: "2100", name: "Utang Usaha", category: "Kewajiban" },
    { code: "2200", name: "Utang Gaji & PPh 21", category: "Kewajiban" },
    { code: "5100", name: "Beban Gaji & Tunjangan", category: "Beban Operasional" },
    { code: "5200", name: "Beban Sewa Gedung", category: "Beban Operasional" },
    { code: "5300", name: "Beban Listrik, Air & Internet", category: "Beban Operasional" },
    { code: "5400", name: "Beban Perlengkapan & ATK", category: "Beban Operasional" },
    { code: "5500", name: "Beban Pemeliharaan & Perbaikan", category: "Beban Operasional" },
    { code: "5600", name: "Beban Konsumsi & Jamuan", category: "Beban Operasional" },
    { code: "5900", name: "Beban Lain-Lain", category: "Beban Operasional" }
];

let journalRows = [];
let nextRowId = 1;

window.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transactionDate').value = today;

    // Generate default Ref No
    document.getElementById('referenceNo').value = generateDefaultRefNo();

    // Initialize with 2 default empty rows
    addJournalRow();
    addJournalRow();

    // Initial calculation check
    calculateTotals();
});

// Generate auto Ref No
function generateDefaultRefNo() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomSeq = String(Math.floor(Math.random() * 900) + 100);
    return `BKK-${year}/${month}/${randomSeq}`;
}

// Add a new row to the journal table
function addJournalRow(presetData = null) {
    const rowId = nextRowId++;
    const row = {
        id: rowId,
        accountCode: presetData ? presetData.accountCode : '',
        memo: presetData ? presetData.memo : '',
        debit: presetData ? presetData.debit : 0,
        credit: presetData ? presetData.credit : 0
    };

    journalRows.push(row);
    renderTableRows();
    calculateTotals();
}

// Delete a row from the journal table
function deleteJournalRow(rowId) {
    if (journalRows.length <= 1) {
        showToast("Jurnal minimal harus memiliki 1 baris!", "warning");
        return;
    }
    journalRows = journalRows.filter(r => r.id !== rowId);
    renderTableRows();
    calculateTotals();
}

// Render table rows DOM
function renderTableRows() {
    const tbody = document.getElementById('journalTableBody');
    tbody.innerHTML = '';

    journalRows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/60 transition-colors group";
        
        let accountOptionsHtml = `<option value="">-- Pilih Kode / Nama Akun --</option>`;
        CHART_OF_ACCOUNTS.forEach(acc => {
            const selected = acc.code === row.accountCode ? 'selected' : '';
            accountOptionsHtml += `<option value="${acc.code}" ${selected}>[${acc.code}] ${acc.name}</option>`;
        });

        tr.innerHTML = `
            <td class="py-3 px-4 text-center text-xs font-mono font-medium text-slate-400 group-hover:text-slate-600">${index + 1}</td>
            <td class="py-3 px-4">
                <select onchange="updateRowField(${row.id}, 'accountCode', this.value)" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                    ${accountOptionsHtml}
                </select>
            </td>
            <td class="py-3 px-4">
                <input type="text" value="${escapeHtml(row.memo)}" placeholder="Catatan baris (opsional)" oninput="updateRowField(${row.id}, 'memo', this.value)" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </td>
            <td class="py-3 px-4">
                <div class="relative">
                    <span class="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">Rp</span>
                    <input type="text" inputmode="numeric" value="${row.debit ? formatNumberInput(row.debit) : ''}" placeholder="0" oninput="handleAmountInput(this, ${row.id}, 'debit')" class="debit-input w-full text-right bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                </div>
            </td>
            <td class="py-3 px-4">
                <div class="relative">
                    <span class="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">Rp</span>
                    <input type="text" inputmode="numeric" value="${row.credit ? formatNumberInput(row.credit) : ''}" placeholder="0" oninput="handleAmountInput(this, ${row.id}, 'credit')" class="credit-input w-full text-right bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                </div>
            </td>
            <td class="py-3 px-4 text-center">
                <button type="button" onclick="deleteJournalRow(${row.id})" title="Hapus Baris" class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all inline-flex items-center justify-center">
                    <i class="fa-regular fa-trash-can text-sm"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update field value in array state
function updateRowField(rowId, field, value) {
    const row = journalRows.find(r => r.id === rowId);
    if (row) {
        row[field] = value;
    }
}

// Handle numeric currency inputs directly without losing focus
function handleAmountInput(inputElem, rowId, type) {
    let cleanVal = inputElem.value.replace(/[^0-9]/g, '');
    let numericVal = parseInt(cleanVal, 10) || 0;

    const row = journalRows.find(r => r.id === rowId);
    if (!row) return;

    // Update active input DOM value with formatting
    inputElem.value = numericVal > 0 ? formatNumberInput(numericVal) : '';

    const rowElem = inputElem.closest('tr');

    if (type === 'debit') {
        row.debit = numericVal;
        if (numericVal > 0) {
            row.credit = 0;
            if (rowElem) {
                const creditInput = rowElem.querySelector('.credit-input');
                if (creditInput) creditInput.value = '';
            }
        }
    } else if (type === 'credit') {
        row.credit = numericVal;
        if (numericVal > 0) {
            row.debit = 0;
            if (rowElem) {
                const debitInput = rowElem.querySelector('.debit-input');
                if (debitInput) debitInput.value = '';
            }
        }
    }

    // Recalculate totals real-time without disturbing DOM focus
    calculateTotals();
}

// Calculate Totals, Selisih, and Balance Indicator Status
function calculateTotals() {
    let totalDebit = 0;
    let totalCredit = 0;

    journalRows.forEach(row => {
        totalDebit += Number(row.debit) || 0;
        totalCredit += Number(row.credit) || 0;
    });

    const selisih = Math.abs(totalDebit - totalCredit);

    // Update UI Total Displays
    document.getElementById('totalDebitDisplay').innerText = formatCurrency(totalDebit);
    document.getElementById('totalCreditDisplay').innerText = formatCurrency(totalCredit);

    // Dynamic Balance Validation Rules
    const statusBadge = document.getElementById('statusBadge');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const selisihText = document.getElementById('selisihText');
    const submitBtn = document.getElementById('submitBtn');

    const isBalanced = (totalDebit === totalCredit) && (totalDebit > 0);

    if (totalDebit === 0 && totalCredit === 0) {
        statusBadge.className = "w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-300 bg-amber-50 border-amber-300 text-amber-800";
        statusIcon.className = "w-3 h-3 rounded-full bg-amber-500 inline-block";
        statusText.innerText = "✕ UNBALANCED (TOTAL NOL)";
        selisihText.classList.add('hidden');
        
        lockSubmitButton(submitBtn, true);
    } else if (isBalanced) {
        statusBadge.className = "w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-300 bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm shadow-emerald-100";
        statusIcon.className = "w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-400";
        statusText.innerText = "✓ BALANCE";
        selisihText.classList.add('hidden');

        lockSubmitButton(submitBtn, false);
    } else {
        statusBadge.className = "w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-300 bg-rose-50 border-rose-300 text-rose-800 shadow-sm shadow-rose-100";
        statusIcon.className = "w-3 h-3 rounded-full bg-rose-500 inline-block animate-ping";
        statusText.innerText = "✕ UNBALANCED";
        selisihText.innerText = `Selisih: ${formatCurrency(selisih)}`;
        selisihText.classList.remove('hidden');

        lockSubmitButton(submitBtn, true);
    }
}

// Toggle submit button lock state
function lockSubmitButton(btn, lock) {
    if (lock) {
        btn.disabled = true;
        btn.className = "w-full sm:w-auto px-8 py-3 bg-slate-200 text-slate-400 font-semibold rounded-xl transition-all shadow-none flex items-center justify-center gap-2 cursor-not-allowed opacity-70";
    } else {
        btn.disabled = false;
        btn.className = "w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5";
    }
}

// Form Submission handler
async function handleFormSubmit(event) {
    event.preventDefault();

    const missingAccount = journalRows.some(r => !r.accountCode || r.accountCode.trim() === '');
    if (missingAccount) {
        showToast("Silakan pilih Akun COA untuk semua baris jurnal!", "error");
        return;
    }

    const transactionDate = document.getElementById('transactionDate').value;
    const referenceNo = document.getElementById('referenceNo').value.trim();
    const paidTo = document.getElementById('paidTo').value.trim();
    const description = document.getElementById('description').value.trim();

    let totalDebit = 0;
    let totalCredit = 0;

    const formattedLines = journalRows.map((row, idx) => {
        const accObj = CHART_OF_ACCOUNTS.find(a => a.code === row.accountCode);
        totalDebit += Number(row.debit);
        totalCredit += Number(row.credit);

        return {
            line_number: idx + 1,
            account_code: row.accountCode,
            account_name: accObj ? accObj.name : "",
            account_category: accObj ? accObj.category : "",
            memo: row.memo || description,
            debit: Number(row.debit),
            credit: Number(row.credit)
        };
    });

    const payload = {
        voucher_metadata: {
            voucher_type: "CASH_OUTFLOW",
            voucher_type_label: "Voucher Kas Keluar (BKK)",
            transaction_date: transactionDate,
            reference_no: referenceNo,
            paid_to: paidTo || null,
            description: description,
            created_at: new Date().toISOString()
        },
        summary: {
            total_debit: totalDebit,
            total_credit: totalCredit,
            is_balanced: totalDebit === totalCredit && totalDebit > 0,
            currency: "IDR"
        },
        journal_entries: formattedLines
    };

    // Try saving to Supabase if client exists
    const statusTextElem = document.getElementById('supabaseSaveStatus');
    if (supabaseClient) {
        statusTextElem.innerText = "Menyimpan ke basis data Supabase...";
        const saveRes = await saveVoucherToSupabase(payload);
        if (saveRes.success) {
            statusTextElem.innerText = "✓ Tersimpan ke database Supabase (ID: " + saveRes.voucherId + ")";
            showToast("Voucher berhasil disimpan ke Supabase!", "success");
        } else {
            statusTextElem.innerText = "⚠ " + saveRes.message;
            showToast(saveRes.message, "warning");
        }
    } else {
        statusTextElem.innerText = "Data siap diproses (Supabase belum dihubungkan).";
    }

    showJsonModal(payload);
}

// Display JSON Payload Modal
function showJsonModal(data) {
    const modal = document.getElementById('jsonModal');
    const modalCard = document.getElementById('jsonModalCard');
    const jsonContent = document.getElementById('jsonContent');

    jsonContent.innerText = JSON.stringify(data, null, 2);

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalCard.classList.remove('scale-95');
        modalCard.classList.add('scale-100');
    }, 10);
}

function closeJsonModal() {
    const modal = document.getElementById('jsonModal');
    const modalCard = document.getElementById('jsonModalCard');

    modal.classList.add('opacity-0');
    modalCard.classList.remove('scale-100');
    modalCard.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function copyJsonToClipboard() {
    const jsonText = document.getElementById('jsonContent').innerText;

    const textArea = document.createElement('textarea');
    textArea.value = jsonText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        const btnText = document.getElementById('copyBtnText');
        btnText.innerText = "Tersalin! ✓";
        showToast("Payload JSON berhasil disalin ke clipboard!", "success");

        setTimeout(() => {
            btnText.innerText = "Salin JSON";
        }, 2000);
    } catch (err) {
        showToast("Gagal menyalin text.", "error");
    } finally {
        document.body.removeChild(textArea);
    }
}

// Preset Sample Data for Testing
function loadSampleData() {
    document.getElementById('referenceNo').value = generateDefaultRefNo();
    document.getElementById('paidTo').value = "PT Telekomunikasi Indonesia";
    document.getElementById('description').value = "Pembayaran internet kantor & pembelian kertas printer A4";

    journalRows = [];
    nextRowId = 1;

    addJournalRow({
        accountCode: "5300",
        memo: "Tagihan IndiHome Oktober 2026",
        debit: 1500000,
        credit: 0
    });

    addJournalRow({
        accountCode: "5400",
        memo: "Kertas A4 & tinta printer",
        debit: 500000,
        credit: 0
    });

    addJournalRow({
        accountCode: "1020",
        memo: "Transfer Bank BCA",
        debit: 0,
        credit: 2000000
    });

    showToast("Contoh data berhasil dimuat!", "info");
}

function resetForm() {
    document.getElementById('voucherForm').reset();
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('referenceNo').value = generateDefaultRefNo();

    journalRows = [];
    nextRowId = 1;

    addJournalRow();
    addJournalRow();

    calculateTotals();
    showToast("Formulir telah direset.", "info");
}

function openSupabaseModal() {
    const modal = document.getElementById('supabaseModal');
    const modalCard = document.getElementById('supabaseModalCard');

    document.getElementById('supabaseUrlInput').value = localStorage.getItem('SUPABASE_URL') || '';
    document.getElementById('supabaseKeyInput').value = localStorage.getItem('SUPABASE_KEY') || '';

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalCard.classList.remove('scale-95');
        modalCard.classList.add('scale-100');
    }, 10);
}

function closeSupabaseModal() {
    const modal = document.getElementById('supabaseModal');
    const modalCard = document.getElementById('supabaseModalCard');

    modal.classList.add('opacity-0');
    modalCard.classList.remove('scale-100');
    modalCard.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function saveSupabaseSettings() {
    const url = document.getElementById('supabaseUrlInput').value.trim();
    const key = document.getElementById('supabaseKeyInput').value.trim();

    if (url && key) {
        localStorage.setItem('SUPABASE_URL', url);
        localStorage.setItem('SUPABASE_KEY', key);
        initSupabase();
        showToast("Pengaturan Supabase berhasil disimpan!", "success");
    } else {
        localStorage.removeItem('SUPABASE_URL');
        localStorage.removeItem('SUPABASE_KEY');
        supabaseClient = null;
        initSupabase();
        showToast("Pengaturan Supabase dibersihkan.", "info");
    }

    closeSupabaseModal();
}

// Toast Notification Helper
function showToast(message, type = "info") {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    let bgColors = "bg-slate-800 text-white border-slate-700";
    let icon = "fa-circle-info text-sky-400";

    if (type === "success") {
        bgColors = "bg-emerald-900 text-emerald-100 border-emerald-700";
        icon = "fa-circle-check text-emerald-400";
    } else if (type === "error") {
        bgColors = "bg-rose-900 text-rose-100 border-rose-700";
        icon = "fa-circle-exclamation text-rose-400";
    } else if (type === "warning") {
        bgColors = "bg-amber-900 text-amber-100 border-amber-700";
        icon = "fa-triangle-exclamation text-amber-400";
    }

    toast.className = `pointer-events-auto px-4 py-3 rounded-xl border ${bgColors} shadow-xl text-xs font-medium flex items-center space-x-3 transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `
        <i class="fa-solid ${icon} text-base"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Helper Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumberInput(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
