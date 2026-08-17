'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Bot,
  TrendingUp,
  AlertTriangle,
  Snowflake,
  ShieldCheck,
  Building2,
  Package,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { analyzeWithGemini } from '@/lib/gemini';

interface AiLogisticsAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRerouteModal?: (title?: string) => void;
}

export function AiLogisticsAssistantDrawer({
  isOpen,
  onClose,
  onOpenRerouteModal,
}: AiLogisticsAssistantDrawerProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string>('dengue_surge');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async (scenarioKey?: string, customPrompt?: string) => {
    setLoading(true);
    setAnalysisResult(null);

    const scenarioToUse = scenarioKey || selectedScenario;
    const promptToUse =
      customPrompt ||
      prompt ||
      `Generate comprehensive supply chain optimization recommendations for scenario: ${scenarioToUse}`;

    try {
      const data = await analyzeWithGemini(
        promptToUse,
        scenarioToUse,
        {
          stateTotalPHCs: 142,
          activeWarehouses: 4,
          coldVaultsOnline: 8,
          currentExcursions: 1,
          criticalStockAlerts: 3,
        }
      );

      setAnalysisResult(data.analysis || 'No analysis returned.');
    } catch (err: any) {
      setAnalysisResult(
        '### ⚠️ Advisory Service Notice\nCould not reach the server API. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                  State Health AI Advisor
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Gemini 3.7 Flash</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                AI Logistics & Outbreak Surge Forecaster
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Quick Scenario Preset Chips */}
          <div>
            <label className="block text-slate-700 font-bold mb-2 uppercase tracking-wider text-[11px]">
              Select Epidemiological / Logistics Scenario
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedScenario('dengue_surge');
                  handleRunAnalysis('dengue_surge', 'Dengue Outbreak Surge Simulation for Malda & Siliguri');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedScenario === 'dengue_surge'
                    ? 'bg-blue-50 border-blue-900 ring-1 ring-blue-900 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  <span>Dengue Vector Surge</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">IV fluids & NS1 kit buffer scaling</div>
              </button>

              <button
                onClick={() => {
                  setSelectedScenario('cold_chain_breach');
                  handleRunAnalysis('cold_chain_breach', 'Cold Chain Excursion Emergency Response Plan');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedScenario === 'cold_chain_breach'
                    ? 'bg-blue-50 border-blue-900 ring-1 ring-blue-900 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Cold Chain Excursion</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Insulin/vaccine batch quarantine</div>
              </button>

              <button
                onClick={() => {
                  setSelectedScenario('monsoon_flood');
                  handleRunAnalysis('monsoon_flood', 'Monsoon Flood Rural Stock Pre-positioning Matrix');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedScenario === 'monsoon_flood'
                    ? 'bg-blue-50 border-blue-900 ring-1 ring-blue-900 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Monsoon Flooding Pre-stock</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Inundation-proof rural buffer packs</div>
              </button>

              <button
                onClick={() => {
                  setSelectedScenario('antibiotic_shortage');
                  handleRunAnalysis('antibiotic_shortage', 'Statewide Antibiotic Stockout Prevention');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedScenario === 'antibiotic_shortage'
                    ? 'bg-blue-50 border-blue-900 ring-1 ring-blue-900 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-900" />
                  <span>Antibiotic Stock Balancing</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Inter-depot FEFO re-routing</div>
              </button>
            </div>
          </div>

          {/* Analysis Results Display */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                AI Logistics Advisory Output
              </span>
              {analysisResult && (
                <button
                  onClick={() => handleRunAnalysis()}
                  className="text-blue-900 hover:text-blue-700 text-[11px] font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-7 h-7 text-blue-900 animate-spin" />
                <p className="text-xs text-slate-600 font-medium">
                  Synthesizing statewide inventory levels, telemetry buffers, and epidemiological models...
                </p>
              </div>
            ) : analysisResult ? (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed font-sans space-y-3 prose-sm max-w-none">
                <div
                  className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-normal"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdownToHTML(analysisResult),
                  }}
                />

                {onOpenRerouteModal && (
                  <div className="pt-3 border-t border-slate-200 flex gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRerouteModal('AI Surge Rebalance: ' + selectedScenario);
                      }}
                      className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Execute Recommended Stock Reroute</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
                <Bot className="w-8 h-8 text-blue-900 mx-auto" />
                <p className="font-medium text-slate-700">Ready to simulate supply scenarios</p>
                <p className="text-[11px] text-slate-400">
                  Select a preset scenario above or enter a customized query below to receive AI-backed stock
                  reallocation strategies.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (prompt.trim()) {
                handleRunAnalysis('custom_query', prompt);
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask custom question (e.g. 'Draft emergency PO for Paracetamol')..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function formatMarkdownToHTML(md: string): string {
  // Simple markdown transformer for bold, headers, and bullet points
  let html = md
    .replace(/^### (.*$)/gim, '<h3 class="font-bold text-slate-900 text-sm mt-3 mb-1">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="font-bold text-slate-800 text-xs mt-2 mb-1">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 text-xs mb-1">$1</li>')
    .replace(/\n\n/g, '<br />');

  return html;
}
