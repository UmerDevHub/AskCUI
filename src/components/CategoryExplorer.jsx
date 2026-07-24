import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Bookmark,
  Home,
  Calculator,
  Clipboard,
  TrendingUp,
  Phone,
  Mail,
  Check
} from 'lucide-react';

import programsData from '../data/programs.json';
import feesData from '../data/fees.json';
import eligibilityData from '../data/eligibility.json';
import prerequisitesData from '../data/prerequisites.json';
import scholarshipsData from '../data/scholarships.json';
import faqsData from '../data/faqs.json';
import meritListsData from '../data/merit_lists.json';
import contactData from '../data/contact_info.json';
import howToApplyData from '../data/how_to_apply.json';

export default function CategoryExplorer({ category, onAskQuestion }) {
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Merit Calculator State
  const [matricObt, setMatricObt] = useState('');
  const [matricTot, setMatricTot] = useState('1100');
  const [interObt, setInterObt] = useState('');
  const [interTot, setInterTot] = useState('1100');
  const [natScore, setNatScore] = useState('');

  // 180ms local skeleton load effect on category switch
  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => setIsLocalLoading(false), 180);
    return () => clearTimeout(timer);
  }, [category]);

  const calculateAggregate = () => {
    const mObt = parseFloat(matricObt);
    const mTot = parseFloat(matricTot);
    const iObt = parseFloat(interObt);
    const iTot = parseFloat(interTot);
    const nScore = parseFloat(natScore);

    if (
      isNaN(mObt) || isNaN(mTot) || mTot <= 0 ||
      isNaN(iObt) || isNaN(iTot) || iTot <= 0 ||
      isNaN(nScore) || nScore < 0 || nScore > 100
    ) {
      return null;
    }

    const matricContribution = (mObt / mTot) * 10;
    const interContribution = (iObt / iTot) * 40;
    const natContribution = (nScore / 100) * 50;

    return (matricContribution + interContribution + natContribution).toFixed(3);
  };

  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // --- SKELETON LOADER CONTAINER ---
  const renderSkeleton = () => {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-premium rounded-xl p-5 bg-white dark:bg-[#121824] space-y-3">
              <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- 1. PROGRAMS ---
  const renderPrograms = () => {
    const levels = ['Undergraduate', 'Graduate', 'PhD'];
    const filtered = programsData.filter(p => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || 
             p.abbreviation.toLowerCase().includes(q) || 
             p.category.toLowerCase().includes(q);
    });

    const grouped = levels.reduce((acc, lv) => {
      acc[lv] = filtered.filter(p => p.level === lv);
      return acc;
    }, {});

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#C9A84C]" />
            Degree Programs Offered
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Find details on standard academic paths available at CUI Wah Campus.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] py-2.5 pl-10 pr-4 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
          />
        </div>

        {/* Grouped Lists */}
        {levels.map(lv => {
          const list = grouped[lv] || [];
          if (list.length === 0) return null;

          return (
            <div key={lv} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] dark:text-[#C9A84C] border-b border-premium pb-1">
                {lv} Degrees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map(p => (
                  <div key={p.abbreviation} className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">{p.category}</span>
                        <span className="text-[10px] font-mono font-bold text-[#C9A84C]">{p.duration_years} Years</span>
                      </div>
                      <h4 className="font-serif font-bold text-[#0F1E36] dark:text-white text-sm mt-1.5 leading-snug">
                        {p.name} ({p.abbreviation})
                      </h4>
                      <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {p.description || `Prepare for success in professional fields with our premium accredited ${p.name} curriculum.`}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Credit Hours:</span>
                          <span className="font-mono text-slate-700 dark:text-slate-350">{p.credit_hours} CH</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onAskQuestion(`What are the program details, credit hours, and scope for ${p.name} at CUI Wah?`, 'Programs')}
                      className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer target-min-size"
                    >
                      Ask Program Scope
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // --- 2. FEES ---
  const renderFees = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#C9A84C]" />
            Fee Structures
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Tuition rates, admission security deposits, and official refund timelines.
          </p>
        </div>

        {/* Stacked Fee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {feesData.structures.map((s, idx) => (
            <div key={idx} className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest block mb-1">Fee Category</span>
                <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white leading-snug">
                  {s.category}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-normal">
                  Programs: {s.programs_included.join(', ')}
                </p>

                <div className="mt-4 space-y-2 text-[11px] pt-3 border-t border-slate-100 dark:border-slate-850">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Admission Fee:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">Rs. {s.admission_fee?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Registration Fee:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">Rs. {s.registration_fee?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Tuition (per sem):</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">Rs. {s.tuition_fee_per_semester?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Total at Admission:</span>
                    <span className="font-mono font-bold text-[#C9A84C]">Rs. {s.total_at_admission?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAskQuestion(`What is the complete semester fee structure, total admission dues, and subsequent semester fees for ${s.category}?`, 'Fees')}
                className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer target-min-size"
              >
                Ask Fee Details
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Refund Policies */}
        <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm">
          <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-[#C9A84C]" />
            Official Fee Refund Schedule
          </h3>
          <div className="space-y-3">
            {feesData.refund_policy.table.map((ref, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                <span className="font-bold text-slate-750 dark:text-slate-300">{ref.refund_percentage} Refund</span>
                <span className="font-mono text-slate-500 dark:text-slate-450">{ref.timeline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- 3. ELIGIBILITY ---
  const renderEligibility = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#C9A84C]" />
            Eligibility Criteria
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Minimum grades and standardized entry test cutoffs required for admission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {['computing_programs', 'engineering_programs', 'other_programs'].map(grp => {
            const data = eligibilityData.undergraduate[grp];
            if (!data) return null;

            return (
              <div key={grp} className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[32px] font-serif font-black text-[#C9A84C] leading-none block">{data.min_percentage}%</span>
                  <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white capitalize mt-2">
                    {grp.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {data.detailed_criteria}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Test Requirement:</div>
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg leading-normal">
                    {data.entry_test_requirement}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 4. HOSTEL & TRANSPORT ---
  const renderHostel = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <Home className="h-5 w-5 text-[#C9A84C]" />
            Hostel & Transport Dues
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            All details on student accommodation availability, semester prices, and campus shuttle routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Accommodation */}
          <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Accommodation</span>
              <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white mt-1">CUI Wah Hostels</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Hostels are allocated strictly on a <strong>First-Come, First-Served</strong> basis due to limited student quotas.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Semester Dues:</span>
                  <span className="font-mono font-bold text-[#C9A84C]">Rs. 55,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Refundable Security:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-350">Rs. 2,000</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskQuestion("What are the facilities, charges, rules and policies for CUI Wah hostels?", 'Hostel & Transport')}
              className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer target-min-size"
            >
              Ask Hostel Policy
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Transport */}
          <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Shuttle Service</span>
              <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white mt-1">Bus Transit Routes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Comfortable transit coverage for twin cities: Rawalpindi, Islamabad, Attock, and local areas.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Semester Dues:</span>
                  <span className="font-mono font-bold text-[#C9A84C]">Rs. 35,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Twin City Routes:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-350">Islamabad, Rawalpindi, Attock</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskQuestion("What are the shuttle schedules and route stops for Islamabad & Rawalpindi?", 'Hostel & Transport')}
              className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer target-min-size"
            >
              Ask Bus Routes
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- 5. MERIT CALCULATOR ---
  const renderCalculator = () => {
    const aggregate = calculateAggregate();

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#C9A84C]" />
            Merit Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Compute your aggregate score based on the official CUI weighting formula: <strong>10% Matric, 40% Intermediate, 50% NTS NAT / Entry Test</strong>.
          </p>
        </div>

        <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Matric Marks */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider block">Matric Marks (Obtained)</label>
              <input
                type="number"
                placeholder="e.g. 950"
                value={matricObt}
                onChange={(e) => setMatricObt(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              />
            </div>

            {/* Intermediate Marks */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider block">Inter Marks (Obtained)</label>
              <input
                type="number"
                placeholder="e.g. 880"
                value={interObt}
                onChange={(e) => setInterObt(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              />
            </div>

            {/* NAT / CUI Entry Test Score */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider block">NAT / Entry Test Score</label>
              <input
                type="number"
                placeholder="e.g. 78"
                value={natScore}
                onChange={(e) => setNatScore(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151D2A] px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              />
            </div>

          </div>

          {/* Results display */}
          {aggregate !== null ? (
            <div className="bg-[#1E3A5F]/5 dark:bg-[#C9A84C]/5 border border-[#C9A84C]/25 rounded-xl p-4 text-center mt-6">
              <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest block">Your Computed Aggregate</span>
              <span className="text-3xl font-serif font-black text-[#0F1E36] dark:text-white block mt-1">{aggregate}%</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                This score can be compared against closing merit trends in the Merit Lists category.
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-center text-xs text-slate-450 dark:text-slate-500">
              Enter all scores above to compute your aggregate percentage.
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- 6. MERIT LISTS ---
  const renderMeritLists = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
            Closing Merit Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Historical cutoff percentage tables from 2022 to 2025 across departments.
          </p>
        </div>

        <div className="space-y-5">
          {meritListsData.departments.map(dept => (
            <div key={dept.name} className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm">
              <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white mb-3">
                {dept.name}
              </h3>
              
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left border-collapse" aria-label={`Closing merit stats for ${dept.name}`}>
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                      <th className="py-2 pr-4 font-bold">Program</th>
                      <th className="py-2 px-4 font-bold text-right">2025</th>
                      <th className="py-2 px-4 font-bold text-right">2024</th>
                      <th className="py-2 pl-4 font-bold text-right">2023</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dept.programs.map(prg => (
                      <tr key={prg.name} className="border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-2.5 pr-4 font-bold text-slate-700 dark:text-slate-350">{prg.name}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-[#0F1E36] dark:text-white text-right">{prg.closing_merits["2025"] ? prg.closing_merits["2025"] + '%' : 'N/A'}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400 text-right">{prg.closing_merits["2024"] ? prg.closing_merits["2024"] + '%' : 'N/A'}</td>
                        <td className="py-2.5 pl-4 font-mono text-slate-600 dark:text-slate-400 text-right">{prg.closing_merits["2023"] ? prg.closing_merits["2023"] + '%' : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => onAskQuestion(`What are the closing merit cuts, aggregate trends and chances for admission in ${dept.name}?`, 'Merit Lists')}
                className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer target-min-size"
              >
                Query Closing Merit Trends
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- 7. HOW TO APPLY ---
  const renderHowToApply = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-[#C9A84C]" />
            Application Process
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Step-by-step checklist to guide your admission submission at CUI Wah.
          </p>
        </div>

        <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm space-y-4">
          <div className="space-y-3">
            {howToApplyData.steps.map((st, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F]/5 dark:bg-slate-800 font-mono font-bold text-xs text-[#C9A84C]">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#0F1E36] dark:text-white leading-normal">{st.title}</h4>
                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- 8. PREREQUISITES ---
  const renderPrerequisites = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#C9A84C]" />
            Academic Prerequisites
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Specific academic requirements, subjects, and prerequisites for engineering and computing programs.
          </p>
        </div>

        <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm space-y-4">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white">Pre-Medical to CS Policy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {prerequisitesData.pre_medical_policy.summary}
            </p>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-premium mt-3 text-[11px] text-slate-600 dark:text-slate-400">
              <strong>Deficiency Policy:</strong> {prerequisitesData.pre_medical_policy.deficiency_courses}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 9. SCHOLARSHIPS ---
  const renderScholarships = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-[#C9A84C]" />
            Scholarships & Financial Aid
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Need-based and merit-based tuition relief programs offered by CUI, HEC, and external donor agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scholarshipsData.financial_aid_options.map((s, idx) => (
            <div key={idx} className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest block mb-1">
                  Offered by: {s.offered_by}
                </span>
                <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white">{s.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {s.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Coverage:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{s.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Eligibility:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350 line-clamp-1">{s.eligibility}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAskQuestion(`How do I apply for the ${s.name} scholarship at CUI Wah and what are the requirements?`, 'Scholarships')}
                className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer target-min-size"
              >
                Ask Application Method
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- 10. FAQS (ACCORDION) ---
  const renderFaqs = () => {
    const filtered = faqsData.filter(faq => {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || 
             faq.answer.toLowerCase().includes(q) ||
             faq.category.toLowerCase().includes(q);
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#C9A84C]" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Instant official answers to admissions, hostels, and academic calendar queries.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] py-2.5 pl-10 pr-4 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
          />
        </div>

        <div className="space-y-3">
          {filtered.map(faq => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="border border-premium rounded-xl bg-white dark:bg-[#111724] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="flex w-full items-center justify-between p-4 text-left font-bold text-[#0F1E36] dark:text-white text-xs sm:text-sm outline-none cursor-pointer"
                >
                  <span className="pr-4 leading-snug">{faq.question}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800">
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                    >
                      <div className="border-t border-slate-100 dark:border-slate-850 p-4 text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-[#090F1B]/50">
                        <div className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mb-2">
                          Topic: {faq.category} • Official Source
                        </div>
                        <p className="whitespace-pre-line">{faq.answer}</p>
                        
                        <button
                          onClick={() => onAskQuestion(faq.question, 'FAQs')}
                          className="mt-3.5 text-xs font-bold text-[#C9A84C] hover:underline flex items-center gap-1.5 cursor-pointer"
                        >
                          Ask AI about this topic
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 11. CONTACT INFO ---
  const renderContactInfo = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#C9A84C]" />
            Official Campus Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Verified direct lines, department emails, and administrative desk channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Core Exchange */}
          <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white">General & Admissions Desk</h3>
            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Main Exchange:</span>
                <span className="font-mono text-slate-800 dark:text-slate-100">{contactData.phone_exchange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Alternative:</span>
                <span className="font-mono text-slate-800 dark:text-slate-100">{contactData.phone_alternative}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Email routing:</span>
                <span className="font-mono text-slate-800 dark:text-slate-100">{contactData.email_general}</span>
              </div>
            </div>
          </div>

          {/* Department Directories */}
          <div className="border border-premium rounded-xl p-5 bg-white dark:bg-[#111724] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#0F1E36] dark:text-white">Department Email Directory</h3>
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 max-h-[140px] overflow-y-auto pr-1">
              {Object.entries(contactData.departments).map(([name, email]) => (
                <div key={name} className="flex justify-between py-1 border-b border-slate-100/50 dark:border-slate-850 last:border-0">
                  <span className="font-bold text-slate-650 dark:text-slate-400">{name}</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- DISPATCH ROUTING ---
  const renderContent = () => {
    switch (category) {
      case 'Programs': return renderPrograms();
      case 'Fees': return renderFees();
      case 'Hostel & Transport': return renderHostel();
      case 'Eligibility': return renderEligibility();
      case 'Merit Calculator': return renderCalculator();
      case 'Merit Lists': return renderMeritLists();
      case 'How to Apply': return renderHowToApply();
      case 'Prerequisites': return renderPrerequisites();
      case 'Scholarships': return renderScholarships();
      case 'FAQs': return renderFaqs();
      case 'Contact Info': return renderContactInfo();
      default: return renderPrograms();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 overflow-y-auto h-full scroll-touch">
      <AnimatePresence mode="wait">
        {isLocalLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {renderSkeleton()}
          </motion.div>
        ) : (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
