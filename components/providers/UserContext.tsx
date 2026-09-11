'use client';
import { createContext, useContext, useState, useEffect } from 'react';

// Define the available tiers
export type UserTier = 'INTERNATIONAL' | 'RESIDENT' | 'CITIZEN';

const UserContext = createContext({
    tier: 'INTERNATIONAL' as UserTier,
    setTier: (tier: UserTier) => { }
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [tier, setTierState] = useState<UserTier>('INTERNATIONAL');

    useEffect(() => {
        const saved = localStorage.getItem('userTier') as UserTier;
        if (saved) setTierState(saved);
    }, []);

    const setTier = (newTier: UserTier) => {
        setTierState(newTier);
        localStorage.setItem('userTier', newTier);
    };

    return (
        <UserContext.Provider value={{ tier, setTier }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);