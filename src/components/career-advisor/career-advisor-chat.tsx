'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Target, 
  BookOpen,
  MessageSquare,
  Loader2,
  Sparkles,
  History,
  Plus,
  Clock
} from 'lucide-react';
import { getCareerAdvice, saveChatMessage, getChatSessions, getChatMessages } from '@/app/actions';
import type { CareerAdviceInput } from '@/ai/flows/generate-career-advice';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedSkills?: string[];
  actionItems?: string[];
  resources?: Array<{title: string, url: string, type: string}>;
}

interface ChatSession {
  id: string;
  userId: string;
  createdAt: Date;
  lastMessageAt: Date;
  messageCount: number;
}

const QUICK_QUESTIONS = [
  "Help me find a job",
  "Learn a Topic", 
  "Test my Knowledge",
  "How can I improve my resume?",
  "How to make a tech resume?",
  "What's asked in coding interviews?",
  "Where to find remote dev jobs?"
];

export default function CareerAdvisorChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load chat sessions on component mount and when history is shown
  useEffect(() => {
    if (user?.uid) {
      loadChatSessions();
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid && showHistory) {
      loadChatSessions();
    }
  }, [user?.uid, showHistory]);

  const saveToLocalStorage = (messages: ChatMessage[], sessionId: string) => {
    if (typeof window !== 'undefined' && user) {
      console.log('Saving to localStorage:', { sessionId, messageCount: messages.length });
      
      // Save messages to localStorage
      const messagesToSave = messages.map(msg => ({
        id: msg.id,
        message: msg.content,
        role: msg.role,
        sessionId: sessionId,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
        suggestedSkills: msg.suggestedSkills,
        actionItems: msg.actionItems,
        resources: msg.resources
      }));
      localStorage.setItem(`chat_messages_${user.uid}_${sessionId}`, JSON.stringify(messagesToSave));
      
      // Save session info
      const sessions = JSON.parse(localStorage.getItem(`chat_sessions_${user.uid}`) || '[]');
      const existingSessionIndex = sessions.findIndex((s: any) => s.sessionId === sessionId);
      
      const sessionData = {
        id: sessionId,
        sessionId: sessionId,
        userId: user.uid,
        createdAt: existingSessionIndex >= 0 ? sessions[existingSessionIndex].createdAt : new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1]?.content?.substring(0, 100) || 'No preview'
      };
      
      if (existingSessionIndex >= 0) {
        sessions[existingSessionIndex] = sessionData;
      } else {
        sessions.unshift(sessionData);
      }
      
      localStorage.setItem(`chat_sessions_${user.uid}`, JSON.stringify(sessions));
      console.log('Updated localStorage sessions:', sessions.length);
      
      // Immediately update the UI
      setChatSessions(sessions);
    }
  };

  const loadChatSessions = async () => {
    if (!user?.uid) {
      console.log('No user UID available for loading chat sessions');
      return;
    }
    
    console.log('Loading chat sessions for user:', user.uid);
    setLoadingSessions(true);
    
    // Always load from localStorage first to show immediate results
    const localSessions = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem(`chat_sessions_${user.uid}`) || '[]') : [];
    
    console.log('Local sessions found:', localSessions.length);
    
    if (localSessions.length > 0) {
      // Ensure dates are properly formatted for local sessions
      const formattedLocalSessions = localSessions.map((session: any) => ({
        ...session,
        createdAt: typeof session.createdAt === 'string' ? session.createdAt : new Date(session.createdAt).toISOString(),
        lastMessageAt: typeof session.lastMessageAt === 'string' ? session.lastMessageAt : new Date(session.lastMessageAt).toISOString()
      }));
      setChatSessions(formattedLocalSessions);
      console.log('Loaded local chat sessions:', formattedLocalSessions.length);
    }
    
    try {
      const result = await getChatSessions(user.uid);
      console.log('getChatSessions result:', result);
      if (result.success && result.sessions.length > 0) {
        setChatSessions(result.sessions);
        console.log('Loaded remote chat sessions:', result.sessions.length);
      } else if (localSessions.length === 0) {
        console.log('No sessions found locally or remotely');
        setChatSessions([]);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      // Keep local sessions if remote fails
      if (localSessions.length === 0) {
        toast({
          title: "Notice",
          description: "Using offline chat history",
          variant: "default",
        });
      }
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadChatMessages = async (selectedSessionId: string) => {
    if (!user) return;
    
    console.log('Loading chat messages for session:', selectedSessionId);
    setIsLoading(true);
    
    // Load from localStorage first
    const localMessages = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem(`chat_messages_${user.uid}_${selectedSessionId}`) || '[]') : [];
    
    console.log('Local messages found:', localMessages.length);
    
    try {
      const result = await getChatMessages(user.uid, selectedSessionId);
      if (result.success && result.messages.length > 0) {
        const formattedMessages = result.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.message,
          timestamp: msg.timestamp,
          suggestedSkills: msg.suggestedSkills,
          actionItems: msg.actionItems,
          resources: msg.resources
        }));
        setMessages(formattedMessages);
        setSessionId(selectedSessionId);
        setShowHistory(false);
        console.log('Loaded remote messages:', formattedMessages.length);
      } else if (localMessages.length > 0) {
        // Use localStorage messages
        const formattedMessages = localMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.message,
          timestamp: new Date(msg.timestamp),
          suggestedSkills: msg.suggestedSkills,
          actionItems: msg.actionItems,
          resources: msg.resources
        }));
        setMessages(formattedMessages);
        setSessionId(selectedSessionId);
        setShowHistory(false);
        console.log('Loaded local messages:', formattedMessages.length);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
      // Use localStorage as fallback
      if (localMessages.length > 0) {
        const formattedMessages = localMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.message,
          timestamp: new Date(msg.timestamp),
          suggestedSkills: msg.suggestedSkills,
          actionItems: msg.actionItems,
          resources: msg.resources
        }));
        setMessages(formattedMessages);
        setSessionId(selectedSessionId);
        setShowHistory(false);
        console.log('Used local messages as fallback:', formattedMessages.length);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId('');
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    let targetDate: Date;
    
    if (typeof date === 'string') {
      targetDate = new Date(date);
    } else if (date instanceof Date) {
      targetDate = date;
    } else {
      return 'Unknown time';
    }
    
    // Check if date is valid
    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }
    
    const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return targetDate.toLocaleDateString();
  };

  const formatDate = (date: Date | string) => {
    let targetDate: Date;
    
    if (typeof date === 'string') {
      targetDate = new Date(date);
    } else if (date instanceof Date) {
      targetDate = date;
    } else {
      return 'Unknown date';
    }
    
    // Check if date is valid
    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }
    
    return targetDate.toLocaleDateString();
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSubmit(question);
  };

  const handleSubmit = async (questionText?: string) => {
    const question = questionText || input.trim();
    if (!question || !user || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Save to localStorage after adding user message
      const tempSessionId = sessionId || `temp_${Date.now()}`;
      saveToLocalStorage(newMessages, tempSessionId);
      return newMessages;
    });
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to Firestore
      const saveResult = await saveChatMessage({
        userId: user.uid,
        message: question,
        role: 'user',
        sessionId: sessionId || undefined
      });

      if (!sessionId && saveResult.success) {
        setSessionId(saveResult.sessionId);
      }

      // Prepare input for AI
      const aiInput: CareerAdviceInput = {
        question,
        userCareer: user.career,
        userSkills: user.skills,
        userExperience: user.experience,
        chatHistory: messages.slice(-4).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      };

      // Get AI response
      const result = await getCareerAdvice(aiInput);

      if (result.success && result.data) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.data.advice,
          timestamp: new Date(),
          suggestedSkills: result.data.suggestedSkills,
          actionItems: result.data.actionItems,
          resources: result.data.resources
        };

        setMessages(prev => {
          const newMessages = [...prev, assistantMessage];
          // Save to localStorage after updating state
          saveToLocalStorage(newMessages, saveResult.sessionId);
          return newMessages;
        });

        // Save assistant message to Firestore
        await saveChatMessage({
          userId: user.uid,
          message: result.data.advice,
          role: 'assistant',
          sessionId: saveResult.sessionId
        });

        // Refresh sessions list to show updated last message time
        loadChatSessions();
      } else {
        throw new Error(result.message || 'Failed to get career advice');
      }
    } catch (error) {
      console.error('Error getting career advice:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 h-[calc(100vh-4rem)]">
      <div className="flex gap-4 h-full">
        {/* Chat History Sidebar */}
        <div className={`transition-all duration-300 ${showHistory ? 'w-80' : 'w-0 overflow-hidden'}`}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat History</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {loadingSessions ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : chatSessions.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No chat history yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-3">
                    {chatSessions.map((session) => (
                      <Button
                        key={session.id}
                        variant={sessionId === session.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto p-3 text-left"
                        onClick={() => loadChatMessages(session.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(session.lastMessageAt)}
                            </span>
                          </div>
                          <p className="text-sm font-medium truncate">
                            Chat {session.messageCount} messages
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(session.createdAt)}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Career Advisor</h1>
                  <p className="text-muted-foreground">Get personalized career guidance powered by AI</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2"
              >
                <History className="w-4 h-4" />
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
            </div>
            
            {messages.length === 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="w-5 h-5" />
                    How can I help you?
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about your career, skills to learn, or how to succeed in tech
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {QUICK_QUESTIONS.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-left h-auto p-3 whitespace-normal"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-start justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mt-1">
                      <Bot className="w-4 h-4 text-white mt-2" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <Card className={`${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-card'
                    }`}>
                      <CardContent className="p-4">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Additional content for assistant messages */}
                        {message.role === 'assistant' && (
                          <div className="mt-4 space-y-3">
                            {message.suggestedSkills && message.suggestedSkills.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-medium">Suggested Skills</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestedSkills.map((skill, index) => (
                                    <Badge key={index} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {message.actionItems && message.actionItems.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium">Action Items</span>
                                </div>
                                <ul className="text-sm space-y-1">
                                  {message.actionItems.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-green-500 mt-1">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {message.resources && message.resources.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <BookOpen className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium">Resources</span>
                                </div>
                                <div className="space-y-2">
                                  {message.resources.map((resource, index) => (
                                    <a
                                      key={index}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-2 border rounded-lg hover:bg-accent transition-colors"
                                    >
                                      <div className="font-medium text-sm">{resource.title}</div>
                                      <div className="text-xs text-muted-foreground">{resource.type}</div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="flex items-start justify-center w-8 h-8 bg-blue-600 rounded-full mt-1">
                      <User className="w-4 h-4 text-white mt-2" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <Card className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Thinking...
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="mt-4 border-t pt-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Ask me about skills to learn, career paths, job hunting, or anything else related to your career growth.
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}