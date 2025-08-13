import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Users, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  customerEmail?: string;
  customerName?: string;
  sessionId: string;
}

interface ActiveChat {
  sessionId: string;
  customerName?: string;
  customerEmail?: string;
  lastMessage: Date;
  unreadCount: number;
  messages: ChatMessage[];
}

export default function ChatAdmin() {
  const [activeChats, setActiveChats] = useState<Map<string, ActiveChat>>(new Map());
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load existing chat messages on admin panel load
    const loadChatMessages = async () => {
      try {
        const response = await fetch('/api/chat/messages');
        if (response.ok) {
          const messages = await response.json();
          console.log('📨 Loaded chat messages:', messages.length);
          
          // Group messages by session
          const sessionGroups = new Map<string, ActiveChat>();
          
          messages.forEach((msg: any) => {
            const sessionId = msg.sessionId;
            
            if (!sessionGroups.has(sessionId)) {
              sessionGroups.set(sessionId, {
                sessionId,
                customerName: msg.customerName || 'Anonymous',
                customerEmail: msg.customerEmail || 'No email',
                lastMessage: new Date(msg.timestamp),
                unreadCount: 0,
                messages: []
              });
            }
            
            const chat = sessionGroups.get(sessionId)!;
            
            // Convert sender types: 'admin' -> 'agent', keep 'user' as 'user'
            const normalizedSender = (msg.sender === 'admin' || msg.sender === 'agent') ? 'agent' : 'user';
            
            chat.messages.push({
              id: msg.id,
              text: msg.message,
              sender: normalizedSender,
              timestamp: new Date(msg.timestamp),
              sessionId: msg.sessionId
            });
            
            // Update last message timestamp
            if (new Date(msg.timestamp) > chat.lastMessage) {
              chat.lastMessage = new Date(msg.timestamp);
            }
          });
          
          // Sort messages within each chat by timestamp
          sessionGroups.forEach(chat => {
            chat.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          });
          
          setActiveChats(sessionGroups);
          console.log('✅ Loaded', sessionGroups.size, 'chat sessions');
        }
      } catch (error) {
        console.error('❌ Error loading chat messages:', error);
      }
    };
    
    loadChatMessages();

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?admin=true`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('Admin connected to chat system');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      if (type === 'customer_message') {
        const message: ChatMessage = {
          ...data,
          sender: 'user' // Customer messages are always 'user'
        };
        
        setActiveChats(prev => {
          const newChats = new Map(prev);
          let chat = newChats.get(message.sessionId);
          
          if (!chat) {
            chat = {
              sessionId: message.sessionId,
              customerName: message.customerName || 'Anonymous',
              customerEmail: message.customerEmail || 'No email',
              lastMessage: new Date(message.timestamp),
              unreadCount: 0,
              messages: []
            };
          }
          
          chat.messages.push(message);
          chat.lastMessage = new Date(message.timestamp);
          chat.unreadCount += 1;
          
          newChats.set(message.sessionId, chat);
          return newChats;
        });
      }
    };

    websocket.onclose = () => {
      console.log('Admin disconnected from chat system');
      setWs(null);
    };

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, activeChats]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedChat) return;

    const messageText = inputText;
    setInputText('');

    // Send message via HTTP API (this saves to database for customer to see)
    try {
      const response = await fetch('/api/chat/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: selectedChat,
          message: messageText,
        })
      });

      if (response.ok) {
        const savedMessage = await response.json();
        console.log('✅ Admin reply sent to database:', savedMessage);
        
        // Add to local state for immediate UI update
        const message: ChatMessage = {
          id: savedMessage.id,
          text: messageText,
          sender: 'agent',
          timestamp: new Date(savedMessage.timestamp),
          sessionId: selectedChat
        };

        setActiveChats(prev => {
          const newChats = new Map(prev);
          const chat = newChats.get(selectedChat);
          if (chat) {
            chat.messages.push(message);
            chat.lastMessage = new Date(savedMessage.timestamp);
            newChats.set(selectedChat, chat);
          }
          return newChats;
        });
      } else {
        console.error('❌ Failed to send admin reply:', response.status);
      }
    } catch (error) {
      console.error('❌ Error sending admin reply:', error);
    }
  };

  const selectChat = (sessionId: string) => {
    setSelectedChat(sessionId);
    
    // Mark as read
    setActiveChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(sessionId);
      if (chat) {
        chat.unreadCount = 0;
        newChats.set(sessionId, chat);
      }
      return newChats;
    });
  };

  const selectedChatData = selectedChat ? activeChats.get(selectedChat) : null;
  const chatList = Array.from(activeChats.values()).sort((a, b) => 
    b.lastMessage.getTime() - a.lastMessage.getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Chat Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">Manage customer support conversations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Chats ({chatList.length})
              </CardTitle>
              <CardDescription>
                {ws ? 'Connected to chat system' : 'Disconnected'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {chatList.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No active chats
                  </div>
                ) : (
                  chatList.map((chat) => (
                    <div
                      key={chat.sessionId}
                      onClick={() => selectChat(chat.sessionId)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedChat === chat.sessionId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {chat.customerName || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {chat.customerEmail || chat.sessionId.slice(0, 8)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {chat.lastMessage.toLocaleTimeString()}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {chat.messages.length > 0 && (
                        <p className="text-xs text-gray-600 mt-2 truncate">
                          {chat.messages[chat.messages.length - 1].text}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedChatData 
                  ? `Chat with ${selectedChatData.customerName || 'Anonymous'}`
                  : 'Select a chat'
                }
              </CardTitle>
              {selectedChatData && (
                <CardDescription>
                  {selectedChatData.customerEmail} • Session: {selectedChatData.sessionId.slice(0, 8)}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              {selectedChatData ? (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4 p-4">
                      {selectedChatData.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'agent' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              message.sender === 'agent'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <span className={`text-xs mt-1 block ${
                              message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your response..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a chat to start messaging
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}