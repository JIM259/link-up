import React, { useState, useEffect } from 'react';
import { fetchAdminStats, runAISecurityTest } from '../services/api';
import { ShieldCheck, AlertTriangle, Activity, Users, FileText, CheckCircle2, Lock, Terminal } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const loadStats = async () => {
    const data = await fetchAdminStats();
    setStatsData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRunSecurityTest = async (testType: string) => {
    setActiveTest(testType);
    setTestResult(null);
    const result = await runAISecurityTest(testType);
    setTestResult(result);
    setActiveTest(null);
  };

  if (loading) {
    return <div className="text-center py-12 text-xs text-neutral-500">Loading admin governance dashboard...</div>;
  }

  const { stats, reports, auditLogs } = statsData;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-[#000000] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CB0000] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> LINK UP PLATFORM GOVERNANCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display">
            Admin & Moderation Console
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real platform analytics, AI safety moderation, and security boundary test suite.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-right">
          <div className="text-[10px] text-neutral-400 font-medium">System Status</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Moderation Active</span>
          </div>
        </div>
      </div>

      {/* Real Statistics Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">Total Users</div>
          <div className="text-lg font-black text-neutral-900 tabular-nums">{stats.totalUsers}</div>
        </div>
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">Active Today</div>
          <div className="text-lg font-black text-neutral-900 tabular-nums">{stats.activeUsersToday}</div>
        </div>
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">Posts</div>
          <div className="text-lg font-black text-neutral-900 tabular-nums">{stats.totalPosts}</div>
        </div>
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">Market Items</div>
          <div className="text-lg font-black text-neutral-900 tabular-nums">{stats.marketplaceListings}</div>
        </div>
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">Housing</div>
          <div className="text-lg font-black text-neutral-900 tabular-nums">{stats.housingListings}</div>
        </div>
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">Events</div>
          <div className="text-lg font-black text-neutral-900 tabular-nums">{stats.activeEvents}</div>
        </div>
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">AI Calls</div>
          <div className="text-lg font-black text-[#CB0000] tabular-nums">{stats.aiRequestsProcessed}</div>
        </div>
        <div className="bg-[#FEFEFE] p-3.5 rounded-xl border border-neutral-200">
          <div className="text-[10px] font-bold text-neutral-400 uppercase">Pending Rep.</div>
          <div className="text-lg font-black text-amber-600 tabular-nums">{stats.pendingReports}</div>
        </div>
      </div>

      {/* AI Security & Boundary Testing Panel */}
      <div className="bg-[#FEFEFE] rounded-2xl border-2 border-[#CB0000]/30 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h3 className="text-base font-extrabold font-display text-neutral-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#CB0000]" />
              <span>AI Security & Boundary Testing Suite</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Run automated defense boundary tests against prompt injection, hallucination, data leaks, and schema corruptions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleRunSecurityTest('prompt_injection')}
            disabled={activeTest !== null}
            className="p-3 bg-neutral-100 hover:bg-[#000000] hover:text-white rounded-xl text-xs font-bold text-neutral-800 transition-colors cursor-pointer text-left space-y-1"
          >
            <div className="text-[11px] text-[#CB0000]">Test 1</div>
            <div>Prompt Injection</div>
          </button>

          <button
            onClick={() => handleRunSecurityTest('data_leakage')}
            disabled={activeTest !== null}
            className="p-3 bg-neutral-100 hover:bg-[#000000] hover:text-white rounded-xl text-xs font-bold text-neutral-800 transition-colors cursor-pointer text-left space-y-1"
          >
            <div className="text-[11px] text-[#CB0000]">Test 2</div>
            <div>Data Leakage Prevention</div>
          </button>

          <button
            onClick={() => handleRunSecurityTest('hallucination')}
            disabled={activeTest !== null}
            className="p-3 bg-neutral-100 hover:bg-[#000000] hover:text-white rounded-xl text-xs font-bold text-neutral-800 transition-colors cursor-pointer text-left space-y-1"
          >
            <div className="text-[11px] text-[#CB0000]">Test 3</div>
            <div>Policy Hallucination</div>
          </button>

          <button
            onClick={() => handleRunSecurityTest('malformed_json')}
            disabled={activeTest !== null}
            className="p-3 bg-neutral-100 hover:bg-[#000000] hover:text-white rounded-xl text-xs font-bold text-neutral-800 transition-colors cursor-pointer text-left space-y-1"
          >
            <div className="text-[11px] text-[#CB0000]">Test 4</div>
            <div>Schema Validation</div>
          </button>
        </div>

        {/* Security Test Output Console */}
        {testResult && (
          <div className="bg-[#000000] text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2 border border-neutral-800">
            <div className="flex items-center justify-between text-white font-bold text-[11px] border-b border-neutral-800 pb-2">
              <span>TEST RESULTS: {testResult.testType.toUpperCase()}</span>
              <span className={testResult.passed ? 'text-emerald-400 font-black' : 'text-rose-500 font-black'}>
                {testResult.passed ? 'STATUS: PASSED (SECURE)' : 'STATUS: FAILED'}
              </span>
            </div>
            <div><span className="text-neutral-500">Input Payload:</span> "{testResult.inputPrompt}"</div>
            <div><span className="text-neutral-500">AI Engine Output:</span> "{testResult.aiOutput}"</div>
            <div className="text-neutral-300"><span className="text-neutral-500">Defense Audit:</span> {testResult.defenseDetails}</div>
          </div>
        )}
      </div>

      {/* Flagged Content & Moderation Queue */}
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-extrabold font-display text-neutral-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Flagged Content & Moderation Queue</span>
        </h3>

        <div className="space-y-3">
          {reports.map((r: any) => (
            <div key={r.id} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-900">Report #{r.id}</span>
                <span className="text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  AI Risk Score: {r.aiRiskScore}/100
                </span>
              </div>
              <p className="text-xs text-neutral-700"><span className="font-bold">Reason:</span> {r.reason}</p>
              <p className="text-xs text-neutral-500"><span className="font-bold text-neutral-800">AI Risk Analysis:</span> {r.aiRiskAnalysis}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-extrabold font-display text-neutral-900">Platform Audit Logs</h3>
        <div className="space-y-2 text-xs text-neutral-700">
          {auditLogs.map((log: any) => (
            <div key={log.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900">{log.actorName}</span> · {log.action}
                <div className="text-neutral-500 text-[11px]">{log.details}</div>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">{log.ipAddress}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
