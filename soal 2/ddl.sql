-- 1. DDL Tabel Persediaan
CREATE TABLE inventory_items (
    item_id    VARCHAR(10) PRIMARY KEY,
    item_name  VARCHAR(100) NOT NULL,
    stock_qty  INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    unit_cost  NUMERIC(15, 2) NOT NULL CHECK (unit_cost >= 0)
);

CREATE TABLE inventory_transactions (
    trx_id    SERIAL PRIMARY KEY,
    item_id   VARCHAR(10) REFERENCES inventory_items(item_id) ON DELETE RESTRICT,
    trx_type  VARCHAR(10) CHECK (trx_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT')),
    qty       INT NOT NULL CHECK (qty > 0),
    trx_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trigger Function Pengelola Stok Persediaan
CREATE OR REPLACE FUNCTION trg_update_stock_and_journal() 
RETURNS TRIGGER AS $$
DECLARE
    v_stok_tersedia INT;
BEGIN
    -- Kunci baris master persediaan untuk mencegah race condition
    SELECT stock_qty INTO v_stok_tersedia
    FROM inventory_items
    WHERE item_id = NEW.item_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item ID % tidak ditemukan pada master persediaan.', NEW.item_id;
    END IF;

    IF NEW.trx_type = 'PURCHASE' THEN
        UPDATE inventory_items 
        SET stock_qty = stock_qty + NEW.qty 
        WHERE item_id = NEW.item_id;

    ELSIF NEW.trx_type = 'SALE' THEN
        IF v_stok_tersedia < NEW.qty THEN
            RAISE EXCEPTION 'TRANSAKSI DITOLAK: Stok Item % tidak mencukupi. Stok saat ini = %, Permintaan = %', 
                NEW.item_id, v_stok_tersedia, NEW.qty;
        END IF;

        UPDATE inventory_items 
        SET stock_qty = stock_qty - NEW.qty 
        WHERE item_id = NEW.item_id;

    ELSIF NEW.trx_type = 'ADJUSTMENT' THEN
        UPDATE inventory_items 
        SET stock_qty = stock_qty + NEW.qty 
        WHERE item_id = NEW.item_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock_and_journal
AFTER INSERT ON inventory_transactions
FOR EACH ROW EXECUTE FUNCTION trg_update_stock_and_journal();

