import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Link, Send, Loader2 } from 'lucide-react';
import { hederaService } from '@/services/hederaService';
import { useToast } from '@/hooks/use-toast';

interface TokenOperationsProps {
  onBack: () => void;
}

export function TokenOperations({ onBack }: TokenOperationsProps) {
  const [associateTokenId, setAssociateTokenId] = useState('');
  const [associateLoading, setAssociateLoading] = useState(false);
  
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferTokenId, setTransferTokenId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  
  const { toast } = useToast();

  const handleAssociate = async () => {
    if (!associateTokenId) {
      toast({
        title: "Error",
        description: "Please enter a token ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setAssociateLoading(true);
      const result = await hederaService.associateToken(associateTokenId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully associated with token ${associateTokenId}`,
        });
        setAssociateTokenId('');
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to associate token",
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
      setAssociateLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferRecipient || !transferTokenId || !transferAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setTransferLoading(true);
      const result = await hederaService.sendToken(transferRecipient, transferTokenId, transferAmount);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully sent ${transferAmount} tokens to ${transferRecipient}`,
        });
        setTransferRecipient('');
        setTransferTokenId('');
        setTransferAmount('');
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to send token",
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
      setTransferLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Token Operations</h1>
      </div>

      <div className="max-w-md mx-auto">
        <Tabs defaultValue="associate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="associate">Associate Token</TabsTrigger>
            <TabsTrigger value="transfer">Transfer Token</TabsTrigger>
          </TabsList>
          
          <TabsContent value="associate" className="space-y-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  Associate Token
                </CardTitle>
                <CardDescription>
                  Associate your account with an existing token
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="associateTokenId">Token ID</Label>
                  <Input
                    id="associateTokenId"
                    placeholder="0.0.123456"
                    value={associateTokenId}
                    onChange={(e) => setAssociateTokenId(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>

                <Button 
                  onClick={handleAssociate} 
                  disabled={associateLoading || !associateTokenId}
                  className="w-full bg-gradient-primary hover:shadow-glow-blue"
                >
                  {associateLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Associating...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Associate Token
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer" className="space-y-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Transfer Token
                </CardTitle>
                <CardDescription>
                  Send tokens to another account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transferRecipient">Recipient Account ID</Label>
                  <Input
                    id="transferRecipient"
                    placeholder="0.0.123456"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferTokenId">Token ID</Label>
                  <Input
                    id="transferTokenId"
                    placeholder="0.0.123456"
                    value={transferTokenId}
                    onChange={(e) => setTransferTokenId(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferAmount">Amount</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    placeholder="100"
                    min="0"
                    step="0.01"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>

                <Button 
                  onClick={handleTransfer} 
                  disabled={transferLoading || !transferRecipient || !transferTokenId || !transferAmount}
                  className="w-full bg-gradient-primary hover:shadow-glow-blue"
                >
                  {transferLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Token
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}