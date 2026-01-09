
import { User, Project, Certificate, CourseProgress, CourseSyllabus, AdminStats } from '../types';

class MockFirebaseService {
  private STORAGE_KEY = 'GURU_APP_DATA_V1';
  private data: {
    users: User[]; // Changed from single user to array
    currentUserId: string;
    courses: CourseSyllabus[];
    progress: CourseProgress[];
    projects: Project[];
  };

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = this.initializeMocks();
      this.save();
    }
  }

  private initializeMocks() {
    const adminUser: User = {
      uid: 'admin-1',
      name: 'Guru_Admin',
      role: 'admin',
      title: 'Architect of Logic',
      level: 99,
      xp: 100000,
      points: 50000,
      streak: 365,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      plan: 'elite',
      coursesStarted: 10,
      projectsCompleted: 50,
      referralCode: 'ADMIN-MASTER',
      certificates: []
    };

    const demoUser: User = {
      uid: 'user-1',
      name: 'Future_Master',
      role: 'student',
      title: 'Beginner Learner',
      level: 1,
      xp: 0,
      points: 0,
      streak: 1,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuruUser',
      plan: 'free',
      coursesStarted: 0,
      projectsCompleted: 0,
      referralCode: 'GURU-NEW-2026',
      certificates: []
    };

    return {
      users: [adminUser, demoUser],
      currentUserId: 'admin-1', // Set default as admin for the demo
      courses: [],
      progress: [],
      projects: []
    };
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  async getCurrentUser(): Promise<User> { 
    return this.data.users.find(u => u.uid === this.data.currentUserId)!; 
  }

  async getAllUsers(): Promise<User[]> {
    return this.data.users;
  }

  async getAllCourses(): Promise<CourseSyllabus[]> {
    return this.data.courses;
  }

  async getAdminStats(): Promise<AdminStats> {
    return {
      totalUsers: this.data.users.length,
      totalCourses: this.data.courses.length,
      totalXP: this.data.users.reduce((acc, u) => acc + u.xp, 0),
      eliteUsers: this.data.users.filter(u => u.plan === 'elite').length
    };
  }

  async deleteCourse(courseId: string) {
    this.data.courses = this.data.courses.filter(c => c.id !== courseId);
    this.data.progress = this.data.progress.filter(p => p.courseId !== courseId);
    this.save();
  }

  async updateUserXP(userId: string, xpAmount: number) {
    const user = this.data.users.find(u => u.uid === userId);
    if (user) {
      user.xp += xpAmount;
      user.level = Math.floor(user.xp / 1000) + 1;
      this.save();
    }
  }

  async toggleUserRole(userId: string) {
    const user = this.data.users.find(u => u.uid === userId);
    if (user) {
      user.role = user.role === 'admin' ? 'student' : 'admin';
      this.save();
    }
  }

  async deleteUser(userId: string) {
    if (userId === this.data.currentUserId) return; // Can't delete self
    this.data.users = this.data.users.filter(u => u.uid !== userId);
    this.save();
  }

  async saveCourse(syllabus: CourseSyllabus) {
    this.data.courses.push(syllabus);
    this.data.progress.push({
      courseId: syllabus.id,
      currentModuleIndex: 0,
      currentLessonIndex: 0,
      completed: false,
      quizScores: [],
      completedModules: [],
      lastAccessed: Date.now()
    });
    this.save();
  }
}

export const firebaseService = new MockFirebaseService();
