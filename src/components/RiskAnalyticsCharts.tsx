import React from 'react';
import { JobAnalysisResult } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Sparkles } from 'lucide-react';

interface RiskAnalyticsChartsProps {
  result: JobAnalysisResult;
}

const SEVERITY_COLORS = {
  CRITICAL: '#f43f5e', // rose-500
  HIGH: '#e11d48',     // rose-600
  MEDIUM: '#c084fc',   // purple-400
  LOW: '#38bdf8',      // sky-400
};

export const RiskAnalyticsCharts: React.FC<RiskAnalyticsChartsProps> = ({ result }) => {
  // 1. Prepare Bar Chart Data: Severity Counts & Category Breakdown
  const severityCounts = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  const categoryMap: { [key: string]: { name: string; count: number; maxSeverity: string } } = {};

  result.aiScamIndicators.forEach((indicator) => {
    // Increment severity count
    if (severityCounts[indicator.severity] !== undefined) {
      severityCounts[indicator.severity]++;
    }

    // Category aggregation
    const catName = indicator.category || 'General Risk';
    if (!categoryMap[catName]) {
      categoryMap[catName] = { name: catName, count: 0, maxSeverity: indicator.severity };
    }
    categoryMap[catName].count++;
  });

  const barChartData = [
    { name: 'Critical Flags', count: severityCounts.CRITICAL, fill: '#e11d48' },
    { name: 'High Flags', count: severityCounts.HIGH, fill: '#be185d' },
    { name: 'Medium Flags', count: severityCounts.MEDIUM, fill: '#9333ea' },
    { name: 'Low Flags', count: severityCounts.LOW, fill: '#0284c7' },
  ];

  // 2. Prepare Pie Chart Data: Overall Risk vs Authenticity Proportions
  const totalScamIndicators = result.aiScamIndicators.length;
  const totalAuthenticMarkers = result.authenticityMarkers.length;

  const pieChartData = [
    { name: 'Critical/High Risk', value: severityCounts.CRITICAL + severityCounts.HIGH, fill: '#e11d48' },
    { name: 'Medium Risk', value: severityCounts.MEDIUM, fill: '#9333ea' },
    { name: 'Low/Minor Risk', value: severityCounts.LOW, fill: '#0284c7' },
    { name: 'Authenticity Markers', value: Math.max(totalAuthenticMarkers, totalScamIndicators === 0 ? 1 : 0), fill: '#059669' },
  ].filter((item) => item.value > 0);

  return (
    <div id="risk-analytics-section" className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-fuchsia-200/80 shadow-xl shadow-fuchsia-100/50 space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-fuchsia-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-fuchsia-100 text-[#be185d] border border-fuchsia-200 shadow-2xs">
              Interactive Visual Analytics
            </span>
            <span className="text-xs text-slate-500 font-semibold font-sans">• High-Speed Data Graph</span>
          </div>
          <h3 className="text-xl font-bold text-[#be185d] mt-1 flex items-center space-x-2 font-serif-aesthetic">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <span>Job Vacancy Risk & Fraud Data Breakdown</span>
          </h3>
        </div>

        <div className="text-xs text-slate-600 font-medium flex items-center space-x-1 font-sans">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Risk Metrics Normalized (0-100 Scale)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 1: BAR CHART */}
        <div className="bg-fuchsia-50/40 p-5 rounded-2xl border border-fuchsia-200/70 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#be185d] flex items-center space-x-1.5 font-sans">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <span>Red Flag Indicators by Severity Level</span>
            </h4>
            <span className="text-[11px] text-[#be185d] font-semibold bg-fuchsia-100 px-2.5 py-0.5 rounded-full border border-fuchsia-200">
              Total: {totalScamIndicators} Flag{totalScamIndicators !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0abfc" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#701a75', fontWeight: 600 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#701a75' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    color: '#4c0519',
                    fontSize: '12px',
                    border: '1px solid #f0abfc',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: any) => [`${value} Detected`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2 font-sans">
            Shows volume of detected scam signals categorized by severity tier.
          </p>
        </div>

        {/* GRAPH 2: PIE CHART */}
        <div className="bg-fuchsia-50/40 p-5 rounded-2xl border border-fuchsia-200/70 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#be185d] flex items-center space-x-1.5 font-sans">
              <PieChartIcon className="w-4 h-4 text-amber-600" />
              <span>Risk vs Authenticity Share</span>
            </h4>
            <span className="text-[11px] font-bold text-[#be185d] bg-fuchsia-100 px-2.5 py-0.5 rounded-full border border-fuchsia-200">
              Score: {result.overallRiskScore}%
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    color: '#4c0519',
                    fontSize: '12px',
                    border: '1px solid #f0abfc',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#4a0429' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2 font-sans">
            Proportions of threat signals vs legitimate organizational markers.
          </p>
        </div>
      </div>
    </div>
  );
};
