'use client';

import React, { useRef, useState } from 'react';
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
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const printDocRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !order) return null;

  const securityHash = '0x' + Array.from(order.orderNumber || 'ORD')
    .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
    .toString(16)
    .toUpperCase()
    .padStart(8, '0');

  // Clean, short URL that any phone camera instantly recognizes:
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrReceiptUrl = `${origin}/?receipt=${encodeURIComponent(order.orderNumber)}`;

  const handleDownloadPDF = async () => {
    if (!printDocRef.current) return;
    setDownloading(true);
    try {
      const element = printDocRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Waybill-Receipt-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
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
          <div ref={printDocRef} className="bg-white rounded-xl p-5 border-2 border-slate-800 shadow-sm relative">
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

            {/* High-Contrast Fast-Scan QR Code Section */}
            <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5 justify-between">
              {/* High Contrast Clean QR */}
              <div className="w-44 h-44 bg-white p-3 border-2 border-slate-900 rounded-2xl shrink-0 flex items-center justify-center shadow-md">
                <QRCodeSVG
                  value={qrReceiptUrl}
                  size={152}
                  level="L"
                  includeMargin={false}
                  className="w-full h-full"
                />
              </div>

              <div className="text-xs space-y-2 flex-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Hash:</span>
                  <span className="font-mono text-slate-800 font-bold">{securityHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Items Manifested:</span>
                  <span className="font-semibold text-slate-800">{order.manifest.length} Medical SKU(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Carrier Vehicle:</span>
                  <span className="font-medium text-slate-800">WB-74-AX-9912 (Refrigerated)</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-[11px] text-emerald-900 font-medium space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Instant Phone Scanner Link:</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 truncate">
                    {qrReceiptUrl}
                  </div>
                  <p className="text-[10px] text-emerald-700">
                    Point camera directly at the code above to open & download the PDF receipt.
                  </p>
                </div>
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
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            <button
              onClick={() => {
                onConfirmDispatch(order.id);
                onClose();
              }}
              className="px-4 py-2 bg-[#00236f] text-white font-semibold text-xs rounded-lg hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-1.5"
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
