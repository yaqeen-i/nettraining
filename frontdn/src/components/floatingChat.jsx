import React, { useState, useRef, useEffect } from "react";
import formApi from "../services/aiModelApi";
import "../styles/FloatingChat.css";

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Initialize with welcome message when opening
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      // Call your AI API endpoint
      const response = await formApi.sendAIMessage(inputMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response || "عذراً، لم أستطع معالجة طلبك. يرجى المحاولة مرة أخرى.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="floating-ai-chat">
      {/* Chat Button */}
      <button 
        className={`chat-toggle-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
      >
        <span className="chat-icon">🤖</span>
        <span className="chat-label">المساعد الذكي</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <h3>المساعد الذكي</h3>
            <div className="chat-actions">
              <button className="clear-chat-btn" onClick={clearChat}>
                🗑️
              </button>
              <button className="close-chat-btn" onClick={toggleChat}>
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message ai-message">
                <div className="message-bubble loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              rows="1"
              className="chat-input"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              className="send-button"
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}