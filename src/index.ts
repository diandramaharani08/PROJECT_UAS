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