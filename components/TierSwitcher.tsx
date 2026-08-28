'use client';
import { motion } from 'framer-motion';
import { useUser, UserTier } from '@/components/providers/UserContext';

const TIER_OPTIONS: { value: UserTier; label: string }[] = [
  { value: 'INTERNATIONAL', label: 'International' },
  { value: 'RESIDENT', label: 'Resident' },
  { value: 'PERMIT', label: 'Permit' },
];

export const TierSwitcher = () => {
  const { tier, setTier } = useUser();

  return (
    <div className="flex bg-gray-100 p-1 rounded-full w-fit shadow-inner">
      {TIER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setTier(option.value)}
          className="relative px-4 py-2 text-sm font-bold rounded-full transition-colors duration-300"
        >
          {tier === option.value && (
            <motion.div
              layoutId="tier-active"
              className="absolute inset-0 bg-white shadow-sm rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className={`relative z-10 ${tier === option.value ? 'text-[#d97706]' : 'text-gray-500'}`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};