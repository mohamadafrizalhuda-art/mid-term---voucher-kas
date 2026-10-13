-- Eksekusi Paralel Kasir A dan Kasir B:
-- Kasir A
BEGIN;
SELECT stock_qty FROM inventory_items WHERE item_id = 'SKU-SKR01' FOR UPDATE;
-- Kasir A mengunci baris barang. Stok terbaca = 1. Lolos validasi -> UPDATE stok menjadi 0 -> COMMIT.

-- Kasir B (Eksekusi bersamaan)
BEGIN;
SELECT stock_qty FROM inventory_items WHERE item_id = 'SKU-SKR01' FOR UPDATE;
-- Kasir B DIBLOKIR (WAIT) oleh PostgreSQL hingga transaksi Kasir A selesai.
-- Setelah A COMMIT, B membaca stok terbaru = 0.
-- Pengecekan trigger B memicu RAISE EXCEPTION -> Transaksi Kasir B dibatalkan!