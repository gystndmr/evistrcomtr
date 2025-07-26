import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, User, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@shared/schema";

interface ChatSession {
  sessionId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export default function ChatAdminPanel() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log("ChatAdminPanel component render edildi");

  // Fetch all chat messages
  const { data: allMessages = [], isLoading, error } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  console.log("ChatAdminPanel - allMessages:", allMessages);
  console.log("ChatAdminPanel - isLoading:", isLoading);
  console.log("ChatAdminPanel - error:", error);

  // Group messages by session
  const chatSessions: ChatSession[] = Object.entries(
    allMessages.reduce((acc, message) => {
      if (!acc[message.sessionId]) {
        acc[message.sessionId] = [];
      }
      acc[message.sessionId].push(message);
      return acc;
    }, {} as Record<string, ChatMessage[]>)
  ).map(([sessionId, messages]) => {
    const sortedMessages = messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const lastMessage = sortedMessages[sortedMessages.length - 1];
    const unreadCount = messages.filter(msg => !msg.isRead && msg.sender === 'user').length;
    
    return {
      sessionId,
      customerName: lastMessage.customerName,
      customerEmail: lastMessage.customerEmail,
      lastMessage: lastMessage.message,
      lastMessageTime: lastMessage.timestamp.toString(),
      unreadCount,
      messages: sortedMessages,
    };
  }).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

  // Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async (data: { sessionId: string; message: string }) => {
      return apiRequest(`/api/chat/reply`, "POST", data);
    },
    onSuccess: () => {
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      toast({
        title: "Cevap Gönderildi",
        description: "Mesajınız müşteriye ulaştırıldı.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  const handleSendReply = () => {
    if (!selectedSession || !replyText.trim()) return;
    
    sendReplyMutation.mutate({
      sessionId: selectedSession,
      message: replyText.trim(),
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const selectedSessionData = selectedSession 
    ? chatSessions.find(session => session.sessionId === selectedSession)
    : null;

  if (isLoading) {
    console.log("ChatAdminPanel - Loading state gösteriliyor");
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Canlı Destek Mesajları - Yükleniyor...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Mesajlar yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.log("ChatAdminPanel - Error state:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Canlı Destek Mesajları - Hata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Mesajlar yüklenirken hata oluştu</p>
            <p className="text-sm text-gray-500 mt-2">Lütfen sayfayı yenileyin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log("ChatAdminPanel - Render final component, sessions:", chatSessions.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Canlı Destek Mesajları ({chatSessions.length}) - Data: {allMessages.length} mesaj
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chatSessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz mesaj bulunmuyor</p>
            <p className="text-sm text-gray-500 mt-2">
              Müşteri mesajları burada görünecek
            </p>
            <p className="text-xs text-red-500 mt-2">
              Debug: allMessages.length = {allMessages.length}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chat Sessions List */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold mb-3">Aktif Sohbetler</h3>
              <ScrollArea className="h-[550px]">
                <div className="space-y-2">
                  {chatSessions.map((session) => (
                    <div
                      key={session.sessionId}
                      onClick={() => setSelectedSession(session.sessionId)}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSession === session.sessionId ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">
                            {session.customerName || 'Anonim'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.customerEmail || 'Email yok'}
                          </p>
                        </div>
                        {session.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {session.lastMessage}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatTime(session.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-2">
              {selectedSessionData ? (
                <div className="h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="border-b pb-3 mb-3">
                    <h3 className="font-semibold">
                      {selectedSessionData.customerName || 'Anonim Müşteri'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedSessionData.customerEmail}
                    </p>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-3">
                      {selectedSessionData.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'agent' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === 'agent'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <User className="h-3 w-3 opacity-70" />
                              <span className="text-xs opacity-70">
                                {message.sender === 'agent' ? 'Admin' : (message.customerName || 'Müşteri')}
                              </span>
                              <span className="text-xs opacity-70 ml-2">
                                {formatTime(message.timestamp.toString())}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Reply Input */}
                  <div className="border-t pt-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Cevabınızı yazın..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendReply();
                          }
                        }}
                        disabled={sendReplyMutation.isPending}
                      />
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sendReplyMutation.isPending}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Bir sohbet seçin</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Müşteri mesajlarını görüntülemek için sol taraftan bir sohbet seçin
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}