import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Key, Shield } from 'lucide-react';
import { hederaService, HederaCredentials } from '@/services/hederaService';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  onConnect: () => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [accountId, setAccountId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if credentials are already stored
    const stored = localStorage.getItem('hedera-credentials');
    if (stored) {
      try {
        const credentials: HederaCredentials = JSON.parse(stored);
        setAccountId(credentials.accountId);
        setPrivateKey(credentials.privateKey);
        hederaService.setCredentials(credentials);
        onConnect();
      } catch (error) {
        localStorage.removeItem('hedera-credentials');
      }
    }
  }, [onConnect]);

  const handleConnect = async () => {
    if (!accountId || !privateKey) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!accountId.match(/^0\.0\.\d+$/)) {
      toast({
        title: "Invalid Account ID",
        description: "Account ID must be in format 0.0.123456",
        variant: "destructive",
      });
      return;
    }

    if (privateKey.length !== 64) {
      toast({
        title: "Invalid Private Key",
        description: "Private key must be 64 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const credentials: HederaCredentials = { accountId, privateKey };
      
      // Set credentials and test connection
      hederaService.setCredentials(credentials);
      await hederaService.getAccountInfo();
      
      // Store credentials locally
      localStorage.setItem('hedera-credentials', JSON.stringify(credentials));
      
      toast({
        title: "Success",
        description: "Wallet connected successfully!",
      });
      
      onConnect();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Invalid credentials or network error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('hedera-credentials');
    setAccountId('');
    setPrivateKey('');
    toast({
      title: "Disconnected",
      description: "Wallet disconnected successfully",
    });
  };

  const isConnected = hederaService.getCredentials() !== null;

  if (isConnected) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card className="border-success">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-success">
              <Shield className="h-5 w-5" />
              Wallet Connected
            </CardTitle>
            <CardDescription>
              Connected to Hedera Testnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <p className="text-sm font-medium">Account ID</p>
              <p className="font-mono text-sm">{accountId}</p>
            </div>
            <Button 
              onClick={handleDisconnect} 
              variant="outline" 
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <div className="text-center space-y-2">
        <Wallet className="h-16 w-16 mx-auto text-primary" />
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Hedera Wallet
        </h1>
        <p className="text-muted-foreground">
          Connect your Hedera account to get started
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your credentials are stored locally in your browser and never sent to external servers.
          This wallet connects to Hedera Testnet.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            Enter your Hedera testnet credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">Account ID</Label>
            <Input
              id="accountId"
              placeholder="0.0.123456"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key</Label>
            <Input
              id="privateKey"
              type="password"
              placeholder="Enter your private key (64 characters)"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="focus:border-primary font-mono"
            />
          </div>

          <Button 
            onClick={handleConnect}
            disabled={loading || !accountId || !privateKey}
            className="w-full bg-gradient-primary hover:shadow-glow-blue"
          >
            {loading ? (
              <>
                <Wallet className="h-4 w-4 mr-2 animate-pulse" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription className="text-sm">
          <strong>Need testnet credentials?</strong><br />
          Visit the{' '}
          <a 
            href="https://portal.hedera.com/register" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Hedera Portal
          </a>
          {' '}to create a testnet account.
        </AlertDescription>
      </Alert>
    </div>
  );
}