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
    totalBayar += admin;    // ditambah biaya admin

    // Mengembalikan seluruh hasil perhitungan
    return { tipeKamar: kamar.nama, hargaKamar, diskon, potongan, admin, totalBayar };
}


// Fungsi tampilan
// Fungsi tanpa parameter dan tanpa return (void) untuk menampilkan menu utama
function tampilkanMenu(): void {
    console.log("\n========== MENU RESERVASI HOTEL ==========");
    console.log("1. Tambah reservasi");
    console.log("2. Lihat semua reservasi");
    console.log("3. Lihat detail reservasi");
    console.log("4. Ubah reservasi");
    console.log("5. Hapus reservasi");
    console.log("6. Cari reservasi");
    console.log("0. Keluar");
}

// Fungsi void untuk menampilkan daftar pilihan memakai forEach
function tampilkanPilihan(judul: string, daftar: Pilihan[]): void {
    console.log(`\n===== ${judul} =====`);
    daftar.forEach((p) => {
        console.log(`${p.kode}. ${p.nama} (${formatRupiah(p.harga)})`);
    });
}

// Fungsi void untuk menampilkan nota lengkap satu reservasi
function tampilkanNota(r: Reservasi): void {
    const rincian: Rincian = hitungRincian(r);
    // Mengubah jumlah hari menjadi minggu dan sisa hari (memakai / dan %)
    const minggu: number = Math.floor(r.jumlahHari / 7);
    const sisaHari: number = r.jumlahHari % 7;

    console.log("\n=========== NOTA PESANAN ===========");
    console.log("ID Reservasi       : " + r.id);
    console.log("Nama Tamu          : " + r.namaTamu);
    console.log("Jumlah Tamu        : " + r.jumlahTamu);
    console.log("Tipe Kamar         : " + rincian.tipeKamar);
    console.log("Fasilitas          : " + cariPilihan(DAFTAR_FASILITAS, r.kodeFasilitas).nama);
    console.log(`Lama Menginap      : ${r.jumlahHari} hari (${minggu} minggu ${sisaHari} hari)`);
    console.log("Paket Makan        : " + cariPilihan(DAFTAR_PAKET, r.kodePaket).nama);
    console.log("Layanan Tambahan   : " + cariPilihan(DAFTAR_LAYANAN, r.kodeLayanan).nama);
    console.log("Membawa Elektronik : " + (r.bawaElektronik ? "Ya" : "Tidak"));
    console.log("Metode Pembayaran  : " + cariPilihan(DAFTAR_BAYAR, r.kodeBayar).nama);
    console.log("____________________________________");
    console.log("Harga Kamar        : " + formatRupiah(rincian.hargaKamar));
    console.log("Diskon             : " + rincian.diskon + "%");
    console.log("Potongan Biaya     : " + formatRupiah(rincian.potongan));
    console.log("Biaya Admin        : " + formatRupiah(rincian.admin));
    console.log("____________________________________");
    console.log("Total Pesanan      : " + formatRupiah(rincian.totalBayar));
}

// Program utama (kerangka menu)
// Menu utama diulang terus sampai pengguna memilih keluar
function main(): void {
    let berjalan: boolean = true;
    while (berjalan) {
        tampilkanMenu();
        const pilihan: string = tanya("Pilih menu (0-6): ");
        // Menjalankan fitur sesuai pilihan menu
        switch (pilihan) {
            case "1":
                console.log("Fitur tambah reservasi belum tersedia.");
                break;
            case "2":
                console.log("Fitur lihat semua reservasi belum tersedia.");
                break;
            case "3":
                console.log("Fitur lihat detail reservasi belum tersedia.");
                break;
            case "4":
                console.log("Fitur ubah reservasi belum tersedia.");
                break;
            case "5":
                console.log("Fitur hapus reservasi belum tersedia.");
                break;
            case "6":
                console.log("Fitur cari reservasi belum tersedia.");
                break;
            case "0":
                berjalan = false; // menghentikan perulangan menu
                console.log("\n===== TERIMAKASIH =====");
                break;
            default: // Muncul jika menu yang dimasukkan tidak valid
                console.log("Menu tidak valid! Masukkan angka 0 sampai 6.");
                break;
        }
    }
}

// Menjalankan program
main();