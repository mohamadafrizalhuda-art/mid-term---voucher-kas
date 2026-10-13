-- 1. Master Chart of Accounts (COA)
CREATE TABLE chart_of_accounts (
    account_id            SERIAL PRIMARY KEY,
    account_code          VARCHAR(20)  NOT NULL UNIQUE,
    account_name          VARCHAR(100) NOT NULL,
    normal_balance        VARCHAR(10)  NOT NULL CHECK (normal_balance IN ('DEBIT', 'CREDIT')),
    report_classification VARCHAR(50)  NOT NULL
);

-- 2. Header Transaksi Jurnal
CREATE TABLE journal_headers (
    header_id      SERIAL PRIMARY KEY,
    trx_date       DATE         NOT NULL,
    reference_no   VARCHAR(50)  NOT NULL UNIQUE,
    description    TEXT,
    status_posting VARCHAR(10)  NOT NULL DEFAULT 'DRAFT' CHECK (status_posting IN ('DRAFT', 'POSTED', 'VOID')),
    created_by     VARCHAR(50)  DEFAULT CURRENT_USER,
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_by     VARCHARS(50),
    updated_at     TIMESTAMP,
    hash_checksum  VARCHAR(64)
);

-- 3. Detail Baris Jurnal
CREATE TABLE journal_lines (
    line_id    SERIAL PRIMARY KEY,
    header_id  INT            NOT NULL,
    account_id INT            NOT NULL,
    debit      NUMERIC(15,2)  NOT NULL DEFAULT 0 CHECK (debit >= 0),
    credit     NUMERIC(15,2)  NOT NULL DEFAULT 0 CHECK (credit >= 0),
    CONSTRAINT chk_tidak_nol_dua_duanya CHECK (NOT (debit = 0 AND credit = 0)),
    CONSTRAINT chk_debit_atau_kredit CHECK (debit = 0 OR credit = 0),
    CONSTRAINT fk_line_header FOREIGN KEY (header_id) REFERENCES journal_headers(header_id) ON DELETE RESTRICT,
    CONSTRAINT fk_line_account FOREIGN KEY (account_id) REFERENCES chart_of_accounts(account_id) ON DELETE RESTRICT
);

-- 4. Fungsi & Constraint Trigger Validasi Keseimbangan Debit = Kredit
CREATE OR REPLACE FUNCTION fn_validasi_keseimbangan_jurnal() 
RETURNS TRIGGER AS $$
DECLARE
    v_header_id INT;
    v_total_debit  NUMERIC(15,2);
    v_total_credit NUMERIC(15,2);
BEGIN
    v_header_id := COALESCE(NEW.header_id, OLD.header_id);
    
    SELECT COALESCE(SUM(debit), 0), COALESCE(SUM(credit), 0)
    INTO v_total_debit, v_total_credit
    FROM journal_lines 
    WHERE header_id = v_header_id;

    IF v_total_debit <> v_total_credit THEN
        RAISE EXCEPTION 'TRANSAKSI UNBALANCED: Header ID % Memiliki Total Debit (Rp %) != Total Kredit (Rp %)', 
            v_header_id, v_total_debit, v_total_credit;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_validasi_keseimbangan_jurnal
AFTER INSERT OR UPDATE OR DELETE ON journal_lines
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION fn_validasi_keseimbangan_jurnal();
