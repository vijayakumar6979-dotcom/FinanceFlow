import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useBills } from '@/hooks/useBills';
import type { Bill, BillPayment } from '@financeflow/shared';
import toast from 'react-hot-toast';

interface ExportBillsProps {
    bills?: Bill[];
    payments?: BillPayment[];
}

export function ExportBills({ bills, payments }: ExportBillsProps) {
    const { data: allBills } = useBills();

    const exportToCSV = () => {
        try {
            const dataToExport = bills || allBills || [];

            if (dataToExport.length === 0) {
                toast.error('No bills to export');
                return;
            }

            // CSV Headers
            const headers = [
                'Bill Name',
                'Provider',
                'Category',
                'Type',
                'Amount',
                'Due Day',
                'Status',
                'Auto-Pay',
                'Notifications',
                'Created Date',
            ];

            // CSV Rows
            const rows = dataToExport.map(bill => [
                bill.bill_name,
                bill.provider_name,
                bill.provider_category,
                bill.is_variable ? 'Variable' : 'Fixed',
                bill.is_variable ? bill.estimated_amount : bill.fixed_amount,
                bill.due_day,
                bill.current_status || 'N/A',
                bill.auto_pay_enabled ? 'Yes' : 'No',
                bill.notifications_enabled ? 'Yes' : 'No',
                new Date(bill.created_at).toLocaleDateString('en-MY'),
            ]);

            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
            ].join('\n');

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `bills_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Bills exported to CSV');
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            toast.error('Failed to export bills');
        }
    };

    const exportPaymentsToCSV = () => {
        try {
            if (!payments || payments.length === 0) {
                toast.error('No payment history to export');
                return;
            }

            // CSV Headers
            const headers = [
                'Bill ID',
                'Due Date',
                'Amount',
                'Paid Amount',
                'Paid Date',
                'Status',
                'Payment Method',
                'Notes',
            ];

            // CSV Rows
            const rows = payments.map(payment => [
                payment.bill_id,
                payment.due_date,
                payment.amount,
                payment.paid_amount || '',
                payment.paid_date || '',
                payment.status,
                payment.payment_method || '',
                payment.notes || '',
            ]);

            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
            ].join('\n');

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `payment_history_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Payment history exported to CSV');
        } catch (error) {
            console.error('Error exporting payments:', error);
            toast.error('Failed to export payment history');
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-white/10 rounded-xl text-white hover:border-white/20 transition-all"
            >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="text-sm font-medium">Export Bills</span>
            </button>

            {payments && payments.length > 0 && (
                <button
                    onClick={exportPaymentsToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-white/10 rounded-xl text-white hover:border-white/20 transition-all"
                >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Export Payments</span>
                </button>
            )}
        </div>
    );
}
