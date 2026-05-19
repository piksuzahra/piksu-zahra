import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { LogOut, Image as ImageIcon, Type, FileText, MessageCircle, Upload } from 'lucide-react';
import { useAppImage, useGalleryImages, useAppText, useAppAudio, uploadFile } from '../../lib/store';

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
  const [mapUrl, setMapUrl] = useAppText('mapUrl', 'https://maps.app.goo.gl/n9WuWK5ZpW7utU1L8?g_st=iw');
  const [mapIframeUrl, setMapIframeUrl] = useAppText('mapIframeUrl', '');
  const [bgMusic, setBgMusic] = useAppAudio('bgMusic');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string, setter: (data: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(key);
      try {
        const url = await uploadFile(file, `app/${key}_${Date.now()}`);
        setter(url);
      } catch (err) {
        console.error(err);
        alert('Upload failed');
      } finally {
        setIsUploading(null);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    
    setIsUploading('gallery');
    try {
      const uploadPromises = files.map(file => uploadFile(file, `gallery/${file.name}_${Date.now()}`));
      const urls = await Promise.all(uploadPromises);
      setGalleryPhotos([...galleryPhotos, ...urls]);
    } catch (err) {
      console.error(err);
      alert('Gallery upload failed');
    } finally {
      setIsUploading(null);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    const newPhotos = [...galleryPhotos];
    newPhotos.splice(index, 1);
    setGalleryPhotos(newPhotos);
  };
  
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-800">
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl">Management Dashboard</h1>
          <p className="text-sm text-zinc-500 uppercase tracking-wider">{role}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-zinc-600 hover:text-red-600 transition">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </header>
      
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col gap-2">
          {[{ id: 'photos', icon: ImageIcon, label: 'Photos' },
            { id: 'fonts', icon: Type, label: 'Fonts' },
            { id: 'content', icon: FileText, label: 'Content' },
            { id: 'messages', icon: MessageCircle, label: 'WA Messages' }].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === tab.id ? 'bg-zinc-800 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
          ))}
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 min-h-[500px]">
            {activeTab === 'photos' && (
              <div className="animate-in fade-in space-y-10">
                <h2 className="text-xl font-serif border-b border-zinc-200 pb-4">Manage Photos</h2>
                
                {/* Single Photos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cover */}
                  <div>
                    <h3 className="font-medium text-sm text-zinc-700 mb-2">Cover Photo</h3>
                    <div className="aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden relative group border border-zinc-200">
                      {coverPhoto ? (
                        <img src={coverPhoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      {isUploading === 'coverPhoto' && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center gap-2">
                        <label className="cursor-pointer text-white text-xs bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-700 transition">
                          Change Photo
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'coverPhoto', setCoverPhoto)} />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pria */}
                  <div>
                    <h3 className="font-medium text-sm text-zinc-700 mb-2">Mempelai Pria</h3>
                    <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden relative group border border-zinc-200">
                      {priaPhoto ? (
                        <img src={priaPhoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                           <ImageIcon size={32} className="mb-2" />
                           <span className="text-sm">Current Photo</span>
                        </div>
                      )}
                      {isUploading === 'priaPhoto' && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center gap-2">
                        <label className="cursor-pointer text-white text-xs bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-700 transition">
                          Change Photo
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'priaPhoto', setPriaPhoto)} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Wanita */}
                  <div>
                    <h3 className="font-medium text-sm text-zinc-700 mb-2">Mempelai Wanita</h3>
                    <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden relative group border border-zinc-200">
                      {wanitaPhoto ? (
                         <img src={wanitaPhoto} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                           <ImageIcon size={32} className="mb-2" />
                           <span className="text-sm">Current Photo</span>
                        </div>
                      )}
                      {isUploading === 'wanitaPhoto' && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center gap-2">
                        <label className="cursor-pointer text-white text-xs bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-700 transition">
                          Change Photo
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'wanitaPhoto', setWanitaPhoto)} />
                        </label>
                      </div>
                    </div>
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
                    onClick={() => alert('Settings saved! Open the invitation to see changes.')}
                    className="bg-zinc-800 text-white font-black px-10 py-4 rounded-xl text-[10px] tracking-[0.3em] uppercase hover:bg-zinc-700 shadow-xl transition-all"
                  >
                    Save All Configurations
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
                        placeholder="Location"
                        onChange={(e) => setEvent2Location(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg p-2 outline-none focus:border-sage mb-2 text-sm" 
                      />
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
                    <button className="bg-zinc-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-zinc-700 mt-4">Update Details</button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
