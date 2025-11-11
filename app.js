// --- KONSTANTA & INISIALISASI ---
const GOOGLE_SHEET_API_URL = 'https://sheetdb.io/api/v1/wzjx9cz1ks5h1';

const KATEGORI = {
    "Pendapatan": ["Gaji", "Bonus", "Investasi", "Lain-lain"],
    "Pengeluaran": ["Makanan & Minuman", "Transportasi", "Cicilan & Utang", "Belanja", "Hiburan", "Tagihan", "Lain-lain"]
};

const MONTH_NAMES = [
    { value: 'all', label: 'Semua Bulan' }, { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' }, { value: '04', label: 'April' }, { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' }, { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' }, { value: '10', label: 'Oktober' }, { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
];

let transactions = []; 
let currentFilteredList = []; 

// Elemen DOM
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const financialForm = document.getElementById('financialForm');
const categorySelect = document.getElementById('category');
const transactionListBody = document.getElementById('transactionList');
const filterYearSelect = document.getElementById('filterYear'); 
const filterMonthSelect = document.getElementById('filterMonth');
const searchBox = document.getElementById('searchBox');

// --- FUNGSI UTILITIES ---

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

function calculateSummaryData(listToRender) {
    let totalIncome = 0; let totalExpense = 0;
    listToRender.forEach(t => {
        const amount = parseFloat(t.jumlah) || 0; 
        if (t.jenis === 'Pendapatan') { totalIncome += amount; } else { totalExpense += amount; }
    });
    return { totalIncome: totalIncome, totalExpense: totalExpense, netBalance: totalIncome - totalExpense };
}

// --- FUNGSI CLOUD (SHEETDB) ---

async function loadTransactionsFromCloud() {
    try {
        transactionListBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Memuat data dari Cloud...</td></tr>';
        
        const response = await fetch(GOOGLE_SHEET_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
            return data.map((t) => ({
                id: t.Timestamp, 
                tanggal: t.Tanggal, 
                jenis: t.Jenis,     
                kategori: t.Kategori,
                jumlah: parseFloat(t.Jumlah) || 0, 
                deskripsi: t.Deskripsi || '' 
            }));
        }
        return [];

    } catch (error) {
        console.error("Gagal memuat transaksi dari SheetDB:", error);
        alert("Gagal memuat data dari cloud. Cek koneksi atau konfigurasi SheetDB.");
        return [];
    }
}

async function saveTransactionToCloud(newTransaction) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: newTransaction })
    };

    try {
        const response = await fetch(GOOGLE_SHEET_API_URL, options);
        const result = await response.json(); 
        
        if (result.created === 1) {
            return { success: true };
        } else {
             console.error("SheetDB Error:", result);
             return { success: false, message: "SheetDB menolak data." };
        }
    } catch (error) {
        console.error("Gagal menyimpan transaksi ke SheetDB:", error);
        return { success: false, message: error.toString() };
    }
}

async function deleteTransactionFromCloud(id) {
    const url = `${GOOGLE_SHEET_API_URL}/Timestamp/${encodeURIComponent(id)}`;

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        
        if (response.status === 200) {
            const rawResponse = await response.text(); 
            
            if (rawResponse.includes('{"deleted":1}')) {
                return { success: true };
            } else {
                 console.error("SheetDB DELETE GAGAL. Respons:", rawResponse);
                 return { success: false, message: "Akses DITOLAK: Respon tidak valid. (Cek izin SheetDB)" };
            }
        } else if (response.status === 404) {
             return { success: false, message: "ID transaksi tidak ditemukan di Sheet." };
        } else {
             return { success: false, message: `Gagal HTTP: ${response.status} (Izin ditolak?)` };
        }
        
    } catch (error) {
        console.error("Gagal menghapus transaksi dari SheetDB:", error);
        return { success: false, message: error.toString() };
    }
}


// --- FUNGSI UTAMA (SUBMIT) ---
financialForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const newTransaction = {
        Timestamp: new Date().toISOString(), 
        Tanggal: document.getElementById('date').value,
        Jenis: document.querySelector('input[name="type"]:checked').value,
        Kategori: categorySelect.value,
        Jumlah: parseFloat(document.getElementById('amount').value),
        Deskripsi: document.getElementById('description').value,
    };
    
    if (!newTransaction.Kategori || !newTransaction.Jumlah || newTransaction.Jumlah <= 0) {
        alert("Mohon isi Kategori dan Jumlah uang dengan benar.");
        return;
    }
    
    const submitButton = financialForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Menyimpan...';
    submitButton.disabled = true;

    const result = await saveTransactionToCloud(newTransaction);
    
    submitButton.textContent = originalText;
    submitButton.disabled = false;


    if (result.success) {
        alert("Transaksi berhasil disimpan ke cloud! Data dimuat ulang.");
        
        transactions = await loadTransactionsFromCloud(); 
        
        filterAndRenderTransactions(); 

        financialForm.reset();
        goToStep1(); 
    } else {
        alert(`Gagal menyimpan: ${result.message || 'Periksa console browser.'}`);
    }
});

// FUNGSI BARU: Logika Saat Tombol Hapus Diklik
window.deleteTransaction = async function(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini secara permanen dari Cloud?")) {
        return;
    }
    
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) {
        alert("ID transaksi tidak ditemukan di daftar.");
        return;
    }

    alert("Menghapus data, mohon tunggu...");

    const result = await deleteTransactionFromCloud(id);

    if (result.success) {
        alert("Transaksi berhasil dihapus dari Cloud!");
        
        transactions = await loadTransactionsFromCloud();
        filterAndRenderTransactions();
    } else {
        alert(`Gagal menghapus: ${result.message}. Cek console untuk detail.`);
    }
};


