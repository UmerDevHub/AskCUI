import React, { useState } from 'react';
import { 
  BookOpen, 
  DollarSign, 
  CheckCircle, 
  FileText, 
  Award, 
  HelpCircle, 
  ArrowRight, 
  Search, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Info,
  Clock
} from 'lucide-react';

import programsData from '../data/programs.json';
import feesData from '../data/fees.json';
import eligibilityData from '../data/eligibility.json';
import prerequisitesData from '../data/prerequisites.json';
import scholarshipsData from '../data/scholarships.json';
import faqsData from '../data/faqs.json';

export default function CategoryExplorer({ category, onAskQuestion }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // For programs: All, Undergraduate, Graduate, PhD
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // --- 1. RENDER PROGRAMS ---
  const renderPrograms = () => {
    const filtered = programsData.filter(p => {
      const matchesTab = activeTab === 'All' || p.level === activeTab;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });

    return (
      <div className="space-y-6">
        {/* Programs Header & Tabs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="h-5.5 w-5.5 text-indigo-500" />
              Degree Programs Offered
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a level and explore our curriculum. Click "Ask AI" to learn about admission requirements.
            </p>
          </div>
          {/* Level Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 shrink-0 self-start">
            {['All', 'Undergraduate', 'Graduate', 'PhD'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {tab === 'Graduate' ? 'MS Graduate' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs by name, abbreviation, or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400"
          />
        </div>

        {/* Programs Grid */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-450 dark:text-slate-550">
            No programs match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, idx) => (
              <div 
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-slate-150 bg-slate-50/50 p-4 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-indigo-900 dark:hover:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                      {p.level}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {p.duration}
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                    {p.abbreviation} • {p.category}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-450 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>
                <button
                  onClick={() => onAskQuestion(`What are the details, eligibility criteria, and requirements for ${p.name} (${p.abbreviation})?`, 'Programs')}
                  className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
                >
                  <span>Ask Admission AI</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- 2. RENDER FEES ---
  const renderFees = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="h-5.5 w-5.5 text-emerald-500" />
            Fee Structure - Fall 2026
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official tuition and admission fees. Scroll down to review the refund policy.
          </p>
        </div>

        {/* Fees Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5 text-right">Admission Fee</th>
                  <th className="px-4 py-3.5 text-right">Registration Fee</th>
                  <th className="px-4 py-3.5 text-right">Tuition / Sem</th>
                  <th className="px-4 py-3.5 text-right bg-emerald-50/50 dark:bg-emerald-950/10 font-bold text-slate-700 dark:text-slate-350">Total at Admission</th>
                  <th className="px-4 py-3.5 text-right">Per Sem Later</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-350">
                {feesData.structures.map((fee, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{fee.category}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]" title={fee.programs_included.join(', ')}>
                        {fee.programs_included.join(', ')}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono">Rs. {fee.admission_fee.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-mono">Rs. {fee.registration_fee.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-mono">Rs. {fee.tuition_fee_per_semester.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-bold font-mono bg-emerald-50/20 dark:bg-emerald-950/5 text-emerald-600 dark:text-emerald-400">Rs. {fee.total_at_admission.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-mono">Rs. {fee.subsequent_semesters.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Processing & NTS Test Fees */}
        {feesData.policies.application_processing_fee_amount && (
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mandatory Application & Entry Test Fees
            </h3>
            <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-2055 dark:text-slate-200">Admission Processing Fee</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Non-Refundable application processing</p>
                </div>
                <div className="text-lg font-black text-slate-800 font-mono dark:text-slate-100">
                  Rs. {feesData.policies.application_processing_fee_amount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-2055 dark:text-slate-200">CUI Wah NTS Test Fee</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Registration fee for CUI NTS exam</p>
                </div>
                <div className="text-lg font-black text-slate-800 font-mono dark:text-slate-100">
                  Rs. {feesData.policies.nts_test_fee_amount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-150 bg-slate-50/40 p-4 dark:border-slate-850 dark:bg-slate-900/20">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Info className="h-4 w-4 text-slate-400" />
              General Billing Policies
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 leading-relaxed">
              <li>{feesData.policies.payment_timing}</li>
              <li>{feesData.policies.exclusion_note}</li>
              <li>{feesData.policies.installments}</li>
              <li>{feesData.policies.revision_note}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-150 bg-slate-50/40 p-4 dark:border-slate-850 dark:bg-slate-900/20">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4 text-slate-400" />
              Admission Refund Deadlines
            </h4>
            <div className="mt-3 space-y-2">
              {feesData.refund_policy.table.map((ref, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-350">{ref.refund_percentage}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{ref.timeline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refund Policy detailed note */}
        <div className="rounded-xl bg-slate-55 bg-slate-100/50 p-4 dark:bg-slate-900/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Refund Notes & Terms</h4>
          <ul className="mt-2.5 space-y-1.5 text-xs text-slate-500 dark:text-slate-450 list-disc pl-4 leading-relaxed">
            {feesData.refund_policy.notes.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onAskQuestion("What is the fee structure for BS Computer Science and the refund policy at COMSATS?", 'Fees')}
          className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span>Have questions about fees? Ask Admission AI</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // --- 3. RENDER ELIGIBILITY ---
  const renderEligibility = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle className="h-5.5 w-5.5 text-amber-500" />
            Admission Eligibility Criteria
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verify academic requirements for undergraduate, MS graduate, and PhD programs.
          </p>
        </div>

        {/* Undergraduate grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Undergraduate Degree Programs</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {eligibilityData.undergraduate.computing_programs.min_percentage}%
                </div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-1.5">Computing Programs</h4>
                <p className="text-[11px] text-slate-550 dark:text-slate-350 mt-2 leading-relaxed font-medium">
                  {eligibilityData.undergraduate.computing_programs.detailed_criteria}
                </p>
                <div className="mt-3 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 dark:bg-blue-950/10 dark:border-blue-950/20 text-[10px] font-bold text-blue-700 dark:text-blue-450 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{eligibilityData.undergraduate.computing_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.computing_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded bg-slate-150 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {eligibilityData.undergraduate.engineering_programs.min_percentage}%
                </div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-1.5">Engineering Programs</h4>
                <p className="text-[11px] text-slate-550 dark:text-slate-350 mt-2 leading-relaxed font-medium">
                  {eligibilityData.undergraduate.engineering_programs.detailed_criteria}
                </p>
                {eligibilityData.undergraduate.engineering_programs.deficiency_policy && (
                  <div className="mt-2 text-[10.5px] leading-relaxed font-semibold text-amber-700 dark:text-amber-455 bg-amber-50/40 dark:bg-amber-950/10 p-2 rounded-xl border border-amber-100/40 dark:border-amber-950/20">
                    <strong>Deficiency:</strong> {eligibilityData.undergraduate.engineering_programs.deficiency_policy}
                  </div>
                )}
                <div className="mt-3 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-950/20 text-[10px] font-bold text-indigo-750 dark:text-indigo-400 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span>{eligibilityData.undergraduate.engineering_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.engineering_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded bg-slate-150 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {eligibilityData.undergraduate.other_programs.min_percentage}%
                </div>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-1.5">Management & Humanities</h4>
                <p className="text-[11px] text-slate-555 dark:text-slate-350 mt-2 leading-relaxed font-medium">
                  {eligibilityData.undergraduate.other_programs.detailed_criteria}
                </p>
                <div className="mt-2 text-[10.5px] leading-relaxed font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/10 p-2 rounded-xl border border-emerald-100/45 dark:border-emerald-950/20">
                  <strong>Accreditation:</strong> {eligibilityData.undergraduate.other_programs.special_accreditations["BS Accounting & Finance"]}
                </div>
                <div className="mt-3 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 dark:bg-amber-950/10 dark:border-amber-950/20 text-[10px] font-bold text-amber-700 dark:text-amber-455 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{eligibilityData.undergraduate.other_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.other_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded bg-slate-150 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {eligibilityData.undergraduate.nat_categories && (
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">CUI NAT Undergraduate Test Categories</h3>
            <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(eligibilityData.undergraduate.nat_categories).map(([catName, catDetail]) => (
                <div key={catName} className="rounded-xl bg-white p-3.5 shadow-sm dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">{catName}</span>
                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                        {catDetail.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">
                      {catDetail.description}
                    </p>
                  </div>
                  <div className="mt-3.5 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Subject Format:</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-relaxed font-mono">
                      {catDetail.test_distribution}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graduate & PhD criteria */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Master of Science (MS) Admissions</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {eligibilityData.graduate_ms.detailed_criteria}
            </p>
            <div className="mt-3 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-950/20 text-[10px] font-bold text-indigo-700 dark:text-indigo-400 leading-normal">
              <strong>Entry Test:</strong> {eligibilityData.graduate_ms.entry_test_requirement}
            </div>
            <div className="mt-3.5 space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="font-bold">Min CGPA</span>
                <span className="font-mono text-slate-700 dark:text-slate-350">{eligibilityData.graduate_ms.min_cgpa}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="font-bold">Min Percentage</span>
                <span className="font-mono text-slate-700 dark:text-slate-350">{eligibilityData.graduate_ms.min_percentage}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="font-bold">Prior Education</span>
                <span className="text-slate-700 dark:text-slate-350">{eligibilityData.graduate_ms.degree_requirement}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-red-500">Academic History Restriction</span>
                <span className="font-semibold text-red-650 dark:text-red-400">{eligibilityData.graduate_ms.division_rule}</span>
              </div>
            </div>
            {eligibilityData.graduate_ms.gat_categories && (
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Applicable GAT General Categories:</span>
                <div className="mt-2 space-y-1.5">
                  {Object.entries(eligibilityData.graduate_ms.gat_categories).map(([catName, catDetail]) => (
                    <div key={catName} className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900 border border-slate-150/40 dark:border-slate-850">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{catName}: {catDetail.title}</span>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-0.5 rounded dark:text-indigo-400">{catDetail.test_distribution}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-455 mt-1 leading-relaxed">{catDetail.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col gap-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Doctor of Philosophy (PhD) Admissions</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {eligibilityData.graduate_phd.detailed_criteria}
              </p>
            </div>

            {/* Academic thresholds */}
            <div className="space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="font-bold">Min CGPA</span>
                <span className="font-mono text-slate-700 dark:text-slate-350">{eligibilityData.graduate_phd.min_cgpa}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="font-bold">Min Percentage</span>
                <span className="font-mono text-slate-700 dark:text-slate-350">{eligibilityData.graduate_phd.min_percentage}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
                <span className="font-bold">Prior Degree Required</span>
                <span className="text-slate-700 dark:text-slate-350 text-right max-w-[60%]">{eligibilityData.graduate_phd.degree_requirement}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-red-500">Academic Restriction</span>
                <span className="font-semibold text-red-650 dark:text-red-400">{eligibilityData.graduate_phd.division_rule}</span>
              </div>
            </div>

            {/* GAT Subject test block */}
            {eligibilityData.graduate_phd.gat_subject_test && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Required Entry Test
                  </span>
                  <span className="rounded-full bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 px-2 py-0.5 text-[9px] font-bold text-violet-700 dark:text-violet-400">
                    Mandatory
                  </span>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800 p-3 space-y-2 text-[11px]">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {eligibilityData.graduate_phd.gat_subject_test.test_name}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {eligibilityData.graduate_phd.gat_subject_test.purpose}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Format</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{eligibilityData.graduate_phd.gat_subject_test.format}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Validity</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{eligibilityData.graduate_phd.gat_subject_test.validity}</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2 border border-slate-100 dark:border-slate-800">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Score Distribution</div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{eligibilityData.graduate_phd.gat_subject_test.score_distribution}</div>
                  </div>

                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/10 p-2 border border-emerald-100 dark:border-emerald-900/20">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-1">Passing Score (NTS / GRE)</div>
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400">{eligibilityData.graduate_phd.gat_subject_test.passing_score_nts_gre}</div>
                  </div>

                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/10 p-2 border border-amber-100 dark:border-amber-900/20">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-1">CUI Own Test (if NTS/GRE unavailable)</div>
                    <div className="font-semibold text-amber-700 dark:text-amber-400">{eligibilityData.graduate_phd.gat_subject_test.passing_score_cui_test}</div>
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/10 p-2 border border-blue-100 dark:border-blue-900/20">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500 mb-1">GRE Equivalence</div>
                    <div className="font-semibold text-blue-700 dark:text-blue-400">{eligibilityData.graduate_phd.gat_subject_test.gre_equivalence}</div>
                  </div>

                  <div className="rounded-lg bg-rose-50 dark:bg-rose-950/10 p-2 border border-rose-100 dark:border-rose-900/20">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500 mb-1">Interview Requirement</div>
                    <div className="font-semibold text-rose-700 dark:text-rose-400">{eligibilityData.graduate_phd.gat_subject_test.interview_requirement}</div>
                  </div>
                </div>

                {/* Program → GAT Subject mapping */}
                {eligibilityData.graduate_phd.gat_subject_test.program_subject_mapping && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Program → Required GAT Subject
                    </span>
                    <div className="mt-2 space-y-1">
                      {Object.entries(eligibilityData.graduate_phd.gat_subject_test.program_subject_mapping).map(([prog, info]) => (
                        <div key={prog} className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2">
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{prog}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] font-bold text-violet-700 dark:text-violet-400">{info.gat_subject}</span>
                            <span className="text-[8.5px] text-slate-400 dark:text-slate-600">({info.gat_type})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Admission Schedule */}
        {eligibilityData.admission_schedule && (
          <div className="rounded-2xl border border-blue-150 bg-blue-50/10 p-5 dark:border-blue-900/30 dark:bg-blue-950/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5" />
              Fall 2026 Important Admission Schedule
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-3.5 shadow-sm dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Last Date to Apply</div>
                <div className="text-base font-extrabold text-red-600 dark:text-red-400 mt-1">
                  {eligibilityData.admission_schedule.last_date_to_apply}
                </div>
              </div>
              <div className="rounded-xl bg-white p-3.5 shadow-sm dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">NTS Entry Test Dates</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 space-y-1">
                  {eligibilityData.admission_schedule.nts_test_dates.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{t.test_name}:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{t.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white p-3.5 shadow-sm dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Merit List Display</div>
                <div className="text-base font-extrabold text-emerald-650 dark:text-emerald-450 mt-1">
                  {eligibilityData.admission_schedule.merit_list_display}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special Policies */}
        <div className="rounded-xl bg-slate-100/50 p-4 dark:bg-slate-900/40 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Important Equivalency & Result-Awaiting Guidelines</h4>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
            <div>
              <h5 className="font-bold text-slate-750 dark:text-slate-350">Result-Awaiting Candidates:</h5>
              <p className="mt-1">{eligibilityData.undergraduate.result_awaiting_policy.fsc_students}</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-750 dark:text-slate-350">O/A-Levels Equivalence:</h5>
              <p className="mt-1">{eligibilityData.equivalence_requirements.o_level_a_level}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onAskQuestion("What is the eligibility criteria for result awaiting F.Sc and A-Level students at COMSATS?", 'Eligibility')}
          className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span>Ask Admission AI about eligibility policies</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // --- 4. RENDER PREREQUISITES ---
  const renderPrerequisites = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="h-5.5 w-5.5 text-purple-500" />
            Program Prerequisites
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Determine which intermediate backgrounds (ICS, Pre-Medical, Pre-Engineering, DAE) qualify you for specific BS degrees.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prerequisitesData.program_pathways.map((path, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-slate-850 dark:bg-slate-900/30"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-2 dark:border-slate-800">
                {path.program}
              </h3>
              <div className="mt-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Eligible Backgrounds:</span>
                <div className="flex flex-col gap-1.5 mt-1">
                  {path.eligible_backgrounds.map((bg, bgIdx) => (
                    <div key={bgIdx} className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span>{bg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Background Policies */}
        <div className="rounded-xl bg-slate-100/50 p-4 dark:bg-slate-900/40 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed text-slate-500 dark:text-slate-450">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-300">DAE Diploma Holders Policy:</h4>
            <p className="mt-1">{prerequisitesData.dae_policy.open_merit}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-300">Pre-Medical with Additional Maths:</h4>
            <p className="mt-1">{prerequisitesData.pre_medical_additional_maths.policy}</p>
          </div>
        </div>

        {/* ── MS Prerequisites ── */}
        {prerequisitesData.ms_prerequisites && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">MS Graduate Program Prerequisites</h3>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                16-year Degree Required
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {prerequisitesData.ms_prerequisites.map((ms, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-150 bg-white dark:border-slate-800 dark:bg-slate-900/40 p-4 space-y-2.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px] border-b border-slate-100 dark:border-slate-800 pb-2">
                    {ms.program}
                  </h4>
                  <div className="text-[11px] space-y-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">Required Prior Degree</span>
                      <span className="text-slate-600 dark:text-slate-350 leading-relaxed">{ms.required_degree}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 px-2.5 py-1.5 flex-1">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Min CGPA</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300 font-mono">{ms.min_cgpa.split(' ')[0]}</div>
                      </div>
                      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-2.5 py-1.5 flex-1">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-500 mb-0.5">GAT Category</div>
                        <div className="font-bold text-indigo-700 dark:text-indigo-400 text-[10px]">{ms.gat_category}</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 px-2.5 py-1.5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5">Entry Test Passing</div>
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 text-[10px]">{ms.entry_test_passing}</div>
                    </div>
                    {ms.interdisciplinary && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 italic leading-relaxed">
                        ℹ {ms.interdisciplinary}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PhD Prerequisites ── */}
        {prerequisitesData.phd_prerequisites && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">PhD Program Prerequisites</h3>
              <span className="rounded-full bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 px-2 py-0.5 text-[9px] font-bold text-violet-600 dark:text-violet-400">
                18-year Degree + Thesis Required
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {prerequisitesData.phd_prerequisites.map((phd, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-150 bg-white dark:border-slate-800 dark:bg-slate-900/40 p-4 space-y-2.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px] border-b border-slate-100 dark:border-slate-800 pb-2">
                    {phd.program}
                  </h4>
                  <div className="text-[11px] space-y-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">Required Prior Degree</span>
                      <span className="text-slate-600 dark:text-slate-350 leading-relaxed">{phd.required_degree}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 px-2.5 py-1.5 flex-1">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Min CGPA</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300 font-mono">{phd.min_cgpa.split(' ')[0]}</div>
                      </div>
                      <div className="rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 px-2.5 py-1.5 flex-1">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-500 mb-0.5">GAT Subject</div>
                        <div className="font-bold text-violet-700 dark:text-violet-400 text-[10px]">{phd.gat_subject}</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 px-2.5 py-1.5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5">Entry Test Passing</div>
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 text-[10px]">{phd.entry_test_passing}</div>
                    </div>
                    <div className="rounded-lg bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 px-2.5 py-1.5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500 mb-0.5">Interview</div>
                      <div className="font-semibold text-rose-700 dark:text-rose-400 text-[10px]">{phd.interview}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => onAskQuestion("What are the prerequisites and required degrees for MS and PhD programs at COMSATS?", 'Prerequisites')}
          className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span>Ask Admission AI about MS / PhD prerequisites</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };



  // --- 5. RENDER SCHOLARSHIPS ---
  const renderScholarships = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="h-5.5 w-5.5 text-rose-500" />
            Scholarships & Financial Aid
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore academic excellence rewards and need-based financial aid options.
          </p>
        </div>

        {/* Merit Policy card */}
        <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-850 dark:text-slate-150">{scholarshipsData.merit_scholarships.title}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Performance-Based Semester Scholarships</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed text-slate-500 dark:text-slate-450">
            <div>
              <span className="font-bold text-slate-750 dark:text-slate-350">BS Undergraduate Level:</span>
              <p className="mt-1">{scholarshipsData.merit_scholarships.undergraduate_eligibility}</p>
            </div>
            <div>
              <span className="font-bold text-slate-750 dark:text-slate-350">MS & PhD Graduate Levels:</span>
              <p className="mt-1">Graduate students are not eligible for merit-based academic excellence scholarships.</p>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-850 dark:text-slate-500">
            <strong>Scholarship Adjustment Schedule:</strong> {scholarshipsData.merit_scholarships.award_timing}
          </div>
        </div>

        {/* Admission Policy warning */}
        <div className="rounded-xl bg-amber-50/40 border border-amber-100 p-4 dark:bg-amber-950/10 dark:border-amber-950/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            Admission Scholarship Policy Note
          </h4>
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            {scholarshipsData.admission_scholarships.policy}
          </p>
        </div>

        {/* Financial Aid options */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Need-Based Financial Assistance Programs</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {scholarshipsData.financial_aid_options.map((aid, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{aid.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">
                    {aid.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  <strong>Eligibility:</strong> {aid.eligibility}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onAskQuestion("What scholarships are available at COMSATS for BS students and how do I apply?", 'Scholarships')}
          className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span>Ask Admission AI about financial aid and scholarship forms</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // --- 6. RENDER FAQS ---
  const renderFaqs = () => {
    const filtered = faqsData.filter(faq => {
      return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
             faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
             faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="h-5.5 w-5.5 text-blue-500" />
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search our comprehensive, pre-approved FAQ registry compiled from official counselor records.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs by keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400"
          />
        </div>

        {/* Accordions */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-450 dark:text-slate-550">
            No FAQs found matching your search term.
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {filtered.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="rounded-xl border border-slate-150 bg-slate-50/50 overflow-hidden transition-colors hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-900/30"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-4 text-left font-semibold text-slate-800 dark:text-slate-2050 text-sm md:text-base outline-none dark:text-slate-200"
                  >
                    <span className="pr-4">{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-white p-4 text-xs sm:text-sm text-slate-600 leading-relaxed dark:border-slate-850 dark:bg-slate-900 dark:text-slate-350">
                      <p className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Category: {faq.category} • Source: {faq.source}
                      </p>
                      <p className="whitespace-pre-wrap">{faq.answer}</p>
                      <button
                        onClick={() => onAskQuestion(faq.question, 'FAQs')}
                        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Ask Admission AI about this
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // --- EXPLORER ROUTER ---
  switch (category) {
    case 'Programs':
      return renderPrograms();
    case 'Fees':
      return renderFees();
    case 'Eligibility':
      return renderEligibility();
    case 'Prerequisites':
      return renderPrerequisites();
    case 'Scholarships':
      return renderScholarships();
    case 'FAQs':
      return renderFaqs();
    default:
      return (
        <div className="py-12 text-center text-slate-400">
          No explorer page found for category: {category}
        </div>
      );
  }
}
