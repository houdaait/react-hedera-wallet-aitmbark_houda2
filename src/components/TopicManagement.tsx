import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Send, MessageSquare, Loader2, Copy, Eye } from 'lucide-react';
import { hederaService, TransactionResult, TopicMessageData } from '@/services/hederaService';
import { useToast } from '@/hooks/use-toast';

interface TopicManagementProps {
  onBack: () => void;
}

export function TopicManagement({ onBack }: TopicManagementProps) {
  const [topicMemo, setTopicMemo] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState<TransactionResult | null>(null);
  
  const [messageTopicId, setMessageTopicId] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  
  const [viewTopicId, setViewTopicId] = useState('');
  const [messages, setMessages] = useState<TopicMessageData[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  
  const { toast } = useToast();

  const handleCreateTopic = async () => {
    if (!topicMemo) {
      toast({
        title: "Error",
        description: "Please enter a topic memo",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreateLoading(true);
      const result = await hederaService.createTopic(topicMemo, isPrivate);
      setCreateResult(result);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Topic created successfully!",
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to create topic",
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
      setCreateLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageTopicId || !messageContent) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendLoading(true);
      const result = await hederaService.sendMessage(messageTopicId, messageContent);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Message sent successfully!",
        });
        setMessageContent('');
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to send message",
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
      setSendLoading(false);
    }
  };

  const handleViewMessages = async () => {
    if (!viewTopicId) {
      toast({
        title: "Error",
        description: "Please enter a topic ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setViewLoading(true);
      const topicMessages = await hederaService.getTopicMessages(viewTopicId);
      setMessages(topicMessages);
      toast({
        title: "Success",
        description: `Loaded ${topicMessages.length} messages`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setViewLoading(false);
    }
  };

  const subscribeToTopic = () => {
    if (!viewTopicId) return;

    try {
      const unsubscribe = hederaService.subscribeToTopic(viewTopicId, (message) => {
        setMessages(prev => [...prev, message]);
        toast({
          title: "New Message",
          description: `Received message: ${message.message.substring(0, 50)}...`,
        });
      });

      setSubscribed(true);
      toast({
        title: "Subscribed",
        description: "Now listening for new messages",
      });

      return unsubscribe;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe to topic",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const resetCreateForm = () => {
    setTopicMemo('');
    setIsPrivate(false);
    setCreateResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Topic Management</h1>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Topic</TabsTrigger>
          <TabsTrigger value="send">Send Message</TabsTrigger>
          <TabsTrigger value="view">View Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <div className="max-w-md mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create Topic
                </CardTitle>
                <CardDescription>
                  Create a new consensus topic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topicMemo">Topic Memo</Label>
                  <Input
                    id="topicMemo"
                    placeholder="My Topic Description"
                    value={topicMemo}
                    onChange={(e) => setTopicMemo(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label htmlFor="private">Private Topic</Label>
                </div>

                <Button 
                  onClick={handleCreateTopic} 
                  disabled={createLoading || !topicMemo}
                  className="w-full bg-gradient-primary hover:shadow-glow-blue"
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Topic
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {createResult && createResult.success && (
              <Card className="border-success">
                <CardHeader>
                  <CardTitle className="text-success">Topic Created!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Topic ID</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={createResult.topicId || ''}
                        readOnly
                        className="font-mono text-xs bg-success/10 border-success"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(createResult.topicId || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={resetCreateForm} variant="outline" className="w-full">
                    Create Another Topic
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Send Message
                </CardTitle>
                <CardDescription>
                  Send a message to a topic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="messageTopicId">Topic ID</Label>
                  <Input
                    id="messageTopicId"
                    placeholder="0.0.123456"
                    value={messageTopicId}
                    onChange={(e) => setMessageTopicId(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messageContent">Message</Label>
                  <Input
                    id="messageContent"
                    placeholder="Hello, Hedera!"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>

                <Button 
                  onClick={handleSendMessage} 
                  disabled={sendLoading || !messageTopicId || !messageContent}
                  className="w-full bg-gradient-primary hover:shadow-glow-blue"
                >
                  {sendLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="view" className="space-y-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  View Topic Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Topic ID (0.0.123456)"
                    value={viewTopicId}
                    onChange={(e) => setViewTopicId(e.target.value)}
                    className="focus:border-primary"
                  />
                  <Button 
                    onClick={handleViewMessages}
                    disabled={viewLoading || !viewTopicId}
                  >
                    {viewLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    onClick={subscribeToTopic}
                    disabled={!viewTopicId || subscribed}
                    variant="outline"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                {subscribed && (
                  <Badge variant="outline" className="text-success border-success">
                    Subscribed to real-time updates
                  </Badge>
                )}
              </CardContent>
            </Card>

            {messages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Messages ({messages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.map((message, index) => (
                      <div key={index} className="p-3 bg-accent rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">
                            Seq: {message.sequenceNumber}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(parseInt(message.consensusTimestamp.split('.')[0]) * 1000).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm break-words">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}