// components/VehicleWeightDropdown.tsx
import React from 'react';

// Define the interface for props to ensure type safety
interface VehicleWeightDropdownProps {
  onSelect: (value: string) => void;
  className?: string; // Optional: allows you to override styles from parent
}

const VehicleWeightDropdown = ({ onSelect, className = "" }: VehicleWeightDropdownProps) => {
  const options = [
    { label: 'Up to 2,000kg', value: 'up_to_2000kg' },
    { label: '2,001–3,000kg', value: '2001_3000kg' },
    { label: '3,001–5,000kg', value: '3001_5000kg' },
  ];

  return (
    <select 
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSelect(e.target.value)} 
      className={`p-2 border rounded ${className}`}
    >
      <option value="">Select Vehicle Weight</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default VehicleWeightDropdown;