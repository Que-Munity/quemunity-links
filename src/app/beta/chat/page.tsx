'use client';
export default function ChatPage() {
  return null;
}
      return () => clearInterval(interval);
    }
  }, [inviteCode]);

  if (!inviteCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Chat Access Required</h1>
            <p className="text-gray-600 mb-4">
              You need a valid invite code to access the beta chat.
            </p>
            <p className="text-sm text-gray-500">
              If you're a beta tester, use the chat link from your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">🔥 Beta Chat</h1>
                <p className="text-sm text-gray-500">Chat with the Que-Munity team</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex flex-col">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Beta Chat!</h3>
                <p className="text-gray-600 mb-4">
                  This is your direct line to the Que-Munity team.
                </p>
                <p className="text-sm text-gray-500">
                  Feel free to share feedback, report bugs, or ask questions about the beta.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md lg:max-w-lg ${
                    msg.isFromAdmin ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                  }`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.isFromAdmin ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      {msg.isFromAdmin ? (
                        <Bot className="h-4 w-4 text-orange-600" />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    
                    {/* Message */}
                    <div className={`px-4 py-2 rounded-lg ${
                      msg.isFromAdmin
                        ? 'bg-orange-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isFromAdmin ? 'text-orange-200' : 'text-blue-200'
                      }`}>
                        {msg.isFromAdmin ? (msg.adminName || 'Que-Munity Team') : 'You'} • {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !newMessage.trim()}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Chat with our team about your beta experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}