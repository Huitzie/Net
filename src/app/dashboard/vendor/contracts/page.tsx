
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Bot, Send, RefreshCw, Clipboard, Check } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { generateContract, type ContractInput } from '@/ai/flows/contract-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ContractsAIPage: NextPage = () => {
  const { user } = useUser();
  const firestore = useFirestore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const servicesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'vendors', user.uid, 'services');
  }, [firestore, user?.uid]);

  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesCollectionRef);

  useEffect(() => {
    // Start with a greeting from the assistant
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm here to help you draft a professional service agreement. I can assist you in English, Spanish, and several other languages. What language shall we use today?",
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        // Use timeout to wait for the DOM to update with the new message
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }, 100);
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contractInput: ContractInput = {
        prompt: input,
        history: messages,
        services: services || [],
      };
      const response = await generateContract(contractInput);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating contract:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, but I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast({title: 'Copied to clipboard!'});
      setTimeout(() => setIsCopied(false), 2000);
    }, (err) => {
      console.error('Failed to copy text: ', err);
      toast({title: 'Failed to copy', variant: 'destructive'});
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vendor">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="h-[75vh] flex flex-col shadow-2xl">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center text-2xl">
            <Bot className="mr-3 h-7 w-7 text-primary" />
            AI Contract Assistant
          </CardTitle>
          <CardDescription>
            Chat with the AI to generate a service agreement. The more details you provide, the better the contract will be.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                        <Avatar className="h-9 w-9 border-2 border-primary">
                        <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`max-w-lg rounded-xl px-4 py-3 shadow ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {(message.content.includes('SERVICE AGREEMENT') || message.content.includes('ACUERDO DE SERVICIO')) && (
                             <Button size="sm" variant="ghost" className="mt-2 text-xs" onClick={() => copyToClipboard(message.content)}>
                                {isCopied ? <Check className="mr-2"/> : <Clipboard className="mr-2"/>}
                                Copy Contract
                            </Button>
                        )}
                    </div>
                    {message.role === 'user' && user && (
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || ''} alt="User" />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border-2 border-primary">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-lg rounded-xl px-4 py-3 shadow bg-muted flex items-center">
                            <RefreshCw className="h-5 w-5 animate-spin text-primary"/>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="border-t p-4 bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={areServicesLoading ? "Loading your services..." : "Provide details for the contract..."}
                        className="flex-1 resize-none"
                        rows={1}
                        disabled={areServicesLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim() || areServicesLoading}>
                        <Send className="h-5 w-5"/>
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractsAIPage;
