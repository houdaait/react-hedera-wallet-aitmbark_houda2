import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { hederaService } from '@/services/hederaService';
import { useToast } from '@/hooks/use-toast';

interface SendHbarProps {
  onBack: () => void;
}

export function SendHbar({ onBack }: SendHbarProps) {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!recipientId || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await hederaService.sendHbar(recipientId, amount);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully sent ${amount} HBAR to ${recipientId}`,
        });
        setRecipientId('');
        setAmount('');
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to send HBAR",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Send HBAR</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Transfer HBAR
          </CardTitle>
          <CardDescription>
            Send HBAR to another Hedera account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Account ID</Label>
            <Input
              id="recipient"
              placeholder="0.0.123456"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (HBAR)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1.0"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus:border-primary"
            />
          </div>

          <Button 
            onClick={handleSend} 
            disabled={loading || !recipientId || !amount}
            className="w-full bg-gradient-primary hover:shadow-glow-blue"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send HBAR
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}