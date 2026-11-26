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