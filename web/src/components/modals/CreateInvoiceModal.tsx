'use client';

import React, { useState } from 'react';
import {
  X,
  Receipt,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Invoice } from '@/lib/types';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (invoice: Invoice) => void;
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onCreateInvoice,
}: CreateInvoiceModalProps) {
  const [orderNumber, setOrderNumber] = useState('ORD-8892');
  const [destination, setDestination] = useState('Central City Hospital');
  const [amount, setAmount] = useState<number>(24800);
  const [dueDate, setDueDate] = useState('Nov 24, 2023');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invNum = `INV-2023-${Math.floor(20 + Math.random() * 80)}`;
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: invNum,
      orderNumber,
      destination,
      amount,
      status: 'Submitted',
      issueDate: 'Today',
      dueDate,
    };

    onCreateInvoice(newInvoice);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-[#00236f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-bold text-base leading-tight">Create Vendor Invoice</h3>
              <p className="text-xs text-blue-200">Submit procurement claim to Health Directorate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Invoice Submitted!</h4>
            <p className="text-sm text-slate-600">
              Claim for ₹{amount.toLocaleString()} forwarded to State Finance Division.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Fulfillment Order Ref
              </label>
              <select
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
              >
                <option value="ORD-8892">ORD-8892 (Central City Hospital - ₹24,800)</option>
                <option value="ORD-8942">ORD-8942 (City Hospital North Wing - ₹18,450)</option>
                <option value="ORD-8845">ORD-8845 (Northside Clinic - ₹6,200)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Billed Medical Institution
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Invoice Total (₹ / RS)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-bold font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Payment Due Date
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>GST / Medical Tax (Exempted):</span>
                <span className="font-mono">Rs 0.00</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Net Payable:</span>
                <span className="font-mono">Rs {amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00236f] text-white font-semibold text-xs rounded-lg hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                Submit Invoice
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
