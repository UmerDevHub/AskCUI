import React, { useState } from 'react';
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
  Info,
  Clock,
  ArrowUpRight,
  Bookmark,
  Home,
  Truck,
  Calculator,
  Clipboard,
  ExternalLink,
  Check,
  AlertCircle,
  Mail
} from 'lucide-react';

import programsData from '../data/programs.json';
import feesData from '../data/fees.json';
import eligibilityData from '../data/eligibility.json';
import prerequisitesData from '../data/prerequisites.json';
import scholarshipsData from '../data/scholarships.json';
import faqsData from '../data/faqs.json';
import meritListsData from '../data/merit_lists.json';
import contactData from '../data/contact_info.json';
import announcementsData from '../data/announcements.json';
import policiesData from '../data/policies.json';
import howToApplyData from '../data/how_to_apply.json';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 350, damping: 25 } 
  }
};

export default function CategoryExplorer({ category, onAskQuestion }) {
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Merit Calculator State
  const [matricObt, setMatricObt] = useState('');
  const [matricTot, setMatricTot] = useState('1100');
  const [interObt, setInterObt] = useState('');
  const [interTot, setInterTot] = useState('1100');
  const [natScore, setNatScore] = useState('');

  // Application Steps State
  const [completedSteps, setCompletedSteps] = useState({});
  const toggleStep = (step) => {
    setCompletedSteps(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  const calculateAggregate = () => {
    const matricObtNum = parseFloat(matricObt);
    const matricTotNum = parseFloat(matricTot);
    const interObtNum = parseFloat(interObt);
    const interTotNum = parseFloat(interTot);
    const natScoreNum = parseFloat(natScore);

    if (
      isNaN(matricObtNum) || isNaN(matricTotNum) || matricTotNum <= 0 ||
      isNaN(interObtNum) || isNaN(interTotNum) || interTotNum <= 0 ||
      isNaN(natScoreNum) || natScoreNum < 0 || natScoreNum > 100
    ) {
      return null;
    }

    const matricContribution = (matricObtNum / matricTotNum) * 10;
    const interContribution = (interObtNum / interTotNum) * 40;
    const natContribution = (natScoreNum / 100) * 50;

    return (matricContribution + interContribution + natContribution).toFixed(3);
  };

  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // --- 1. RENDER PROGRAMS ---
  const renderPrograms = () => {
    const levels = ['Undergraduate', 'Graduate', 'PhD'];
    const levelConfig = {
      Undergraduate: { label: 'Undergraduate Programs', sublabel: 'BS / BBA / B.Arch — 4 Year Degrees', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-100 dark:border-indigo-900/30', dot: 'bg-indigo-500' },
      Graduate:      { label: 'Graduate Programs (MS)', sublabel: 'MS / MBA / M.Arch — 2 Year Postgraduate Degrees', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-100 dark:border-violet-900/30', dot: 'bg-violet-500' },
      PhD:           { label: 'PhD Programs', sublabel: 'Doctor of Philosophy — Research Degrees', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-100 dark:border-rose-900/30', dot: 'bg-rose-500' },
    };

    const grouped = levels.reduce((acc, lv) => {
      acc[lv] = programsData.filter(p =>
        p.level === lv &&
        (
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      return acc;
    }, {});

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <BookOpen className="h-5.5 w-5.5" />
              </span>
              Degree Programs Offered
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Undergraduate, graduate, and PhD programs at CUI Wah Campus — click any card to ask the AI.
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs by name, abbreviation, or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-indigo-400"
          />
        </motion.div>

        {/* Grouped Sections */}
        {levels.map(lv => {
          const programs = grouped[lv];
          if (programs.length === 0) return null;
          const cfg = levelConfig[lv];
          return (
            <motion.div key={lv} variants={itemVariants} className="space-y-4">
              {/* Section Heading */}
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                <div>
                  <h3 className={`text-base font-extrabold ${cfg.color}`}>{cfg.label}</h3>
                  <p className="text-[10.5px] text-slate-450 dark:text-slate-500 font-medium">{cfg.sublabel}</p>
                </div>
                <span className={`ml-auto text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                  {programs.length} {programs.length === 1 ? 'Program' : 'Programs'}
                </span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map((p, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -3, transition: { duration: 0.18 } }}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-5 transition-all duration-300 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-[#151a28] dark:hover:border-indigo-900/60"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${cfg.bg} ${cfg.color} ${cfg.border} whitespace-nowrap`}>
                          {p.abbreviation}
                        </span>
                        <span className="text-[11px] font-bold text-slate-455 dark:text-slate-500 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {p.duration}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm leading-snug">
                          {p.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                          {p.category}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    </div>
                    <button
                      onClick={() => onAskQuestion(`What are the details, eligibility, and requirements for ${p.name} (${p.abbreviation})?`, 'Programs')}
                      className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-50 border border-slate-200/50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100/50 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-355 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                    >
                      <span>Ask Admission AI</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Empty search state */}
        {levels.every(lv => grouped[lv].length === 0) && (
          <motion.div variants={itemVariants} className="py-16 text-center text-sm text-slate-450 dark:text-slate-500">
            No programs match your search. Try another keyword.
          </motion.div>
        )}
      </motion.div>
    );
  };


  // --- 2. RENDER FEES ---
  const renderFees = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <DollarSign className="h-5.5 w-5.5" />
            </span>
            Fee Structure - Fall 2026
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official semester structure, registration costs, and admission policies.
          </p>
        </motion.div>

        {/* Fees Table - Desktop View */}
        <motion.div variants={itemVariants} className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151a28] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-4">Program Category</th>
                  <th className="px-5 py-4 text-right">Admission Fee</th>
                  <th className="px-5 py-4 text-right">Registration Fee</th>
                  <th className="px-5 py-4 text-right">Tuition / Sem</th>
                  <th className="px-5 py-4 text-right bg-emerald-50/40 dark:bg-emerald-950/10 font-bold text-slate-700 dark:text-slate-350">Total at Admission</th>
                  <th className="px-5 py-4 text-right">Per Sem Later</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-350">
                {feesData.structures.map((fee, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-slate-800 dark:text-slate-200">{fee.category}</div>
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 max-w-[220px] truncate" title={fee.programs_included.join(', ')}>
                        {fee.programs_included.join(', ')}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-semibold">Rs. {fee.admission_fee.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono font-semibold">Rs. {fee.registration_fee.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono font-semibold">Rs. {fee.tuition_fee_per_semester.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-extrabold font-mono bg-emerald-50/20 dark:bg-emerald-950/5 text-emerald-600 dark:text-emerald-400">Rs. {fee.total_at_admission.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono font-semibold">Rs. {fee.subsequent_semesters.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Fees - Mobile Responsive List View */}
        <motion.div variants={itemVariants} className="block md:hidden space-y-4">
          {feesData.structures.map((fee, idx) => (
            <div 
              key={idx} 
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-3.5"
            >
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-snug">{fee.category}</h4>
                <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 mt-1">{fee.programs_included.join(', ')}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Admission Fee</span>
                  <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">Rs. {fee.admission_fee.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Registration Fee</span>
                  <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">Rs. {fee.registration_fee.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Tuition / Sem</span>
                  <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">Rs. {fee.tuition_fee_per_semester.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Semester later</span>
                  <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">Rs. {fee.subsequent_semesters.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-emerald-50/50 dark:bg-emerald-950/15 p-3 rounded-xl border border-emerald-100 dark:border-emerald-950/25 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex justify-between items-center mt-2.5">
                <span>Total at Admission:</span>
                <span className="font-mono text-sm font-extrabold">Rs. {fee.total_at_admission.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Application Processing & NTS Test Fees */}
        {feesData.policies.application_processing_fee_amount && (
          <motion.div variants={itemVariants} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-[#121622] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Mandatory Application & Entry Test Fees
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-[#161d2d] border border-slate-200/50 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Admission Processing Fee</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Non-Refundable application processing</p>
                </div>
                <div className="text-lg font-black text-slate-850 font-mono dark:text-slate-100 shrink-0">
                  Rs. {feesData.policies.application_processing_fee_amount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-[#161d2d] border border-slate-200/50 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">CUI Wah NTS Test Fee</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Registration fee for CUI NTS exam</p>
                </div>
                <div className="text-lg font-black text-slate-850 font-mono dark:text-slate-100 shrink-0">
                  Rs. {feesData.policies.nts_test_fee_amount.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hostel & Transport Link Cross Reference */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => onAskQuestion("What are the hostel and transport fees and policies?", 'Hostel & Transport')}
          className="cursor-pointer group flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/10 p-5 dark:border-blue-900/40 dark:bg-blue-950/5 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Home className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Looking for Hostel & Transport details?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                CUI Wah offers hostels (first come first served) and transit covers Islamabad, Rawalpindi, and Attock.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all group-hover:translate-x-1 shrink-0 ml-4" />
        </motion.div>

        {/* Note Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm">
            <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Info className="h-4.5 w-4.5 text-emerald-500" />
              General Billing Policies
            </h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed list-none pl-0">
              <li className="flex gap-2 items-start"><span className="text-emerald-500 font-bold">•</span><span>{feesData.policies.payment_timing}</span></li>
              <li className="flex gap-2 items-start"><span className="text-emerald-500 font-bold">•</span><span>{feesData.policies.exclusion_note}</span></li>
              <li className="flex gap-2 items-start"><span className="text-emerald-500 font-bold">•</span><span>{feesData.policies.installments}</span></li>
              <li className="flex gap-2 items-start"><span className="text-emerald-500 font-bold">•</span><span>{feesData.policies.revision_note}</span></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm">
            <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Clock className="h-4.5 w-4.5 text-emerald-500" />
              Admission Refund Deadlines
            </h4>
            <div className="mt-4 space-y-3">
              {feesData.refund_policy.table.map((ref, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-extrabold text-slate-700 dark:text-slate-350">{ref.refund_percentage}</div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">{ref.timeline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Refund Policy detailed note */}
        <motion.div variants={itemVariants} className="rounded-2xl bg-slate-50 border border-slate-200/50 p-5 dark:bg-[#111520] dark:border-slate-800/80">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-500" />
            Refund Notes & Terms
          </h4>
          <ul className="mt-3.5 space-y-2 text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 leading-relaxed">
            {feesData.refund_policy.notes.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion("What is the fee structure for BS Computer Science and the refund policy at COMSATS?", 'Fees')}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-5 py-4 text-sm font-bold text-white transition-all shadow-md hover:shadow-lg dark:from-emerald-600 dark:to-teal-700"
        >
          <span>Have questions about fees? Ask Admission AI</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  };

  // --- 3. RENDER ELIGIBILITY ---
  const renderEligibility = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <CheckCircle className="h-5.5 w-5.5" />
            </span>
            Admission Eligibility Criteria
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Check the required percentages and entry test benchmarks for academic levels.
          </p>
        </motion.div>

        {/* Undergraduate grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Undergraduate Degree Programs
          </h3>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="text-3xl font-black text-amber-600 dark:text-amber-450 font-mono">
                  {eligibilityData.undergraduate.computing_programs.min_percentage}%
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Computing Programs</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {eligibilityData.undergraduate.computing_programs.detailed_criteria}
                </p>
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/40 dark:bg-amber-950/15 dark:border-amber-900/20 text-[10px] font-bold text-amber-800 dark:text-amber-400 flex items-start gap-1.5 leading-normal">
                  <Bookmark className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{eligibilityData.undergraduate.computing_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.computing_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="text-3xl font-black text-orange-600 dark:text-orange-400 font-mono">
                  {eligibilityData.undergraduate.engineering_programs.min_percentage}%
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Engineering Programs</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {eligibilityData.undergraduate.engineering_programs.detailed_criteria}
                </p>
                {eligibilityData.undergraduate.engineering_programs.deficiency_policy && (
                  <div className="text-[10.5px] leading-relaxed font-semibold text-rose-700 dark:text-rose-400 bg-rose-50/55 dark:bg-rose-950/15 p-3 rounded-xl border border-rose-100/40 dark:border-rose-900/20">
                    <strong>Deficiency Note:</strong> {eligibilityData.undergraduate.engineering_programs.deficiency_policy}
                  </div>
                )}
                <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/40 dark:bg-orange-950/15 dark:border-orange-900/20 text-[10px] font-bold text-orange-850 dark:text-orange-4050 dark:text-orange-400 flex items-start gap-1.5 leading-normal">
                  <Bookmark className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{eligibilityData.undergraduate.engineering_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.engineering_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="text-3xl font-black text-amber-600 dark:text-amber-450 font-mono">
                  {eligibilityData.undergraduate.other_programs.min_percentage}%
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Management & Humanities</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {eligibilityData.undergraduate.other_programs.detailed_criteria}
                </p>
                <div className="text-[10.5px] leading-relaxed font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/55 dark:bg-emerald-950/15 p-3 rounded-xl border border-emerald-100/45 dark:border-emerald-900/20">
                  <strong>Accreditation:</strong> {eligibilityData.undergraduate.other_programs.special_accreditations["BS Accounting & Finance"]}
                </div>
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/40 dark:bg-amber-950/15 dark:border-amber-900/20 text-[10px] font-bold text-amber-800 dark:text-amber-400 flex items-start gap-1.5 leading-normal">
                  <Bookmark className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{eligibilityData.undergraduate.other_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.other_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {eligibilityData.undergraduate.nat_categories && (
          <motion.div variants={itemVariants} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-[#121622] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              CUI NAT Undergraduate Test Categories
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(eligibilityData.undergraduate.nat_categories).map(([catName, catDetail]) => (
                <div 
                  key={catName} 
                  className="rounded-xl bg-white p-4 shadow-sm dark:bg-[#161d2d] border border-slate-200/50 dark:border-slate-800/80 flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">{catName}</span>
                      <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/20">
                        {catDetail.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-50500 dark:text-slate-400 leading-relaxed">
                      {catDetail.description}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">Subject Format:</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-slate-50 dark:bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 block">
                      {catDetail.test_distribution}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Graduate & PhD criteria */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Master of Science (MS) Admissions</h4>
            <p className="text-xs text-slate-550 dark:text-slate-4050 dark:text-slate-400 leading-relaxed">
              {eligibilityData.graduate_ms.detailed_criteria}
            </p>
            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 dark:bg-indigo-950/15 dark:border-indigo-900/20 text-xs font-bold text-indigo-700 dark:text-indigo-400 leading-normal">
              <strong>Entry Test:</strong> {eligibilityData.graduate_ms.entry_test_requirement}
            </div>
            <div className="space-y-2.5 text-xs leading-relaxed text-slate-550 dark:text-slate-400 pt-2">
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-bold">Min CGPA</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-extrabold">{eligibilityData.graduate_ms.min_cgpa}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-bold">Min Percentage</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-extrabold">{eligibilityData.graduate_ms.min_percentage}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-bold">Prior Education</span>
                <span className="text-slate-700 dark:text-slate-300 text-right max-w-[60%]">{eligibilityData.graduate_ms.degree_requirement}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-red-500">Academic Division Rule</span>
                <span className="font-extrabold text-red-650 dark:text-red-400">{eligibilityData.graduate_ms.division_rule}</span>
              </div>
            </div>
            {eligibilityData.graduate_ms.gat_categories && (
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">GAT General Categories:</span>
                <div className="space-y-2">
                  {Object.entries(eligibilityData.graduate_ms.gat_categories).map(([catName, catDetail]) => (
                    <div key={catName} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{catName}: {catDetail.title}</span>
                        <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md dark:text-indigo-400">{catDetail.test_distribution}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{catDetail.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm flex flex-col gap-4">
            <div>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Doctor of Philosophy (PhD) Admissions</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mt-1">
                {eligibilityData.graduate_phd.detailed_criteria}
              </p>
            </div>

            <div className="space-y-2.5 text-xs leading-relaxed text-slate-550 dark:text-slate-400">
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-bold">Min CGPA</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-extrabold">{eligibilityData.graduate_phd.min_cgpa}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-bold">Min Percentage</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-extrabold">{eligibilityData.graduate_phd.min_percentage}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-bold">Prior Degree Required</span>
                <span className="text-slate-700 dark:text-slate-300 text-right max-w-[65%]">{eligibilityData.graduate_phd.degree_requirement}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-red-500">Academic History Restriction</span>
                <span className="font-extrabold text-red-650 dark:text-red-400">{eligibilityData.graduate_phd.division_rule}</span>
              </div>
            </div>

            {eligibilityData.graduate_phd.gat_subject_test && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Required Entry Test
                  </span>
                  <span className="rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 px-2.5 py-0.5 text-[9px] font-extrabold text-amber-700 dark:text-amber-400">
                    Mandatory
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-[#111520] border border-slate-200/50 dark:border-slate-800/80 p-4 space-y-3.5 text-[11px] max-h-[220px] overflow-y-auto pr-1">
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                    {eligibilityData.graduate_phd.gat_subject_test.test_name}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {eligibilityData.graduate_phd.gat_subject_test.purpose}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200/40 dark:border-slate-800">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Format</div>
                      <div className="font-bold text-slate-700 dark:text-slate-300">{eligibilityData.graduate_phd.gat_subject_test.format}</div>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200/40 dark:border-slate-800">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Validity</div>
                      <div className="font-bold text-slate-700 dark:text-slate-300">{eligibilityData.graduate_phd.gat_subject_test.validity}</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200/40 dark:border-slate-800">
                    <div className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Score Distribution</div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{eligibilityData.graduate_phd.gat_subject_test.score_distribution}</div>
                  </div>

                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/15 p-2.5 border border-emerald-100/50 dark:border-emerald-900/20">
                    <div className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5">Passing Score (NTS / GRE)</div>
                    <div className="font-bold text-emerald-700 dark:text-emerald-450">{eligibilityData.graduate_phd.gat_subject_test.passing_score_nts_gre}</div>
                  </div>

                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/15 p-2.5 border border-amber-100/50 dark:border-amber-900/20">
                    <div className="text-[8.5px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-0.5">CUI Own Test Option</div>
                    <div className="font-bold text-amber-700 dark:text-amber-450">{eligibilityData.graduate_phd.gat_subject_test.passing_score_cui_test}</div>
                  </div>

                  <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/15 p-2.5 border border-indigo-100/50 dark:border-indigo-900/20">
                    <div className="text-[8.5px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-500 mb-0.5">GRE Equivalence</div>
                    <div className="font-bold text-indigo-700 dark:text-indigo-400">{eligibilityData.graduate_phd.gat_subject_test.gre_equivalence}</div>
                  </div>

                  <div className="rounded-lg bg-rose-50 dark:bg-rose-950/15 p-2.5 border border-rose-100/50 dark:border-rose-900/20">
                    <div className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500 mb-0.5">Interview Requirement</div>
                    <div className="font-bold text-rose-700 dark:text-rose-455">{eligibilityData.graduate_phd.gat_subject_test.interview_requirement}</div>
                  </div>
                </div>

                {/* Program → GAT Subject mapping */}
                {eligibilityData.graduate_phd.gat_subject_test.program_subject_mapping && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Program → Required GAT Subject:
                    </span>
                    <div className="space-y-1.5">
                      {Object.entries(eligibilityData.graduate_phd.gat_subject_test.program_subject_mapping).map(([prog, info]) => (
                        <div key={prog} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-3.5 py-2.5">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-3050 dark:text-slate-300">{prog}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400">{info.gat_subject}</span>
                            <span className="text-[8.5px] font-semibold text-slate-400 dark:text-slate-650">({info.gat_type})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Admission Schedule */}
        {eligibilityData.admission_schedule && (
          <motion.div variants={itemVariants} className="rounded-2xl border border-amber-200/50 bg-amber-50/15 p-5 dark:border-amber-900/30 dark:bg-amber-950/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5" />
              Fall 2026 Important Admission Schedule
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-[#161d2d] border border-slate-200/50 dark:border-slate-850">
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Last Date to Apply</div>
                <div className="text-base font-black text-rose-600 dark:text-rose-400 mt-1">
                  {eligibilityData.admission_schedule.last_date_to_apply}
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-[#161d2d] border border-slate-200/50 dark:border-slate-850">
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">NTS Entry Test Dates</div>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1.5 space-y-1.5">
                  {eligibilityData.admission_schedule.nts_test_dates.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{t.test_name}:</span>
                      <span className="text-indigo-650 dark:text-indigo-400 font-mono font-extrabold">{t.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-[#161d2d] border border-slate-200/50 dark:border-slate-850">
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Merit List Display</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-450 mt-1">
                  {eligibilityData.admission_schedule.merit_list_display}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Special Policies */}
        <motion.div variants={itemVariants} className="rounded-2xl bg-slate-50 border border-slate-200/50 p-5 dark:bg-[#111520] dark:border-slate-800/80 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400">Important Equivalency & Result-Awaiting Guidelines</h4>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs text-slate-500 dark:text-slate-4050 dark:text-slate-400 leading-relaxed">
            <div className="space-y-1.5">
              <h5 className="font-extrabold text-slate-800 dark:text-slate-250">Result-Awaiting Candidates:</h5>
              <p>{eligibilityData.undergraduate.result_awaiting_policy.fsc_students}</p>
            </div>
            <div className="space-y-1.5">
              <h5 className="font-extrabold text-slate-800 dark:text-slate-250">O/A-Levels Equivalence:</h5>
              <p>{eligibilityData.equivalence_requirements.o_level_a_level}</p>
            </div>
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion("What is the eligibility criteria for result awaiting F.Sc and A-Level students at COMSATS?", 'Eligibility')}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-5 py-4 text-sm font-bold text-white transition-all shadow-md hover:shadow-lg dark:from-amber-600 dark:to-orange-655"
        >
          <span>Ask Admission AI about eligibility policies</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  };

  // --- 4. RENDER PREREQUISITES ---
  const renderPrerequisites = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <FileText className="h-5.5 w-5.5" />
            </span>
            Program Prerequisites
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review which intermediate pathways (ICS, Pre-Med, Pre-Eng, DAE) are accepted for our degree programs.
          </p>
        </motion.div>

        {/* Pathways Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {prerequisitesData.program_pathways.map((path, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-2.5 dark:border-slate-800 text-sm">
                  {path.program}
                </h3>
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Eligible Backgrounds:</span>
                  <div className="flex flex-col gap-2 mt-1.5">
                    {path.eligible_backgrounds.map((bg, bgIdx) => (
                      <div key={bgIdx} className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                        <span>{bg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Special Background Policies */}
        <motion.div variants={itemVariants} className="rounded-2xl bg-slate-50 border border-slate-200/50 p-5 dark:bg-[#111520] dark:border-slate-800/80 grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs leading-relaxed text-slate-550 dark:text-slate-400">
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-250">DAE Diploma Holders Policy:</h4>
            <p>{prerequisitesData.dae_policy.open_merit}</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-250">Pre-Medical with Additional Maths:</h4>
            <p>{prerequisitesData.pre_medical_additional_maths.policy}</p>
          </div>
        </motion.div>

        {/* MS Prerequisites */}
        {prerequisitesData.ms_prerequisites && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">MS Graduate Program Prerequisites</h3>
              <span className="rounded-full bg-purple-50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/30 px-2.5 py-0.5 text-[9px] font-extrabold text-purple-650 dark:text-purple-400 uppercase tracking-wider">
                16-year Degree
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {prerequisitesData.ms_prerequisites.map((ms, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#151a28] p-5 space-y-4 shadow-sm">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-[13px] border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    {ms.program}
                  </h4>
                  <div className="text-[11px] space-y-3">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Required Prior Degree:</span>
                      <span className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">{ms.required_degree}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-0.5">Min CGPA</div>
                        <div className="font-black text-slate-700 dark:text-slate-300 font-mono text-xs">{ms.min_cgpa.split(' ')[0]}</div>
                      </div>
                      <div className="rounded-xl bg-purple-50 dark:bg-purple-950/15 border border-purple-100 dark:border-purple-900/20 px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400 mb-0.5">GAT Category</div>
                        <div className="font-black text-purple-700 dark:text-purple-400 text-xs">{ms.gat_category}</div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/20 px-3 py-2">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5">Entry Test Passing Score</div>
                      <div className="font-bold text-emerald-700 dark:text-emerald-450 text-[10.5px]">{ms.entry_test_passing}</div>
                    </div>
                    {ms.interdisciplinary && (
                      <div className="text-[10px] text-slate-450 dark:text-slate-500 italic leading-relaxed pt-1">
                        ℹ {ms.interdisciplinary}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PhD Prerequisites */}
        {prerequisitesData.phd_prerequisites && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">PhD Program Prerequisites</h3>
              <span className="rounded-full bg-violet-50 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/30 px-2.5 py-0.5 text-[9px] font-extrabold text-violet-650 dark:text-violet-400 uppercase tracking-wider">
                18-year Degree + Thesis
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {prerequisitesData.phd_prerequisites.map((phd, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#151a28] p-5 space-y-4 shadow-sm">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-[13px] border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    {phd.program}
                  </h4>
                  <div className="text-[11px] space-y-3">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">Required Prior Degree:</span>
                      <span className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">{phd.required_degree}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-0.5">Min CGPA</div>
                        <div className="font-black text-slate-700 dark:text-slate-300 font-mono text-xs">{phd.min_cgpa.split(' ')[0]}</div>
                      </div>
                      <div className="rounded-xl bg-violet-50 dark:bg-violet-950/15 border border-violet-100 dark:border-violet-900/20 px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-400 mb-0.5">GAT Subject</div>
                        <div className="font-black text-violet-700 dark:text-violet-455 text-xs">{phd.gat_subject}</div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/20 px-3 py-2">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5">Entry Test Passing Score</div>
                      <div className="font-bold text-emerald-700 dark:text-emerald-450 text-[10.5px]">{phd.entry_test_passing}</div>
                    </div>
                    <div className="rounded-xl bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/20 px-3 py-2">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-550 mb-0.5">Interview</div>
                      <div className="font-bold text-rose-700 dark:text-rose-455 text-[10.5px]">{phd.interview}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion("What are the prerequisites and required degrees for MS and PhD programs at COMSATS?", 'Prerequisites')}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-605 px-5 py-4 text-sm font-bold text-white transition-all shadow-md hover:shadow-lg dark:from-purple-650 dark:to-fuchsia-700"
        >
          <span>Ask Admission AI about MS / PhD prerequisites</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  };

  // --- 5. RENDER SCHOLARSHIPS ---
  const renderScholarships = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <Award className="h-5.5 w-5.5" />
            </span>
            Scholarships & Financial Aid
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore reward programs for high achievers and financial assistance options.
          </p>
        </motion.div>

        {/* Merit Policy card */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/20">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-850 dark:text-slate-100">{scholarshipsData.merit_scholarships.title}</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">Performance-Based Semester Adjustments</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed text-slate-550 dark:text-slate-400 pt-1">
            <div className="space-y-1">
              <span className="font-extrabold text-slate-850 dark:text-slate-200">BS Undergraduate Level:</span>
              <p>{scholarshipsData.merit_scholarships.undergraduate_eligibility}</p>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-slate-850 dark:text-slate-200">MS & PhD Graduate Levels:</span>
              <p>Graduate students are not eligible for merit-based academic excellence scholarships.</p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-455 dark:border-slate-800 dark:text-slate-500">
            <strong>Scholarship Adjustment Schedule:</strong> {scholarshipsData.merit_scholarships.award_timing}
          </div>
        </motion.div>

        {/* Admission Policy warning */}
        <motion.div variants={itemVariants} className="rounded-2xl bg-amber-50/40 border border-amber-250/20 p-5 dark:bg-amber-950/10 dark:border-amber-950/25">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-850 dark:text-amber-400 flex items-center gap-2">
            <Shield className="h-4.5 w-4.5" />
            Admission Scholarship Policy Note
          </h4>
          <p className="mt-2.5 text-xs text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
            {scholarshipsData.admission_scholarships.policy}
          </p>
        </motion.div>

        {/* Financial Aid options */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Need-Based Assistance Programs
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {scholarshipsData.financial_aid_options.map((aid, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm leading-snug">{aid.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {aid.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-450 dark:text-slate-500 leading-relaxed">
                  <strong>Eligibility:</strong> {aid.eligibility}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion("What scholarships are available at COMSATS for BS students and how do I apply?", 'Scholarships')}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 px-5 py-4 text-sm font-bold text-white transition-all shadow-md hover:shadow-lg dark:from-rose-650 dark:to-pink-700"
        >
          <span>Ask Admission AI about financial aid and scholarship forms</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  };

  // --- 5.5. RENDER HOSTEL & TRANSPORT ---
  const renderHostelAndTransport = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Home className="h-5.5 w-5.5" />
            </span>
            Hostel & Transport Facilities
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official CUI Wah campus facilities, semester fees, seat allocation policy, and routes.
          </p>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Hostel Card */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#151a28] shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-900/60 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-600 uppercase tracking-wider dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100/40 dark:border-blue-900/20 whitespace-nowrap shrink-0">
                  Accommodation
                </span>
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-600 uppercase tracking-wider dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/40 dark:border-amber-900/20 whitespace-nowrap shrink-0">
                  First Come First Served
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
                  On-Campus & Partner Hostels
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5 font-bold uppercase tracking-wider">
                  CUI Wah Campus
                </p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hostel accommodation is allotted strictly on a <strong>First Come First Served</strong> basis due to limited seat capacity. Includes modern mess facilities, high-speed Wi-Fi, electricity backup, and secure boundaries.
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Semester Fee:</span>
                  <span className="font-mono font-extrabold text-slate-850 dark:text-slate-100 text-sm">Rs. 55,000</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Security (Refundable):</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">Rs. 2,000</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskQuestion("How can I apply for CUI Wah hostels and what is the process?", 'Hostel & Transport')}
              className="mt-6 flex w-full items-center justify-between rounded-xl bg-slate-50 border border-slate-200/50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100/50 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-355 dark:hover:bg-blue-955/30 dark:hover:text-blue-400 dark:hover:border-blue-900/30"
            >
              <span>Ask Hostel Policy</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Transport Card */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#151a28] shadow-sm relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-900/60 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/20 whitespace-nowrap shrink-0">
                  Transport
                </span>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/20 whitespace-nowrap shrink-0">
                  Semestral Route
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
                  Transit Services & Fleet
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5 font-bold uppercase tracking-wider">
                  CUI Wah Routes
                </p>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dedicated university fleet covering safe pick-and-drop transit options. Extensive coverage routes:
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {feesData.hostel_and_transport.transport.routes.map((rt, ri) => (
                    <span key={ri} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-extrabold text-slate-600 dark:text-slate-400">
                      {rt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Semester Fee:</span>
                  <span className="font-mono font-extrabold text-slate-850 dark:text-slate-100 text-sm">Rs. 35,000</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Routes Included:</span>
                  <span className="font-semibold text-slate-705 dark:text-slate-350 text-[10.5px]">Islamabad, Rawalpindi, Attock...</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskQuestion("What are the transport routes and stops for Rawalpindi and Attock?", 'Hostel & Transport')}
              className="mt-6 flex w-full items-center justify-between rounded-xl bg-slate-50 border border-slate-200/50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100/50 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-355 dark:hover:bg-emerald-955/30 dark:hover:text-emerald-400 dark:hover:border-emerald-900/30"
            >
              <span>Ask Routes & Schedule</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* FAQs inside this category */}
        <motion.div variants={itemVariants} className="space-y-4 pt-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-455 dark:text-slate-500">
            Hostel & Transport Quick FAQs
          </h3>
          <div className="space-y-3">
            {faqsData.filter(f => f.category === 'Hostel & Transport').map(faq => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className="rounded-xl border border-slate-200/85 bg-white overflow-hidden dark:border-slate-800/80 dark:bg-[#151a28] shadow-sm">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-slate-750 dark:text-slate-250 text-xs md:text-sm outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-slate-100 bg-slate-50/40 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
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
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <HelpCircle className="h-5.5 w-5.5" />
            </span>
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse admissions, hostels, transport, and eligibility FAQs.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs by keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
          />
        </motion.div>

        {/* Accordions */}
        {filtered.length === 0 ? (
          <motion.div variants={itemVariants} className="py-16 text-center text-sm text-slate-450 dark:text-slate-500">
            No FAQs found matching your search term. Try another keyword.
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            className="space-y-3 max-h-[52vh] overflow-y-auto pr-1"
          >
            {filtered.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <motion.div 
                  key={faq.id}
                  variants={itemVariants}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 dark:border-slate-800 dark:bg-[#151a28]"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-4.5 text-left font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base outline-none"
                  >
                    <span className="pr-4 leading-snug">{faq.question}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-450 border border-slate-200/40 dark:border-slate-850">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-550 dark:text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-550 dark:text-slate-400" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t border-slate-100 bg-slate-50/40 p-4.5 text-xs sm:text-sm text-slate-600 leading-relaxed dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-350">
                          <p className="font-extrabold text-[9.5px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                            Category: {faq.category} • Source: {faq.source}
                          </p>
                          <p className="whitespace-pre-wrap">{faq.answer}</p>
                          <button
                            onClick={() => onAskQuestion(faq.question, 'FAQs')}
                            className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Ask Admission AI about this
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // --- 5.6. RENDER MERIT CALCULATOR ---
  const renderMeritCalculator = () => {
    const aggregate = calculateAggregate();

    const programCutoffs = [
      { code: 'BSCS', name: 'BS Computer Science', f24: 80.10, f23: 74.00, est25: '79.5% - 81.0%' },
      { code: 'BSSE', name: 'BS Software Engineering', f24: 77.00, f23: 72.50, est25: '76.5% - 78.5%' },
      { code: 'BSAI', name: 'BS Artificial Intelligence', f24: 80.00, f23: null, est25: '79.0% - 80.5%' },
      { code: 'BSCE', name: 'BS Computer Engineering', f24: 71.20, f23: 66.00, est25: '71.0% - 72.5%' },
      { code: 'BSEE/BSCE', name: 'BS Civil / Electrical Eng.', f24: 60.00, f23: 60.00, est25: '60.0% - 62.0%' }
    ];

    const getStatus = (cutoff, estRange) => {
      if (!aggregate) return { text: 'Awaiting Calculation', color: 'text-slate-400 border-slate-205 bg-slate-50 dark:bg-slate-900/30 dark:border-slate-800' };
      const aggNum = parseFloat(aggregate);
      
      let lowerBound = cutoff;
      if (estRange) {
        const match = estRange.match(/([0-9.]+)/);
        if (match) lowerBound = parseFloat(match[1]);
      }

      if (aggNum >= lowerBound + 1.0) {
        return { text: 'Safe / High Chance', color: 'text-emerald-650 dark:text-emerald-400 border-emerald-100 bg-emerald-50/20 dark:bg-emerald-950/10 dark:border-emerald-900/30' };
      } else if (aggNum >= lowerBound - 1.5) {
        return { text: 'Borderline / Moderate', color: 'text-amber-655 dark:text-amber-400 border-amber-100 bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-900/30' };
      } else {
        return { text: 'Low Chance', color: 'text-rose-655 dark:text-rose-450 border-rose-100 bg-rose-50/20 dark:bg-rose-950/10 dark:border-rose-900/30' };
      }
    };

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
              <Calculator className="h-5.5 w-5.5" />
            </span>
            Admission Merit Calculator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate your aggregate based on the official 10:40:50 weightage formula.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Form Card */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-5"
          >
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-400 dark:text-slate-500 text-[10.5px] uppercase tracking-wider">
                Input Academic Scores
              </h3>

              {/* Matriculation */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-705 dark:text-slate-300">
                  Matric / O-Level Marks (10% Weightage)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Marks Obtained</span>
                    <input
                      type="number"
                      placeholder="e.g. 950"
                      value={matricObt}
                      onChange={(e) => setMatricObt(e.target.value)}
                      className="w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Total Marks</span>
                    <input
                      type="number"
                      placeholder="e.g. 1100"
                      value={matricTot}
                      onChange={(e) => setMatricTot(e.target.value)}
                      className="w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Intermediate */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-750 dark:text-slate-300">
                  Intermediate / F.Sc / ICS Marks (40% Weightage)
                </label>
                <p className="text-[9.5px] text-slate-400 dark:text-slate-500 -mt-1 leading-snug font-medium">
                  *If results are awaited, enter F.Sc Part-1 marks.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Marks Obtained</span>
                    <input
                      type="number"
                      placeholder="e.g. 880"
                      value={interObt}
                      onChange={(e) => setInterObt(e.target.value)}
                      className="w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Total Marks</span>
                    <input
                      type="number"
                      placeholder="e.g. 1100"
                      value={interTot}
                      onChange={(e) => setInterTot(e.target.value)}
                      className="w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Entrance Exam */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-750 dark:text-slate-300">
                  NTS NAT / CUI Entry Test Score (50% Weightage)
                </label>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Test Score (out of 100)</span>
                  <input
                    type="number"
                    placeholder="e.g. 78"
                    value={natScore}
                    onChange={(e) => setNatScore(e.target.value)}
                    className="w-full rounded-xl border border-slate-205 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 mt-4">
              <strong className="text-slate-705 dark:text-slate-300">Official Formula:</strong>
              <div className="font-mono text-[10.5px] bg-white dark:bg-slate-950 p-2 rounded border border-slate-200/50 dark:border-slate-850 overflow-x-auto text-slate-650 dark:text-slate-400">
                Aggregate = (Matric Obt / Total * 10) + (Inter Obt / Total * 40) + (NAT Score * 0.5)
              </div>
            </div>
          </motion.div>

          {/* Results Side Panel */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-5 flex flex-col justify-center items-center rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 dark:border-slate-800 dark:from-[#151a28] dark:to-[#121622] shadow-sm text-center min-h-[300px]"
          >
            {aggregate ? (
              <div className="space-y-5 w-full">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-extrabold text-violet-600 uppercase tracking-wider dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100/40 dark:border-violet-900/20">
                  Your Aggregate
                </span>

                <div className="relative flex items-center justify-center">
                  <div className="text-5xl font-black text-slate-850 dark:text-slate-100 tracking-tight font-mono">
                    {aggregate}%
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 px-2 leading-relaxed">
                  Your calculated admission aggregate is <strong>{aggregate}%</strong>. Compare this with the program cutoff history below.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMatricObt('');
                      setInterObt('');
                      setNatScore('');
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    Reset Calculator
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-700 mx-auto">
                  <Calculator className="h-7 w-7" />
                </div>
                <h3 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">
                  Awaiting Academic Inputs
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed px-4">
                  Please enter your scores on the left to calculate your expected aggregate dynamically.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* 3-Year Merit Trends Table */}
        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-455 dark:text-slate-500 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              CUI Wah Closing Merit History & Chances
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Last 3 Admission Cycles</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151a28] shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-455 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-500">
                  <th className="px-4.5 py-3">Degree Program</th>
                  <th className="px-4 py-3 text-center">Fall 2023</th>
                  <th className="px-4 py-3 text-center">Fall 2024</th>
                  <th className="px-4 py-3 text-center">Fall 2025 (Est)</th>
                  <th className="px-4.5 py-3 text-right">Your Admission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {programCutoffs.map((prog, idx) => {
                  const status = getStatus(prog.f24, prog.est25);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-4.5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{prog.code}</span>
                          <span>{prog.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-medium text-slate-500 dark:text-slate-400">
                        {prog.f23 ? `${prog.f23.toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-350">
                        {prog.f24.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-violet-600 dark:text-violet-400 font-extrabold">
                        {prog.est25}
                      </td>
                      <td className="px-4.5 py-3.5 text-right">
                        <span className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Note Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm">
            <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Info className="h-4.5 w-4.5 text-indigo-500" />
              Computing Merit Spike Note
            </h4>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              In 2023, the BSCS merit closed at <strong>74.0%</strong>. However, due to a massive surge in candidates, the aggregate jumped to <strong>80.1%</strong> in 2024. Plan your NTS prep target accordingly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm">
            <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Clock className="h-4.5 w-4.5 text-emerald-500" />
              Spring Admission Intake Advantage
            </h4>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              If your current aggregate falls short of the Fall cutoffs by 1% to 2%, consider applying for the **Spring Session** intake. It typically has slightly lower merit cutoffs due to lower applicant volume.
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // --- 5.7. RENDER HOW TO APPLY ---
  const renderHowToApply = () => {
    const steps = [
      { name: 'Instructions', desc: 'Read and accept the portal terms and conditions.' },
      { name: 'Personal Details', desc: 'Enter name, CNIC/B-Form, guardian info, and gender.' },
      { name: 'Address Details', desc: 'Provide permanent and mailing addresses with contact numbers.' },
      { name: 'Photo Upload', desc: 'Upload one passport-size photo with a clear background.' },
      { name: 'Education Details', desc: 'Provide Matric/O-Level, Intermediate/A-Level, or DAE scores.' },
      { name: 'NTS Details', desc: 'Enter NTS NAT score details (valid for 1 year) or register for institutional NAT.' },
      { name: 'Program Choices', desc: 'Select your preferred degree programs in order of priority.' },
      { name: 'Labour Quota', desc: 'Upload documents if applying under the workers children quota.' },
      { name: 'Other Details', desc: 'Mention academic achievements, co-curriculars, or extra info.' },
      { name: 'Documents Upload', desc: 'Upload scanned copies of required academic transcripts.' },
      { name: 'Confirm Fee', desc: 'Print challan, deposit fee in bank, and upload paid copy.' },
      { name: 'Submit Application', desc: 'Finalize and submit your online form for verification.' }
    ];

    const requiredDocs = [
      { label: 'Passport-Size Photograph', detail: '1 copy with a clean blue/white background.' },
      { label: 'Matric / O-Level Transcript', detail: 'Matric marks sheet or O-Level Equivalence from IBCC.' },
      { label: 'Intermediate Part-1 Marks Sheet', detail: 'Required if applying as a result-awaited candidate.' },
      { label: 'A-Level Marksheet / Equivalency', detail: 'O-Level equivalence or A-Level transcripts if results are declared.' },
      { label: 'Part-2 Roll Number Slip', detail: 'Only needed if F.Sc Part-2 complete result is awaited.' },
      { label: 'NTS NAT Result Card', detail: 'Must be valid (taken within one year of applying).' }
    ];

    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    const progressPercent = Math.round((completedCount / steps.length) * 100);

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        {/* Top Hero and Portal Link */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-650 to-indigo-750 p-6 md:p-8 text-white shadow-md dark:border-blue-900/40">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          <div className="relative space-y-4">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">
              Official Admissions Portal
            </span>
            <div className="max-w-xl space-y-2">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                CUI Online Application Guide
              </h2>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                The entire admission process is completely online. You do not need to visit the campus to submit your application form. Apply directly through the portal linked below:
              </p>
            </div>
            
            <div className="pt-2">
              <a
                href="https://admissions.comsats.edu.pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs md:text-sm font-extrabold text-blue-700 shadow-sm transition-all hover:bg-slate-50"
              >
                Go to admissions.comsats.edu.pk
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Timeline of Steps */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-7 rounded-2xl border border-slate-205 bg-white p-6 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                  Application Checklist & Steps
                </h3>
                <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-0.5">
                  Click on steps to track your progress interactively
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                  {completedCount}/{steps.length} Done ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-650 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Steps List */}
            <div className="space-y-3 pt-2">
              {steps.map((step, idx) => {
                const isDone = !!completedSteps[step.name];
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleStep(step.name)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isDone
                        ? 'border-emerald-100 bg-emerald-50/20 dark:border-emerald-950/20 dark:bg-emerald-950/5'
                        : 'border-slate-150/60 bg-slate-50/30 hover:bg-slate-50/80 dark:border-slate-850 dark:bg-slate-900/10 dark:hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-white">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 text-slate-350 dark:text-slate-650 text-[10px] font-bold">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className={`text-xs font-bold ${isDone ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-850 dark:text-slate-205'}`}>
                        {step.name}
                      </h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Panel: Required Docs & Fee Structure */}
          <div className="lg:col-span-5 space-y-6">
            {/* Required Documents */}
            <motion.div 
              variants={itemVariants} 
              className="rounded-2xl border border-slate-205 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-4"
            >
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400">
                  <FileText className="h-4 w-4" />
                </span>
                Required Documents
              </h3>
              
              <div className="space-y-3">
                {requiredDocs.map((doc, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">{doc.label}</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-snug">{doc.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fee & Payment Details */}
            <motion.div 
              variants={itemVariants} 
              className="rounded-2xl border border-slate-205 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-4"
            >
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450">
                  <DollarSign className="h-4 w-4" />
                </span>
                Fee & Challan Process
              </h3>

              <div className="space-y-3.5 text-xs text-slate-650 dark:text-slate-400">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3.5 border border-slate-150/40 dark:border-slate-800 space-y-1">
                  <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block">Total Admission & Test Fee</span>
                  <div className="text-lg font-black text-slate-850 dark:text-slate-100 font-mono">
                    Rs. 3,300 <span className="text-xs font-normal text-slate-450">(2500 + 800)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-1">
                    Applicable if you are taking the NTS NAT test through COMSATS. 
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">How to Complete Payment:</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-[10.5px] text-slate-500 dark:text-slate-450 pl-1 leading-relaxed">
                    <li>Generate and print the admission challan from the portal.</li>
                    <li>Pay at the designated bank branches.</li>
                    <li>Upload a clear photo/scanned copy of the paid challan back to the portal.</li>
                  </ol>
                </div>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    NTS Score Improvement:
                  </h4>
                  <p className="text-[10.5px] text-slate-550 dark:text-slate-450 leading-relaxed">
                    If you wish to re-appear for NAT to improve your score after registering, you only need to pay an extra **Rs. 800** fee. Paid challan must be emailed to <strong className="text-blue-600 dark:text-blue-400 font-bold">zainab@ciitwah.edu.pk</strong>. Your NTS roll number slip will then be displayed on your portal.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Verification & Objections */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-slate-205 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-4"
        >
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400">
              <Shield className="h-4 w-4" />
            </span>
            Verification & Objection Handling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-550 dark:text-slate-450 leading-relaxed">
            <div className="space-y-2">
              <strong className="text-slate-700 dark:text-slate-350 block">1. Form Verification & Roll No Slip</strong>
              <p>
                Once you submit the online form, CUI Wah Campus admission desk staff will verify all details and documents. If verified successfully, your NTS Roll Number slip will automatically display on the portal.
              </p>
            </div>
            <div className="space-y-2">
              <strong className="text-slate-750 dark:text-slate-350 block flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                2. Handling Objections
              </strong>
              <p>
                If the admission desk finds issues (e.g. incorrect transcripts, low marks, incomplete info), they will raise an objection. You will be notified immediately via **email** and on your **portal dashboard**. You must fix the objection on the portal to keep your application active.
              </p>
            </div>
          </div>
        </motion.div>

        {/* General Portal Instructions */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-slate-205 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-[#121622]/50 shadow-sm space-y-4"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500">
            Important Guidelines & Rules
          </h3>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-[10.5px] text-slate-550 dark:text-slate-450 list-disc list-inside leading-relaxed">
            <li>Form submission is 100% ONLINE; do not visit campus to submit forms.</li>
            <li>All application steps must be completed in order.</li>
            <li>Admission process fee is non-refundable.</li>
            <li>Applications will be rejected instantly in case of false details.</li>
            <li>Candidates with active supplementaries in HSSC Part-I or Part-II are not eligible to apply.</li>
            <li>HSSC improvement candidates cannot apply as result-awaiting; they can only apply using their previous result.</li>
            <li>Result-awaited A-Level candidates are evaluated based on O-Level equivalence scores.</li>
            <li>Result-awaited 3rd-year DAE candidates are evaluated based on a flat 60% intermediate score representation.</li>
          </ul>
        </motion.div>
      </motion.div>
    );
  };

  // --- MERIT LISTS RENDERER ---
  const renderMeritLists = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-full">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
            <Info className="h-5 w-5" />
          </span>
          Historical Closing Merit Lists
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Official closing merit percentages per program. Formula: Matric 10% + FSc 40% + NAT 50%.
        </p>
      </motion.div>

      {meritListsData.programs.map((prog, idx) => {
        const latest = prog.merit_history[prog.merit_history.length - 1];
        const oldest = prog.merit_history[0];
        const change = (latest.closing_merit - oldest.closing_merit).toFixed(2);
        return (
          <motion.div key={idx} variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#151a28] shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100">{prog.program}</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{prog.category} · {prog.department}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">{latest.closing_merit}%</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{latest.session}</div>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${ parseFloat(change) > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' }`}>
                  {parseFloat(change) > 0 ? '↑' : '↓'} {Math.abs(change)}% since {oldest.session}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left px-2 py-2 font-bold text-slate-500 dark:text-slate-400">Session</th>
                    <th className="text-right px-2 py-2 font-bold text-slate-500 dark:text-slate-400">Closing Merit</th>
                    <th className="text-right px-2 py-2 font-bold text-slate-500 dark:text-slate-400">Seats</th>
                    <th className="text-right px-2 py-2 font-bold text-slate-500 dark:text-slate-400">Round</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {[...prog.merit_history].reverse().map((h, hi) => (
                    <tr key={hi} className={hi === 0 ? 'bg-cyan-50/30 dark:bg-cyan-950/10' : ''}>
                      <td className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-300">{h.session}</td>
                      <td className="px-2 py-2 text-right font-mono font-extrabold text-cyan-700 dark:text-cyan-400">{h.closing_merit}%</td>
                      <td className="px-2 py-2 text-right text-slate-500 dark:text-slate-400">{h.seats}</td>
                      <td className="px-2 py-2 text-right text-slate-400 dark:text-slate-500">{h.round}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-relaxed">{prog.trend_note}</p>
            <button
              onClick={() => onAskQuestion(`What is the merit trend and my admission chances for ${prog.program}?`, 'Merit Lists')}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 border border-slate-200/50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-100 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-cyan-950/20 dark:hover:text-cyan-400 transition-all"
            >
              <span>Ask AI about {prog.abbreviation} merit trends</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        );
      })}

      <motion.div variants={itemVariants} className="rounded-2xl bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 p-4 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
        {meritListsData.general_notes.map((n, i) => <p key={i} className="mb-1">• {n}</p>)}
      </motion.div>
    </motion.div>
  );

  // --- CONTACT INFO RENDERER ---
  const renderContactInfo = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-full">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <Mail className="h-5 w-5" />
          </span>
          Contact Information
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CUI Wah Campus contact details for admissions, departments, and student services.</p>
      </motion.div>

      {/* Admissions Office */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-teal-200/60 bg-teal-50/20 dark:border-teal-900/40 dark:bg-teal-950/10 p-5 space-y-3">
        <h3 className="font-extrabold text-teal-700 dark:text-teal-400 text-sm">📞 Admissions Office</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[['Phone', contactData.admissions_office.phone], ['Alt Phone', contactData.admissions_office.phone_alt], ['Email', contactData.admissions_office.email], ['NTS Email', contactData.admissions_office.email_nts], ['Office Hours', contactData.admissions_office.office_hours], ['Address', contactData.admissions_office.physical_address]].map(([label, val]) => (
            <div key={label} className="rounded-xl bg-white dark:bg-[#151a28] border border-slate-200/50 dark:border-slate-800 p-3">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{label}</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 break-all">{val}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Departments */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Department Contacts</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contactData.departments.map((dept, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#151a28] p-4 shadow-sm space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{dept.name}</h4>
              <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400">{dept.email}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {dept.programs.map((p, pi) => <span key={pi} className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-400">{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Student Services */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Student Services</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(contactData.student_services).map(([key, svc]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#151a28] p-4 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{svc.name}</h4>
              {svc.email && <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-1">{svc.email}</p>}
              {svc.phone && <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-1">{svc.phone}</p>}
              {svc.note && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">{svc.note}</p>}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.button variants={itemVariants} whileTap={{ scale: 0.98 }}
        onClick={() => onAskQuestion('What is the phone number and email for CUI Wah Campus admissions office?', 'Contact Info')}
        className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-4 text-sm font-bold text-white shadow-md hover:from-teal-700 hover:to-cyan-700 transition-all">
        <span>Ask AI for contact details</span>
        <ArrowRight className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );

  // --- ANNOUNCEMENTS RENDERER ---
  const renderAnnouncements = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-full">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <Info className="h-5 w-5" />
          </span>
          News & Announcements
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Latest official notices, admission updates, and academic calendar for Fall 2025.</p>
      </motion.div>

      {announcementsData.announcements.map((ann, i) => {
        const badgeColor = ann.type === 'Admission' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
          : ann.type === 'Merit' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400'
          : ann.type === 'Fee' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
          : ann.type === 'Scholarship' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
          : ann.type === 'Test' ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400'
          : 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400';
        return (
          <motion.div key={i} variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#151a28] p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3 justify-between flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${badgeColor}`}>{ann.badge}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{ann.date}</span>
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{ann.title}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ann.details || ann.summary}</p>
            <button
              onClick={() => onAskQuestion(ann.title, ann.category)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
              <span>Ask AI for more details</span><ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        );
      })}

      {/* Academic Calendar */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-orange-200/60 bg-orange-50/20 dark:border-orange-900/40 dark:bg-orange-950/10 p-5 space-y-3">
        <h3 className="font-extrabold text-orange-700 dark:text-orange-400 text-sm">📅 Fall 2025 Academic Calendar</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(announcementsData.academic_calendar_fall_2025).map(([key, val]) => (
            <div key={key} className="rounded-xl bg-white dark:bg-[#151a28] border border-slate-200/50 dark:border-slate-800 p-3">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{key.replace(/_/g, ' ')}</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{val}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // --- POLICIES RENDERER ---
  const renderPolicies = () => {
    const sections = ['attendance_policy','academic_integrity','exam_policy','grading_system','code_of_conduct','degree_completion','transfer_policy','hostel_rules'];
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-full">
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <Shield className="h-5 w-5" />
            </span>
            University Policies & Regulations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CUI Wah Campus academic policies, conduct rules, and regulations.</p>
        </motion.div>

        {sections.filter(s => policiesData[s]).map((sectionKey, i) => {
          const section = policiesData[sectionKey];
          return (
            <motion.div key={i} variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#151a28] p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{section.title}</h3>
              {section.minimum_required && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">{section.minimum_required}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">minimum required</span>
                </div>
              )}
              {section.rules && (
                <ul className="space-y-2">
                  {section.rules.map((rule, ri) => (
                    <li key={ri} className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              )}
              {section.grades && (
                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-slate-50 dark:bg-slate-900">
                      <th className="px-3 py-2 text-left font-bold text-slate-500">Grade</th>
                      <th className="px-3 py-2 text-right font-bold text-slate-500">GPA</th>
                      <th className="px-3 py-2 text-right font-bold text-slate-500">Percentage</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {section.grades.map((g, gi) => (
                        <tr key={gi}>
                          <td className="px-3 py-1.5 font-extrabold text-slate-800 dark:text-slate-200">{g.letter}</td>
                          <td className="px-3 py-1.5 text-right font-mono text-slate-700 dark:text-slate-300">{g.gpa}</td>
                          <td className="px-3 py-1.5 text-right text-slate-500 dark:text-slate-400">{g.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                onClick={() => onAskQuestion(`What is CUI's ${section.title}?`, 'Policies')}
                className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1">
                <span>Ask AI about this policy</span><ArrowRight className="h-3 w-3" />
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  // --- EXPLORER ROUTER ---
  switch (category) {
    case 'Programs':           return renderPrograms();
    case 'Fees':               return renderFees();
    case 'Eligibility':        return renderEligibility();
    case 'Prerequisites':      return renderPrerequisites();
    case 'Scholarships':       return renderScholarships();
    case 'Hostel & Transport': return renderHostelAndTransport();
    case 'Merit Calculator':   return renderMeritCalculator();
    case 'How to Apply':       return renderHowToApply();
    case 'FAQs':               return renderFaqs();
    case 'Merit Lists':        return renderMeritLists();
    case 'Contact Info':       return renderContactInfo();
    case 'Announcements':      return renderAnnouncements();
    case 'Policies':           return renderPolicies();
    default:
      return (
        <div className="py-16 text-center text-slate-400">
          No explorer page found for category: {category}
        </div>
      );
  }
}
