import * as readline from "readline-sync";

const tanya = (pertanyaan: string): string => {
    // trim() berfungsi untuk menghapus spasi di awal dan akhir input
    return readline.question(pertanyaan).trim(); 
    // readline.question() menunggu sampai pengguna menekan Enter, lalu mengembalikan jawabannya
};

// Struktur data dan tipe data untuk satu reservasi tamu
interface Reservasi {
    id: number;              // id unik yang didapat tamu
    namaTamu: string;        
    jumlahTamu: number;      
    kodeKamar: number;       // kode tipe kamar yang dipilih (1-3)
    kodeFasilitas: number;   // kode fasilitas bintang yang dipilih (1-3)
    jumlahHari: number;   
    kodePaket: number;       // kode paket makan (1-4)
    kodeLayanan: number;     // kode layanan tambahan (1-3)
    bawaElektronik: boolean; // true jika tamu membawa alat elektronik
    kodeBayar: number;       // kode metode pembayaran (1-4)
}

// Struktur data untuk pilihan paket makan, layanan, dan metode bayar
interface Pilihan {
    kode: number;  // nomor pilihan
    nama: string;  // nama pilihan
    harga: number; // harga pilihan (untuk metode bayar & biaya admin)
}

// Struktur data untuk hasil perhitungan biaya reservasi
interface Rincian {
    tipeKamar: string;  
    hargaKamar: number; // harga sebelum diskon
    diskon: number;     
    potongan: number;   // potongan khusus kartu debit
    admin: number;      // biaya admin metode pembayaran
    totalBayar: number; // total yang harus dibayar
}

// Data tetap (const) dan data yang berubah (let)
// Biaya tambahan jika tamu membawa alat elektronik (nilai tetap)
const HARGA_ELEKTRONIK: number = 150000;

// Daftar tipe kamar dan harganya per malam
const DAFTAR_KAMAR: Pilihan[] = [
    { kode: 1, nama: "Standard", harga: 500000 },
    { kode: 2, nama: "Deluxe", harga: 700000 },
    { kode: 3, nama: "Suite", harga: 1000000 },
];

// Daftar fasilitas hotel berdasarkan bintang beserta biaya tambahannya
const DAFTAR_FASILITAS: Pilihan[] = [
    { kode: 1, nama: "Bintang 3", harga: 150000 },
    { kode: 2, nama: "Bintang 4", harga: 250000 },
    { kode: 3, nama: "Bintang 5", harga: 350000 },
];

// Batas minimal dan maksimal ID tamu
const ID_MIN: number = 100000;
const ID_MAX: number = 999999;

// Daftar paket makan beserta harganya
const DAFTAR_PAKET: Pilihan[] = [
    { kode: 1, nama: "Paket sarapan prasmanan", harga: 100000 },
    { kode: 2, nama: "Paket sarapan standar", harga: 50000 },
    { kode: 3, nama: "Paket 3x makan prasmanan", harga: 200000 },
    { kode: 4, nama: "Paket 3x makan standar", harga: 150000 },
];

// Daftar layanan tambahan beserta harganya
const DAFTAR_LAYANAN: Pilihan[] = [
    { kode: 1, nama: "Laundry", harga: 70000 },
    { kode: 2, nama: "Pembersihan kamar", harga: 100000 },
    { kode: 3, nama: "Penjemputan di bandara", harga: 50000 },
];

// Daftar metode pembayaran dan biaya adminnya
const DAFTAR_BAYAR: Pilihan[] = [
    { kode: 1, nama: "Kartu debit", harga: 2500 },
    { kode: 2, nama: "Transfer bank", harga: 5000 },
    { kode: 3, nama: "Uang tunai", harga: 0 },
    { kode: 4, nama: "QRIS", harga: 1500 },
];

// Array untuk menyimpan seluruh data reservasi
let dataReservasi: Reservasi[] = [];

//Fungsi fungsi
// Fungsi untuk memberi format rupiah dengan titik ribuan
const formatRupiah = (angka: number): string => {
    // toLocaleString('id-ID') berfungsi untuk memberikan titik ribuan
    return "Rp" + Math.round(angka).toLocaleString("id-ID");
    // Math.round() berfungsi untuk membulatkan angka desimal ke bilangan bulat terdekat
};

// Fungsi untuk mencari pilihan berdasarkan kode memakai find()
function cariPilihan(daftar: Pilihan[], kode: number): Pilihan {
    const hasil: Pilihan | undefined = daftar.find((p) => p.kode === kode);
    // Jika tidak ditemukan, kembalikan pilihan pertama sebagai cadangan
    return hasil !== undefined ? hasil : daftar[0]; 
}

