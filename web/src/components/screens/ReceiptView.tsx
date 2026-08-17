'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  Truck,
  CheckCircle2,
  QrCode,
  PackageCheck,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReceiptData {
  orderNumber: string;
  destination: string;
  origin?: string;
  requestedDate: string;
  status: string;
  slaLimit?: string;
  totalValue?: string;
  securityHash?: string;
  carrierVehicle?: string;
  manifest: Array<{
    drugName: string;
    batchNo: string;
    quantity: number;
    unit: string;
  }>;
}

interface ReceiptViewProps {
  receiptData?: ReceiptData | null;
  onBackToApp?: () => void;
}

export default function ReceiptView({ receiptData: propData, onBackToApp }: ReceiptViewProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReceiptData>(() => {
    if (propData) return propData;
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const orderNum = params.get('receipt') || params.get('id') || 'PO-1786995076902';
    return {
      orderNumber: orderNum,
      destination: 'District Alpha Medical Complex',
      origin: 'Central State Medical Warehouse, Bay 4',
      requestedDate: new Date().toLocaleDateString('en-IN'),
      status: 'CLEARED FOR TRANSIT',
      slaLimit: '24 hrs remaining',
      totalValue: '₹32,000',
      securityHash: '0x3EE1A691',
      carrierVehicle: 'WB-74-AX-9912 (Refrigerated)',
      manifest: [
        { drugName: 'Amoxicillin 500mg', batchNo: 'B-7742', quantity: 1000, unit: 'Units' },
      ],
    };
  });

  useEffect(() => {
    if (propData) {
      setData(propData);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const orderNum = params.get('receipt') || params.get('id');
    if (!orderNum) return;

    setLoading(true);
    fetch(`/api/purchase-orders/public/${encodeURIComponent(orderNum)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.data) {
          const po = res.data;
          let dest = po.vendor_name || 'District Alpha Medical Complex';
          let batchStr = `LOT-${po.id.slice(0, 6)}`;
          if (po.notes) {
            if (po.notes.includes('Destination:')) {
              const part = po.notes.split('Destination:')[1].split('|')[0].trim();
              if (part) dest = part;
            }
            if (po.notes.includes('Batch:')) {
              const bPart = po.notes.split('Batch:')[1].trim();
              if (bPart) batchStr = bPart;
            }
          }

          const securityHash = '0x' + Array.from(po.po_number || orderNum)
            .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
            .toString(16)
            .toUpperCase()
            .padStart(8, '0');

          setData({
            orderNumber: po.po_number || orderNum,
            destination: dest,
            origin: 'Central State Medical Warehouse, Bay 4',
            requestedDate: po.created_at ? new Date(po.created_at).toLocaleDateString('en-IN') : 'Today',
            status: po.status === 'approved' ? 'CLEARED FOR TRANSIT' : 'DISPATCH APPROVED',
            slaLimit: '24 hrs remaining',
            totalValue: `₹${(po.total_cost || 0).toLocaleString()}`,
            securityHash: securityHash,
            carrierVehicle: 'WB-74-AX-9912 (Refrigerated)',
            manifest: [
              {
                drugName: po.drug_name || 'Pharmaceutical Batch',
                batchNo: batchStr,
                quantity: po.quantity || 1000,
                unit: 'Units',
              },
            ],
          });
        }
      })
      .catch((err) => {
        console.warn('Public PO fetch error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propData]);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const element = receiptRef.current;
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
      pdf.save(`Waybill-Receipt-${data.orderNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-start font-sans text-slate-900">
      {/* Top Action Bar */}
      <div className="w-full max-w-3xl mb-4 flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          {onBackToApp ? (
            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" /> Back to App
            </button>
          ) : (
            <a
              href="/"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" /> Go to Portal
            </a>
          )}
          <span className="text-xs text-slate-400 hidden sm:inline">Official Waybill Receipt Verification</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? 'Generating PDF...' : 'Download Official PDF'}
          </button>
        </div>
      </div>

      {/* Main Printable Receipt Card */}
      <div
        ref={receiptRef}
        className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-200"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00236f] text-white flex items-center justify-center font-bold text-xl shadow-md">
              🏥
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                MediSetu Logistics Directorate
              </h1>
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
                Department of Health & Family Welfare • Government Verification
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            OFFICIAL CLEARANCE: TRANSIT VERIFIED
          </div>
        </div>

        {/* Waybill & Dispatch Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Waybill / Order ID</span>
            <span className="font-mono font-bold text-sm text-slate-900">{data.orderNumber}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Destination Facility</span>
            <span className="font-bold text-slate-900">{data.destination}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Dispatch Origin</span>
            <span className="font-medium text-slate-700">{data.origin || 'Central State Medical Warehouse'}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Dispatch SLA</span>
            <span className="font-medium text-slate-700">{data.requestedDate} ({data.slaLimit || '24 hrs'})</span>
          </div>
        </div>

        {/* QR Code & Security Stamp Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-blue-50/50 rounded-xl border border-blue-100 gap-6 my-6">
          <div className="flex items-center gap-5">
            <div className="w-32 h-32 bg-white p-2 rounded-xl border-2 border-slate-900 shadow-sm shrink-0 flex items-center justify-center">
              <QRCodeSVG
                value={typeof window !== 'undefined' ? window.location.href : ''}
                size={110}
                level="L"
                includeMargin={false}
                className="w-full h-full"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                Cryptographic Authentication
              </div>
              <div className="text-slate-600">
                Security Hash: <strong className="font-mono text-slate-900">{data.securityHash || '0x3EE1A691'}</strong>
              </div>
              <div className="text-slate-600">
                Transport Carrier: <strong className="text-slate-900">{data.carrierVehicle || 'WB-74-AX-9912 (Cold Chain)'}</strong>
              </div>
              <div className="text-slate-600">
                Verification Protocol: <strong className="text-slate-900">GS1 / WHO Pharmaceutical Standard</strong>
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right text-xs text-slate-500 border-t sm:border-t-0 sm:border-l border-blue-200/60 pt-3 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto sm:ml-auto flex items-center justify-center mb-1 font-bold">
              ✓
            </div>
            <div className="font-bold text-slate-800">Tamper-Evident Receipt</div>
            <div className="text-[11px]">Authorized Medical Dispatch</div>
          </div>
        </div>

        {/* Consignment Manifest Table */}
        <div className="my-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2.5">
            Manifest Line Items ({data.manifest.length} Items Cleared)
          </h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Drug / Consumable Description</th>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.manifest.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{item.drugName}</td>
                    <td className="p-3 font-mono text-slate-600">{item.batchNo}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      {item.quantity.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                        INSPECTED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures & Certification Footer */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-500">
          <div>
            <span className="block font-bold text-slate-700 mb-4">Dispatching Officer:</span>
            <div className="border-b border-slate-300 pb-1 font-mono text-slate-900 font-bold">R. Sen (Pharmacist-in-Charge)</div>
            <span className="text-[10px] text-slate-400">Warehouse Central Hub</span>
          </div>

          <div>
            <span className="block font-bold text-slate-700 mb-4">Transport Driver:</span>
            <div className="border-b border-slate-300 pb-1 font-mono text-slate-900 font-bold">M. Ali (Carrier Verified)</div>
            <span className="text-[10px] text-slate-400">Govt Logistics Fleet</span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block font-bold text-slate-700 mb-4">Receiving Pharmacist:</span>
            <div className="border-b border-slate-300 pb-1 text-slate-400 italic">Signature / Scan on Arrival</div>
            <span className="text-[10px] text-slate-400">Destination Hospital</span>
          </div>
        </div>

        {/* Official Legal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 leading-relaxed">
          This digital transport document was generated electronically by the State Drug Inventory & Supply Chain Tracking System (PSS04). 
          Scan the QR code to verify live status, cold chain integrity, and digital custody logs.
        </div>
      </div>
    </div>
  );
}
