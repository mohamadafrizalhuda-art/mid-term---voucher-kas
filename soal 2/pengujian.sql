-- Setup Master Barang (Stok Awal = 12 unit)
INSERT INTO inventory_items VALUES ('SKU-SKR01', 'Kertas HVS F4 80gr Sinar Dunia', 12, 62000.00);

-- Uji 1: Transaksi Pembelian (PURCHASE 20 unit -> Stok Otomatis Menjadi 32)
INSERT INTO inventory_transactions (item_id, trx_type, qty) VALUES ('SKU-SKR01', 'PURCHASE', 20);

-- Uji 2: Transaksi Penjualan Valid (SALE 10 unit -> Stok Otomatis Menjadi 22)
INSERT INTO inventory_transactions (item_id, trx_type, qty) VALUES ('SKU-SKR01', 'SALE', 10);

-- Uji 3: Transaksi Penjualan Melebihi Stok (SALE 50 unit -> Ditolak Exception)
INSERT INTO inventory_transactions (item_id, trx_type, qty) VALUES ('SKU-SKR01', 'SALE', 50);
-- Hasil Supabase: ERROR: P0001: TRANSAKSI DITOLAK: Stok Item SKU-SKR01 tidak mencukupi. Stok saat ini = 22, Permintaan = 50
