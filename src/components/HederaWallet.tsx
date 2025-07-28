import React, { useState } from 'react';
import { WalletConnect } from './WalletConnect';
import { WalletDashboard } from './WalletDashboard';
import { SendHbar } from './SendHbar';
import { CreateToken } from './CreateToken';
import { TokenOperations } from './TokenOperations';
import { TopicManagement } from './TopicManagement';
import { hederaService } from '@/services/hederaService';

type WalletSection = 'dashboard' | 'send-hbar' | 'create-token' | 'token-operations' | 'topics';

export function HederaWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentSection, setCurrentSection] = useState<WalletSection>('dashboard');

  const handleConnect = () => {
    setIsConnected(true);
    setCurrentSection('dashboard');
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section as WalletSection);
  };

  const handleBack = () => {
    setCurrentSection('dashboard');
  };

  if (!isConnected) {
    return <WalletConnect onConnect={handleConnect} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {currentSection === 'dashboard' && (
          <WalletDashboard onNavigate={handleNavigate} />
        )}
        
        {currentSection === 'send-hbar' && (
          <SendHbar onBack={handleBack} />
        )}
        
        {currentSection === 'create-token' && (
          <CreateToken onBack={handleBack} />
        )}
        
        {currentSection === 'token-operations' && (
          <TokenOperations onBack={handleBack} />
        )}
        
        {currentSection === 'topics' && (
          <TopicManagement onBack={handleBack} />
        )}
      </div>
    </div>
  );
}