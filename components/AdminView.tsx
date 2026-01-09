
import React, { useState, useEffect } from 'react';
import { User, CourseSyllabus, AdminStats } from '../types';
import { firebaseService } from '../services/firebaseService';
import { courseService } from '../services/courseService';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  TrashIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  PlusIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const AdminView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<CourseSyllabus[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [ingesting, setIngesting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [allUsers, allCourses, allStats] = await Promise.all([
      firebaseService.getAllUsers(),
      firebaseService.getAllCourses(),
      firebaseService.getAdminStats()
    ]);
    setUsers(allUsers);
    setCourses(allCourses);
    setStats(allStats);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIngest = async () => {
    if (!youtubeUrl.trim()) return;
    setIngesting(true);
    const user = await firebaseService.getCurrentUser();
    await courseService.ingestYouTubeCourse(user.uid, youtubeUrl);
    setYoutubeUrl('');
    await fetchData();
    setIngesting(false);
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Permanently remove this source force from Guru?')) {
      await firebaseService.deleteCourse(id);
      await fetchData();
    }
  };

  const handleRoleToggle = async (uid: string) => {
    await firebaseService.toggleUserRole(uid);
    await fetchData();
  };

  const handleGrantXP = async (uid: string) => {
    await firebaseService.updateUserXP(uid, 500);
    await fetchData();
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <ArrowPathIcon className="w-10 h-10 text-cyan-500 animate-spin" />
      <p className="text-[10px] mono font-black text-white/20 uppercase tracking-[0.4em]">Decrypting Command Center...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-result">
      
      {/* Platform Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Learners', value: stats?.totalUsers, icon: UsersIcon, color: 'text-blue-500' },
          { label: 'Active Courses', value: stats?.totalCourses, icon: AcademicCapIcon, color: 'text-cyan-500' },
          { label: 'Circulating XP', value: stats?.totalXP, icon: BoltIcon, color: 'text-amber-500' },
          { label: 'Elite Tier', value: stats?.eliteUsers, icon: ShieldCheckIcon, color: 'text-purple-500' }
        ].map((s, i) => (
          <div key={i} className="p-6 bg-[#111] border border-white/5 rounded-[32px] space-y-3">
             <div className={`${s.color} bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center`}>
                <s.icon className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] mono font-bold text-white/20 uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-black text-white">{s.value?.toLocaleString()}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* User Management */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight uppercase italic flex items-center space-x-3">
               <UsersIcon className="w-6 h-6 text-cyan-500" />
               <span>User Ledger</span>
            </h3>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {users.map(u => (
              <div key={u.uid} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between hover:border-white/10 transition-all">
                <div className="flex items-center space-x-4">
                  <img src={u.avatar} className="w-12 h-12 rounded-xl border border-white/10" alt="" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-white">{u.name}</p>
                      {u.role === 'admin' && <ShieldCheckIcon className="w-4 h-4 text-cyan-500" />}
                    </div>
                    <p className="text-[10px] mono text-white/30 uppercase">Lvl {u.level} • {u.xp} XP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                   <button onClick={() => handleGrantXP(u.uid)} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-all" title="Grant 500 XP">
                      <BoltIcon className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleRoleToggle(u.uid)} className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg hover:bg-cyan-500/20 transition-all" title="Toggle Admin Role">
                      <ShieldCheckIcon className="w-4 h-4" />
                   </button>
                   <button onClick={() => firebaseService.deleteUser(u.uid).then(fetchData)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                      <TrashIcon className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Management */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight uppercase italic flex items-center space-x-3">
               <AcademicCapIcon className="w-6 h-6 text-cyan-500" />
               <span>Course Vault</span>
            </h3>
          </div>

          {/* Quick Ingest */}
          <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-[32px] flex items-center space-x-4">
             <input 
               type="text" 
               value={youtubeUrl}
               onChange={e => setYoutubeUrl(e.target.value)}
               placeholder="Paste YouTube URL to ingest..."
               className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none"
             />
             <button 
               onClick={handleIngest}
               disabled={ingesting}
               className="p-4 bg-cyan-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
             >
                {ingesting ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PlusIcon className="w-5 h-5" />}
             </button>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto custom-scrollbar pr-2">
            {courses.length === 0 ? (
               <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[48px]">
                  <p className="text-white/20 italic">The Vault is empty. Ingest a course to begin.</p>
               </div>
            ) : (
              courses.map(c => (
                <div key={c.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                       <AcademicCapIcon className="w-6 h-6 text-white/40" />
                    </div>
                    <div>
                      <p className="font-bold text-white truncate max-w-[200px]">{c.title}</p>
                      <p className="text-[10px] mono text-white/30 uppercase">{c.modules.length} Modules • ID: {c.id.slice(-6)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteCourse(c.id)}
                    className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                     <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;
