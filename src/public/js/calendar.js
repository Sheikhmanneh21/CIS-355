class Calendar {
    constructor() {
        this.initPrintButton();
        this.initTooltips();
    }

    initPrintButton() {
        document.getElementById('print-btn')?.addEventListener('click', () => {
            window.print();
        });
    }

    initTooltips() {
        // Initialize Bootstrap tooltips if needed
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(
                document.querySelectorAll('[data-bs-toggle="tooltip"]')
            );
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});