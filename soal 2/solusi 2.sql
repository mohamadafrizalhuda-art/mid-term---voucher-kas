BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT stock_qty FROM inventory_items WHERE item_id = 'SKU-SKR01';
UPDATE inventory_items SET stock_qty = stock_qty - 1 WHERE item_id = 'SKU-SKR01';
COMMIT;
-- PostgreSQL mendeteksi konflik pembacaan/penulisan paralel dan secara otomatis membatalkan salah satu transaksi dengan error serialization failure.