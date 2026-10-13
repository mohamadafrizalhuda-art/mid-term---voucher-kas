-- A. Pengisian Data Master Akun 
INSERT INTO chart_of_accounts (account_code, account_name, normal_balance, report_classification)  
VALUES  
('110-01', 'Kas Operasional Kantor', 'DEBIT', 'Aset Lancar'), 
('110-02', 'Rekening Bank BCA Utama', 'DEBIT', 'Aset Lancar'), 
('210-01', 'Utang Usaha Pemasok', 'CREDIT', 'Kewajiban Jangka Pendek'), 
('510-01', 'Beban Listrik & Daya Operasional', 'DEBIT', 'Beban Operasional'); -- B. Uji Case 1: Transaksi Seimbang (Sukses Commit) 
INSERT INTO journal_headers (trx_date, reference_no, description, status_posting, created_by)  
VALUES ('2026-10-19', 'VKK/2026/10/001', 'Pembayaran Beban Listrik Operasional', 'DRAFT', 'staf_keuangan'); 
INSERT INTO journal_lines (header_id, account_id, debit, credit) VALUES  
(1, 4, 850000.00, 0.00),  -- Beban Listrik (Debit) 
(1, 1, 0.00, 850000.00);  -- Kas Operasional (Kredit) -- Hasil: COMMIT BERHASIL. Total Debit = Total Kredit (Rp 850.000). -- C. Uji Case 2: Transaksi Tidak Seimbang (Ditolak Trigger) 
INSERT INTO journal_headers (trx_date, reference_no, description)  
VALUES ('2026-10-19', 'VKK/2026/10/002', 'Uji Transaksi Unbalanced'); 
 
INSERT INTO journal_lines (header_id, account_id, debit, credit) VALUES  
(2, 4, 850000.00, 0.00), 
(2, 1, 0.00, 500000.00); -- Hasil Supabase: ERROR: P0001: TRANSAKSI UNBALANCED: Header ID 2 Memiliki Total Debit (Rp 850000.00) != 
Total Kredit (Rp 500000.00)