import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Material } from '../../types';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  materials?: Material[];
  timestamp: Date;
}

export const AIBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: 'Hello! I am your Material Library AI Assistant. I can help you:\n\n• Search materials by properties\n• Find similar fabrics\n• Answer questions about materials\n• Provide recommendations\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { materials } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const response = processAIQuery(inputValue, materials);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        materials: response.materials,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const processAIQuery = (query: string, allMaterials: Material[]): { content: string; materials?: Material[] } => {
    const lowerQuery = query.toLowerCase();

    // Search by material type
    if (lowerQuery.includes('woven') || lowerQuery.includes('poplin') || lowerQuery.includes('canvas')) {
      const results = allMaterials.filter(m => 
        m.materialType.toLowerCase().includes('woven') ||
        m.name.toLowerCase().includes('poplin') ||
        m.name.toLowerCase().includes('canvas')
      );
      return {
        content: `I found ${results.length} woven materials in the library:`,
        materials: results.slice(0, 5)
      };
    }

    // Search by fiber content
    if (lowerQuery.includes('cotton') || lowerQuery.includes('polyester') || lowerQuery.includes('linen')) {
      const fiber = lowerQuery.includes('cotton') ? 'cotton' : 
                    lowerQuery.includes('polyester') ? 'polyester' : 'linen';
      const results = allMaterials.filter(m => 
        m.composition.toLowerCase().includes(fiber)
      );
      return {
        content: `I found ${results.length} materials with ${fiber} content:`,
        materials: results.slice(0, 5)
      };
    }

    // Search by weight
    const weightMatch = lowerQuery.match(/(\d+)\s*gsm/i) || lowerQuery.match(/less than (\d+)/i);
    if (weightMatch) {
      const weight = parseInt(weightMatch[1]);
      const results = allMaterials.filter(m => m.weight < weight);
      return {
        content: `I found ${results.length} materials with weight less than ${weight} GSM:`,
        materials: results.slice(0, 5)
      };
    }

    // Search by supplier
    if (lowerQuery.includes('supplier') || lowerQuery.includes('from')) {
      return {
        content: 'I can help you find materials by supplier. Here are some materials with supplier information:',
        materials: allMaterials.filter(m => m.supplier).slice(0, 5)
      };
    }

    // Search by status
    if (lowerQuery.includes('in stock') || lowerQuery.includes('available')) {
      const results = allMaterials.filter(m => m.status === 'approved');
      return {
        content: `I found ${results.length} approved materials:`,
        materials: results.slice(0, 5)
      };
    }

    // Search by color
    if (lowerQuery.includes('white') || lowerQuery.includes('black') || lowerQuery.includes('color')) {
      return {
        content: 'Here are some materials with color information:',
        materials: allMaterials.filter(m => m.color).slice(0, 5)
      };
    }

    // General search
    const results = allMaterials.filter(m => 
      m.name.toLowerCase().includes(lowerQuery) ||
      m.materialType.toLowerCase().includes(lowerQuery) ||
      m.composition.toLowerCase().includes(lowerQuery)
    );

    if (results.length > 0) {
      return {
        content: `I found ${results.length} materials matching your query:`,
        materials: results.slice(0, 5)
      };
    }

    // Default response
    return {
      content: `I understand you're looking for "${query}". Let me help you with that.\n\nYou can try asking me:\n• "Find cotton materials"\n• "Show me woven fabrics"\n• "Materials less than 200 GSM"\n• "What's in stock?"\n\nOr be more specific about what you need!`
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    'Find cotton materials',
    'Materials less than 200 GSM',
    'What\'s in stock?',
    'Show woven fabrics'
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#334155] to-[#64748b] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#334155] to-[#64748b] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/70">Material Library Bot</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-[#334155]' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm ${
                    message.type === 'user'
                      ? 'bg-[#334155] text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  {/* Material Cards */}
                  {message.materials && message.materials.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.materials.map((material) => (
                        <div
                          key={material.id}
                          className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => window.location.href = `/materials/${material.id}`}
                        >
                          <div className="flex items-start gap-3">
                            {material.images[0] ? (
                              <img
                                src={material.images[0]}
                                alt={material.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No img</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{material.name}</p>
                              <p className="text-xs text-gray-500">{material.code}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{material.weight} GSM</span>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{material.width}"</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <span className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length < 3 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(suggestion);
                    }}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about materials..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
