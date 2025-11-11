// --- Konstanta dan Inisialisasi ---
const LS_KEY = 'financialTransactions'; 

const KATEGORI = {
    "Pendapatan": ["Gaji", "Bonus", "Investasi", "Lain-lain"],
    "Pengeluaran": ["Makanan & Minuman", "Transportasi", "Cicilan & Utang", "Belanja", "Hiburan", "Tagihan", "Lain-lain"]
};

const MONTH_NAMES = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
];

let transactions = []; 
let currentFilteredList = []; // Menyimpan daftar yang difilter saat ini untuk laporan/render

// Elemen DOM
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const financialForm = document.getElementById('financialForm');
const categorySelect = document.getElementById('category');
const transactionListBody = document.getElementById('transactionList');
const filterYearSelect = document.getElementById('filterYear'); 
const filterMonthSelect = document.getElementById('filterMonth');
const searchBox = document.getElementById('searchBox');

// --- Fungsi Utilitas ---

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

function saveTransactions() {
    localStorage.setItem(LS_KEY, JSON.stringify(transactions));
}

function loadTransactions() {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
        try {
            transactions = JSON.parse(stored);
        } catch (e) {
            console.error("Gagal memuat transaksi dari Local Storage", e);
            transactions = [];
        }
    }
}

// --- FUNGSI GENERATE PDF ---

window.generatePDFReport = function() {
    if (currentFilteredList.length === 0) {
        alert("Tidak ada transaksi dalam periode ini untuk dibuatkan laporan.");
        return;
    }
    
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF.prototype.autoTable === 'undefined') {
        alert("Gagal memuat library PDF (jsPDF atau AutoTable). Pastikan koneksi internet stabil.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const summary = calculateSummaryData(currentFilteredList);
    const selectedMonthName = MONTH_NAMES.find(m => m.value === filterMonthSelect.value)?.label || filterMonthSelect.value;
    const selectedYear = filterYearSelect.value;
    
    let title = `Laporan Finansial: ${selectedMonthName} ${selectedYear}`;
    if (selectedMonthName === 'Semua Bulan' || selectedYear === 'all') {
        title = `Laporan Finansial (Filter Saat Ini)`;
    }
    
    let y = 15; 

    // 1. HEADER
    doc.setFontSize(16);
    doc.text("FinTrack Harian", 15, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(title, 15, y);
    y += 12;

    // 2. RINGKASAN
    doc.setFontSize(10);
    doc.text(`Total Pendapatan: ${formatRupiah(summary.totalIncome)}`, 15, y);
    y += 6;
    doc.text(`Total Pengeluaran: ${formatRupiah(summary.totalExpense)}`, 15, y);
    y += 6;
    doc.setFontSize(12);
    doc.text(`Saldo Bersih: ${formatRupiah(summary.netBalance)}`, 15, y);
    y += 15;

    // 3. TABEL TRANSAKSI
    doc.setFontSize(10);
    doc.text("Rincian Transaksi:", 15, y);
    y += 5;

    const tableData = currentFilteredList.map(t => [
        t.tanggal,
        t.jenis,
        t.kategori,
        formatRupiah(t.jumlah)
    ]);
    
    doc.autoTable({
        startY: y,
        head: [['Tanggal', 'Jenis', 'Kategori', 'Jumlah']],
        body: tableData,
        
        didParseCell: function(data) {
            const transaction = currentFilteredList[data.row.index];
            
            // Periksa apakah baris ini adalah Pengeluaran untuk pembeda warna
            if (transaction && transaction.jenis === 'Pengeluaran') {
                data.cell.styles.fillColor = [230, 230, 230]; // Abu-abu terang
            }
        },

        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        headStyles: { fillColor: [40, 167, 69] },
    });

    // 4. UNDUH FILE
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);
};

// Fungsi pembantu untuk menghitung summary
function calculateSummaryData(listToRender) {
    let totalIncome = 0;
    let totalExpense = 0;

    listToRender.forEach(t => {
        const amount = parseFloat(t.jumlah) || 0; 
        if (t.jenis === 'Pendapatan') {
            totalIncome += amount;
        } else {
            totalExpense += amount;
        }
    });

    return {
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        netBalance: totalIncome - totalExpense
    };
}


// --- FUNGSI FILTER & SEARCH UTAMA ---

function populateYearFilter() {
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 50;

    filterYearSelect.innerHTML = '';
    
    let allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Semua Tahun';
    filterYearSelect.appendChild(allOption);

    for (let year = currentYear; year <= futureYear; year++) {
        let option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        filterYearSelect.appendChild(option);
    }
    
    filterYearSelect.value = currentYear.toString();
}

function populateMonthFilter() {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    
    filterMonthSelect.innerHTML = '';
    
    MONTH_NAMES.forEach(month => {
        let option = document.createElement('option');
        option.value = month.value;
        option.textContent = month.label;
        filterMonthSelect.appendChild(option);
    });

    filterMonthSelect.value = currentMonth;
}

window.filterAndRenderTransactions = function() {
    const searchTerm = searchBox.value.toLowerCase().trim();
    const selectedYear = filterYearSelect.value;
    const selectedMonth = filterMonthSelect.value;
    
    let filteredList = transactions;

    // LANGKAH 1: Filter Pencarian Teks
    if (searchTerm) {
        filteredList = filteredList.filter(t => 
            (t.deskripsi && t.deskripsi.toLowerCase().includes(searchTerm)) || 
            (t.kategori && t.kategori.toLowerCase().includes(searchTerm))
        );
    }

    // LANGKAH 2 & 3: Filter Periode
    if (selectedYear !== 'all') {
        filteredList = filteredList.filter(t => t.tanggal && t.tanggal.startsWith(selectedYear));
    }
    
    if (selectedMonth !== 'all') {
        if (selectedYear !== 'all') {
            const monthPrefix = `${selectedYear}-${selectedMonth}`; 
            filteredList = filteredList.filter(t => t.tanggal && t.tanggal.startsWith(monthPrefix));
        } else {
            const monthSegment = `-${selectedMonth}-`; 
            filteredList = filteredList.filter(t => t.tanggal && t.tanggal.includes(monthSegment));
        }
    }
    
    currentFilteredList = filteredList;

    renderTransactions(currentFilteredList);
}


// --- Fungsi Navigasi Formulir & Rincian ---

window.goToStep2 = function() {
    const selectedType = document.querySelector('input[name="type"]:checked');
    const dateInput = document.getElementById('date').value;

    if (!selectedType || !dateInput) {
        alert("Mohon isi Tanggal dan Jenis Transaksi.");
        return;
    }

    const type = selectedType.value;
    
    categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
    KATEGORI[type].forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    step1.style.display = 'none';
    step2.style.display = 'block';
}

window.goToStep1 = function() {
    step1.style.display = 'block';
    step2.style.display = 'none';
}

window.showDetails = function(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    let detailsText = `
        RINCIAN TRANSAKSI
        -------------------------
        Tanggal: ${transaction.tanggal}
        Jenis: ${transaction.jenis}
        Kategori: ${transaction.kategori}
        Jumlah: ${formatRupiah(transaction.jumlah)}
        Deskripsi: ${transaction.deskripsi || '(Tidak ada deskripsi)'}
    `;

    alert(detailsText);
    
    if (transaction.imageURL) {
        if (transaction.imageURL.startsWith('http')) {
            window.open(transaction.imageURL, '_blank');
        } else {
            alert("URL foto tidak valid.");
        }
    }
}

// --- Fungsi Utama (Render, Hapus) ---

function calculateAndRenderSummary(listToRender) {
    const summary = calculateSummaryData(listToRender);

    document.getElementById('totalIncome').textContent = formatRupiah(summary.totalIncome);
    document.getElementById('totalExpense').textContent = formatRupiah(summary.totalExpense);
    
    const netBalanceEl = document.getElementById('netBalance');
    netBalanceEl.textContent = formatRupiah(summary.netBalance);
    netBalanceEl.style.color = summary.netBalance >= 0 ? '#007bff' : '#dc3545';
}

function renderTransactions(listToRender) {
    transactionListBody.innerHTML = ''; 

    listToRender.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)); 

    if (listToRender.length === 0) {
        const row = transactionListBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = "Tidak ada transaksi ditemukan untuk kriteria ini.";
        cell.style.textAlign = 'center';
    } else {
        listToRender.forEach(t => {
            const row = transactionListBody.insertRow();
            const typeClass = t.jenis === 'Pendapatan' ? 'income' : 'expense';
    
            row.insertCell().textContent = t.tanggal;
            row.insertCell().innerHTML = `<span class="${typeClass}">${t.jenis}</span>`;
            row.insertCell().textContent = t.kategori;
            row.insertCell().textContent = formatRupiah(t.jumlah);
            
            const actionCell = row.insertCell();
            
            const detailBtn = document.createElement('button');
            detailBtn.textContent = 'Rincian';
            detailBtn.className = 'btn detail';
            detailBtn.onclick = () => showDetails(t.id);
            actionCell.appendChild(detailBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.className = 'btn delete';
            deleteBtn.onclick = () => deleteTransaction(t.id);
            actionCell.appendChild(deleteBtn);
        });
    }

    calculateAndRenderSummary(listToRender);
}

