import { GoogleGenAI } from "@google/genai";

export async function analyzeWithGemini(prompt: string, scenario?: string, contextData?: any) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback deterministic response if API key is not configured yet
      return {
        analysis: generateFallbackAnalysis(scenario || "general", prompt),
        fallback: true,
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are the Lead State Health Supply Chain & Epidemiological Logistics AI Advisor for AushadhFlow (State Medical Logistics & Pharmacy Directorate).
Provide concise, actionable, and structured insights for pharmacy managers, district medical officers, and warehouse directors.
Always structure recommendations clearly:
1. Risk Assessment & Severity (Low/Medium/High/Critical)
2. Immediate Stock Reallocation & Buffer Recommendations
3. Cold-Chain & Expiry Integrity Protocols
4. Projected Outbreak / Demand Trajectory
Keep answers precise, professional, and practical for hospital supply administrators.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Context Scenario: ${scenario || "General Inpatient & Dispensary Logistics"}
Additional Supply Chain Data: ${JSON.stringify(contextData || {})}
User Query / Optimization Request: ${prompt}`,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return {
      analysis: response.text || "Analysis generated successfully.",
      fallback: false,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      analysis: generateFallbackAnalysis("general", "State Logistics Query"),
      error: error.message || "Failed to process request",
      fallback: true,
    };
  }
}

function generateFallbackAnalysis(scenario: string, prompt: string): string {
  if (scenario === "dengue_surge") {
    return `### 🚨 Dengue Outbreak Epidemiological Surge Analysis
**Risk Severity:** High (Monsoon Vector Surge)

#### 1. Critical Supply Allocation
- **IV Fluids (Normal Saline & Ringer Lactate):** Increase buffer stock at Malda & Siliguri Sub-divisional hospitals by **+150%** over baseline 30-day consumption.
- **Paracetamol 500mg (Tabs & Syrup):** Deploy 50,000 additional units from State Central Master Warehouse (WH-01 Kolkata) to Malda District Depot within 24 hours.
- **Platelet Count Test Reagents & NS1 Antigen Kits:** Expedite vendor requisition PO-2026-088 for immediate 2-day delivery.

#### 2. Cold Chain & Quality Protocol
- Ensure NS1 Rapid Test kits maintain continuous storage between **2°C - 30°C**.
- Dispatch 3 refrigerated cold-box transport vans to rural PHCs with secondary battery loggers.

#### 3. Recommended Action Plan
- Authorize emergency inter-depot transfer from Central Warehouse Kolkata to Malda Rural PHC network.
- Place standing orders for anti-pyretic suspension buffers.`;
  }

  if (scenario === "cold_chain_breach") {
    return `### ⚠️ Cold Chain Excursion & Potency Safeguard Plan
**Risk Severity:** Critical (Vault Temperature Breach > 7.5°C)

#### 1. Immediate Quarantine Protocol
- Place Batch **#LOT-2026-904** (Insulin Glargine 100IU) into physical telemetry quarantine.
- Check logger data: If cumulative excursion time between 8°C - 15°C exceeded 6 continuous hours, initiate pharmacovigilance stability testing.

#### 2. Backup Supply Rerouting
- Route 1,200 vials of backup Insulin Glargine from Hub-01 (Kolkata) to Asansol General Hospital via expedited GPS-tracked refrigerated carrier #WB-04-E-8812.

#### 3. Root Cause Mitigation
- Ensure secondary diesel generator automatic transfer switch (ATS) remains engaged while HVAC technician recalibrates compressor loop.`;
  }

  return `### 📊 State Pharmacy Logistics Optimization Report
**Analysis for:** ${prompt || "General Network Inventory"}

#### 1. Inventory Balancing & Stockout Prevention
- Prioritize FEFO (First-Expired, First-Out) dispatch for 14 batches expiring within 45 days.
- Shift 350 boxes of Amoxicillin 500mg from low-utilization rural clinics to Burdwan Medical College.

#### 2. Procurement SLA & Lead-Time Optimization
- Vendor Apex Pharma has maintained 98.4% on-time fulfillment; recommended for next quarterly bulk anti-microbial tender.
- Re-route pending stock orders via the Eastern Corridor to avoid transit delays.

#### 3. Next Steps
- Generate QR transport waybills for approved transfers.
- Verify cold-vault telemetry pings across all 4 regional hubs.`;
}
