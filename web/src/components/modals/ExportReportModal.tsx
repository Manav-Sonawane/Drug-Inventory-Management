'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  Filter,
} from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportReportModal({
  isOpen,
  onClose,
}: ExportReportModalProps) {
  const [reportType, setReportType] = useState('full');
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);

      // Generate a mock CSV download
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Facility Name,District,Stock Status,Critical Items,Last Sync,Avg SLA\n' +
        'District Alpha Medical,District Alpha,Critical,Paracetamol < 5 days,12m ago,89.4%\n' +
        'Primary Health Centre Malda,Malda District,Warning,Oxytocin (Low),5m ago,96.2%\n' +
        'Central State Medical Warehouse,Kolkata Central,Optimal,None,Just now,99.1%\n' +
        'North Wing General Hospital,North 24 Parganas,Critical,Insulin Glargine,18m ago,91.8%\n' +
        'Siliguri Regional Depot,Darjeeling,Optimal,None,25m ago,97.5%\n' +
        'Asansol Industrial Health Center,Paschim Bardhaman,Warning,Antibiotics near expiry,40m ago,93.0%\n';

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `MediSetu_Statewide_Report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-[#00236f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-bold text-base leading-tight">Export Statewide Health Report</h3>
              <p className="text-xs text-blue-200">Generate compliance & supply audit records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Downloaded!</h4>
            <p className="text-xs text-slate-500">
              CSV file has been saved with 1,248 healthcare institution stock metrics.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Select Report Scope
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    checked={reportType === 'full'}
                    onChange={() => setReportType('full')}
                    className="text-blue-900 focus:ring-blue-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Complete Statewide Inventory</span>
                    <span className="text-[11px] text-slate-500">All 1,248 PHCs, District Hospitals & Warehouses</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    checked={reportType === 'critical'}
                    onChange={() => setReportType('critical')}
                    className="text-blue-900 focus:ring-blue-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Critical Stockouts & Near-Expiry Batches</span>
                    <span className="text-[11px] text-slate-500">Filtered to 47 critical facilities + 312 batches</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    checked={reportType === 'vendor'}
                    onChange={() => setReportType('vendor')}
                    className="text-blue-900 focus:ring-blue-900"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Vendor Performance & SLA Audit</span>
                    <span className="text-[11px] text-slate-500">Vendor fulfillment rate, delays, quality scores</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                    format === 'csv'
                      ? 'border-blue-900 bg-blue-50/80 text-blue-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Excel / CSV (.csv)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                    format === 'pdf'
                      ? 'border-blue-900 bg-blue-50/80 text-blue-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  Official PDF Doc (.pdf)
                </button>
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
                type="button"
                disabled={isExporting}
                onClick={handleExport}
                className="px-5 py-2.5 bg-[#00236f] text-white font-semibold text-xs rounded-lg hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Generating Report...' : 'Download Export'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
