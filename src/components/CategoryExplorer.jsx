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
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('All');
  
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
    setExpandedFaqId(prevId => prevId === id ? null : id);
  };

  // Safe FAQ list getter
  const getFaqs = () => {
    if (Array.isArray(faqsData)) return faqsData;
    if (faqsData && Array.isArray(faqsData.faqs)) return faqsData.faqs;
    return [];
  };

  // --- 1. RENDER PROGRAMS ---
  const renderPrograms = () => {
    const levels = ['Undergraduate', 'Graduate', 'PhD'];
    const levelConfig = {
      Undergraduate: { label: 'Undergraduate Programs', sublabel: 'BS / BBA / B.Arch — 4 Year Degrees', color: 'text-[#0B2545] dark:text-[#E2EBFA]', bg: 'bg-[#F4F5F7] dark:bg-[#112035]', border: 'border-[#E7E2D8] dark:border-[#1A2A40]', dot: 'bg-[#0B2545]' },
      Graduate:      { label: 'Graduate Programs (MS)', sublabel: 'MS / MBA / M.Arch — 2 Year Postgraduate Degrees', color: 'text-[#7A1E2B] dark:text-[#C9A227]', bg: 'bg-[#F7F5F0] dark:bg-[#0E1B2D]', border: 'border-[#E7E2D8] dark:border-[#1A2A40]', dot: 'bg-[#7A1E2B]' },
      PhD:           { label: 'PhD Programs', sublabel: 'Doctor of Philosophy — Research Degrees', color: 'text-[#0B2545] dark:text-[#E2EBFA]', bg: 'bg-[#F4F5F7] dark:bg-[#112035]', border: 'border-[#E7E2D8] dark:border-[#1A2A40]', dot: 'bg-[#C9A227]' },
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
            <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
                <BookOpen className="h-5 w-5" />
              </span>
              Degree Programs Offered
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1 max-w-xl">
              Undergraduate, graduate, and PhD programs at CUI Wah Campus — click any card to ask the AI.
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B2545] dark:text-[#809BCE]" />
          <input
            type="text"
            placeholder="Search programs by name, abbreviation, or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#E7E2D8] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2B2B2B] outline-none placeholder:text-[#888888] focus:border-[#0B2545] dark:border-[#1A2A40] dark:bg-[#0B1524] dark:text-[#E2EBFA] dark:focus:border-[#6C8EBF] transition-all font-medium"
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
                <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                <div>
                  <h3 className={`font-serif text-base font-bold ${cfg.color}`}>{cfg.label}</h3>
                  <p className="text-[10.5px] text-[#555555] dark:text-[#A0B0C5] font-medium">{cfg.sublabel}</p>
                </div>
                <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                  {programs.length} {programs.length === 1 ? 'Program' : 'Programs'}
                </span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map((p, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -2, transition: { duration: 0.18 } }}
                    className="group flex flex-col justify-between rounded-lg border border-[#E7E2D8] bg-white p-5 transition-all duration-150 hover:border-[#0B2545] shadow-xs dark:border-[#1A2A40] dark:bg-[#0B1524] dark:hover:border-[#6C8EBF]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${cfg.bg} ${cfg.color} ${cfg.border} whitespace-nowrap`}>
                          {p.abbreviation}
                        </span>
                        <span className="text-[11px] font-semibold text-[#7A1E2B] dark:text-[#C9A227] flex items-center gap-1 whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {p.duration}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#0B2545] dark:text-[#E2EBFA] group-hover:text-[#7A1E2B] transition-colors leading-snug">
                          {p.name}
                        </h4>
                        <p className="text-[10px] font-bold text-[#7A1E2B] dark:text-[#C9A227] mt-0.5 uppercase tracking-wider">
                          {p.category}
                        </p>
                      </div>
                      <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    </div>
                    <button
                      onClick={() => onAskQuestion(`What are the details, eligibility, and requirements for ${p.name} (${p.abbreviation})?`, 'Programs')}
                      className="mt-4 flex w-full items-center justify-between rounded-md bg-[#F4F5F7] border border-[#E7E2D8] px-4 py-2.5 text-xs font-bold text-[#0B2545] transition-all hover:bg-[#0B2545] hover:text-white dark:bg-[#070D18] dark:border-[#1A2A40] dark:text-[#E2EBFA] dark:hover:bg-[#7A1E2B]"
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
          <motion.div variants={itemVariants} className="py-16 text-center text-sm text-[#666666] font-serif">
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
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <DollarSign className="h-5 w-5" />
            </span>
            Fee Structure - Fall 2026
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Official semester structure, registration costs, and admission policies.
          </p>
        </motion.div>

        {/* Fees Table - Desktop View */}
        <motion.div variants={itemVariants} className="hidden md:block overflow-hidden rounded-lg border border-[#E7E2D8] dark:border-[#1A2A40] bg-white dark:bg-[#0B1524] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F5F0] text-xs font-bold font-serif text-[#0B2545] dark:bg-[#070D18] dark:text-[#E2EBFA] border-b border-[#E7E2D8] dark:border-[#1A2A40]">
                  <th className="px-5 py-4">Program Category</th>
                  <th className="px-5 py-4 text-right">Admission Fee</th>
                  <th className="px-5 py-4 text-right">Registration Fee</th>
                  <th className="px-5 py-4 text-right">Tuition / Sem</th>
                  <th className="px-5 py-4 text-right bg-[#F4F5F7] dark:bg-[#112035] font-bold text-[#0B2545] dark:text-[#E2EBFA]">Total at Admission</th>
                  <th className="px-5 py-4 text-right">Per Sem Later</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8] dark:divide-[#1A2A40] text-xs sm:text-sm text-[#2B2B2B] dark:text-[#D8E2EE]">
                {feesData.structures.map((fee, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F5F7] dark:hover:bg-[#112035] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">{fee.category}</div>
                      <div className="text-[10px] font-medium text-[#555555] dark:text-[#A0B0C5] mt-1 max-w-[220px] truncate" title={fee.programs_included.join(', ')}>
                        {fee.programs_included.join(', ')}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-semibold">Rs. {fee.admission_fee.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono font-semibold">Rs. {fee.registration_fee.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono font-semibold">Rs. {fee.tuition_fee_per_semester.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-bold font-mono bg-[#F7F5F0] dark:bg-[#070D18] text-[#0B2545] dark:text-[#C9A227]">Rs. {fee.total_at_admission.toLocaleString()}</td>
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
              className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-3.5"
            >
              <div>
                <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm leading-snug">{fee.category}</h4>
                <p className="text-[10px] font-semibold text-[#555555] dark:text-[#A0B0C5] mt-1">{fee.programs_included.join(', ')}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#E7E2D8] dark:border-[#1A2A40]">
                <div>
                  <span className="text-[#666666] dark:text-[#A0B0C5] block text-[9px] uppercase font-bold tracking-wider">Admission Fee</span>
                  <span className="font-semibold font-mono text-[#2B2B2B] dark:text-[#D8E2EE]">Rs. {fee.admission_fee.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#666666] dark:text-[#A0B0C5] block text-[9px] uppercase font-bold tracking-wider">Registration Fee</span>
                  <span className="font-semibold font-mono text-[#2B2B2B] dark:text-[#D8E2EE]">Rs. {fee.registration_fee.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#666666] dark:text-[#A0B0C5] block text-[9px] uppercase font-bold tracking-wider">Tuition / Sem</span>
                  <span className="font-semibold font-mono text-[#2B2B2B] dark:text-[#D8E2EE]">Rs. {fee.tuition_fee_per_semester.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#666666] dark:text-[#A0B0C5] block text-[9px] uppercase font-bold tracking-wider">Semester later</span>
                  <span className="font-semibold font-mono text-[#2B2B2B] dark:text-[#D8E2EE]">Rs. {fee.subsequent_semesters.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-[#F7F5F0] dark:bg-[#070D18] p-3 rounded-md border border-[#E7E2D8] dark:border-[#1A2A40] text-xs font-bold text-[#0B2545] dark:text-[#C9A227] flex justify-between items-center mt-2.5">
                <span>Total at Admission:</span>
                <span className="font-mono text-sm font-extrabold">Rs. {fee.total_at_admission.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Application Processing & NTS Test Fees */}
        {feesData.policies.application_processing_fee_amount && (
          <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] flex items-center gap-1.5 font-serif">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7A1E2B]" />
              Mandatory Application & Entry Test Fees
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-md bg-[#F4F5F7] p-4 dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40]">
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Admission Processing Fee</h4>
                  <p className="text-[10px] text-[#555555] dark:text-[#A0B0C5] mt-1">Non-Refundable application processing</p>
                </div>
                <div className="text-lg font-bold font-mono text-[#0B2545] dark:text-[#C9A227] shrink-0">
                  Rs. {feesData.policies.application_processing_fee_amount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md bg-[#F4F5F7] p-4 dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40]">
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">CUI Wah NTS Test Fee</h4>
                  <p className="text-[10px] text-[#555555] dark:text-[#A0B0C5] mt-1">Registration fee for CUI NTS exam</p>
                </div>
                <div className="text-lg font-bold font-mono text-[#0B2545] dark:text-[#C9A227] shrink-0">
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
          className="cursor-pointer group flex items-center justify-between rounded-lg border border-[#E7E2D8] bg-[#F7F5F0] p-5 dark:border-[#1A2A40] dark:bg-[#0E1B2D] hover:border-[#0B2545] transition-all duration-150 shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0B2545] text-[#C9A227]">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] group-hover:text-[#7A1E2B] transition-colors">
                Looking for Hostel & Transport details?
              </h4>
              <p className="text-xs text-[#555555] dark:text-[#A0B0C5] mt-0.5">
                CUI Wah offers hostels (first come first served) and transit covers Islamabad, Rawalpindi, and Attock.
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#0B2545] group-hover:text-[#7A1E2B] transition-all group-hover:translate-x-1 shrink-0 ml-4 dark:text-[#E2EBFA]" />
        </motion.div>

        {/* Note Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs">
            <h4 className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#E2EBFA]">
              <Info className="h-4 w-4 text-[#7A1E2B]" />
              General Billing Policies
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
              <li className="flex gap-2 items-start"><span className="text-[#7A1E2B] font-bold">•</span><span>{feesData.policies.payment_timing}</span></li>
              <li className="flex gap-2 items-start"><span className="text-[#7A1E2B] font-bold">•</span><span>{feesData.policies.exclusion_note}</span></li>
              <li className="flex gap-2 items-start"><span className="text-[#7A1E2B] font-bold">•</span><span>{feesData.policies.installments}</span></li>
              <li className="flex gap-2 items-start"><span className="text-[#7A1E2B] font-bold">•</span><span>{feesData.policies.revision_note}</span></li>
            </ul>
          </div>

          <div className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs">
            <h4 className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#E2EBFA]">
              <Clock className="h-4 w-4 text-[#7A1E2B]" />
              Admission Refund Deadlines
            </h4>
            <div className="mt-4 space-y-3">
              {feesData.refund_policy.table.map((ref, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 border-b border-[#E7E2D8] pb-2.5 last:border-0 last:pb-0 dark:border-[#1A2A40]">
                  <div>
                    <div className="text-xs font-bold text-[#0B2545] dark:text-[#E2EBFA]">{ref.refund_percentage}</div>
                    <div className="text-[10px] font-medium text-[#555555] dark:text-[#A0B0C5] mt-0.5">{ref.timeline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Refund Policy detailed note */}
        <motion.div variants={itemVariants} className="rounded-lg bg-[#F7F5F0] border border-[#E7E2D8] p-5 dark:bg-[#0E1B2D] dark:border-[#1A2A40]">
          <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-[#7A1E2B]" />
            Refund Notes & Terms
          </h4>
          <ul className="mt-3 space-y-1.5 text-xs text-[#555555] dark:text-[#A0B0C5] list-disc pl-4 leading-relaxed">
            {feesData.refund_policy.notes.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion("What is the fee structure for BS Computer Science and the refund policy at COMSATS?", 'Fees')}
          className="flex w-full items-center justify-between rounded-lg bg-[#0B2545] hover:bg-[#7A1E2B] px-5 py-4 text-sm font-bold text-white transition-all shadow-xs cursor-pointer"
        >
          <span>Have questions about fees? Ask Admission AI</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  };

  // --- 3. RENDER ELIGIBILITY ---
  const renderEligibility = () => {
    const allFaqs = getFaqs();
    const eligibilityFaqs = allFaqs.filter(f => 
      f.category === 'Eligibility' || 
      f.category === 'Admission Related' ||
      (f.question && (
        f.question.toLowerCase().includes('eligib') ||
        f.question.toLowerCase().includes('percentage') ||
        f.question.toLowerCase().includes('result awaiting') ||
        f.question.toLowerCase().includes('supply') ||
        f.question.toLowerCase().includes('marks') ||
        f.question.toLowerCase().includes('a-level')
      ))
    );

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <CheckCircle className="h-5 w-5" />
            </span>
            Admission Eligibility Criteria
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Check the required percentages and entry test benchmarks for academic levels.
          </p>
        </motion.div>

        {/* Undergraduate grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7A1E2B]" />
            Undergraduate Degree Programs
          </h3>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="text-3xl font-extrabold text-[#0B2545] dark:text-[#C9A227] font-mono">
                  {eligibilityData.undergraduate.computing_programs.min_percentage}%
                </div>
                <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">Computing Programs</h4>
                <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
                  {eligibilityData.undergraduate.computing_programs.detailed_criteria}
                </p>
                <div className="bg-[#F7F5F0] p-3 rounded-md border border-[#E7E2D8] dark:bg-[#070D18] dark:border-[#1A2A40] text-[10px] font-bold text-[#0B2545] dark:text-[#C9A227] flex items-start gap-1.5 leading-normal">
                  <Bookmark className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#7A1E2B]" />
                  <span>{eligibilityData.undergraduate.computing_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.computing_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded bg-[#F4F5F7] px-2 py-0.5 text-[9px] font-bold text-[#0B2545] dark:bg-[#112035] dark:text-[#D8E2EE] border border-[#E7E2D8] dark:border-[#1A2A40]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="text-3xl font-extrabold text-[#7A1E2B] dark:text-[#C9A227] font-mono">
                  {eligibilityData.undergraduate.engineering_programs.min_percentage}%
                </div>
                <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">Engineering Programs</h4>
                <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
                  {eligibilityData.undergraduate.engineering_programs.detailed_criteria}
                </p>
                {eligibilityData.undergraduate.engineering_programs.deficiency_policy && (
                  <div className="text-[10.5px] leading-relaxed font-semibold text-[#7A1E2B] dark:text-[#E2EBFA] bg-[#F7F5F0] dark:bg-[#070D18] p-3 rounded-md border border-[#E7E2D8] dark:border-[#1A2A40]">
                    <strong>Deficiency Note:</strong> {eligibilityData.undergraduate.engineering_programs.deficiency_policy}
                  </div>
                )}
                <div className="bg-[#F7F5F0] p-3 rounded-md border border-[#E7E2D8] dark:bg-[#070D18] dark:border-[#1A2A40] text-[10px] font-bold text-[#0B2545] dark:text-[#C9A227] flex items-start gap-1.5 leading-normal">
                  <Bookmark className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#7A1E2B]" />
                  <span>{eligibilityData.undergraduate.engineering_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.engineering_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded bg-[#F4F5F7] px-2 py-0.5 text-[9px] font-bold text-[#0B2545] dark:bg-[#112035] dark:text-[#D8E2EE] border border-[#E7E2D8] dark:border-[#1A2A40]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="text-3xl font-extrabold text-[#0B2545] dark:text-[#C9A227] font-mono">
                  {eligibilityData.undergraduate.other_programs.min_percentage}%
                </div>
                <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">Management & Humanities</h4>
                <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
                  {eligibilityData.undergraduate.other_programs.detailed_criteria}
                </p>
                <div className="text-[10.5px] leading-relaxed font-semibold text-[#0B2545] dark:text-[#E2EBFA] bg-[#F7F5F0] dark:bg-[#070D18] p-3 rounded-md border border-[#E7E2D8] dark:border-[#1A2A40]">
                  <strong>Accreditation:</strong> {eligibilityData.undergraduate.other_programs.special_accreditations["BS Accounting & Finance"]}
                </div>
                <div className="bg-[#F7F5F0] p-3 rounded-md border border-[#E7E2D8] dark:bg-[#070D18] dark:border-[#1A2A40] text-[10px] font-bold text-[#0B2545] dark:text-[#C9A227] flex items-start gap-1.5 leading-normal">
                  <Bookmark className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#7A1E2B]" />
                  <span>{eligibilityData.undergraduate.other_programs.entry_test_requirement}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1">
                {eligibilityData.undergraduate.other_programs.programs.map((p, idx) => (
                  <span key={idx} className="rounded bg-[#F4F5F7] px-2 py-0.5 text-[9px] font-bold text-[#0B2545] dark:bg-[#112035] dark:text-[#D8E2EE] border border-[#E7E2D8] dark:border-[#1A2A40]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {eligibilityData.undergraduate.nat_categories && (
          <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] space-y-4 shadow-xs">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7A1E2B]" />
              CUI NAT Undergraduate Test Categories
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(eligibilityData.undergraduate.nat_categories).map(([catName, catDetail]) => (
                <div 
                  key={catName} 
                  className="rounded-md bg-[#F4F5F7] p-4 dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40] flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">{catName}</span>
                      <span className="rounded bg-[#0B2545] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        {catDetail.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
                      {catDetail.description}
                    </p>
                  </div>
                  <div className="border-t border-[#E7E2D8] pt-3 dark:border-[#1A2A40]">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] block mb-1">Subject Format:</span>
                    <span className="text-[10px] font-semibold text-[#2B2B2B] dark:text-[#D8E2EE] leading-relaxed font-mono bg-white dark:bg-[#0B1524] px-2 py-1.5 rounded border border-[#E7E2D8] dark:border-[#1A2A40] block">
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
          <div className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Master of Science (MS) Admissions</h4>
            <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
              {eligibilityData.graduate_ms.detailed_criteria}
            </p>
            <div className="bg-[#F7F5F0] p-3 rounded-md border border-[#E7E2D8] dark:bg-[#070D18] dark:border-[#1A2A40] text-xs font-bold text-[#0B2545] dark:text-[#C9A227] leading-normal">
              <strong>Entry Test:</strong> {eligibilityData.graduate_ms.entry_test_requirement}
            </div>
            <div className="space-y-2 text-xs leading-relaxed text-[#555555] dark:text-[#A0B0C5] pt-2">
              <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                <span className="font-bold">Min CGPA</span>
                <span className="font-mono text-[#0B2545] dark:text-[#E2EBFA] font-bold">{eligibilityData.graduate_ms.min_cgpa}</span>
              </div>
              <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                <span className="font-bold">Min Percentage</span>
                <span className="font-mono text-[#0B2545] dark:text-[#E2EBFA] font-bold">{eligibilityData.graduate_ms.min_percentage}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Doctor of Philosophy (PhD) Admissions</h4>
            <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
              {eligibilityData.graduate_phd?.detailed_criteria}
            </p>
            <div className="bg-[#F7F5F0] p-3 rounded-md border border-[#E7E2D8] dark:bg-[#070D18] dark:border-[#1A2A40] text-xs font-bold text-[#0B2545] dark:text-[#C9A227] leading-normal">
              <strong>Entry Test:</strong> {eligibilityData.graduate_phd?.entry_test_requirement}
            </div>
            <div className="space-y-2 text-xs leading-relaxed text-[#555555] dark:text-[#A0B0C5] pt-2">
              <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                <span className="font-bold">Min CGPA</span>
                <span className="font-mono text-[#0B2545] dark:text-[#E2EBFA] font-bold">{eligibilityData.graduate_phd?.min_cgpa}</span>
              </div>
              <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                <span className="font-bold">Min Percentage</span>
                <span className="font-mono text-[#0B2545] dark:text-[#E2EBFA] font-bold">{eligibilityData.graduate_phd?.min_percentage}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Foreign & A-Level Equivalence */}
        {eligibilityData.equivalence_requirements && (
          <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-[#F7F5F0] p-5 dark:border-[#1A2A40] dark:bg-[#0E1B2D] space-y-3">
            <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Info className="h-4 w-4 text-[#7A1E2B]" />
              IBCC & HEC Equivalence Mandate
            </h4>
            <div className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed space-y-2">
              <p><strong>O & A-Level Equivalence:</strong> {eligibilityData.equivalence_requirements.o_level_a_level}</p>
              <p><strong>Foreign Qualifications:</strong> {eligibilityData.equivalence_requirements.foreign_qualifications}</p>
            </div>
          </motion.div>
        )}

        {/* Interactive Eligibility FAQs Accordion Section */}
        {eligibilityFaqs.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4 pt-2">
            <h3 className="font-serif text-lg font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#7A1E2B]" />
              Eligibility Frequently Asked Questions ({eligibilityFaqs.length})
            </h3>
            <div className="space-y-2.5">
              {eligibilityFaqs.map((faq, idx) => {
                const itemKey = `elig_faq_${faq.id || idx}`;
                const isExpanded = expandedFaqId === itemKey;
                return (
                  <div key={itemKey} className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs overflow-hidden">
                    <button
                      onClick={() => toggleFaq(itemKey)}
                      className="flex w-full items-center justify-between p-3.5 text-left font-serif font-bold text-xs sm:text-sm text-[#0B2545] dark:text-[#E2EBFA] hover:bg-[#F4F5F7] dark:hover:bg-[#112035] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <span className="rounded bg-[#F4F5F7] px-2 py-0.5 text-[9px] font-bold text-[#7A1E2B] border border-[#E7E2D8] dark:bg-[#112035] dark:text-[#C9A227] dark:border-[#1A2A40] shrink-0">
                          {faq.category || 'Eligibility'}
                        </span>
                        <span>{faq.question}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-[#0B2545] dark:text-[#C9A227]" /> : <ChevronDown className="h-4 w-4 shrink-0 text-[#0B2545] dark:text-[#809BCE]" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-3.5 pt-0 border-t border-[#E7E2D8] dark:border-[#1A2A40] text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed space-y-2.5 bg-[#FAF9F5] dark:bg-[#070D18]"
                        >
                          <p>{faq.answer}</p>
                          <button
                            onClick={() => onAskQuestion(faq.question, 'Eligibility')}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0B2545] dark:text-[#C9A227] hover:underline cursor-pointer"
                          >
                            <span>Ask AI for custom evaluation</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion("Am I eligible for BS Computer Science with 58% marks in FSc Pre-Engineering?", 'Eligibility')}
          className="flex w-full items-center justify-between rounded-lg bg-[#0B2545] hover:bg-[#7A1E2B] px-5 py-4 text-sm font-bold text-white transition-all shadow-xs cursor-pointer"
        >
          <span>Check your personal eligibility with Admission AI</span>
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
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <FileText className="h-5 w-5" />
            </span>
            Program Prerequisites
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Review which intermediate pathways (ICS, Pre-Med, Pre-Eng, DAE) are accepted for our degree programs.
          </p>
        </motion.div>

        {/* Pathways Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {prerequisitesData.program_pathways.map((path, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] border-b border-[#E7E2D8] pb-2.5 dark:border-[#1A2A40] text-sm">
                  {path.program}
                </h3>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227]">Eligible Backgrounds:</span>
                  <div className="flex flex-col gap-2 mt-1.5">
                    {path.eligible_backgrounds.map((bg, bgIdx) => (
                      <div key={bgIdx} className="flex items-center gap-2.5 text-xs text-[#2B2B2B] dark:text-[#D8E2EE]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0B2545] shrink-0" />
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
        <motion.div variants={itemVariants} className="rounded-lg bg-[#F7F5F0] border border-[#E7E2D8] p-5 dark:bg-[#0E1B2D] dark:border-[#1A2A40] grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs leading-relaxed text-[#555555] dark:text-[#A0B0C5]">
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">DAE Diploma Holders Policy:</h4>
            <p>{prerequisitesData.dae_policy.open_merit}</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Pre-Medical with Additional Maths:</h4>
            <p>{prerequisitesData.pre_medical_additional_maths.policy}</p>
          </div>
        </motion.div>

        {/* MS Prerequisites */}
        {prerequisitesData.ms_prerequisites && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <h3 className="font-serif text-base font-bold text-[#0B2545] dark:text-[#E2EBFA]">MS Graduate Program Prerequisites</h3>
              <span className="rounded bg-[#0B2545] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                16-year Degree
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {prerequisitesData.ms_prerequisites.map((ms, idx) => (
                <div key={idx} className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] p-5 space-y-4 shadow-xs">
                  <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-[13px] border-b border-[#E7E2D8] dark:border-[#1A2A40] pb-2.5">
                    {ms.program}
                  </h4>
                  <div className="text-[11px] space-y-3">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] block mb-1">Required Prior Degree:</span>
                      <span className="text-[#2B2B2B] dark:text-[#D8E2EE] leading-relaxed font-medium">{ms.required_degree}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="rounded-md bg-[#F4F5F7] dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40] px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#555555] dark:text-[#A0B0C5] mb-0.5">Min CGPA</div>
                        <div className="font-extrabold text-[#0B2545] dark:text-[#E2EBFA] font-mono text-xs">{ms.min_cgpa.split(' ')[0]}</div>
                      </div>
                      <div className="rounded-md bg-[#F7F5F0] dark:bg-[#0E1B2D] border border-[#E7E2D8] dark:border-[#1A2A40] px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] mb-0.5">GAT Category</div>
                        <div className="font-bold text-[#7A1E2B] dark:text-[#C9A227] text-xs">{ms.gat_category}</div>
                      </div>
                    </div>
                    <div className="rounded-md bg-[#F4F5F7] dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40] px-3 py-2">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#E2EBFA] mb-0.5">Entry Test Passing Score</div>
                      <div className="font-bold text-[#0B2545] dark:text-[#C9A227] text-[10.5px]">{ms.entry_test_passing}</div>
                    </div>
                    {ms.interdisciplinary && (
                      <div className="text-[10px] text-[#555555] dark:text-[#A0B0C5] italic leading-relaxed pt-1">
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
              <h3 className="font-serif text-base font-bold text-[#0B2545] dark:text-[#E2EBFA]">PhD Program Prerequisites</h3>
              <span className="rounded bg-[#7A1E2B] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                18-year Degree + Thesis
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {prerequisitesData.phd_prerequisites.map((phd, idx) => (
                <div key={idx} className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] p-5 space-y-4 shadow-xs">
                  <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-[13px] border-b border-[#E7E2D8] dark:border-[#1A2A40] pb-2.5">
                    {phd.program}
                  </h4>
                  <div className="text-[11px] space-y-3">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] block mb-1">Required Prior Degree:</span>
                      <span className="text-[#2B2B2B] dark:text-[#D8E2EE] leading-relaxed font-medium">{phd.required_degree}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="rounded-md bg-[#F4F5F7] dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40] px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#555555] dark:text-[#A0B0C5] mb-0.5">Min CGPA</div>
                        <div className="font-extrabold text-[#0B2545] dark:text-[#E2EBFA] font-mono text-xs">{phd.min_cgpa.split(' ')[0]}</div>
                      </div>
                      <div className="rounded-md bg-[#F7F5F0] dark:bg-[#0E1B2D] border border-[#E7E2D8] dark:border-[#1A2A40] px-3 py-2 flex-1">
                        <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] mb-0.5">GAT Subject</div>
                        <div className="font-bold text-[#7A1E2B] dark:text-[#C9A227] text-xs">{phd.gat_subject}</div>
                      </div>
                    </div>
                    <div className="rounded-md bg-[#F4F5F7] dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40] px-3 py-2">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#E2EBFA] mb-0.5">Entry Test Passing Score</div>
                      <div className="font-bold text-[#0B2545] dark:text-[#C9A227] text-[10.5px]">{phd.entry_test_passing}</div>
                    </div>
                    <div className="rounded-md bg-[#F4F5F7] dark:bg-[#070D18] border border-[#E7E2D8] dark:border-[#1A2A40] px-3 py-2">
                      <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] mb-0.5">Interview</div>
                      <div className="font-bold text-[#7A1E2B] dark:text-[#C9A227] text-[10.5px]">{phd.interview}</div>
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
          className="flex w-full items-center justify-between rounded-lg bg-[#0B2545] hover:bg-[#7A1E2B] px-5 py-4 text-sm font-bold text-white transition-all shadow-xs cursor-pointer"
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
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Award className="h-5 w-5" />
            </span>
            Scholarships & Financial Aid
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Explore reward programs for high achievers and financial assistance options.
          </p>
        </motion.div>

        {/* Merit Policy card */}
        <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-[#0B2545] p-2.5 text-[#C9A227]">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">{scholarshipsData.merit_scholarships.title}</h3>
              <p className="text-xs text-[#555555] dark:text-[#A0B0C5] mt-0.5">Performance-Based Semester Adjustments</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed text-[#555555] dark:text-[#A0B0C5] pt-1">
            <div className="space-y-1">
              <span className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">BS Undergraduate Level:</span>
              <p>{scholarshipsData.merit_scholarships.undergraduate_eligibility}</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Graduate (MS/PhD) Level:</span>
              <p>{scholarshipsData.merit_scholarships.graduate_ms_eligibility}</p>
            </div>
          </div>
          <div className="rounded-md bg-[#F7F5F0] p-3 text-[11px] font-semibold text-[#0B2545] border border-[#E7E2D8] dark:bg-[#0E1B2D] dark:border-[#1A2A40] dark:text-[#C9A227]">
            ℹ {scholarshipsData.merit_scholarships.award_timing}
          </div>
        </motion.div>

        {/* Financial Aid Options */}
        <motion.div variants={containerVariants} className="space-y-4">
          <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7A1E2B]" />
            Available Financial Assistance Schemes
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {scholarshipsData.financial_aid_options.map((sch, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm leading-snug">
                    {sch.name}
                  </h4>
                  <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
                    {sch.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E7E2D8] dark:border-[#1A2A40] text-[11px]">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] block mb-1">Eligibility Criteria:</span>
                  <p className="text-[#2B2B2B] dark:text-[#D8E2EE] font-medium leading-relaxed">{sch.eligibility}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Admission Scholarship Policy Notice */}
        <motion.div variants={itemVariants} className="rounded-lg bg-[#F7F5F0] border border-[#E7E2D8] p-5 dark:bg-[#0E1B2D] dark:border-[#1A2A40] text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed space-y-2">
          <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-1.5">
            <Info className="h-4 w-4 text-[#7A1E2B]" />
            Note on Initial Admission Scholarships:
          </h4>
          <p>{scholarshipsData.admission_scholarships.policy}</p>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion("How can I apply for HEC Need-Based or PEEF Scholarships at CUI Wah?", 'Scholarships')}
          className="flex w-full items-center justify-between rounded-lg bg-[#0B2545] hover:bg-[#7A1E2B] px-5 py-4 text-sm font-bold text-white transition-all shadow-xs cursor-pointer"
        >
          <span>Ask Admission AI about financial aid & scholarship requirements</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  };

  // --- 6. RENDER HOSTEL & TRANSPORT ---
  const renderHostelAndTransport = () => {
    const { hostel, transport } = feesData.hostel_and_transport;
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Home className="h-5 w-5" />
            </span>
            Hostel & Campus Transport
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Information regarding student accommodation, monthly mess, and bus routes across cities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Hostel Card */}
          <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-6 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-[#0B2545] p-2.5 text-[#C9A227]">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-base">Hostel Accommodation</h3>
                  <span className="text-[10px] font-bold text-[#7A1E2B] dark:text-[#C9A227] uppercase tracking-wider">{hostel.policy}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#555555] dark:text-[#A0B0C5] pt-2">
                <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                  <span>Hostel Fee / Sem</span>
                  <span className="font-mono font-bold text-[#0B2545] dark:text-[#E2EBFA]">Rs. {hostel.semester_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                  <span>Refundable Security</span>
                  <span className="font-mono font-bold text-[#0B2545] dark:text-[#E2EBFA]">Rs. {hostel.security_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                  <span>Mess Included</span>
                  <span className="font-bold text-[#0B2545] dark:text-[#E2EBFA]">{hostel.includes_mess ? 'Yes (3 Meals Daily)' : 'No'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskQuestion("What are the hostel room facilities and monthly mess rules at CUI Wah?", 'Hostel & Transport')}
              className="w-full rounded-md bg-[#F4F5F7] border border-[#E7E2D8] py-2.5 text-xs font-bold text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all dark:bg-[#070D18] dark:border-[#1A2A40] dark:text-[#E2EBFA] dark:hover:bg-[#7A1E2B]"
            >
              Ask AI about Hostel Facilities
            </button>
          </motion.div>

          {/* Transport Card */}
          <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-6 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-[#0B2545] p-2.5 text-[#C9A227]">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-base">Campus Bus Service</h3>
                  <span className="text-[10px] font-bold text-[#7A1E2B] dark:text-[#C9A227] uppercase tracking-wider">Covering 5 Major Nearby Routes</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#555555] dark:text-[#A0B0C5] pt-2">
                <div className="flex justify-between border-b border-[#E7E2D8] pb-2 dark:border-[#1A2A40]">
                  <span>Transport Fee / Sem</span>
                  <span className="font-mono font-bold text-[#0B2545] dark:text-[#E2EBFA]">Rs. {transport.semester_fee.toLocaleString()}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] block mb-2">Available Routes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {transport.routes.map((rt, idx) => (
                      <span key={idx} className="rounded bg-[#F4F5F7] px-2.5 py-1 text-[10px] font-bold text-[#0B2545] dark:bg-[#112035] dark:text-[#D8E2EE] border border-[#E7E2D8] dark:border-[#1A2A40]">
                        🚌 {rt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskQuestion("What are the exact transport bus timing and pick up points for Rawalpindi / Islamabad?", 'Hostel & Transport')}
              className="w-full rounded-md bg-[#F4F5F7] border border-[#E7E2D8] py-2.5 text-xs font-bold text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all dark:bg-[#070D18] dark:border-[#1A2A40] dark:text-[#E2EBFA] dark:hover:bg-[#7A1E2B]"
            >
              Ask AI about Bus Timings & Stop Places
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // --- 7. RENDER MERIT CALCULATOR ---
  const renderMeritCalculator = () => {
    const aggregate = calculateAggregate();

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Calculator className="h-5 w-5" />
            </span>
            Aggregate Merit Calculator
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Calculate your aggregate percentage based on CUI Official Formula: 10% Matric + 40% FSc + 50% NTS NAT.
          </p>
        </motion.div>

        {/* Merit Formula Banner */}
        <motion.div variants={itemVariants} className="rounded-lg bg-[#F7F5F0] border border-[#E7E2D8] p-4.5 dark:bg-[#0E1B2D] dark:border-[#1A2A40] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227]">CUI Weightage Formula:</span>
            <div className="font-mono text-sm font-bold text-[#0B2545] dark:text-[#E2EBFA]">
              Aggregate = (Matric % × 0.10) + (FSc % × 0.40) + (NTS NAT Score % × 0.50)
            </div>
          </div>
        </motion.div>

        {/* Inputs Form + Result Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs Form */}
          <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#0B2545] dark:text-[#E2EBFA]">Enter Academic Marks</h3>
            
            {/* Matric */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B2B2B] dark:text-[#D8E2EE]">Matriculation / SSC Marks (10%)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Obtained"
                  value={matricObt}
                  onChange={(e) => setMatricObt(e.target.value)}
                  className="w-full rounded-md border border-[#E7E2D8] bg-[#F4F5F7] px-3 py-2 text-xs font-medium text-[#2B2B2B] outline-none focus:border-[#0B2545] dark:border-[#1A2A40] dark:bg-[#070D18] dark:text-[#E2EBFA]"
                />
                <input
                  type="number"
                  placeholder="Total"
                  value={matricTot}
                  onChange={(e) => setMatricTot(e.target.value)}
                  className="w-full rounded-md border border-[#E7E2D8] bg-[#F4F5F7] px-3 py-2 text-xs font-medium text-[#2B2B2B] outline-none focus:border-[#0B2545] dark:border-[#1A2A40] dark:bg-[#070D18] dark:text-[#E2EBFA]"
                />
              </div>
            </div>

            {/* Intermediate */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B2B2B] dark:text-[#D8E2EE]">Intermediate / HSSC Marks (40%)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Obtained"
                  value={interObt}
                  onChange={(e) => setInterObt(e.target.value)}
                  className="w-full rounded-md border border-[#E7E2D8] bg-[#F4F5F7] px-3 py-2 text-xs font-medium text-[#2B2B2B] outline-none focus:border-[#0B2545] dark:border-[#1A2A40] dark:bg-[#070D18] dark:text-[#E2EBFA]"
                />
                <input
                  type="number"
                  placeholder="Total"
                  value={interTot}
                  onChange={(e) => setInterTot(e.target.value)}
                  className="w-full rounded-md border border-[#E7E2D8] bg-[#F4F5F7] px-3 py-2 text-xs font-medium text-[#2B2B2B] outline-none focus:border-[#0B2545] dark:border-[#1A2A40] dark:bg-[#070D18] dark:text-[#E2EBFA]"
                />
              </div>
            </div>

            {/* NTS NAT */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B2B2B] dark:text-[#D8E2EE]">NTS NAT Score (50%)</label>
              <input
                type="number"
                placeholder="Score (0 - 100)"
                value={natScore}
                onChange={(e) => setNatScore(e.target.value)}
                className="w-full rounded-md border border-[#E7E2D8] bg-[#F4F5F7] px-3 py-2 text-xs font-medium text-[#2B2B2B] outline-none focus:border-[#0B2545] dark:border-[#1A2A40] dark:bg-[#070D18] dark:text-[#E2EBFA]"
              />
            </div>
          </motion.div>

          {/* Result Output Card */}
          <motion.div variants={itemVariants} className="rounded-lg border-2 border-[#0B2545] bg-[#F7F5F0] p-6 dark:border-[#1A2A40] dark:bg-[#0E1B2D] flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227]">
                Calculated Aggregate Result
              </span>
              <div className="mt-3 text-4xl font-extrabold text-[#0B2545] dark:text-[#E2EBFA] font-mono">
                {aggregate ? `${aggregate}%` : '— . — %'}
              </div>
              <p className="text-xs text-[#555555] dark:text-[#A0B0C5] mt-2 leading-relaxed">
                {aggregate 
                  ? `Your calculated aggregate is ${aggregate}%. Select below to compare against closing merit cutoffs.`
                  : 'Fill in your Matric, Intermediate, and NAT scores on the left to view your aggregate.'}
              </p>
            </div>

            {aggregate && (
              <button
                onClick={() => onAskQuestion(`My aggregate is ${aggregate}%. What are my admission chances at CUI Wah for BS CS, SE, AI, and EE?`, 'Merit Calculator')}
                className="mt-6 flex w-full items-center justify-between rounded-lg bg-[#0B2545] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#7A1E2B] cursor-pointer"
              >
                <span>Check My Program Chances with AI</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // --- 8. RENDER HOW TO APPLY ---
  const renderHowToApply = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Clipboard className="h-5 w-5" />
            </span>
            How to Apply — Step-by-Step Online Guide
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Complete walkthrough for online application form submission at CUI Wah Campus.
          </p>
        </motion.div>

        {/* Overview Banner */}
        <motion.div variants={itemVariants} className="rounded-lg bg-[#F7F5F0] border border-[#E7E2D8] p-5 dark:bg-[#0E1B2D] dark:border-[#1A2A40] space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227]">100% Online Application System</span>
              <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-base mt-0.5">admissions.comsats.edu.pk</h3>
            </div>
            <a
              href="https://admissions.comsats.edu.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0B2545] px-4 py-2 text-xs font-bold text-white hover:bg-[#7A1E2B] transition-all"
            >
              <span>Visit Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">{howToApplyData.overview}</p>
        </motion.div>

        {/* Steps List */}
        <motion.div variants={containerVariants} className="space-y-4">
          {howToApplyData.steps.map((st) => {
            const isDone = completedSteps[st.step];
            return (
              <motion.div 
                key={st.step}
                variants={itemVariants}
                className={`rounded-lg border p-5 transition-all duration-150 shadow-xs ${
                  isDone 
                    ? 'border-[#0B2545] bg-[#F7F5F0] dark:border-[#1A2A40] dark:bg-[#0E1B2D]' 
                    : 'border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStep(st.step)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isDone 
                        ? 'bg-[#0B2545] text-white' 
                        : 'bg-[#F4F5F7] text-[#0B2545] dark:bg-[#112035] dark:text-[#E2EBFA] border border-[#E7E2D8] dark:border-[#1A2A40]'
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : st.step}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-serif font-bold text-sm ${isDone ? 'text-[#0B2545] line-through dark:text-[#E2EBFA]' : 'text-[#0B2545] dark:text-[#E2EBFA]'}`}>
                        Step {st.step}: {st.title}
                      </h4>
                      {isDone && <span className="text-[10px] font-bold text-[#0B2545] dark:text-[#C9A227]">Completed</span>}
                    </div>
                    <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
                      {st.description}
                    </p>

                    {st.tips && st.tips.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] block mb-1">Important Tips:</span>
                        <ul className="space-y-1 text-[11px] text-[#555555] dark:text-[#A0B0C5] pl-3 list-disc">
                          {st.tips.map((t, ti) => (
                            <li key={ti}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* NTS Score Improvement Box */}
        <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-[#F7F5F0] p-5 dark:border-[#1A2A40] dark:bg-[#0E1B2D] space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#7A1E2B]" />
            <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-xs uppercase tracking-wider">
              {howToApplyData.nts_score_improvement_procedure.title}
            </h4>
          </div>
          <p className="text-xs font-bold text-[#7A1E2B] dark:text-[#E2EBFA] leading-relaxed">
            {howToApplyData.nts_score_improvement_procedure.critical_notice}
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#555555] dark:text-[#A0B0C5] pl-1 leading-relaxed">
            {howToApplyData.nts_score_improvement_procedure.steps.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ol>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-3">
          <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-[#7A1E2B]" />
            Common Mistakes to Avoid
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#555555] dark:text-[#A0B0C5] list-disc list-inside leading-relaxed">
            {howToApplyData.common_mistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    );
  };

  // --- 9. RENDER FAQS ---
  const renderFaqs = () => {
    const allFaqs = getFaqs();
    const categories = ['All', ...new Set(allFaqs.map(f => f.category).filter(Boolean))];

    const filteredFaqs = allFaqs.filter(faq => {
      const matchesCat = selectedFaqCategory === 'All' || faq.category === selectedFaqCategory;
      const matchesSearch = !searchQuery || 
        (faq.question && faq.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (faq.answer && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <HelpCircle className="h-5 w-5" />
            </span>
            Frequently Asked Questions ({allFaqs.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Common questions regarding admissions, NTS NAT entry test, fees, eligibility, and policies.
          </p>
        </motion.div>

        {/* FAQ Search & Category Filter */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B2545] dark:text-[#809BCE]" />
            <input
              type="text"
              placeholder="Search questions by keyword (e.g., eligibility, NAT, fee, challan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#E7E2D8] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2B2B2B] outline-none placeholder:text-[#888888] focus:border-[#0B2545] dark:border-[#1A2A40] dark:bg-[#0B1524] dark:text-[#E2EBFA] dark:focus:border-[#6C8EBF] transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFaqCategory(cat)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFaqCategory === cat
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'bg-[#F4F5F7] text-[#2B2B2B] hover:bg-[#E7E2D8] dark:bg-[#070D18] dark:text-[#A0B0C5] dark:hover:bg-[#112035] border border-[#E7E2D8] dark:border-[#1A2A40]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQs Accordion List */}
        <motion.div variants={containerVariants} className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-[#666666] font-serif">
              No questions found matching your filter or keyword.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const itemKey = `faq_${faq.id || idx}`;
              const isExpanded = expandedFaqId === itemKey;
              return (
                <motion.div 
                  key={itemKey}
                  variants={itemVariants}
                  className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(itemKey)}
                    className="flex w-full items-center justify-between p-4 text-left font-serif font-bold text-xs sm:text-sm text-[#0B2545] dark:text-[#E2EBFA] hover:bg-[#F4F5F7] dark:hover:bg-[#112035] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 pr-2">
                      {faq.category && (
                        <span className="rounded bg-[#F4F5F7] px-2 py-0.5 text-[9px] font-bold text-[#7A1E2B] border border-[#E7E2D8] dark:bg-[#112035] dark:text-[#C9A227] dark:border-[#1A2A40] shrink-0">
                          {faq.category}
                        </span>
                      )}
                      <span>{faq.question}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-[#0B2545] dark:text-[#C9A227]" /> : <ChevronDown className="h-4 w-4 shrink-0 text-[#0B2545] dark:text-[#809BCE]" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 pt-0 border-t border-[#E7E2D8] dark:border-[#1A2A40] text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed space-y-3 bg-[#FAF9F5] dark:bg-[#070D18]"
                      >
                        <p className="pt-3">{faq.answer}</p>
                        <button
                          onClick={() => onAskQuestion(faq.question, 'FAQs')}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0B2545] dark:text-[#C9A227] hover:underline cursor-pointer"
                        >
                          <span>Ask AI for detailed explanation</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>
    );
  };

  // --- 10. RENDER MERIT LISTS ---
  const renderMeritLists = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Info className="h-5 w-5" />
            </span>
            Historical Closing Merit Lists
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">
            Official closing merit percentages per program. Formula: Matric 10% + FSc 40% + NAT 50%.
          </p>
        </motion.div>

        {meritListsData.programs.map((prog, idx) => {
          const latest = prog.merit_history[prog.merit_history.length - 1];
          const oldest = prog.merit_history[0];
          const change = (latest.closing_merit - oldest.closing_merit).toFixed(2);
          return (
            <motion.div key={idx} variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white p-5 dark:border-[#1A2A40] dark:bg-[#0B1524] shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-base">{prog.program}</h3>
                  <p className="text-[10px] font-bold text-[#7A1E2B] dark:text-[#C9A227] uppercase tracking-wider mt-0.5">{prog.category} · {prog.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-[#0B2545] dark:text-[#C9A227] font-mono">{latest.closing_merit}%</div>
                    <div className="text-[9px] font-bold text-[#555555] uppercase tracking-wider">{latest.session}</div>
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${ parseFloat(change) > 0 ? 'bg-[#F4F5F7] text-[#0B2545] border border-[#E7E2D8]' : 'bg-[#F7F5F0] text-[#7A1E2B] border border-[#E7E2D8]' }`}>
                    {parseFloat(change) > 0 ? '↑' : '↓'} {Math.abs(change)}% since {oldest.session}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E7E2D8] dark:border-[#1A2A40] bg-[#F7F5F0] dark:bg-[#070D18]">
                      <th className="text-left px-3 py-2 font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Session</th>
                      <th className="text-right px-3 py-2 font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Closing Merit</th>
                      <th className="text-right px-3 py-2 font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Seats</th>
                      <th className="text-right px-3 py-2 font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Round</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D8] dark:divide-[#1A2A40]">
                    {[...prog.merit_history].reverse().map((h, hi) => (
                      <tr key={hi} className={hi === 0 ? 'bg-[#F4F5F7] dark:bg-[#112035]' : ''}>
                        <td className="px-3 py-2 font-semibold text-[#2B2B2B] dark:text-[#D8E2EE]">{h.session}</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-[#0B2545] dark:text-[#C9A227]">{h.closing_merit}%</td>
                        <td className="px-3 py-2 text-right text-[#555555] dark:text-[#A0B0C5]">{h.seats}</td>
                        <td className="px-3 py-2 text-right text-[#555555] dark:text-[#A0B0C5]">{h.round}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10.5px] text-[#555555] dark:text-[#A0B0C5] leading-relaxed">{prog.trend_note}</p>
              <button
                onClick={() => onAskQuestion(`What is the merit trend and my admission chances for ${prog.program}?`, 'Merit Lists')}
                className="flex w-full items-center justify-between rounded-md bg-[#F4F5F7] border border-[#E7E2D8] px-4 py-2.5 text-xs font-bold text-[#0B2545] hover:bg-[#0B2545] hover:text-white dark:bg-[#070D18] dark:border-[#1A2A40] dark:text-[#E2EBFA] dark:hover:bg-[#7A1E2B] transition-all cursor-pointer"
              >
                <span>Ask AI about {prog.abbreviation} merit trends</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}

        <motion.div variants={itemVariants} className="rounded-lg bg-[#F7F5F0] border border-[#E7E2D8] dark:bg-[#0E1B2D] dark:border-[#1A2A40] p-4 text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed space-y-1">
          {meritListsData.general_notes.map((n, i) => <p key={i}>• {n}</p>)}
        </motion.div>
      </motion.div>
    );
  };

  // --- 11. RENDER CONTACT INFO ---
  const renderContactInfo = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Mail className="h-5 w-5" />
            </span>
            Contact Information
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">Official CUI Wah Campus contact details for admissions, departments, and student services.</p>
        </motion.div>

        {/* Admissions Office */}
        <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-[#F7F5F0] dark:border-[#1A2A40] dark:bg-[#0E1B2D] p-5 space-y-3">
          <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">📞 Admissions Office</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              ['Phone', contactData.admissions_office.phone],
              ['Alt Phone', contactData.admissions_office.phone_alt],
              ['Email', contactData.admissions_office.email],
              ['NTS Email', contactData.admissions_office.email_nts],
              ['Office Hours', contactData.admissions_office.office_hours],
              ['Address', contactData.admissions_office.physical_address]
            ].map(([label, val]) => (
              <div key={label} className="rounded-md bg-white dark:bg-[#0B1524] border border-[#E7E2D8] dark:border-[#1A2A40] p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] mb-0.5">{label}</div>
                <div className="font-bold text-[#0B2545] dark:text-[#E2EBFA] break-all">{val}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Departments */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227]">Department Contacts</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contactData.departments.map((dept, i) => (
              <div key={i} className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] p-4 shadow-xs space-y-2">
                <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">{dept.name}</h4>
                <p className="text-[10px] font-bold text-[#7A1E2B] dark:text-[#C9A227]">{dept.email}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dept.programs.map((p, pi) => <span key={pi} className="rounded bg-[#F4F5F7] dark:bg-[#112035] px-1.5 py-0.5 text-[9px] font-bold text-[#0B2545] dark:text-[#E2EBFA] border border-[#E7E2D8] dark:border-[#1A2A40]">{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Student Services */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227]">Student Services</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(contactData.student_services).map(([key, svc]) => (
              <div key={key} className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] p-4 shadow-xs">
                <h4 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-xs">{svc.name}</h4>
                {svc.email && <p className="text-[10px] font-bold text-[#7A1E2B] dark:text-[#C9A227] mt-1">{svc.email}</p>}
                {svc.phone && <p className="text-[10px] font-bold text-[#0B2545] dark:text-[#E2EBFA] mt-1">{svc.phone}</p>}
                {svc.note && <p className="text-[10px] text-[#555555] dark:text-[#A0B0C5] mt-1.5 leading-relaxed">{svc.note}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button 
          variants={itemVariants} 
          whileTap={{ scale: 0.98 }}
          onClick={() => onAskQuestion('What is the phone number and email for CUI Wah Campus admissions office?', 'Contact Info')}
          className="flex w-full items-center justify-between rounded-lg bg-[#0B2545] hover:bg-[#7A1E2B] px-5 py-4 text-sm font-bold text-white transition-all shadow-xs cursor-pointer"
        >
          <span>Ask AI for contact details</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  };

  // --- 12. RENDER ANNOUNCEMENTS ---
  const renderAnnouncements = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Info className="h-5 w-5" />
            </span>
            News & Announcements
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">Latest official notices, admission updates, and academic calendar for Fall 2025.</p>
        </motion.div>

        {announcementsData.announcements.map((ann, i) => {
          return (
            <motion.div key={i} variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] p-5 shadow-xs space-y-3">
              <div className="flex items-start gap-3 justify-between flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#0B2545] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">{ann.badge}</span>
                    <span className="text-[10px] text-[#555555] dark:text-[#A0B0C5]">{ann.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">{ann.title}</h3>
                </div>
              </div>
              <p className="text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">{ann.details || ann.summary}</p>
              <button
                onClick={() => onAskQuestion(ann.title, ann.category)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B2545] dark:text-[#C9A227] hover:underline cursor-pointer"
              >
                <span>Ask AI for more details</span><ArrowRight className="h-3 w-3" />
              </button>
            </motion.div>
          );
        })}

        {/* Academic Calendar */}
        <motion.div variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-[#F7F5F0] dark:border-[#1A2A40] dark:bg-[#0E1B2D] p-5 space-y-3">
          <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">📅 Fall 2025 Academic Calendar</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(announcementsData.academic_calendar_fall_2025).map(([key, val]) => (
              <div key={key} className="rounded-md bg-white dark:bg-[#0B1524] border border-[#E7E2D8] dark:border-[#1A2A40] p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] mb-0.5">{key.replace(/_/g, ' ')}</div>
                <div className="font-bold text-[#0B2545] dark:text-[#E2EBFA] text-xs">{val}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // --- 13. RENDER POLICIES ---
  const renderPolicies = () => {
    const sections = ['attendance_policy','academic_integrity','exam_policy','grading_system','code_of_conduct','degree_completion','transfer_policy','hostel_rules'];
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-full"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-[#E2EBFA] flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227]">
              <Shield className="h-5 w-5" />
            </span>
            University Policies & Regulations
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0B0C5] mt-1">Official CUI Wah Campus academic policies, conduct rules, and regulations.</p>
        </motion.div>

        {sections.filter(s => policiesData[s]).map((sectionKey, i) => {
          const section = policiesData[sectionKey];
          return (
            <motion.div key={i} variants={itemVariants} className="rounded-lg border border-[#E7E2D8] bg-white dark:border-[#1A2A40] dark:bg-[#0B1524] p-5 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-sm">{section.title}</h3>
              {section.minimum_required && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-[#0B2545] dark:text-[#E2EBFA] font-mono">{section.minimum_required}</span>
                  <span className="text-xs text-[#555555] dark:text-[#A0B0C5]">minimum required</span>
                </div>
              )}
              {section.rules && (
                <ul className="space-y-2">
                  {section.rules.map((rule, ri) => (
                    <li key={ri} className="flex gap-2 items-start text-xs text-[#555555] dark:text-[#A0B0C5] leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#7A1E2B] shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              )}
              {section.grades && (
                <div className="overflow-x-auto rounded-md border border-[#E7E2D8] dark:border-[#1A2A40]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#F7F5F0] dark:bg-[#070D18] border-b border-[#E7E2D8] dark:border-[#1A2A40]">
                        <th className="px-3 py-2 text-left font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Grade</th>
                        <th className="px-3 py-2 text-right font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">GPA</th>
                        <th className="px-3 py-2 text-right font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA]">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2D8] dark:divide-[#1A2A40]">
                      {section.grades.map((g, gi) => (
                        <tr key={gi}>
                          <td className="px-3 py-1.5 font-extrabold text-[#0B2545] dark:text-[#E2EBFA]">{g.letter}</td>
                          <td className="px-3 py-1.5 text-right font-mono text-[#0B2545] dark:text-[#C9A227]">{g.gpa}</td>
                          <td className="px-3 py-1.5 text-right text-[#555555] dark:text-[#A0B0C5]">{g.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                onClick={() => onAskQuestion(`What is CUI's ${section.title}?`, 'Policies')}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B2545] dark:text-[#C9A227] hover:underline mt-1 cursor-pointer"
              >
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
        <div className="py-16 text-center text-[#666666] font-serif text-sm">
          No explorer section found for category: {category}
        </div>
      );
  }
}
