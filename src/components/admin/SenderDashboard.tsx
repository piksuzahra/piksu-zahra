import React, { useState } from 'react';
import { LogOut, Plus, Send, Copy, Check } from 'lucide-react';

export default function SenderDashboard({ role, onLogout }: { role: string; onLogout: () => void }) {
  const [guests, setGuests] = useState<{ id: string, name: string, sent: boolean }[]>([
    { id: '1', name: 'Bapak Budi & Keluarga', sent: false },
    { id: '2', name: 'Alumni SMA 1', sent: true },
  ]);
  const [newName, setNewName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setGuests([{ id: Date.now().toString(), name: newName.trim(), sent: false }, ...guests]);
    setNewName('');
  };

  const getWAUrl = (name: string) => {
    const baseUrl = window.location.origin;
    const encodedName = encodeURIComponent(name);
    const link = `${baseUrl}?to=${encodedName}`;
    
    // Different message template based on role
    const template = role.includes('ortu') 
      ? `Bismillah, Mohon doa restu dan kehadirannya pada pernikahan putra/putri kami.\nKepada Yth. *${name}*.\n\nAkses undangan lengkap: ${link}`
      : `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${name}* untuk hadir di acara pernikahan kami.\n\nAkses undangan: ${link}`;
      
    return `https://wa.me/?text=${encodeURIComponent(template)}`;
  };

  const handleSend = (id: string, name: string) => {
    setGuests(guests.map(g => g.id === id ? { ...g, sent: true } : g));
    window.open(getWAUrl(name), '_blank');
  };

  const copyLink = (name: string, id: string) => {
    const link = `${window.location.origin}?to=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-800">
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl">Guest Management</h1>
          <p className="text-sm text-zinc-500 uppercase tracking-wider">Account: {role}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-zinc-600 hover:text-red-600 transition">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6 mt-4">
        {/* Add Guest Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 mb-8">
          <h2 className="text-lg font-medium mb-4">Add New Guest</h2>
          <form onSubmit={addGuest} className="flex gap-4">
            <input 
               type="text" 
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               placeholder="Nama Penerima (e.g. Bapak Budi / Teman SMA)" 
               className="flex-1 border border-zinc-300 rounded-lg p-3 outline-none focus:border-sage"
            />
            <button 
              type="submit"
              disabled={!newName.trim()}
              className="bg-zinc-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </form>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
             <h2 className="font-medium text-zinc-700">Guest List ({guests.length})</h2>
             <span className="text-sm text-zinc-500">{guests.filter(g => g.sent).length} Sent</span>
           </div>
           
           {guests.length === 0 ? (
             <div className="p-12 text-center text-zinc-500">
               No guests added yet. Add someone to start sharing.
             </div>
           ) : (
             <ul className="divide-y divide-zinc-100">
               {guests.map(guest => (
                 <li key={guest.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between sm:items-center hover:bg-zinc-50/50 transition">
                   <div>
                     <p className="font-medium text-zinc-800">{guest.name}</p>
                     {guest.sent ? (
                       <span className="text-[10px] uppercase tracking-wider font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded mt-1 inline-block">Shared</span>
                     ) : (
                       <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded mt-1 inline-block">Draft</span>
                     )}
                   </div>
                   
                   <div className="flex gap-2 self-end sm:self-auto">
                     <button 
                       onClick={() => copyLink(guest.name, guest.id)}
                       className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition"
                       title="Copy Link"
                     >
                       {copiedId === guest.id ? <Check size={18} className="text-sage" /> : <Copy size={18} />}
                     </button>
                     <button 
                       onClick={() => handleSend(guest.id, guest.name)}
                       className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition ${
                         guest.sent 
                          ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200' 
                          : 'bg-[#25D366] text-white hover:bg-[#1ebd5c]'
                       }`}
                     >
                       <Send size={16} />
                       {guest.sent ? 'Resend WA' : 'Send via WA'}
                     </button>
                   </div>
                 </li>
               ))}
             </ul>
           )}
        </div>
      </div>
    </div>
  );
}
