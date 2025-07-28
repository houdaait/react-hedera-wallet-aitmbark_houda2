import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Loader2, Copy, CheckCircle } from 'lucide-react';
import { hederaService, TransactionResult } from '@/services/hederaService';
import { useToast } from '@/hooks/use-toast';

interface CreateTokenProps {
  onBack: () => void;
}

export function CreateToken({ onBack }: CreateTokenProps) {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!tokenName || !tokenSymbol || !initialSupply) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const tokenResult = await hederaService.createToken(tokenName, tokenSymbol, initialSupply);
      setResult(tokenResult);
      
      if (tokenResult.success) {
        toast({
          title: "Success",
          description: `Token ${tokenSymbol} created successfully!`,
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: tokenResult.error || "Failed to create token",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const resetForm = () => {
    setTokenName('');
    setTokenSymbol('');
    setInitialSupply('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create Token</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create Fungible Token
            </CardTitle>
            <CardDescription>
              Create a new HTS fungible token on Hedera
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokenName">Token Name</Label>
              <Input
                id="tokenName"
                placeholder="My Token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input
                id="tokenSymbol"
                placeholder="MTK"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                className="focus:border-primary"
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialSupply">Initial Supply</Label>
              <Input
                id="initialSupply"
                type="number"
                placeholder="1000"
                min="1"
                value={initialSupply}
                onChange={(e) => setInitialSupply(e.target.value)}
                className="focus:border-primary"
              />
            </div>

            <Button 
              onClick={handleCreate} 
              disabled={loading || !tokenName || !tokenSymbol || !initialSupply}
              className="w-full bg-gradient-primary hover:shadow-glow-blue"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Token...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Token
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={result.success ? "border-success" : "border-destructive"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <span className="h-5 w-5 text-destructive">❌</span>
                )}
                Transaction Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.success ? (
                <>
                  <div className="space-y-2">
                    <Label>Transaction ID</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={result.transactionId || ''}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.transactionId || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {result.tokenId && (
                    <div className="space-y-2">
                      <Label>Token ID</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={result.tokenId}
                          readOnly
                          className="font-mono text-xs bg-success/10 border-success"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.tokenId || '')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button onClick={resetForm} variant="outline" className="w-full">
                    Create Another Token
                  </Button>
                </>
              ) : (
                <div className="text-destructive text-sm">
                  {result.error}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}