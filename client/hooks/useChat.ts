import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "driver" | "system";
  content: string;
  timestamp: Date;
  type: "text" | "location" | "system";
  read: boolean;
  tripId: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  lastSeen: Date;
}

export function useChat(tripId: string) {
  const { user } = useAuth();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    lastSeen: new Date(),
  });

  // Load chat from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem(`chat_${tripId}`);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        setChatState({
          ...parsed,
          messages: parsed.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          lastSeen: new Date(parsed.lastSeen),
        });
      } catch (error) {
        console.error("Error loading chat:", error);
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, [tripId]);

  // Save chat to localStorage when messages change
  useEffect(() => {
    if (chatState.messages.length > 0) {
      localStorage.setItem(`chat_${tripId}`, JSON.stringify(chatState));
    }
  }, [chatState, tripId]);

  const initializeChat = () => {
    const initialMessages: Message[] = [
      {
        id: "system_1",
        senderId: "system",
        senderName: "Sistema",
        senderRole: "system",
        content: "Chat iniciado. Tu conductor te contactará pronto.",
        timestamp: new Date(Date.now() - 3600000),
        type: "system",
        read: true,
        tripId,
      },
    ];

    setChatState({
      messages: initialMessages,
      isTyping: false,
      lastSeen: new Date(),
    });
  };

  const sendMessage = (content: string, type: "text" | "location" = "text") => {
    if (!content.trim() || !user) return;

    const message: Message = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: user.role === "driver" ? `driver_${user.email}` : `client_${user.email}`,
      senderName: user.name,
      senderRole: user.role === "driver" ? "driver" : "client",
      content: content.trim(),
      timestamp: new Date(),
      type,
      read: false,
      tripId,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    // Note: Auto-response removed - now requires manual interaction between real users

    return message.id;
  };

  const simulateResponse = (originalMessage: Message) => {
    const isDriverResponding = originalMessage.senderRole === "client";
    
    if (!isDriverResponding) return; // Only simulate driver responses to client messages

    setChatState(prev => ({ ...prev, isTyping: true }));

    setTimeout(() => {
      const responses = [
        "Perfecto, nos vemos entonces.",
        "Entendido, estaré atento.",
        "Gracias por la información.",
        "De acuerdo, sin problema.",
        "Te mantendré informado.",
        "Estoy en camino, llegaré en 10 minutos.",
        "¿Necesitas que te ayude con algo más?",
        "Ya estoy en el lugar de recogida.",
        "Hay un poco de tráfico, pero llegamos a tiempo.",
      ];

      const responseMessage: Message = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: "driver_demo",
        senderName: "Carlos Rodríguez",
        senderRole: "driver",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: "text",
        read: false,
        tripId,
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, responseMessage],
        isTyping: false,
      }));
    }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
  };

  const markMessagesAsRead = () => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => ({ ...msg, read: true })),
      lastSeen: new Date(),
    }));
  };

  const shareLocation = (locationName: string) => {
    return sendMessage(`📍 Ubicación compartida: ${locationName}`, "location");
  };

  const getUnreadCount = () => {
    return chatState.messages.filter(msg => 
      !msg.read && 
      msg.senderRole !== user?.role &&
      msg.type !== "system"
    ).length;
  };

  const getOtherParticipantName = () => {
    if (user?.role === "driver") {
      const clientMessage = chatState.messages.find(msg => msg.senderRole === "client");
      return clientMessage?.senderName || "Cliente";
    } else {
      const driverMessage = chatState.messages.find(msg => msg.senderRole === "driver");
      return driverMessage?.senderName || "Conductor";
    }
  };

  const isOtherPartyTyping = () => {
    return chatState.isTyping;
  };

  const clearChat = () => {
    localStorage.removeItem(`chat_${tripId}`);
    setChatState({
      messages: [],
      isTyping: false,
      lastSeen: new Date(),
    });
  };

  return {
    messages: chatState.messages,
    sendMessage,
    markMessagesAsRead,
    shareLocation,
    getUnreadCount,
    getOtherParticipantName,
    isOtherPartyTyping,
    clearChat,
    isTyping: chatState.isTyping,
    lastSeen: chatState.lastSeen,
  };
}

// Additional utility functions for chat management
export const getChatSummary = (tripId: string) => {
  const savedChat = localStorage.getItem(`chat_${tripId}`);
  if (!savedChat) return null;

  try {
    const parsed = JSON.parse(savedChat);
    const lastMessage = parsed.messages[parsed.messages.length - 1];
    const unreadCount = parsed.messages.filter((msg: Message) => !msg.read).length;
    
    return {
      lastMessage: lastMessage ? {
        ...lastMessage,
        timestamp: new Date(lastMessage.timestamp),
      } : null,
      unreadCount,
      lastSeen: new Date(parsed.lastSeen),
    };
  } catch {
    return null;
  }
};

export const getAllChats = () => {
  const chats: Array<{ tripId: string; summary: any }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('chat_')) {
      const tripId = key.replace('chat_', '');
      const summary = getChatSummary(tripId);
      if (summary) {
        chats.push({ tripId, summary });
      }
    }
  }
  
  return chats.sort((a, b) => 
    b.summary.lastMessage?.timestamp.getTime() - a.summary.lastMessage?.timestamp.getTime()
  );
};
