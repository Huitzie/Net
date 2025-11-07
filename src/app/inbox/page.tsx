
'use client';

import type { NextPage } from 'next';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Conversation, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// Mock function to get participant details - in a real app, you'd fetch this
const getOtherParticipant = async (participantIds: string[], currentUserUid: string) => {
    // This is a simplified mock. A real implementation would fetch user docs from firestore.
    const otherId = participantIds.find(id => id !== currentUserUid);
    return {
        id: otherId,
        name: `Vendor ${otherId?.substring(0,5)}`,
        avatar: `https://avatar.vercel.sh/${otherId}.png?size=40`
    };
};


const InboxPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'conversations'), where('participantIds', 'array-contains', user.uid));
  }, [firestore, user?.uid]);

  const { data: conversations, isLoading: areConversationsLoading } = useCollection<Conversation>(conversationsQuery);
  
  const isLoading = isUserLoading || areConversationsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3">Loading your messages...</p>
      </div>
    );
  }
  
  if (!user) {
     return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <Mail className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-6">Please log in to view your inbox.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
       <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
                <Mail className="mr-3 h-8 w-8 text-primary" />
                My Inbox
            </CardTitle>
            <CardDescription>All your communications with vendors in one place.</CardDescription>
        </CardHeader>
        <CardContent>
            {conversations && conversations.length > 0 ? (
                <div className="space-y-4">
                    {conversations.map(convo => (
                        <Link href={`/inbox/${convo.id}`} key={convo.id} legacyBehavior>
                           <a className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                             <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12 border">
                                    {/* In a real app, fetch the other user's profile image */}
                                    <AvatarImage src={`https://avatar.vercel.sh/${convo.participantIds.find(p => p !== user.uid)}.png?size=48`} data-ai-hint="vendor avatar" />
                                    <AvatarFallback>{convo.participantIds.find(p => p !== user.uid)?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-lg">
                                            {/* In a real app, fetch the other user's name */}
                                           Vendor
                                        </p>
                                        {convo.lastMessageTimestamp && (
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(convo.lastMessageTimestamp.toDate(), { addSuffix: true })}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {convo.lastMessage || 'No messages yet...'}
                                    </p>
                                </div>
                             </div>
                           </a>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Your inbox is empty.</p>
                    <p className="text-sm text-muted-foreground mt-1">Start a conversation with a vendor to see it here.</p>
                     <Button asChild variant="outline" className="mt-6">
                        <Link href="/search">Find Vendors to Message</Link>
                    </Button>
                </div>
            )}
        </CardContent>
       </Card>
    </div>
  );
};


export default InboxPage;