// Fungsi untuk menghitung potongan harga berdasarkan jumlah hari menginap
function hitungPotonganHari(jumlahHari: number): number {
    if (jumlahHari < 4) {
        return 0;
    } else if (jumlahHari >= 4 && jumlahHari <= 8) { // if dengan 2 kondisi (&&)
        return 200000;
    } else {
        return 300000;
    }
}

// Fungsi yang mengembalikan nilai hasil hitung seluruh biaya satu reservasi
function hitungRincian(r: Reservasi): Rincian {
    // Mengambil data kamar, fasilitas, paket makan, dan layanan sesuai kode
    const kamar: Pilihan = cariPilihan(DAFTAR_KAMAR, r.kodeKamar);
    const fasilitas: Pilihan = cariPilihan(DAFTAR_FASILITAS, r.kodeFasilitas);
    const paket: Pilihan = cariPilihan(DAFTAR_PAKET, r.kodePaket);
    const layanan: Pilihan = cariPilihan(DAFTAR_LAYANAN, r.kodeLayanan);

    // Menghitung harga kamar: harga per malam dikali jumlah hari
    let hargaKamar: number = kamar.harga * r.jumlahHari;
    hargaKamar -= hitungPotonganHari(r.jumlahHari); // dikurangi potongan hari
    hargaKamar += fasilitas.harga;                  // ditambah biaya fasilitas bintang
    hargaKamar += paket.harga + layanan.harga;      // ditambah paket & layanan
    // Ditambah biaya elektronik jika tamu membawa alat elektronik
    if (r.bawaElektronik) {
        hargaKamar += HARGA_ELEKTRONIK;
    }

    // Menentukan diskon berdasarkan total harga kamar
    let diskon: number;
    if (hargaKamar < 1000000) {
        diskon = 0;
    } else if (hargaKamar >= 1000000 && hargaKamar < 5000000) {
        diskon = 15;
    } else {
        diskon = 25;
    }

    // Menghitung total harga setelah diskon
    let totalHarga: number = hargaKamar;
    totalHarga *= (100 - diskon) / 100; // operator compound perkalian

    // Biaya admin diambil dari daftar metode pembayaran
    const admin: number = cariPilihan(DAFTAR_BAYAR, r.kodeBayar).harga;

    // Potongan khusus pembayaran kartu debit (nested 3 tingkat)
    let potongan: number = 0;
    if (r.kodeBayar === 1) {                 // tingkat 1: bayar pakai kartu debit
        if (totalHarga >= 500000) {          // tingkat 2: memenuhi syarat minimal
            if (totalHarga <= 1000000) {     // tingkat 3: menentukan besar potongan
                potongan = 100000;
            } else {
                potongan = 150000;
            }
        }
    }

    // Menghitung total bayar akhir
    let totalBayar: number = totalHarga;
    totalBayar -= potongan; // dikurangi potongan kartu debit
    totalBayar -= admin;    // ditambah biaya admin

    // Mengembalikan seluruh hasil perhitungan
    return { tipeKamar: kamar.nama, hargaKamar, diskon, potongan, admin, totalBayar };
}

// Fungsi input dengan validasi 
// Meminta input teks yang tidak boleh kosong 
function inputTeks(pertanyaan: string): string {
    let jawaban: string;
    do {
        jawaban = tanya(pertanyaan);
        // Tampilkan pesan jika input kosong
        if (jawaban === "") {
            console.log("Input tidak boleh kosong!");
        }
    } while (jawaban === ""); // ulangi selama input masih kosong
    return jawaban;
}

// Meminta input angka bulat dalam rentang min sampai max
function inputAngka(pertanyaan: string, min: number, max: number): number {
    let angka: number = 0;
    let valid: boolean = false;
    // Ulangi terus sampai input valid
    while (!valid) {
        const teks: string = tanya(pertanyaan);
        angka = Number(teks); // konversi dari string ke number
        // Input salah jika kosong, bukan angka, bukan bilangan bulat, atau di luar rentang
        if (teks === "" || isNaN(angka) || !Number.isInteger(angka) || angka < min || angka > max) {
            console.log(`Input harus berupa angka bulat dari ${min} sampai ${max}!`);
        } else {
            valid = true;
        }
    }
    return angka;
}

// Meminta jawaban Y/T dan mengubahnya menjadi boolean
function inputYT(pertanyaan: string): boolean {
    while (true) {
        // toUpperCase berfungsi untuk mengubah input menjadi huruf kapital
        const jawaban: string = (tanya(pertanyaan)).toUpperCase();
        if (jawaban === "Y") return true;
        if (jawaban === "T") return false;
        console.log("Jawab dengan Y atau T saja!");
    }
}