/**
 * Supabase Integration Module for Voucher Kas Keluar
 */

let supabaseClient = null;

// Initialize Supabase configuration on load from LocalStorage if saved
function initSupabase() {
    const savedUrl = localStorage.getItem('SUPABASE_URL');
    const savedKey = localStorage.getItem('SUPABASE_KEY');

    const statusDot = document.getElementById('dbStatusDot');
    const statusText = document.getElementById('dbStatusText');

    if (savedUrl && savedKey && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(savedUrl, savedKey);
            if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400";
            if (statusText) statusText.innerText = "Supabase Terhubung";
            return true;
        } catch (err) {
            console.error("Gagal menginisialisasi client Supabase:", err);
            if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-rose-500";
            if (statusText) statusText.innerText = "Supabase Error";
            return false;
        }
    } else {
        if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-amber-400";
        if (statusText) statusText.innerText = "Supabase Offline";
        return false;
    }
}

/**
 * Saves complete voucher and journal entries directly into Supabase tables
 */
async function saveVoucherToSupabase(payload) {
    if (!supabaseClient) {
        return { success: false, message: "Supabase belum dikonfigurasi. Data hanya ditampilkan dalam format JSON." };
    }

    try {
        const metadata = payload.voucher_metadata;
        const summary = payload.summary;

        // 1. Insert Voucher Header
        const { data: voucherData, error: voucherError } = await supabaseClient
            .from('vouchers')
            .insert([{
                voucher_type: metadata.voucher_type,
                transaction_date: metadata.transaction_date,
                reference_no: metadata.reference_no,
                paid_to: metadata.paid_to,
                description: metadata.description,
                total_debit: summary.total_debit,
                total_credit: summary.total_credit,
                currency: summary.currency
            }])
            .select()
            .single();

        if (voucherError) throw voucherError;

        // 2. Prepare Journal Lines linked to Voucher ID
        const linesToInsert = payload.journal_entries.map(line => ({
            voucher_id: voucherData.id,
            line_number: line.line_number,
            account_code: line.account_code,
            account_name: line.account_name,
            account_category: line.account_category,
            memo: line.memo,
            debit: line.debit,
            credit: line.credit
        }));

        // 3. Insert Journal Entries Lines
        const { error: linesError } = await supabaseClient
            .from('journal_entries')
            .insert(linesToInsert);

        if (linesError) throw linesError;

        return { success: true, message: "Berhasil tersimpan ke basis data Supabase!", voucherId: voucherData.id };

    } catch (error) {
        console.error("Gagal menyimpan ke Supabase:", error);
        return { success: false, message: `Gagal menyimpan ke Supabase: ${error.message || error}` };
    }
}

// Auto init on load
window.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});
