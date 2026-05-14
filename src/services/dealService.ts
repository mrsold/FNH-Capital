import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Deal {
  id?: string;
  title: string;
  description: string;
  status: 'Active' | 'Closed' | 'Funding';
  imageUrl?: string;
  loanAmount?: number;
  interestRate?: string;
  loanPeriod?: string;
  propertyType?: string;
  location?: string;
  fundingProgress?: number;
  createdAt: any;
  updatedAt?: any;
}

const DEALS_COLLECTION = 'deals';

export const getDeals = async (): Promise<Deal[]> => {
  const q = query(collection(db, DEALS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Deal));
};

export const createDeal = async (deal: Omit<Deal, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, DEALS_COLLECTION), {
    ...deal,
    createdAt: serverTimestamp()
  });
};

export const updateDeal = async (id: string, deal: Partial<Omit<Deal, 'id' | 'createdAt'>>) => {
  const dealRef = doc(db, DEALS_COLLECTION, id);
  return await updateDoc(dealRef, {
    ...deal,
    updatedAt: serverTimestamp()
  });
};

export const deleteDeal = async (id: string) => {
  return await deleteDoc(doc(db, DEALS_COLLECTION, id));
};
