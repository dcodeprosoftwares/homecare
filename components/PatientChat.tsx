"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/lib/supabase";
import { notifyAdminChatStart } from "@/app/actions/chatNotify";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  created_at: string;
}

export default function PatientChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize visitor ID and fetch active session
  useEffect(() => {
    let vId = localStorage.getItem("truecare_visitor_id");
    if (!vId) {
      vId = "vis_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("truecare_visitor_id", vId);
    }
    setVisitorId(vId);

    const initChat = async () => {
      // Find open session
      const { data: sessionData } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("visitor_id", vId)
        .eq("status", "open")
        .single();

      if (sessionData) {
        setSessionId(sessionData.id);
        // Fetch messages
        const { data: msgs } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", sessionData.id)
          .order("created_at", { ascending: true });

        if (msgs) {
          setMessages(msgs as Message[]);
        }
      } else {
        // Welcome message if no session exists yet
        setMessages([
          {
            id: "welcome",
            text: "Hello! Welcome to TrueCare. How can we help you today?",
            sender: "admin",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    };

    initChat();
  }, []);

  // Subscribe to real-time messages when a session is established
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`visitor_messages:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // Only add admin messages (we optimistically added user ones)
          if (newMsg.sender === "admin") {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !visitorId) return;

    const textToSend = inputValue.trim();
    setInputValue("");

    // Optimistically add user message
    const tempMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      created_at: new Date().toISOString(),
    };
    
    // We add it to state first for immediate feedback
    setMessages((prev) => {
      // Prevent duplicating the welcome message if it's the only one
      const prevClean = prev.filter(m => m.id !== "welcome" || m.sender !== "admin" || prev.length > 1);
      return [...prevClean, tempMessage];
    });

    const isNewSession = !sessionId;
    let currentSessionId = sessionId;

    // Create session if it doesn't exist
    if (!currentSessionId) {
      const { data: newSession, error: sessionErr } = await supabase
        .from("chat_sessions")
        .insert([{ visitor_id: visitorId, status: "open" }])
        .select()
        .single();

      if (sessionErr || !newSession) {
        console.error("Failed to create session", sessionErr);
        return;
      }
      currentSessionId = newSession.id;
      setSessionId(currentSessionId);
      
      // Fire and forget the email notification so it doesn't block the UI
      notifyAdminChatStart(visitorId, textToSend).catch(console.error);
    }

    // Insert user message
    if (currentSessionId) {
       await supabase.from("chat_messages").insert([
        {
          session_id: currentSessionId,
          sender: "user",
          text: textToSend,
        },
      ]);

      // If it's a brand new session, send the automated greeting
      if (isNewSession) {
        await supabase.from("chat_messages").insert([
          {
            session_id: currentSessionId,
            sender: "admin",
            text: "Kindly wait, our representative will join the conversation soon",
          },
        ]);
      }
      
      // Update session timestamp so it floats to top in admin
      await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", currentSessionId);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          "fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-cyan-700 hover:shadow-cyan-600/30 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 group",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label="Open Chat"
      >
        <MessageSquare className="h-7 w-7" />
        <span className="absolute right-16 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap pointer-events-none">
          Live Chat Support
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={clsx(
          "fixed bottom-6 right-6 z-50 flex w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-600 to-cyan-500 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">TrueCare Support</h3>
              <p className="text-xs text-cyan-100 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                We reply quickly
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Close Chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex h-[350px] flex-col overflow-y-auto bg-slate-50 p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                "flex max-w-[85%]",
                msg.sender === "user" ? "self-end justify-end" : "self-start justify-start"
              )}
            >
              <div
                className={clsx(
                  "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                  msg.sender === "user"
                    ? "bg-cyan-600 text-white rounded-br-sm"
                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
                )}
              >
                {msg.text}
                <div
                  className={clsx(
                    "mt-1 text-[10px]",
                    msg.sender === "user" ? "text-cyan-200 text-right" : "text-slate-400"
                  )}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-100 bg-white p-4">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-white transition-colors hover:bg-cyan-700 disabled:bg-slate-300 focus:outline-none"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
