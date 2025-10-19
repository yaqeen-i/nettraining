import React, { useState, useRef, useEffect } from "react";
import aiModelApi from "../services/aiModelApi";
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
          timestamp: new Date(),
          type: "text"
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
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      // Call your AI API endpoint with the required format
      console.log("Sending question to AI:", inputMessage);
      const response = await aiModelApi.sendAIMessage(inputMessage);
      console.log("AI Response:", response.data);
      
      // Extract the answer from the response based on the provided format
      const aiResponse = response.data;
      
      let displayText = "";
      
      if (aiResponse.answer) {
        displayText = aiResponse.answer;
        
        // If there are results, you might want to format them nicely
        if (aiResponse.results && aiResponse.results.length > 0) {
          // For simple count results like your example
          if (aiResponse.results[0].total_students !== undefined) {
            displayText += `\n\nالنتيجة: ${aiResponse.results[0].total_students}`;
          }
          // You can add more formatting for different types of results here
        }
      } else {
        displayText = "عذراً، لم أستطع معالجة سؤالك. يرجى المحاولة مرة أخرى.";
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: displayText,
        isUser: false,
        timestamp: new Date(),
        type: "text",
        rawData: aiResponse // Store raw data for potential future use
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      
      let errorMessage = "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = `خطأ في الخادم: ${error.response.status} - ${error.response.data?.message || ''}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.";
      }
      
      const errorResponse = {
        id: Date.now() + 1,
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
        type: "error"
      };

      setMessages(prev => [...prev, errorResponse]);
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
        timestamp: new Date(),
        type: "text"
      }
    ]);
  };

  // Format message text with proper line breaks
  const formatMessageText = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
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
              <button className="clear-chat-btn" onClick={clearChat} title="مسح المحادثة">
                🗑️
              </button>
              <button className="close-chat-btn" onClick={toggleChat} title="إغلاق">
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'ai-message'} ${message.type === 'error' ? 'error-message' : ''}`}
              >
                <div className="message-bubble">
                  <p>{formatMessageText(message.text)}</p>
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
              placeholder="اكتب سؤالك هنا بالعربية..."
              rows="1"
              className="chat-input"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              className="send-button"
              title="إرسال"
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}