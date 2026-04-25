import React, { useState, useEffect, useRef } from 'react';
import { useGetMessagesByRoomQuery, useCreateMessageMutation } from '../features/api/messagesApi';
import { useGetChatRoomsQuery } from '../features/api/chatroomApi';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';
import { format } from 'date-fns';
import { Send, Users, Shield, Heart } from 'lucide-react';

const WarRoomPage: React.FC = () => {
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: RootState) => state.auth);

    // 1. Find the "War Room" ID from your chatrooms list
    const { data: rooms } = useGetChatRoomsQuery();
    const warRoom = rooms?.find(r => r.description.toLowerCase().includes('war room'));
    const roomId = warRoom?.roomId || 1; // Fallback to 1 if not found

    // 2. Fetch Continuous Messages
    const { data: messages, isLoading } = useGetMessagesByRoomQuery(roomId, {
        pollingInterval: 3000, // Refresh every 3 seconds for a "live" feel
    });

    const [sendMessage] = useCreateMessageMutation();

    // Scroll to bottom on new message
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        await sendMessage({
            roomId,
            message: newMessage,
        });
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-gray-50 rounded-xl shadow-inner overflow-hidden border border-red-100">
            {/* Header: Online Stats & Title */}
            <div className="bg-white border-b p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                        <Shield size={24} /> THE WAR ROOM
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">The Front Line Against Addiction</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                    <Users size={16} />
                    <span>24/7 LIVE SUPPORT</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((msg) => (
                    <div key={msg.messagesId} className={`flex flex-col ${msg.userId === user?.userId ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                                msg.sender === 'admin' ? 'bg-purple-600 text-white' : 
                                msg.sender === 'support_partner' ? 'bg-emerald-500 text-white' : 
                                'bg-blue-500 text-white'
                            }`}>
                                {msg.sender}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                {format(new Date(msg.createdAt), 'p')}
                            </span>
                        </div>
                        <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                            msg.sender === 'admin' ? 'bg-purple-50 border-l-4 border-purple-600' :
                            msg.userId === user?.userId ? 'bg-red-600 text-white rounded-tr-none' : 
                            'bg-white border border-gray-200 rounded-tl-none'
                        }`}>
                            <p className="text-sm font-medium">{msg.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Encourage a peer or ask for help..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                />
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default WarRoomPage;