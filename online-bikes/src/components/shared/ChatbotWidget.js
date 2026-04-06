import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../../services/api';
import ReactMarkdown from "react-markdown";
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm BikeBot 🏍️ Tell me what kind of ride you're looking for and I'll find the perfect bike for you!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const { data } = await chatAPI.send(text);
      setMessages((m) => [...m, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') send(); };

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-robot fs-5" />
              <span>BikeBot AI</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <span className="spinner-border spinner-border-sm me-2" />
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about bikes..."
              disabled={loading}
            />
            <button onClick={send} disabled={loading}>
              <i className="bi bi-send-fill" />
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen((o) => !o)} title="Chat with BikeBot">
        <i className={`bi ${open ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} />
      </button>
    </>
  );
}