window.deleteTransaction = function(id) {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        filterAndRenderTransactions(); 
    }
}

// --- Event Listener Submit Formulir ---
financialForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const type = document.querySelector('input[name="type"]:checked').value;

    const category = categorySelect.value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const imageURL = document.getElementById('imageURL').value;
    
    if (!category || !amount || amount <= 0) {
        alert("Mohon isi Kategori dan Jumlah uang dengan benar.");
        return;
    }

    const newTransaction = {
        id: Date.now(), 
        tanggal: date,
        jenis: type,
        jumlah: amount,
        kategori: category,
        deskripsi: description,
        imageURL: imageURL
    };

    transactions.push(newTransaction);
    saveTransactions();
    
    filterAndRenderTransactions(); 
    
    financialForm.reset();
    goToStep1(); 
});

// --- Inisialisasi Aplikasi saat dimuat ---
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan delay kecil untuk memastikan DOM sudah benar-benar selesai di-load (opsional, tapi membantu)
    setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        
        loadTransactions();
        
        populateYearFilter();
        populateMonthFilter();
        
        // Cek kembali apakah elemen filter terisi
        if (filterYearSelect.options.length <= 1 || filterMonthSelect.options.length <= 1) {
             console.error("Filter Tahun/Bulan tidak terisi. Cek ulang ID elemen di HTML.");
        }

        filterAndRenderTransactions(); 
    }, 50); // Delay 50ms
});