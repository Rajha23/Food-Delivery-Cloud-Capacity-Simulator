import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Tab1Overview from './pages/Tab1Overview';
import Tab2Simulator from './pages/Tab2Simulator';
import Tab3Capacity from './pages/Tab3Capacity';
import Tab4Controls from './pages/Tab4Controls';
import Tab5Evaluation from './pages/Tab5Evaluation';
import Tab6AcademicReport from './pages/Tab6AcademicReport';
import PrintableReportModal from './components/PrintableReportModal';
import { Award, Cloud, Cpu, Database, Heart, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [simMode, setSimMode] = useState('unmanaged'); // 'unmanaged' or 'managed'
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Academic Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
        simMode={simMode}
        setSimMode={setSimMode}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <Tab1Overview onNavigateToSimulator={() => setActiveTab('simulator')} />
        )}
        {activeTab === 'simulator' && (
          <Tab2Simulator simMode={simMode} setSimMode={setSimMode} />
        )}
        {activeTab === 'capacity' && (
          <Tab3Capacity />
        )}
        {activeTab === 'controls' && (
          <Tab4Controls />
        )}
        {activeTab === 'evaluation' && (
          <Tab5Evaluation />
        )}
        {activeTab === 'viva' && (
          <Tab6AcademicReport onOpenPrintableReport={() => setIsReportOpen(true)} />
        )}
      </main>

      {/* Printable Report Modal */}
      <PrintableReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Academic Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PeakDinner CloudResilience™</span>
            <span>•</span>
            <span>Cloud Services Mini-Project (Problem #29)</span>
            <span>•</span>
            <span className="text-orange-400 font-mono">CO3 | Bloom's K5</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span>Team: <strong>814724104167</strong> VIJAYA RAJHA K</span>
            <span>&amp;</span>
            <span><strong>814724104174</strong> VISHVAA M</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

