
import React from 'react';
import { DiscoveredCourse } from '../types';
import { AcademicCapIcon, PlayIcon, ArrowUpRightIcon, StarIcon } from '@heroicons/react/24/outline';

interface CourseDiscoveryProps {
  courses: DiscoveredCourse[];
  onIngest: (url: string) => void;
}

const CourseDiscovery: React.FC<CourseDiscoveryProps> = ({ courses, onIngest }) => {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="space-y-6 animate-result">
      <div className="flex items-center space-x-2">
        <AcademicCapIcon className="w-5 h-5 text-cyan-500" />
        <h3 className="text-sm mono font-black text-white/40 uppercase tracking-widest">Discovered Learning Paths</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, idx) => (
          <div key={idx} className="group p-5 bg-white/[0.02] border border-white/5 rounded-[32px] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[8px] mono font-bold px-2 py-0.5 rounded-full ${course.isInternal ? 'bg-cyan-500/20 text-cyan-500' : 'bg-white/10 text-white/40'}`}>
                      {course.isInternal ? 'Guru Certified' : 'Open Source'}
                    </span>
                    <span className="text-[8px] mono font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">
                      {course.difficulty}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">{course.title}</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <PlayIcon className="w-5 h-5 text-white/20 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed italic line-clamp-2">"{course.relevanceReason}"</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] mono font-black text-white/20 uppercase tracking-widest">{course.provider}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => onIngest(course.url)}
                  className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-500 hover:text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all border border-cyan-500/20"
                >
                  Sync to Guru
                </button>
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all"
                >
                  <ArrowUpRightIcon className="w-4 h-4 text-white/40" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDiscovery;
