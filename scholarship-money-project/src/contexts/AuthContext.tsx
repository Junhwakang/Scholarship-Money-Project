"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
  hasAdditionalInfo: boolean;
  scholarshipInfo?: ScholarshipInfo;
  jobInfo?: JobInfo;
}

export interface ScholarshipInfo {
  income: string;
  assets: string;
  householdSize: number;
  region: string;
  university: string;
  grade: string;
  major: string;
  gpa: string;
}

export interface JobInfo {
  desiredCompany: string;
  desiredField: string;
  desiredPosition: string;
  experience: string;
  education: string;
  skills: string[];
  certifications: string[];
  region: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserProfile = useCallback(async (uid: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('프로필 로드 에러:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserProfile]);

  const refreshUserProfile = useCallback(async (): Promise<void> => {
    if (user) {
      await loadUserProfile(user.uid);
    }
  }, [user, loadUserProfile]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential.user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('이메일 인증이 필요합니다. 이메일을 확인해주세요.');
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, phone: string): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    await sendEmailVerification(newUser);

    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      name,
      phone,
      createdAt: new Date().toISOString(),
      hasAdditionalInfo: false,
    });

    await firebaseSignOut(auth);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      userProfile,
      login,
      register,
      logout,
      refreshUserProfile,
    }),
    [user, loading, userProfile, login, register, logout, refreshUserProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
