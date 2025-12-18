import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { Resume, SavedJob, createEmptyResume } from '@/types/resume';

// 프로필 관련 인터페이스
export interface UserExclusions {
  nightShift: boolean;
  weekend: boolean;
  farLocation: boolean;
  lowSalary: boolean;
}

export interface UserNotifications {
  deadlineAlert: boolean;
  newJobAlert: boolean;
  scholarshipAlert: boolean;
  wageViolationAlert: boolean;
}

// Firestore Timestamp를 Date로 변환하는 헬퍼 함수
function toDate(timestamp: any): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (typeof timestamp === 'string') return new Date(timestamp);
  return new Date();
}

// 관심 태그 저장
export async function saveInterestTags(userId: string, tags: string[]): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    interestTags: tags,
    updatedAt: serverTimestamp()
  });
}

// 추천 제외 조건 저장
export async function saveExclusions(userId: string, exclusions: UserExclusions): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    exclusions,
    updatedAt: serverTimestamp()
  });
}

// 알림 설정 저장
export async function saveNotifications(userId: string, notifications: UserNotifications): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    notifications,
    updatedAt: serverTimestamp()
  });
}

// 관심 공고 추가
export async function addFavoriteJob(userId: string, jobId: string, jobData: any): Promise<void> {
  const favoritesRef = collection(db, 'favoriteJobs');
  await addDoc(favoritesRef, {
    userId,
    jobId,
    jobData,
    createdAt: serverTimestamp()
  });
}

// 관심 공고 제거
export async function removeFavoriteJob(userId: string, jobId: string): Promise<void> {
  const favoritesRef = collection(db, 'favoriteJobs');
  const q = query(favoritesRef, where('userId', '==', userId), where('jobId', '==', jobId));
  const querySnapshot = await getDocs(q);
  
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

// 관심 공고 목록 가져오기
export async function getFavoriteJobs(userId: string): Promise<SavedJob[]> {
  const favoritesRef = collection(db, 'favoriteJobs');
  const q = query(favoritesRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId || '',
      jobId: data.jobId || '',
      jobData: data.jobData || {},
      createdAt: toDate(data.createdAt),
    };
  });
}

// 사용자의 이력서 목록 가져오기
export async function getUserResumes(userId: string): Promise<Resume[]> {
  const resumesRef = collection(db, 'resumes');
  const q = query(resumesRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    const empty = createEmptyResume();
    
    // Firestore 데이터를 Resume 타입으로 정규화
    return {
      name: data.name || empty.name,
      phone: data.phone || empty.phone,
      email: data.email || empty.email,
      region: data.region || empty.region,
      birthYear: data.birthYear || empty.birthYear,
      gender: data.gender || empty.gender,
      
      university: data.university || empty.university,
      major: data.major || empty.major,
      grade: data.grade || empty.grade,
      status: data.status || empty.status,
      admissionYear: data.admissionYear || empty.admissionYear,
      graduationYear: data.graduationYear || empty.graduationYear,
      
      desiredField: data.desiredField || empty.desiredField,
      desiredPosition: data.desiredPosition || empty.desiredPosition,
      workType: data.workType || empty.workType,
      
      availableDays: data.availableDays || empty.availableDays,
      availableTime: data.availableTime || empty.availableTime,
      workRegion: data.workRegion || empty.workRegion,
      desiredSalary: data.desiredSalary || empty.desiredSalary,
      
      hasExperience: data.hasExperience || empty.hasExperience,
      experiences: data.experiences || empty.experiences,
      
      introduction: data.introduction || empty.introduction,
      
      skills: data.skills || empty.skills,
      exclusions: data.exclusions || empty.exclusions,
      attachments: data.attachments || empty.attachments,
      
      userId: data.userId || userId,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  });
}

// 특정 이력서 가져오기
export async function getResume(resumeId: string): Promise<Resume | null> {
  const resumeRef = doc(db, 'resumes', resumeId);
  const docSnap = await getDoc(resumeRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  const empty = createEmptyResume();
  
  return {
    name: data.name || empty.name,
    phone: data.phone || empty.phone,
    email: data.email || empty.email,
    region: data.region || empty.region,
    birthYear: data.birthYear || empty.birthYear,
    gender: data.gender || empty.gender,
    
    university: data.university || empty.university,
    major: data.major || empty.major,
    grade: data.grade || empty.grade,
    status: data.status || empty.status,
    admissionYear: data.admissionYear || empty.admissionYear,
    graduationYear: data.graduationYear || empty.graduationYear,
    
    desiredField: data.desiredField || empty.desiredField,
    desiredPosition: data.desiredPosition || empty.desiredPosition,
    workType: data.workType || empty.workType,
    
    availableDays: data.availableDays || empty.availableDays,
    availableTime: data.availableTime || empty.availableTime,
    workRegion: data.workRegion || empty.workRegion,
    desiredSalary: data.desiredSalary || empty.desiredSalary,
    
    hasExperience: data.hasExperience || empty.hasExperience,
    experiences: data.experiences || empty.experiences,
    
    introduction: data.introduction || empty.introduction,
    
    skills: data.skills || empty.skills,
    exclusions: data.exclusions || empty.exclusions,
    attachments: data.attachments || empty.attachments,
    
    userId: data.userId || '',
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

// 이력서 저장
export async function saveResume(userId: string, resumeData: Partial<Resume>, resumeId?: string): Promise<string> {
  if (resumeId) {
    // 기존 이력서 업데이트
    const resumeRef = doc(db, 'resumes', resumeId);
    await updateDoc(resumeRef, {
      ...resumeData,
      updatedAt: serverTimestamp()
    });
    return resumeId;
  } else {
    // 새 이력서 생성
    const resumesRef = collection(db, 'resumes');
    const docRef = await addDoc(resumesRef, {
      ...resumeData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }
}

// 이력서 삭제
export async function deleteResume(resumeId: string): Promise<void> {
  const resumeRef = doc(db, 'resumes', resumeId);
  await deleteDoc(resumeRef);
}

// 알림 발송 기록 저장
export async function saveNotificationLog(
  userId: string, 
  jobId: string, 
  type: 'D-3' | 'D-1',
  email: string
): Promise<void> {
  const logsRef = collection(db, 'notificationLogs');
  await addDoc(logsRef, {
    userId,
    jobId,
    type,
    email,
    sentAt: serverTimestamp()
  });
}

// 알림 발송 기록 확인 (중복 발송 방지)
export async function checkNotificationSent(
  userId: string, 
  jobId: string, 
  type: 'D-3' | 'D-1'
): Promise<boolean> {
  const logsRef = collection(db, 'notificationLogs');
  const q = query(
    logsRef, 
    where('userId', '==', userId), 
    where('jobId', '==', jobId),
    where('type', '==', type)
  );
  const querySnapshot = await getDocs(q);
  
  return !querySnapshot.empty;
}
