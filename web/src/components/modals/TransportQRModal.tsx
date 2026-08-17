'use client';

import React from 'react';
import {
  X,
  QrCode,
  Printer,
  Download,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
} from 'lucide-react';
import { Order } from '@/lib/types';
import Logo from '@/components/Logo';

interface TransportQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmDispatch: (orderId: string) => void;
}

export default function TransportQRModal({
  isOpen,
  onClose,
  order,
  onConfirmDispatch,
}: TransportQRModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#00236f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-bold text-base leading-tight">Digital Transport Document & QR Waybill</h3>
              <p className="text-xs text-blue-200">Official GS1 Consignment Dispatch Clearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Container */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm bg-slate-50/50">
          <div className="bg-white rounded-xl p-5 border-2 border-slate-800 shadow-sm relative">
            {/* Stamp / Clearance Ribbon */}
            <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              CLEARED FOR TRANSIT
            </div>

            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-200">
              <Logo size="sm" subtitle="State Medical Logistics Directorate" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block uppercase tracking-wider font-semibold">Order / Waybill ID</span>
                <span className="text-slate-900 font-mono font-bold text-sm">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider font-semibold">Destination Facility</span>
                <span className="text-slate-900 font-bold">{order.destination}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider font-semibold">Dispatch Origin</span>
                <span className="text-slate-700">Central State Medical Warehouse, Bay 4</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider font-semibold">Timestamp / SLA</span>
                <span className="text-slate-700">{order.requestedDate} (SLA: {order.slaLimit})</span>
              </div>
            </div>

            {/* Scannable SVG QR Code Graphic */}
            <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="w-32 h-32 bg-white p-2 border-2 border-slate-900 rounded-lg shrink-0 flex items-center justify-center shadow-xs">
                {/* Authentic QR Pattern SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="2" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />

                  <rect x="70" y="0" width="30" height="30" rx="2" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />

                  <rect x="0" y="70" width="30" height="30" rx="2" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />

                  {/* QR Data Matrix Bits */}
                  <rect x="36" y="10" width="8" height="8" />
                  <rect x="50" y="15" width="8" height="8" />
                  <rect x="36" y="28" width="8" height="8" />
                  <rect x="50" y="32" width="8" height="8" />
                  <rect x="12" y="44" width="8" height="8" />
                  <rect x="26" y="48" width="8" height="8" />
                  <rect x="42" y="48" width="16" height="8" />
                  <rect x="68" y="42" width="8" height="16" />
                  <rect x="84" y="46" width="8" height="8" />
                  <rect x="42" y="66" width="8" height="8" />
                  <rect x="56" y="66" width="16" height="8" />
                  <rect x="78" y="72" width="12" height="12" />
                  <rect x="44" y="84" width="12" height="8" />
                </svg>
              </div>

              <div className="text-xs space-y-1.5 flex-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Hash:</span>
                  <span className="font-mono text-slate-800 font-semibold">0x7F9B...4C82</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Items Manifested:</span>
                  <span className="font-semibold text-slate-800">{order.manifest.length} Medical SKUs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Carrier Vehicle:</span>
                  <span className="font-medium text-slate-800">WB-74-AX-9912 (Refrigerated)</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Recipient Health Centre pharmacist can scan this QR code on arrival to automatically confirm inventory receipt.
                </p>
              </div>
            </div>

            {/* Manifest Table Summary */}
            <div className="text-xs border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                <span>Drug & Strength</span>
                <span>Batch / Quantity</span>
              </div>
              <div className="divide-y divide-slate-100">
                {order.manifest.map((item) => (
                  <div key={item.id} className="px-3 py-1.5 flex justify-between">
                    <span className="font-medium text-slate-800">{item.drugName}</span>
                    <span className="font-mono text-slate-600">
                      {item.batchNo} | <strong className="text-slate-900">{item.quantity} {item.unit}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Print Shipping Doc
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            <button
              onClick={() => {
                onConfirmDispatch(order.id);
                onClose();
              }}
              className="px-5 py-2.5 bg-[#00236f] text-white font-semibold text-xs rounded-lg hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Authorize & Mark Shipped
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
