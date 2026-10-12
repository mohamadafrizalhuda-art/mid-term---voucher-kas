/* STREAMING_CHUNK:Styling custom scrollbars and UI components... */
/* Custom scrollbars for smooth scrolling */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Custom focus ring styling for input fields */
input:focus, select:focus {
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* Form input animation effects */
.debit-input, .credit-input {
    transition: all 0.2s ease-in-out;
}

/* Pulse indicator animation */
@keyframes statusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

.status-animating {
    animation: statusPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Print Stylesheet for Voucher Printing */
@media print {
    header, footer, button, #toastContainer, #supabaseModal {
        display: none !important;
    }

    body {
        background-color: #ffffff !important;
        color: #000000 !important;
    }

    .shadow-sm, .shadow-md, .shadow-lg, .shadow-2xl {
        box-shadow: none !important;
    }

    .border {
        border-color: #cbd5e1 !important;
    }
}