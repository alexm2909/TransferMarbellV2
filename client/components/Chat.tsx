import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import {
  MessageSquareIcon,
  SendIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  CheckCheckIcon,
  XIcon,
  NavigationIcon,
} from "lucide-react";

interface ChatProps {
  tripId?: string;
  driverName?: string;
  driverPhone?: string;
  isActive?: boolean;
  onClose?: () => void;
}

export default function Chat({
  tripId = "TM123456",
  driverName = "Carlos Rodríguez",
  driverPhone = "+34 600 123 456",
  isActive = true,
  onClose,
}: ChatProps) {
  const { user } = useAuth();
  const {
    messages,
    sendMessage,
    markMessagesAsRead,
    shareLocation,
    getUnreadCount,
    getOtherParticipantName,
    isTyping,
  } = useChat(tripId);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when chat is opened
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  }, []);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.role === "driver" ? "driver_001" : "client_001",
      senderName: user?.name || "Usuario",
      senderRole: user?.role === "driver" ? "driver" : "client",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate driver response (only if user is client)
    if (user?.role !== "driver") {
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          "Perfecto, nos vemos entonces.",
          "Entendido, estaré atento.",
          "Gracias por la información.",
          "De acuerdo, sin problema.",
          "Te mantendré informado.",
        ];
        
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: "driver_001",
          senderName: "Carlos Rodríguez", 
          senderRole: "driver",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: "text",
          read: false,
        };

        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const quickMessages = user?.role === "driver" ? [
    "Ya estoy llegando",
    "Estoy en el lugar de recogida",
    "Hay algo de tráfico, 5 min de retraso",
    "¿Cuántas maletas llevas?",
  ] : [
    "¿Ya estás en camino?",
    "¿Cuánto tiempo falta?",
    "Estoy listo para salir",
    "Gracias por el excelente servicio",
  ];

  return (
    <Card className="h-full max-h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-ocean">
                {user?.role === "driver" ? user.name?.split(' ').map(n => n[0]).join('') : "CR"}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">
                {user?.role === "driver" ? user.name?.split(' ')[0] : driverName}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${isActive ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-300'}`}
                >
                  {isActive ? '🟢 En línea' : '⚫ Desconectado'}
                </Badge>
                <span className="text-xs text-gray-500">Viaje #{tripId}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <PhoneIcon className="w-4 h-4 mr-1" />
              Llamar
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const showDate = index === 0 || 
              formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${
                  message.senderRole === user?.role ? 'justify-end' : 'justify-start'
                }`}>
                  <div className={`max-w-[80%] ${
                    message.type === 'system' ? 'mx-auto' : ''
                  }`}>
                    {message.type === 'system' ? (
                      <div className="text-center text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                        {message.content}
                      </div>
                    ) : (
                      <div className={`rounded-lg px-4 py-2 ${
                        message.senderRole === user?.role
                          ? 'bg-ocean text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="text-sm">
                          {message.type === 'location' ? (
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="w-4 h-4" />
                              <span>{message.content}</span>
                            </div>
                          ) : (
                            message.content
                          )}
                        </div>
                        <div className={`flex items-center justify-between mt-1 ${
                          message.senderRole === user?.role ? 'text-ocean-light' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.senderRole === user?.role && (
                            <div className="ml-2">
                              {message.read ? (
                                <CheckCheckIcon className="w-3 h-3" />
                              ) : (
                                <CheckIcon className="w-3 h-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">escribiendo...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => setNewMessage(msg)}
              >
                {msg}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-ocean hover:bg-ocean/90"
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
