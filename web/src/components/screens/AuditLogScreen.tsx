import React, { useState, useEffect } from 'react';
import { auditApi } from '@/lib/api';
import { ClipboardList, RefreshCw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export function AuditLogScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [entityType, setEntityType] = useState('');
  const LIMIT = 25;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await auditApi.list({ entity_type: entityType || undefined, limit: LIMIT, offset: page * LIMIT });
      setLogs(res.data || []);
      setTotal(res.total || 0);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, entityType]);

  const entityTypes = ['', 'drug', 'batch', 'po', 'shipment'];
  const actionColors: Record<string, string> = {
    CREATE: 'bg-emerald-100 text-emerald-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-900" />
            Audit Log
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Complete tamper-proof record of all system changes · {total} total entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={entityType}
            onChange={(e) => { setEntityType(e.target.value); setPage(0); }}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">All Entities</option>
            {entityTypes.filter(Boolean).map((t) => (
              <option key={t} value={t}>{t.toUpperCase()}</option>
            ))}
          </select>
          <button
            onClick={load}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Entity</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Reason / Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No audit entries found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap font-mono">
                      {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-slate-700 uppercase">
                        {log.entity_type}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate max-w-[140px]">{log.entity_id?.slice(0, 16)}…</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${actionColors[log.action] || 'bg-slate-100 text-slate-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700">
                      {log.user_name || <span className="text-slate-400 italic">System</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                      {log.reason || (log.new_values ? (
                        <span className="font-mono text-[10px] text-slate-400">{String(log.new_values).slice(0, 60)}</span>
                      ) : '—')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">Page {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * LIMIT >= total}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
