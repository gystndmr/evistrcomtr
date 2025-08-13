import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  
  // Generate unique session ID for this chat
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('chatSessionId');
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', newId);
    return newId;
  });

  const chatTexts = {
    en: {
      title: 'Live Support',
      placeholder: 'Type your message...',
      send: 'Send',
      online: 'We are online',
      offline: 'We are offline',
      greeting: 'Hello! How can we help you with your visa or insurance application?',
      minimize: 'Minimize',
      close: 'Close'
    },
    tr: {
      title: 'Canlı Destek',
      placeholder: 'Mesajınızı yazın...',
      send: 'Gönder',
      online: 'Çevrimiçiyiz',
      offline: 'Çevrimdışıyız',
      greeting: 'Merhaba! Vize veya sigorta başvurunuzla ilgili nasıl yardımcı olabiliriz?',
      minimize: 'Küçült',
      close: 'Kapat'
    },
    fr: {
      title: 'Support en Direct',
      placeholder: 'Tapez votre message...',
      send: 'Envoyer',
      online: 'Nous sommes en ligne',
      offline: 'Nous sommes hors ligne',
      greeting: 'Bonjour! Comment pouvons-nous vous aider avec votre demande de visa ou d\'assurance?',
      minimize: 'Réduire',
      close: 'Fermer'
    },
    de: {
      title: 'Live-Support',
      placeholder: 'Ihre Nachricht eingeben...',
      send: 'Senden',
      online: 'Wir sind online',
      offline: 'Wir sind offline',
      greeting: 'Hallo! Wie können wir Ihnen bei Ihrem Visa- oder Versicherungsantrag helfen?',
      minimize: 'Minimieren',
      close: 'Schließen'
    },
    es: {
      title: 'Soporte en Vivo',
      placeholder: 'Escriba su mensaje...',
      send: 'Enviar',
      online: 'Estamos en línea',
      offline: 'Estamos fuera de línea',
      greeting: '¡Hola! ¿Cómo podemos ayudarle con su solicitud de visa o seguro?',
      minimize: 'Minimizar',
      close: 'Cerrar'
    },
    ar: {
      title: 'الدعم المباشر',
      placeholder: 'اكتب رسالتك...',
      send: 'إرسال',
      online: 'نحن متصلون',
      offline: 'نحن غير متصلين',
      greeting: 'مرحبا! كيف يمكننا مساعدتك في طلب الفيزا أو التأمين؟',
      minimize: 'تصغير',
      close: 'إغلاق'
    }
  };

  const t = chatTexts[currentLanguage.code as keyof typeof chatTexts] || chatTexts.en;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch admin replies from backend every 3 seconds
  useEffect(() => {
    const fetchAdminReplies = async () => {
      if (!sessionId) return;
      
      try {
        const response = await fetch('/api/chat/messages');
        const allMessages = await response.json();
        
        // Filter messages for this session and get admin replies
        const sessionMessages = allMessages.filter((msg: any) => 
          msg.sessionId === sessionId && msg.sender === 'agent'
        );
        
        // Add new admin replies to local messages
        sessionMessages.forEach((adminMsg: any) => {
          const existsInLocal = messages.some(msg => msg.id === adminMsg.id);
          if (!existsInLocal) {
            const newAdminMessage: Message = {
              id: adminMsg.id,
              text: adminMsg.message,
              sender: 'agent',
              timestamp: new Date(adminMsg.timestamp)
            };
            setMessages(prev => [...prev, newAdminMessage]);
          }
        });
        
      } catch (error) {
        console.error('Admin mesajları alınamadı:', error);
      }
    };

    // Poll for admin replies every 3 seconds when chat is open
    if (isOpen && !isMinimized) {
      const interval = setInterval(fetchAdminReplies, 3000);
      return () => clearInterval(interval);
    }
  }, [sessionId, isOpen, isMinimized, messages]);

  useEffect(() => {
    // Initialize with greeting message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: t.greeting,
        sender: 'agent',
        timestamp: new Date()
      }]);
    }
  }, [currentLanguage]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Send message to backend and store in database for admin panel
    const messageToSend = inputText;
    fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageToSend,
        sessionId: sessionId,
        customerName: 'Website Visitor',
        customerEmail: null
      })
    }).then(response => {
      if (response.ok) {
        console.log('💬 Chat mesajı backend\'e gönderildi:', messageToSend);
      } else {
        console.error('❌ Chat mesajı gönderilemedi:', response.status);
      }
    }).catch(error => {
      console.error('❌ Chat API hatası:', error);
    });

    // Auto-reply after 2 seconds (only if no admin is online)
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage.code === 'tr' 
          ? 'Mesajınız alındı. Müşteri temsilcimiz en kısa sürede size dönüş yapacaktır.' 
          : 'Your message has been received. Our customer representative will get back to you shortly.',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-96 w-80'
    }`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
            <h3 className="font-semibold text-sm">{t.title}</h3>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-blue-700 p-1 h-auto"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Status */}
            <div className="px-4 py-2 bg-gray-50 border-b">
              <p className="text-xs text-gray-600 flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                {isOnline ? t.online : t.offline}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className={`text-xs mt-1 block ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.placeholder}
                  className="text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}