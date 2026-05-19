import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Image as ImageIcon, Type, FileText, MessageCircle, Upload } from 'lucide-react';
import { useAppImage, useGalleryImages, useAppText, useAppAudio, uploadFile } from '../../lib/store';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AdminDashboard({ role, onLogout }: { role: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('photos');
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  const [coverPhoto, setCoverPhoto] = useAppImage('coverPhoto', '/cover-bg.jpg');
  const [priaPhoto, setPriaPhoto] = useAppImage('priaPhoto', 'https://images.unsplash.com/photo-1550064560-6dd11a91e55b?auto=format&fit=crop&q=80&w=600');
  const [wanitaPhoto, setWanitaPhoto] = useAppImage('wanitaPhoto', 'https://images.unsplash.com/photo-1541250848049-b4f714612024?auto=format&fit=crop&q=80&w=600');
  const [galleryPhotos, setGalleryPhotos] = useGalleryImages();

  // Content state hooks
  const [theme, setTheme] = useAppText('theme', 'rustic');
  const [groomName, setGroomName] = useAppText('groomName', 'Piksu');
  const [groomFull, setGroomFull] = useAppText('groomFull', 'Riehaizou');
  const [groomDesc, setGroomDesc] = useAppText('groomDesc', 'Putra pertama bapak Haita\ndan ibu Tri Artati');
  const [brideName, setBrideName] = useAppText('brideName', 'Zahra');
  const [brideFull, setBrideFull] = useAppText('brideFull', 'Fatimatuzzahroh');
  const [brideDesc, setBrideDesc] = useAppText('brideDesc', 'Putri pertama bapak Algajali\ndan ibu Harlina');
  const [weddingDate, setWeddingDate] = useAppText('weddingDate', '2026-07-05');

  // Font settings
  const [titleFontFamily, setTitleFontFamily] = useAppText('titleFontFamily', 'DM Serif Display');
  const [titleFontUrl, setTitleFontUrl] = useAppText('titleFontUrl', '');
  const [subtitleFontFamily, setSubtitleFontFamily] = useAppText('subtitleFontFamily', 'Great Vibes');
  const [subtitleFontUrl, setSubtitleFontUrl] = useAppText('subtitleFontUrl', '');
  const [contentFontFamily, setContentFontFamily] = useAppText('contentFontFamily', 'Inter');
  const [contentFontUrl, setContentFontUrl] = useAppText('contentFontUrl', '');
  const [eventsTitle, setEventsTitle] = useAppText('eventsTitle', 'Rangkaian Acara');
  const [eventsSubtitle, setEventsSubtitle] = useAppText('eventsSubtitle', 'Waktu & Tempat');
  const [wishes, setWishes] = React.useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      setWishes(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const stats = {
    total: wishes.length,
    hadir: wishes.filter(w => w.attendance === 'Hadir').length,
    ragu: wishes.filter(w => w.attendance === 'Ragu-ragu').length,
    tidak: wishes.filter(w => w.attendance === 'Tidak Hadir').length,
  };
  const [event1Title, setEvent1Title] = useAppText('event1Title', 'Akad Nikah');
  const [event1Time, setEvent1Time] = useAppText('event1Time', '08.00 WIB - Selesai');
  const [event1Location, setEvent1Location] = useAppText('event1Location', 'Kediaman Mempelai Wanita');
  const [event2Title, setEvent2Title] = useAppText('event2Title', 'Resepsi');
  const [event2Time, setEvent2Time] = useAppText('event2Time', '14.00 - 21.00 WIB');
  const [event2Location, setEvent2Location] = useAppText('event2Location', 'Gedung Ratu Elok');
  const [event2Entertainment, setEvent2Entertainment] = useAppText('event2Entertainment', 'NEW YULISA');
  const [greetingTitle, setGreetingTitle] = useAppText('greetingTitle', 'Mukadimah');
  const [greetingSubtitle, setGreetingSubtitle] = useAppText('greetingSubtitle', 'Maha Suci Allah');
  const [greetingVerse, setGreetingVerse] = useAppText('greetingVerse', 'QS. Ar-Rum: 21');
  const [greetingText, setGreetingText] = useAppText('greetingText', '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."');
  const [greetingFooter, setGreetingFooter] = useAppText('greetingFooter', 'Ya Allah, perkenankanlah dan Ridhoilah Pernikahan kami.');
  const [bankInfo, setBankInfo] = useAppText('bankInfo', 'BCA - 1234567890\na.n. Piksu');
  const [bankInfo2, setBankInfo2] = useAppText('bankInfo2', 'Mandiri - 0987654321\na.n. Zahra');
  const [event2Address, setEvent2Address] = useAppText('event2Address', 'Jl. Raya Utama No. 88, Desa Ratu Elok\nKec. Maju Jaya, Kota Indah, 12345');
  const [mapUrl, setMapUrl] = useAppText('mapUrl', 'https://maps.app.goo.gl/n9WuWK5ZpW7utU1L8?g_st=iw');
  const [mapIframeUrl, setMapIframeUrl] = useAppText('mapIframeUrl', '');
  const [bgMusic, setBgMusic] = useAppAudio('bgMusic');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string, setter: (data: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Maaf, ukuran file terlalu besar (maksimal 5MB). Silahkan kompres foto Anda atau gunakan foto lain.');
        return;
      }
      setIsUploading(key);
      try {
        const url = await uploadFile(file, `app/${key}_${Date.now()}`);
        await setter(url);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (err) {
        console.error(err);
        alert('Gagal mengupload: ' + (err instanceof Error ? err.message : 'Silahkan cek koneksi internet Anda'));
      } finally {
        setIsUploading(null);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    
    // Check total size
    const oversized = files.some(f => f.size > 5 * 1024 * 1024);
    if (oversized) {
      alert('Beberapa file melebihi batas 5MB. Silahkan pilih file yang lebih kecil.');
      return;
    }

    setIsUploading('gallery');
    try {
      const uploadPromises = files.map(file => uploadFile(file, `gallery/${Date.now()}_${file.name}`));
      const urls = await Promise.all(uploadPromises);
      await setGalleryPhotos([...galleryPhotos, ...urls]);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      alert('Gallery upload failed');
    } finally {
      setIsUploading(null);
    }
  };

  const removeGalleryPhoto = async (index: number) => {
    const newPhotos = [...galleryPhotos];
    newPhotos.splice(index, 1);
    await setGalleryPhotos(newPhotos);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };
  
  const deleteWish = async (id: string) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'wishes', id));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const [editingWish, setEditingWish] = useState<any | null>(null);
  const handleUpdateWish = async () => {
    if (!editingWish) return;
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'wishes', editingWish.id), {
        name: editingWish.name,
        message: editingWish.message,
        attendance: editingWish.attendance
      });
      setEditingWish(null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handleSimpleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  useEffect(() => {
    // Force clear loading if it hangs for more than 30s
    if (isUploading) {
      const timer = setTimeout(() => {
        setIsUploading(null);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isUploading]);
  
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-800 pb-20">
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex justify-between items-center sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-serif font-black italic">A</div>
          <div>
            <h1 className="font-serif text-lg md:text-xl font-black italic leading-none">Management</h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1">{role} Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <AnimatePresence>
            {saveStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${saveStatus === 'saving' ? 'text-zinc-400' : 'text-green-600'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-zinc-300 animate-pulse' : 'bg-green-500'}`}></div>
                {saveStatus === 'saving' ? 'Saving...' : 'Changes Saved'}
              </motion.div>
            )}
          </AnimatePresence>
          
          <button onClick={onLogout} className="flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black text-[10px] uppercase tracking-widest hidden md:block">Logout</span>
          </button>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {[{ id: 'stats', icon: FileText, label: 'Guest Book' },
            { id: 'photos', icon: ImageIcon, label: 'Photos' },
            { id: 'fonts', icon: Type, label: 'Fonts' },
            { id: 'content', icon: FileText, label: 'Content' },
            { id: 'messages', icon: MessageCircle, label: 'WA Messages' }].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-lg text-left transition shrink-0 ${
                  activeTab === tab.id ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-100'
                }`}
              >
                <tab.icon size={16} />
                <span className="font-bold text-[11px] md:text-sm">{tab.label}</span>
              </button>
          ))}
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 min-h-[500px]">
            {activeTab === 'stats' && (
              <div className="animate-in fade-in space-y-8">
                <h2 className="text-xl font-serif border-b border-zinc-200 pb-4">Wedding Analytics</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col items-center">
                    <span className="text-3xl font-black text-zinc-800">{stats.total}</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-2">Total Wishes</span>
                  </div>
                  <div className="bg-sage/5 p-6 rounded-xl border border-sage/10 flex flex-col items-center">
                    <span className="text-3xl font-black text-sage">{stats.hadir}</span>
                    <span className="text-[10px] text-sage/60 uppercase tracking-widest font-bold mt-2">Will Attend</span>
                  </div>
                  <div className="bg-gold/5 p-6 rounded-xl border border-gold/10 flex flex-col items-center">
                    <span className="text-3xl font-black text-gold">{stats.ragu}</span>
                    <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold mt-2">Doubtful</span>
                  </div>
                  <div className="bg-rose/5 p-6 rounded-xl border border-rose/10 flex flex-col items-center">
                    <span className="text-3xl font-black text-rose">{stats.tidak}</span>
                    <span className="text-[10px] text-rose/60 uppercase tracking-widest font-bold mt-2">Can't Attend</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-serif mb-4">Latest Wishes</h3>
                  <div className="bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-[10px] uppercase tracking-widest font-black text-zinc-500">
                        <tr>
                          <th className="px-6 py-4">Guest Name</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Message</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {wishes.map(wish => (
                          <tr key={wish.id} className="hover:bg-white transition-colors group">
                            <td className="px-6 py-4 font-bold">{wish.name}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                                wish.attendance === 'Hadir' ? 'bg-sage/10 text-sage' : 
                                wish.attendance === 'Tidak Hadir' ? 'bg-rose/10 text-rose' : 'bg-gold/10 text-gold'
                              }`}>
                                {wish.attendance}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-zinc-500 italic max-w-xs">{wish.message}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setEditingWish(wish)}
                                  className="text-zinc-300 hover:text-zinc-900 transition-colors opacity-0 group-hover:opacity-100 p-2"
                                >
                                  <Type size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteWish(wish.id)}
                                  className="text-zinc-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                                >
                                  <LogOut size={16} className="rotate-180" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Editing Wish Modal */}
            <AnimatePresence>
              {editingWish && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setEditingWish(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl p-6 shadow-2xl relative w-full max-w-md"
                  >
                    <h3 className="font-serif text-lg mb-6">Edit Ucapan</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase font-black text-zinc-400 block mb-1">Nama Tamu</label>
                        <input 
                          type="text" 
                          value={editingWish.name} 
                          onChange={(e) => setEditingWish({...editingWish, name: e.target.value})}
                          className="w-full border border-zinc-200 rounded-lg p-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black text-zinc-400 block mb-1">Status Kehadiran</label>
                        <select 
                          value={editingWish.attendance}
                          onChange={(e) => setEditingWish({...editingWish, attendance: e.target.value})}
                          className="w-full border border-zinc-200 rounded-lg p-3 text-sm"
                        >
                          <option value="Hadir">Hadir</option>
                          <option value="Tidak Hadir">Tidak Hadir</option>
                          <option value="Ragu-ragu">Ragu-ragu</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black text-zinc-400 block mb-1">Pesan / Doa</label>
                        <textarea 
                          value={editingWish.message}
                          onChange={(e) => setEditingWish({...editingWish, message: e.target.value})}
                          className="w-full border border-zinc-200 rounded-lg p-3 text-sm h-32"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-8">
                      <button 
                         onClick={() => setEditingWish(null)}
                         className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 text-zinc-500 font-bold text-xs uppercase tracking-widest"
                      >
                        Batal
                      </button>
                      <button 
                         onClick={handleUpdateWish}
                         className="flex-1 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg"
                      >
                        Update
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {activeTab === 'photos' && (
              <div className="animate-in fade-in space-y-10">
                <h2 className="text-xl font-serif border-b border-zinc-200 pb-4">Manage Photos</h2>
                
                {/* Single Photos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Cover */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 italic">Foto Cover</h3>
                    <div className="aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden relative group border border-zinc-200 shadow-sm mb-3">
                      {coverPhoto ? (
                        <img src={coverPhoto} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                          <ImageIcon size={40} strokeWidth={1} />
                        </div>
                      )}
                      {isUploading === 'coverPhoto' && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800 mb-2"></div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-3 cursor-pointer bg-zinc-900 border border-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.25em] px-6 py-4 rounded-xl hover:bg-zinc-800 hover:shadow-2xl transition-all duration-300 shadow-lg w-full group relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      <Upload size={16} className="group-hover:-translate-y-1 transition-transform" />
                      Ganti Foto Cover
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'coverPhoto', setCoverPhoto)} />
                    </label>
                  </div>
                  
                  {/* Pria */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 italic">Mempelai Pria</h3>
                    <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden relative group border border-zinc-200 shadow-sm mb-4">
                      {priaPhoto ? (
                        <img src={priaPhoto} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                           <ImageIcon size={40} strokeWidth={1} />
                        </div>
                      )}
                      {isUploading === 'priaPhoto' && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800 mb-2"></div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-3 cursor-pointer bg-zinc-900 border border-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.25em] px-6 py-4 rounded-xl hover:bg-zinc-800 hover:shadow-2xl transition-all duration-300 shadow-lg w-full group relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-sage/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      <Upload size={16} className="group-hover:-translate-y-1 transition-transform" />
                      Foto Pria
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'priaPhoto', setPriaPhoto)} />
                    </label>
                  </div>

                  {/* Wanita */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 italic">Mempelai Wanita</h3>
                    <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden relative group border border-zinc-200 shadow-sm mb-4">
                      {wanitaPhoto ? (
                         <img src={wanitaPhoto} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                           <ImageIcon size={40} strokeWidth={1} />
                        </div>
                      )}
                      {isUploading === 'wanitaPhoto' && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800 mb-2"></div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-3 cursor-pointer bg-zinc-900 border border-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.25em] px-6 py-4 rounded-xl hover:bg-zinc-800 hover:shadow-2xl transition-all duration-300 shadow-lg w-full group relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-rose/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      <Upload size={16} className="group-hover:-translate-y-1 transition-transform" />
                      Foto Wanita
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'wanitaPhoto', setWanitaPhoto)} />
                    </label>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                   <div className="flex justify-between items-end mb-4">
                     <h3 className="font-medium text-sm text-zinc-700">Gallery Photos ({galleryPhotos.length})</h3>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {galleryPhotos.map((photo, i) => (
                       <div key={i} className="aspect-square bg-zinc-100 rounded-lg overflow-hidden relative group border border-zinc-200">
                         <img src={photo} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex justify-center items-center">
                            <span onClick={() => removeGalleryPhoto(i)} className="text-white text-xs bg-red-500 px-3 py-1 rounded-full cursor-pointer hover:bg-red-600">Delete</span>
                         </div>
                       </div>
                     ))}
                     <label className="aspect-square border-2 border-dashed border-zinc-300 rounded-lg text-center bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition flex flex-col items-center justify-center text-zinc-400">
                        {isUploading === 'gallery' ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-500"></div>
                        ) : (
                          <>
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-xs">Upload</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                     </label>
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === 'fonts' && (
              <div className="animate-in fade-in">
                <h2 className="text-xl font-serif mb-4">Typography Settings</h2>
                <p className="text-sm text-zinc-500 mb-6">Choose from standard fonts or upload custom font files (TTF/OTF).</p>
                
                <div className="space-y-8 max-w-2xl">
                  {/* Title Font */}
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <label className="block text-sm font-black text-zinc-800 uppercase tracking-widest mb-3">Judul (Title Font)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Font Name</label>
                        <input 
                          type="text" 
                          value={titleFontFamily || ''} 
                          onChange={(e) => setTitleFontFamily(e.target.value)}
                          className="w-full p-2 border border-zinc-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Upload Font File</label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-white border border-zinc-300 px-4 py-2 rounded-lg text-xs hover:bg-zinc-50 flex-1 text-center">
                            {isUploading === 'titleFont' ? 'Uploading...' : 'Choose File'}
                            <input type="file" className="hidden" accept=".ttf,.otf,.woff,.woff2" onChange={(e) => handleFileUpload(e, 'titleFont', setTitleFontUrl)} />
                          </label>
                          {titleFontUrl && <span className="text-green-500 text-xs font-bold">Uploaded!</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle Font */}
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <label className="block text-sm font-black text-zinc-800 uppercase tracking-widest mb-3">Sub Judul (Subtitle Font)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Font Name</label>
                        <input 
                          type="text" 
                          value={subtitleFontFamily || ''} 
                          onChange={(e) => setSubtitleFontFamily(e.target.value)}
                          className="w-full p-2 border border-zinc-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Upload Font File</label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-white border border-zinc-300 px-4 py-2 rounded-lg text-xs hover:bg-zinc-50 flex-1 text-center">
                            {isUploading === 'subtitleFont' ? 'Uploading...' : 'Choose File'}
                            <input type="file" className="hidden" accept=".ttf,.otf,.woff,.woff2" onChange={(e) => handleFileUpload(e, 'subtitleFont', setSubtitleFontUrl)} />
                          </label>
                          {subtitleFontUrl && <span className="text-green-500 text-xs font-bold">Uploaded!</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Font */}
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <label className="block text-sm font-black text-zinc-800 uppercase tracking-widest mb-3">Isi (Content Font)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Font Name</label>
                        <input 
                          type="text" 
                          value={contentFontFamily || ''} 
                          onChange={(e) => setContentFontFamily(e.target.value)}
                          className="w-full p-2 border border-zinc-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Upload Font File</label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-white border border-zinc-300 px-4 py-2 rounded-lg text-xs hover:bg-zinc-50 flex-1 text-center">
                            {isUploading === 'contentFont' ? 'Uploading...' : 'Choose File'}
                            <input type="file" className="hidden" accept=".ttf,.otf,.woff,.woff2" onChange={(e) => handleFileUpload(e, 'contentFont', setContentFontUrl)} />
                          </label>
                          {contentFontUrl && <span className="text-green-500 text-xs font-bold">Uploaded!</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSimpleSave}
                    className="bg-zinc-900 text-white font-black px-10 py-5 rounded-xl text-[10px] tracking-[0.3em] uppercase hover:bg-zinc-800 shadow-xl transition-all active:scale-95"
                  >
                    Simpan Semua Konfigurasi
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'messages' && (
              <div className="animate-in fade-in">
                <h2 className="text-xl font-serif mb-4">WA Message Templates</h2>
                <p className="text-sm text-zinc-500 mb-6">These templates will be used by the couple and parents when generating WA messages to guests.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Template Couple</label>
                    <textarea 
                       className="w-full h-32 border border-zinc-300 rounded-lg p-3 outline-none focus:border-sage text-sm"
                       defaultValue={"Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i [NAMA] untuk hadir di acara pernikahan kami.\n\nAkses undangan: [LINK]"}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Template Orang Tua</label>
                    <textarea 
                       className="w-full h-32 border border-zinc-300 rounded-lg p-3 outline-none focus:border-sage text-sm"
                       defaultValue={"Bismillah, Mohon doa restu dan kehadirannya pada pernikahan putra/putri kami. Kepada Yth. [NAMA].\n\nDetail acara: [LINK]"}
                    ></textarea>
                  </div>
                  <button className="bg-zinc-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-zinc-700">Save Templates</button>
                </div>
              </div>
            )}

             {activeTab === 'content' && (
              <div className="animate-in fade-in">
                 <h2 className="text-xl font-serif mb-4">Edit Content</h2>
                 <p className="text-zinc-500 text-sm mb-4">Modify text and details for the invitation sections.</p>
                 <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Theme / Warna</label>
                      <select 
                        value={theme || 'rustic'}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage text-sm"
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="rustic">Classic Rustic (Sage, Gold, Terracotta)</option>
                        <option value="ocean">Ocean Blue (Teal, Navy, Gold)</option>
                        <option value="monochrome">Monochrome (Zinc, Gray)</option>
                        <option value="sunset">Sunset (Orange, Peach, Red)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1 mt-4 pb-1 border-b border-zinc-200">Mempelai Pria</label>
                      <input 
                        type="text" 
                        value={groomName || ''} 
                        placeholder="Panggilan (cth: Piksu)" 
                        className="w-full border border-zinc-300 rounded-lg p-2 mb-2 outline-none focus:border-sage text-sm" 
                        onChange={(e) => setGroomName(e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={groomFull || ''} 
                        placeholder="Nama Lengkap" 
                        className="w-full border border-zinc-300 rounded-lg p-2 mb-2 outline-none focus:border-sage text-sm" 
                        onChange={(e) => setGroomFull(e.target.value)}
                      />
                      <textarea 
                        value={groomDesc || ''} 
                        placeholder="Keterangan Keluarga" 
                        className="w-full border border-zinc-300 rounded-lg p-2 mb-2 outline-none focus:border-sage text-sm h-16" 
                        onChange={(e) => setGroomDesc(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1 mt-4 pb-1 border-b border-zinc-200">Mempelai Wanita</label>
                      <input 
                        type="text" 
                        value={brideName || ''} 
                        placeholder="Panggilan (cth: Zahra)" 
                        className="w-full border border-zinc-300 rounded-lg p-2 mb-2 outline-none focus:border-sage text-sm" 
                        onChange={(e) => setBrideName(e.target.value)}
                      />
                      <input 
                        type="text" 
                        value={brideFull || ''} 
                        placeholder="Nama Lengkap" 
                        className="w-full border border-zinc-300 rounded-lg p-2 mb-2 outline-none focus:border-sage text-sm" 
                        onChange={(e) => setBrideFull(e.target.value)}
                      />
                      <textarea 
                        value={brideDesc || ''} 
                        placeholder="Keterangan Keluarga" 
                        className="w-full border border-zinc-300 rounded-lg p-2 mb-2 outline-none focus:border-sage text-sm h-16" 
                        onChange={(e) => setBrideDesc(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Wedding Date</label>
                      <input 
                        type="date" 
                        value={weddingDate || ''} 
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage"
                        onChange={(e) => setWeddingDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2 mt-4 pb-1 border-b border-zinc-200">Acara</label>
                      <input 
                        type="text" 
                        value={eventsTitle || ''} 
                        placeholder="Main Title"
                        onChange={(e) => setEventsTitle(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2" 
                      />
                      <input 
                        type="text" 
                        value={eventsSubtitle || ''} 
                        placeholder="Subtitle"
                        onChange={(e) => setEventsSubtitle(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-4" 
                      />

                      <label className="block text-sm font-medium text-zinc-700 mb-1 font-semibold text-sage">Akad Nikah</label>
                      <input 
                        type="text" 
                        value={event1Title || ''} 
                        placeholder="Title (e.g. Akad Nikah)"
                        onChange={(e) => setEvent1Title(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm" 
                      />
                      <input 
                        type="text" 
                        value={event1Time || ''} 
                        placeholder="Time"
                        onChange={(e) => setEvent1Time(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm" 
                      />
                      <input 
                        type="text" 
                        value={event1Location || ''} 
                        placeholder="Location"
                        onChange={(e) => setEvent1Location(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-4 text-sm" 
                      />

                      <label className="block text-sm font-medium text-zinc-700 mb-1 font-semibold text-terracotta">Resepsi</label>
                      <input 
                        type="text" 
                        value={event2Title || ''} 
                        placeholder="Title"
                        onChange={(e) => setEvent2Title(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm" 
                      />
                      <input 
                        type="text" 
                        value={event2Time || ''} 
                        placeholder="Time"
                        onChange={(e) => setEvent2Time(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm" 
                      />
                      <input 
                        type="text" 
                        value={event2Location || ''} 
                        placeholder="Location Name"
                        onChange={(e) => setEvent2Location(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm" 
                      />
                      <textarea 
                        value={event2Address || ''} 
                        placeholder="Full Address"
                        onChange={(e) => setEvent2Address(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm h-20" 
                      ></textarea>
                      <input 
                        type="text" 
                        value={event2Entertainment || ''} 
                        placeholder="Hiburan"
                        onChange={(e) => setEvent2Entertainment(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2 mt-4 pb-1 border-b border-zinc-200">Mukadimah (Ayat / Doa)</label>
                      <input 
                        type="text" 
                        value={greetingTitle || ''} 
                        placeholder="Main Title"
                        onChange={(e) => setGreetingTitle(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2" 
                      />
                      <input 
                        type="text" 
                        value={greetingSubtitle || ''} 
                        placeholder="Subtitle"
                        onChange={(e) => setGreetingSubtitle(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2" 
                      />
                      <input 
                        type="text" 
                        value={greetingVerse || ''} 
                        placeholder="Sumber / Surah"
                        onChange={(e) => setGreetingVerse(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2" 
                      />
                      <textarea 
                        value={greetingText || ''} 
                        placeholder="Isi Ayat / Doa"
                        onChange={(e) => setGreetingText(e.target.value)}
                        className="w-full h-32 border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm leading-relaxed" 
                      />
                      <input 
                        type="text" 
                        value={greetingFooter || ''} 
                        placeholder="Teks Penutup"
                        onChange={(e) => setGreetingFooter(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-4" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1 mt-4 pb-1 border-b border-zinc-200">Bank Info & Music</label>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Bank Info 1 (Cashless Gift)</label>
                      <textarea 
                        value={bankInfo || ''}
                        onChange={(e) => setBankInfo(e.target.value)}
                        className="w-full h-20 border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Bank Info 2 (Cashless Gift)</label>
                      <textarea 
                        value={bankInfo2 || ''}
                        onChange={(e) => setBankInfo2(e.target.value)}
                        className="w-full h-20 border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Background Music (MP3)</label>
                      <div className="flex items-center gap-4">
                        <label className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg cursor-pointer transition text-sm">
                          Upload Audio file
                          <input 
                            type="file" 
                            accept="audio/mp3, audio/mpeg" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setIsUploading('bgMusic');
                                try {
                                  const url = await uploadFile(file, `audio/bgMusic_${Date.now()}`);
                                  setBgMusic(url);
                                  alert('Music configured! It will play when the invitation is opened.');
                                } catch (err) {
                                  console.error(err);
                                  alert('Audio upload failed');
                                } finally {
                                  setIsUploading(null);
                                }
                              }
                            }} 
                          />
                        </label>
                        <span className="text-xs text-zinc-500">Max size 5MB recommended</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Google Maps URL</label>
                      <input 
                        type="url" 
                        value={mapUrl || ''} 
                        placeholder="https://maps.google.com/..." 
                        onChange={(e) => setMapUrl(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Google Maps Iframe source</label>
                      <textarea 
                        value={mapIframeUrl || ''} 
                        placeholder="https://www.google.com/maps/embed?pb=..." 
                        onChange={(e) => setMapIframeUrl(e.target.value)}
                        className="w-full h-24 border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage text-sm"
                      ></textarea>
                    </div>
                    <button 
                      onClick={handleSimpleSave}
                      className="bg-zinc-900 text-white font-black px-10 py-4 rounded-xl text-[10px] tracking-[0.3em] uppercase hover:bg-zinc-800 shadow-lg transition-all active:scale-95 mt-8 w-full"
                    >
                      Update Semua Detail
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
