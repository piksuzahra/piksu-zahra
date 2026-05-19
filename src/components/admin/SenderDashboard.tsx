import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Send, Copy, Check, Trash2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAppText } from '../../lib/store';

export default function SenderDashboard({ role, onLogout }: { role: string; onLogout: () => void }) {
  const [waTemplateCouple] = useAppText('waTemplateCouple', 'Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i [NAMA] untuk hadir di acara pernikahan kami.\n\nAkses undangan: [LINK]');
  const [waTemplateOrtu] = useAppText('waTemplateOrtu', 'Bismillah, Mohon doa restu dan kehadirannya pada pernikahan putra/putri kami. Kepada Yth. [NAMA].\n\nDetail acara: [LINK]');

  const [guests, setGuests] = useState<{ id: string, name: string, sent: boolean }[]>([]);
  const [newName, setNewName] = useState('');
  const [editingGuest, setEditingGuest] = useState<{ id: string, name: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Only use where() to avoid requiring a composite index in Firestore
    const q = query(
      collection(db, 'guests'), 
      where('role', '==', role)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      // Sort in memory to avoid index requirements
      data.sort((a, b) => {
        const timeA = a.created_at?.toMillis?.() || 0;
        const timeB = b.created_at?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setGuests(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'guests');
    });

    return () => unsubscribe();
  }, [role]);

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isAdding) return;
    
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'guests'), {
        name: newName.trim(),
        role: role,
        sent: false,
        created_at: serverTimestamp()
      });
      setNewName('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'guests');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteGuest = async (id: string) => {
    if (!confirm('Hapus tamu ini?')) return;
    try {
      await deleteDoc(doc(db, 'guests', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'guests');
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest || !editingGuest.name.trim()) return;
    try {
      await updateDoc(doc(db, 'guests', editingGuest.id), { name: editingGuest.name.trim() });
      setEditingGuest(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'guests');
    }
  };

  const getWAUrl = (name: string, id: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}?token=${id}`;
    
    // Different message template based on role
    let template = role.includes('ortu') ? waTemplateOrtu : waTemplateCouple;
      
    // Replace placeholders
    template = template.replace(/\[NAMA\]/g, `*${name}*`).replace(/\[LINK\]/g, link);

    // Use wa.me for universal support across mobile and web
    return `https://wa.me/?text=${encodeURIComponent(template)}`;
  };

  const handleSend = async (id: string, name: string) => {
    // Open window synchronously to avoid popup blocker
    const url = getWAUrl(name, id);
    window.open(url, '_blank');
    
    try {
      await updateDoc(doc(db, 'guests', id), { sent: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'guests');
    }
  };

  const copyLink = (name: string, id: string) => {
    const link = `${window.location.origin}?token=${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-800">
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div>
          <h1 className="font-serif text-lg md:text-xl font-black italic">Guest Management</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Account: {role}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-zinc-600 hover:text-red-500 transition">
          <LogOut size={16} />
          <span className="text-xs font-bold">Logout</span>
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6 mt-4">
        {/* Add Guest Form */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-zinc-200 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 italic">Add New Guest</h2>
          <form onSubmit={addGuest} className="flex flex-col md:flex-row gap-3">
            <input 
               type="text" 
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               placeholder="Nama Penerima (e.g. Bapak Budi / Teman SMA)" 
               className="flex-1 border border-zinc-200 rounded-lg p-3 outline-none focus:border-sage text-sm"
            />
            <button 
              type="submit"
              disabled={!newName.trim()}
              className="bg-zinc-900 text-white px-6 py-3 rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
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
                   
                    <div className="flex gap-2 self-end sm:self-auto items-center">
                      <button 
                        onClick={() => setEditingGuest({ id: guest.id, name: guest.name })}
                        className="p-2 text-zinc-400 hover:text-zinc-800 bg-white border border-zinc-200 rounded-lg transition shadow-sm"
                        title="Edit Tamu"
                      >
                        <Plus size={16} className="rotate-45" />
                      </button>
                      <button 
                        onClick={() => deleteGuest(guest.id)}
                        className="p-2 text-zinc-400 hover:text-rose-500 bg-white border border-zinc-200 rounded-lg transition shadow-sm"
                        title="Hapus Tamu"
                      >
                        <Trash2 size={18} />
                      </button>
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

      {/* Edit Guest Modal */}
      {editingGuest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingGuest(null)} />
          <div className="bg-white rounded-2xl p-6 shadow-2xl relative w-full max-w-md">
            <h3 className="font-serif text-lg mb-6">Edit Nama Tamu</h3>
            <input 
              type="text" 
              value={editingGuest.name} 
              onChange={(e) => setEditingGuest({...editingGuest, name: e.target.value})}
              className="w-full border border-zinc-200 rounded-lg p-3 text-sm mb-6"
            />
            <div className="flex gap-3">
              <button 
                 onClick={() => setEditingGuest(null)}
                 className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 text-zinc-500 font-bold text-xs uppercase tracking-widest"
              >
                Batal
              </button>
              <button 
                 onClick={handleUpdateGuest}
                 className="flex-1 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
