import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type UserRole = 'investor' | 'borrower' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  investAmount?: string;
  isAccredited?: boolean;
  loanType?: string;
  loanAmount?: number;
  propertyValue?: number;
  duration?: string;
  experience?: string;
  createdAt: any;
  updatedAt?: any;
}

const USERS_COLLECTION = 'users';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const createUserProfile = async (profile: Omit<UserProfile, 'createdAt'>) => {
  const docRef = doc(db, USERS_COLLECTION, profile.uid);
  
  // Firestore does not allow undefined values in objects
  const sanitizedProfile = Object.entries(profile).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);

  return await setDoc(docRef, {
    ...sanitizedProfile,
    createdAt: serverTimestamp()
  });
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const docRef = doc(db, USERS_COLLECTION, uid);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};