// --- FUNGSI RENDERING & FILTER ---

function populateYearFilter() {
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 50;
    filterYearSelect.innerHTML = '';
    let allOption = document.createElement('option');
    allOption.value = 'all'; allOption.textContent = 'Semua Tahun'; filterYearSelect.appendChild(allOption);
    for (let year = currentYear; year <= futureYear; year++) {
        let option = document.createElement('option');
        option.value = year.toString(); option.textContent = year.toString(); filterYearSelect.appendChild(option);
    }
    filterYearSelect.value = currentYear.toString();
}

function populateMonthFilter() {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    filterMonthSelect.innerHTML = '';
    MONTH_NAMES.forEach(month => {
        let option = document.createElement('option');
        option.value = month.value; option.textContent = month.label; filterMonthSelect.appendChild(option);
    });
    filterMonthSelect.value = currentMonth;
}

window.filterAndRenderTransactions = function() {
    const searchTerm = searchBox.value.toLowerCase().trim();
    const selectedYear = filterYearSelect.value;
    const selectedMonth = filterMonthSelect.value;
    let filteredList = transactions;

    if (searchTerm) {
        filteredList = filteredList.filter(t => (t.deskripsi && t.deskripsi.toLowerCase().includes(searchTerm)) || (t.kategori && t.kategori.toLowerCase().includes(searchTerm)));
    }
    if (selectedYear !== 'all') {
        filteredList = filteredList.filter(t => t.tanggal && t.tanggal.startsWith(selectedYear));
    }
    if (selectedMonth !== 'all') {
        if (selectedYear !== 'all') {
            const monthPrefix = `${selectedYear}-${selectedMonth}`; filteredList = filteredList.filter(t => t.tanggal && t.tanggal.startsWith(monthPrefix));
        } else {
            const monthSegment = `-${selectedMonth}-`; filteredList = filteredList.filter(t => t.tanggal && t.tanggal.includes(monthSegment));
        }
    }
    currentFilteredList = filteredList;
    renderTransactions(currentFilteredList);
}

function renderTransactions(listToRender) {
    transactionListBody.innerHTML = ''; 
    listToRender.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)); 
    
    if (listToRender.length === 0) {
        const row = transactionListBody.insertRow();
        const cell = row.insertCell();
        // PERBAIKAN: Mengatur colspan ke 5
        cell.colSpan = 5; 
        cell.textContent = "Tidak ada transaksi ditemukan untuk kriteria ini."; 
        cell.style.textAlign = 'center'; 
        cell.style.padding = '12px 0'; // Style yang disinkronkan dengan CSS
    } else {
        listToRender.forEach((t) => {
            const row = transactionListBody.insertRow();
            const typeClass = t.jenis === 'Pendapatan' ? 'income' : 'expense';
            
            row.insertCell().textContent = t.tanggal;
            row.insertCell().innerHTML = `<span class="${typeClass}">${t.jenis}</span>`;
            row.insertCell().textContent = t.kategori;
            row.insertCell().textContent = formatRupiah(t.jumlah);
            
            const actionCell = row.insertCell();
            
            // 1. Tombol RINCIAN 
            const detailBtn = document.createElement('button');
            detailBtn.textContent = 'Rincian'; 
            detailBtn.className = 'btn detail';
            detailBtn.onclick = () => showDetails(t.id); 
            detailBtn.style.cssText = 'background-color: #007bff; color: white;';
            actionCell.appendChild(detailBtn);
            
            // 2. Tombol HAPUS 
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus'; 
            deleteBtn.className = 'btn delete';
            deleteBtn.onclick = () => deleteTransaction(t.id);
            deleteBtn.style.cssText = 'background-color: #dc3545; color: white;';
            actionCell.appendChild(deleteBtn);
        });
    }
    calculateAndRenderSummary(listToRender); 
}

// FUNGSI LAINNYA
window.goToStep2 = function() {
    const selectedType = document.querySelector('input[name="type"]:checked');
    const dateInput = document.getElementById('date').value;
    if (!selectedType || !dateInput) { alert("Mohon isi Tanggal dan Jenis Transaksi."); return; }
    const type = selectedType.value;
    categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
    KATEGORI[type].forEach(cat => {
        const option = document.createElement('option');
        option.value = cat; option.textContent = cat; categorySelect.appendChild(option);
    });
    step1.style.display = 'none'; step2.style.display = 'block';
}

window.goToStep1 = function() { step1.style.display = 'block'; step2.style.display = 'none'; }

window.showDetails = function(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    let detailsText = `RINCIAN TRANSAKSI\n-------------------------\nTanggal: ${transaction.tanggal}\nJenis: ${transaction.jenis}\nKategori: ${transaction.kategori}\nJumlah: ${formatRupiah(transaction.jumlah)}\nDeskripsi: ${transaction.deskripsi || '(Tidak ada deskripsi)'}`;
    alert(detailsText);
}

// --- INISIALISASI APLIKASI saat dimuat ---
document.addEventListener('DOMContentLoaded', async () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    transactions = await loadTransactionsFromCloud(); 
    populateYearFilter();
    populateMonthFilter();
    filterAndRenderTransactions(); 
});