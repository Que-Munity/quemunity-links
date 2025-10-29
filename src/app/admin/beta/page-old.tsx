'use client';

import { useState, useEffect } from 'react';
import { Users, MessageCircle, Mail, Calendar, Refresh, Check, Clock } from 'lucide-react';

interface BetaSignup {
  signupNumber: number;
  firstName: string;
  lastName: string;
  email: string;
  experience: string;
  equipment: string;
  motivation: string;
  timestamp: string;
  status: 'APPROVED' | 'WAITLIST';
  inviteCode?: string;
}

interface ChatMessage {
  id: string;
  message: string;
  isFromAdmin: boolean;
  adminName?: string;
  createdAt: string;
}

export default function BetaAdminPage() {
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTester, setSelectedTester] = useState<BetaSignup | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Load beta signups from log files
  const loadSignups = async () => {
    try {
      const response = await fetch('/api/beta/admin/signups');
      const data = await response.json();
      setSignups(data.signups || []);
    } catch (error) {
      console.error('Failed to load signups:', error);
    }
  };

  const loadChatMessages = async (testerId: string) => {
    try {
      const response = await fetch(`/api/beta/chat/${testerId}`);
      const data = await response.json();
      setChatMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedTester || !newMessage.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/beta/chat/${selectedTester.inviteCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          isFromAdmin: true,
          adminName: 'Admin'
        })
      });

      if (response.ok) {
        setNewMessage('');
        await loadChatMessages(selectedTester.inviteCode!);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignups();
    // Auto-refresh every 30 seconds to check for new signups
    const interval = setInterval(loadSignups, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedTester?.inviteCode) {
      loadChatMessages(selectedTester.inviteCode);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        loadChatMessages(selectedTester.inviteCode!);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedTester]);
      });

      if (response.ok) {
        fetchTesters(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const sendAdminMessage = async (testerId: string) => {
    if (!chatMessage.trim()) return;

    try {
      const response = await fetch(`/api/beta/admin/${testerId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: chatMessage,
          adminName: 'Admin' 
        }),
      });

      if (response.ok) {
        setChatMessage('');
        alert('Message sent successfully!');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const stats = {
    total: testers.length,
    approved: testers.filter(t => t.status === 'APPROVED').length,
    pending: testers.filter(t => t.status === 'PENDING').length,
    waitlist: testers.filter(t => t.status === 'WAITLIST').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading beta admin...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: signups.length,
    approved: signups.filter(s => s.status === 'APPROVED').length,
    waitlist: signups.filter(s => s.status === 'WAITLIST').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">🔥 Beta Admin Dashboard</h1>
            <button
              onClick={loadSignups}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Refresh className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Signups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Check className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Waitlisted</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.waitlist}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Beta Signups List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Beta Signups ({signups.length})
                </h2>
              </div>
            </div>
            
            <div className="divide-y max-h-96 overflow-y-auto">
              {signups.map((signup) => (
                <div
                  key={signup.signupNumber}
                  onClick={() => setSelectedTester(signup)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTester?.signupNumber === signup.signupNumber ? 'bg-orange-50 border-r-2 border-orange-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{signup.signupNumber}</span>
                      {signup.status === 'APPROVED' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{signup.firstName} {signup.lastName}</p>
                    <p className="text-gray-600">{signup.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(signup.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {signups.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No beta signups yet</p>
                  <p className="text-sm">Signups will appear here automatically</p>
                </div>
              )}
            </div>
          </div>

          {/* Tester Details & Chat */}
          <div className="lg:col-span-2">
            {selectedTester ? (
              <div className="space-y-6">
                
                {/* Tester Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Beta Tester #{selectedTester.signupNumber} - {selectedTester.firstName} {selectedTester.lastName}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Email:</strong> {selectedTester.email}</p>
                      <p><strong>Experience:</strong> {selectedTester.experience}</p>
                      <p><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedTester.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedTester.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p><strong>Equipment:</strong> {selectedTester.equipment}</p>
                      <p><strong>Signed up:</strong> {new Date(selectedTester.timestamp).toLocaleString()}</p>
                      {selectedTester.inviteCode && (
                        <p><strong>Invite Code:</strong> {selectedTester.inviteCode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p><strong>Motivation:</strong></p>
                    <p className="text-gray-700 mt-1">{selectedTester.motivation}</p>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                      Chat with {selectedTester.firstName}
                    </h3>
                  </div>
                  
                  {/* Messages */}
                  <div className="h-64 overflow-y-auto p-4 space-y-3">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.isFromAdmin
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.isFromAdmin ? 'text-orange-200' : 'text-gray-500'
                            }`}>
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Beta Tester</h3>
                <p className="text-gray-600">Choose a tester from the list to view details and chat</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Motivation</label>
                    <p className="text-sm text-gray-900">{selectedTester.motivation}</p>
                  </div>

                  {selectedTester.inviteCode && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Invite Code</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedTester.inviteCode}</p>
                    </div>
                  )}
                </div>

                {/* Send Message */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send Admin Message
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message to the beta tester..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      onClick={() => sendAdminMessage(selectedTester.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a beta tester to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}