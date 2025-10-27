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
          text: `مرحباً! 👋 أنا بوت ذكي للاستعلام عن قاعدة البيانات\n\n💡 جرب هذه الأسئلة:\n• مرحباً / كيف حالك؟\n• كم عدد الطلاب؟\n• من الطلاب اللي عمرهم أكبر من 25؟\n• كم عدد الإناث من الشمال؟\n• اعرض أسماء الطلاب`,
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
      
      // Extract data from the response
      const aiResponse = response.data;
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse.answer || "عذراً، لم أستطع معالجة سؤالك.",
        isUser: false,
        timestamp: new Date(),
        type: "ai_response",
        results: aiResponse.results,
        intent: aiResponse.intent
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      
      let errorMessage = "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = `خطأ في الخادم: ${error.response.status} - ${error.response.data?.detail || ''}`;
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
        text: `مرحباً! 👋 أنا بوت ذكي للاستعلام عن قاعدة البيانات\n\n💡 جرب هذه الأسئلة:\n• مرحباً / كيف حالك؟\n• كم عدد الطلاب؟\n• من الطلاب اللي عمرهم أكبر من 25؟\n• كم عدد الإناث من الشمال؟\n• اعرض أسماء الطلاب`,
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

  // Render SQL results table
  const renderResultsTable = (results) => {
    if (!results || results.length === 0) return null;

    const keys = Object.keys(results[0]);
    const displayResults = results.slice(0, 50); // Limit to 50 rows

    return (
      <div className="results-section">
        <table className="result-table">
          <thead>
            <tr>
              {keys.map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayResults.map((row, index) => (
              <tr key={index}>
                {keys.map(key => (
                  <td key={key}>
                    {row[key] !== null ? row[key] : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {results.length > 50 && (
          <p className="results-info">
            عرض 50 من {results.length} نتيجة
          </p>
        )}
      </div>
    );
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
            <h3>🤖 شات بوت ذكي</h3>
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
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user' : 'bot'} ${message.type === 'error' ? 'error' : ''}`}
              >
                <div className="message-content">
                  {formatMessageText(message.text)}
                  

                  
                  {/* Show results table if available */}
                  {message.results && renderResultsTable(message.results)}
                  
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="message bot">
                <div className="message-content">
                  جاري المعالجة 
                  <span className="loading"></span>
                  <span className="loading"></span>
                  <span className="loading"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا... (مثال: كم عدد الطلاب؟)"
              className="chat-input"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              className="send-button"
            >
              {loading ? 'جاري المعالجة...' : 'إرسال'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}