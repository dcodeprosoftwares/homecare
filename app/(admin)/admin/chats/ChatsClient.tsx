"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Search, MessageSquare, Send, User, Clock } from "lucide-react";
import clsx from "clsx";

interface ChatSession {
  id: string;
  visitor_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender: "user" | "admin";
  text: string;
  created_at: string;
}

export default function ChatsClient() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all sessions
  useEffect(() => {
    const fetchSessions = async () => {
      const { data } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });
      if (data) setSessions(data);
    };

    fetchSessions();

    // Subscribe to new sessions
    const sessionChannel = supabase
      .channel("public:chat_sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_sessions" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSessions((prev) => [payload.new as ChatSession, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setSessions((prev) =>
              prev.map((s) => (s.id === payload.new.id ? (payload.new as ChatSession) : s))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, []);

  // Fetch messages for active session
  useEffect(() => {
    if (!activeSession) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", activeSession.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages for this session
    const messageChannel = supabase
      .channel(`messages:${activeSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${activeSession.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [activeSession]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSession) return;

    const tempText = inputValue.trim();
    setInputValue("");

    const { error } = await supabase.from("chat_messages").insert([
      {
        session_id: activeSession.id,
        sender: "admin",
        text: tempText,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
      // Optional: add UI error state
    }
  };

  const markSessionClosed = async () => {
    if (!activeSession) return;
    await supabase
      .from("chat_sessions")
      .update({ status: "closed" })
      .eq("id", activeSession.id);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-800">Active Chats</h2>
          <div className="mt-3 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitors..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No active chats.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className={clsx(
                    "w-full text-left p-4 hover:bg-gray-100 transition-colors flex items-start gap-3",
                    activeSession?.id === session.id ? "bg-cyan-50 border-l-4 border-cyan-500" : "border-l-4 border-transparent"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center flex-shrink-0 text-cyan-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        Visitor {session.visitor_id.substring(0, 4)}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        "inline-block w-2 h-2 rounded-full",
                        session.status === "open" ? "bg-green-500" : "bg-gray-300"
                      )} />
                      <span className="text-xs text-gray-500 capitalize">{session.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Area - Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Visitor {activeSession.visitor_id.substring(0, 4)}
                  </h2>
                  <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={markSessionClosed}
                disabled={activeSession.status === "closed"}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeSession.status === "closed" ? "Closed" : "Mark as Resolved"}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Clock className="w-12 h-12 mb-4 opacity-20" />
                  <p>No messages yet.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={clsx(
                      "flex max-w-[75%]",
                      msg.sender === "admin" ? "ml-auto justify-end" : "mr-auto justify-start"
                    )}
                  >
                    <div
                      className={clsx(
                        "rounded-2xl px-5 py-3 text-sm shadow-sm",
                        msg.sender === "admin"
                          ? "bg-cyan-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                      )}
                    >
                      {msg.text}
                      <div
                        className={clsx(
                          "mt-1.5 text-[10px] font-medium",
                          msg.sender === "admin" ? "text-cyan-200 text-right" : "text-gray-400"
                        )}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a reply..."
                  disabled={activeSession.status === "closed"}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || activeSession.status === "closed"}
                  className="absolute right-2 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-slate-50/50">
            <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
