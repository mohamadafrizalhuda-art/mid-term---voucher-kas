# Mid-Term Pengkod

Repository ini berisi kumpulan jawaban dan implementasi tugas mid-term
pemrograman basis data. Materinya mencakup rancangan jurnal akuntansi,
pengelolaan stok dengan trigger, serta aplikasi web voucher kas keluar.

## Demo Aplikasi

Coba aplikasi voucher kas keluar secara langsung:
[Buka Demo Voucher Kas Keluar](https://mohamadafrizalhuda-art.github.io/mid-term---voucher-kas/).

## Isi Repository

### `soal 1/` — Jurnal Akuntansi

Contoh skema PostgreSQL untuk master akun (Chart of Accounts), header jurnal,
dan detail jurnal. Skema menerapkan batasan pada nilai debit/kredit serta
constraint trigger untuk memastikan total debit dan kredit setiap transaksi
seimbang.

- `ddl.sql` — definisi tabel, relasi, fungsi, dan trigger validasi jurnal.
- `pengujian.sql` — contoh pengurangan stok dengan isolation level
  `SERIALIZABLE`, untuk mengilustrasikan konflik transaksi bersamaan.

### `soal 2/` — Persediaan dan Transaksi Konkuren

Contoh pengelolaan persediaan menggunakan PostgreSQL. Trigger memperbarui stok
saat terjadi pembelian atau penjualan, menolak penjualan yang melebihi stok,
dan mengunci baris persediaan untuk mencegah konflik transaksi bersamaan.

- `ddl.sql` — tabel barang dan transaksi serta fungsi dan trigger pembaruan stok.
- `pengujian.sql` — contoh pengujian transaksi jurnal seimbang dan tidak
  seimbang.
- `solusi 1.sql` — simulasi dua kasir yang mengakses stok secara bersamaan
  menggunakan row-level lock (`FOR UPDATE`).
- `solusi 2.sql` — contoh transaksi pembelian, penjualan yang valid, dan
  penjualan yang ditolak karena stok tidak mencukupi.

### `soal 3/` — Aplikasi Voucher Kas Keluar

Aplikasi web berbahasa Indonesia untuk mengisi voucher kas keluar (BKK) beserta
baris jurnal debit dan kredit. Aplikasi menghitung total secara otomatis dan
memeriksa keseimbangan jurnal.

- `voucher_kas_keluar.html` — halaman utama aplikasi.
- `application_logic.js` — logika formulir dan baris jurnal.
- `supabase_configuration.js` — inisialisasi Supabase dan penyimpanan voucher.
- `database_schema_sql.sql` — skema tabel voucher dan detail jurnal untuk
  Supabase.
- `custom_stylesheet.md` — catatan stylesheet untuk tampilan dan pencetakan.
- `README.md` — petunjuk khusus untuk aplikasi pada folder ini.

Untuk menjalankannya secara lokal, buka `soal 3/voucher_kas_keluar.html` di
browser. Tailwind CSS, Google Fonts, dan Font Awesome dimuat dari CDN, sehingga
koneksi internet diperlukan agar seluruh tampilan dan ikon muncul.

## Menjalankan SQL

File SQL ditulis untuk PostgreSQL. Jalankan DDL pada database PostgreSQL yang
sesuai sebelum menjalankan file pengujian atau solusi. Beberapa skrip pengujian
mengasumsikan data dan struktur tabel sudah dibuat.

## Catatan Supabase

Integrasi penyimpanan aplikasi pada `soal 3/` bersifat opsional. Lihat
[`soal 3/README.md`](soal%203/README.md) untuk petunjuk lebih lanjut. Jangan
menaruh service-role key di aplikasi web publik, dan tinjau kebijakan Row Level
Security sebelum menggunakan database dengan data sungguhan.
