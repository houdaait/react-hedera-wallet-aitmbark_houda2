import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, RefreshCw, Send, Plus, MessageSquare, Link } from 'lucide-react';
import { hederaService, AccountInfo } from '@/services/hederaService';
import { useToast } from '@/hooks/use-toast';

interface WalletDashboardProps {
  onNavigate: (section: string) => void;
}

export function WalletDashboard({ onNavigate }: WalletDashboardProps) {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadAccountInfo = async () => {
    try {
      setLoading(true);
      const info = await hederaService.getAccountInfo();
      setAccountInfo(info);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load account information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const credentials = hederaService.getCredentials();
    if (credentials) {
      loadAccountInfo();
    }
  }, []);

  if (!accountInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Connect your wallet to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <Card className="border-primary/20 shadow-blue">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Account Overview
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {accountInfo.accountId}
              </CardDescription>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={loadAccountInfo}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">HBAR Balance</p>
              <p className="text-2xl font-bold text-primary">{accountInfo.balance}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Associated Tokens</p>
              <p className="text-2xl font-bold text-primary">{accountInfo.tokens.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-blue transition-all duration-200 cursor-pointer group"
              onClick={() => onNavigate('send-hbar')}>
          <CardContent className="p-6 text-center">
            <Send className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold">Send HBAR</h3>
            <p className="text-sm text-muted-foreground">Transfer HBAR to another account</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-blue transition-all duration-200 cursor-pointer group"
              onClick={() => onNavigate('create-token')}>
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold">Create Token</h3>
            <p className="text-sm text-muted-foreground">Create a new fungible token</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-blue transition-all duration-200 cursor-pointer group"
              onClick={() => onNavigate('topics')}>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold">Topics</h3>
            <p className="text-sm text-muted-foreground">Manage consensus topics</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-blue transition-all duration-200 cursor-pointer group"
              onClick={() => onNavigate('token-operations')}>
          <CardContent className="p-6 text-center">
            <Link className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold">Token Ops</h3>
            <p className="text-sm text-muted-foreground">Associate & transfer tokens</p>
          </CardContent>
        </Card>
      </div>

      {/* Token Balances */}
      {accountInfo.tokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Token Balances</CardTitle>
            <CardDescription>Your associated token balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountInfo.tokens.map((token) => (
                <div key={token.tokenId} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium">{token.tokenId}</p>
                    <p className="text-sm text-muted-foreground">Token ID</p>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {(parseInt(token.balance) / 100).toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}