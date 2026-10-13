# Voucher Entri Kas Keluar

Aplikasi web sederhana untuk membuat voucher kas keluar (BKK) dan memasukkan
rincian jurnal debit/kredit. Antarmuka menggunakan Bahasa Indonesia dan
menampilkan nilai dalam Rupiah (IDR).

## Demo

Buka aplikasi publik di:

<https://mohamadafrizalhuda-art.github.io/mid-term---voucher-kas/>

Klik **Isi Contoh Data** untuk melihat contoh transaksi dengan jumlah debit dan
kredit yang seimbang. Formulir juga bisa diisi dan digunakan langsung di browser.

## Fitur

- Informasi transaksi: tanggal, nomor referensi, penerima, dan deskripsi.
- Tambah atau hapus baris jurnal serta pilih akun dari daftar COA.
- Input debit dan kredit dengan format angka Rupiah.
- Perhitungan total otomatis dan pemeriksaan keseimbangan jurnal.
- Contoh data, reset formulir, dan notifikasi hasil tindakan.
- Opsi integrasi Supabase; tanpa konfigurasi Supabase, data tidak disimpan ke
  basis data.

## Berkas

| Berkas | Keterangan |
| --- | --- |
| `voucher_kas_keluar.html` | Halaman aplikasi utama; dapat dibuka langsung di browser. |
| `application_logic.js` | Modul logika formulir dan pengelolaan baris jurnal. |
| `supabase_configuration.js` | Modul inisialisasi Supabase dan penyimpanan voucher. |
| `database_schema_sql.sql` | Skema tabel dan kebijakan akses untuk Supabase. |
| `custom_stylesheet.md` | Referensi stylesheet untuk scrollbar, fokus input, dan cetak. |
| `.github/workflows/pages.yml` | Workflow untuk menerbitkan demo melalui GitHub Pages. |

Halaman demo utama dapat berjalan tanpa instalasi Node.js atau server lokal.
Buka `voucher_kas_keluar.html` dengan browser. Tampilan memuat Tailwind CSS,
Google Fonts, dan Font Awesome dari CDN, sehingga koneksi internet diperlukan
agar aset-aset tersebut tampil.

## Supabase (opsional)

Jalankan `database_schema_sql.sql` melalui SQL Editor di proyek Supabase untuk
membuat tabel voucher dan rincian jurnal. Berkas konfigurasi Supabase membaca
URL proyek dan key dari penyimpanan lokal browser. Jangan pernah menggunakan
service-role key di aplikasi publik; untuk penggunaan publik, evaluasi dan
batasi kebijakan Row Level Security sebelum mengirim data sungguhan.
