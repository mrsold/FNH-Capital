import { 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  addDoc,
  onSnapshot,
  limit,
  where,
  QueryConstraint
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code || 'unknown';
  
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  
  console.error(`Firestore Error [${operationType}] on [${path}]:`, errorCode, errorMessage, JSON.stringify(errInfo));
  
  const enhancedError = new Error(JSON.stringify(errInfo));
  (enhancedError as any).code = errorCode;
  throw enhancedError;
}

// Interfaces
export interface Borrower {
  name: string;
  email: string;
  phone?: string;
  createdAt?: any;
}

export interface Investor {
  name: string;
  email: string;
  phone?: string;
  isAccredited?: boolean;
  createdAt?: any;
}

export interface LoanDocument {
  id?: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Loan {
  id?: string;
  address: string;
  loanAmount: number;
  interestRate: number;
  monthlyPayment: number;
  maturityDate: string;
  arv?: number;
  amountRaised?: number;
  images?: string[];
  isFeatured?: boolean;
  borrowerEmail: string;
  borrowerName: string;
  investorEmails: string[];
  status: 'Active' | 'Funding' | 'Closed';
  documentCount?: number;
  lastDocs?: string[];
  createdAt?: any;
  updatedAt?: any;
}

// Borrowers
export const getBorrowers = async (): Promise<Borrower[]> => {
  const path = 'borrowers';
  try {
    const q = query(collection(db, path), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Borrower);
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const upsertBorrower = async (borrower: Borrower) => {
  const path = `borrowers/${borrower.email}`;
  try {
    const borrowerRef = doc(db, 'borrowers', borrower.email);
    await setDoc(borrowerRef, {
      ...borrower,
      updatedAt: serverTimestamp(),
      createdAt: borrower.createdAt || serverTimestamp()
    }, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const deleteBorrower = async (email: string) => {
  const path = `borrowers/${email}`;
  try {
    await deleteDoc(doc(db, 'borrowers', email));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, path);
  }
};

// Investors
export const getInvestors = async (): Promise<Investor[]> => {
  const path = 'investors';
  try {
    const q = query(collection(db, path), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Investor);
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const upsertInvestor = async (investor: Investor) => {
  const path = `investors/${investor.email}`;
  try {
    const investorRef = doc(db, 'investors', investor.email);
    await setDoc(investorRef, {
      ...investor,
      updatedAt: serverTimestamp(),
      createdAt: investor.createdAt || serverTimestamp()
    }, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, path);
  }
};

export const deleteInvestor = async (email: string) => {
  const path = `investors/${email}`;
  try {
    await deleteDoc(doc(db, 'investors', email));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, path);
  }
};

// Loans
export const getLoans = async (): Promise<Loan[]> => {
  const path = 'loans';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Loan));
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const createLoan = async (loan: Omit<Loan, 'id' | 'createdAt'>) => {
  const path = 'loans';
  try {
    return await addDoc(collection(db, 'loans'), {
      ...loan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, path);
  }
};

export const updateLoan = async (id: string, loan: Partial<Loan>) => {
  const path = `loans/${id}`;
  try {
    const loanRef = doc(db, 'loans', id);
    await updateDoc(loanRef, {
      ...loan,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.UPDATE, path);
  }
};

export const deleteLoan = async (id: string) => {
  const path = `loans/${id}`;
  try {
    await deleteDoc(doc(db, 'loans', id));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, path);
  }
}

export const subscribeToLoans = (callback: (loans: Loan[]) => void, constraints: any[] = [], onError?: (error: any) => void) => {
  const q = query(collection(db, 'loans'), ...constraints, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const loans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Loan));
    callback(loans);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.LIST, 'loans');
  });
};

export const updateLoanDocStats = async (loanId: string, currentDocs?: LoanDocument[]) => {
  const path = `loans/${loanId}/docs`;
  try {
    const loanRef = doc(db, 'loans', loanId);
    
    let count: number;
    let lastDocs: string[];

    if (currentDocs) {
      count = currentDocs.length;
      lastDocs = [...currentDocs]
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 3)
        .map(d => d.name);
    } else {
      const q = query(collection(db, 'loans', loanId, 'docs'), orderBy('uploadedAt', 'desc'), limit(3));
      const [snapshot, lastDocsSnapshot] = await Promise.all([
        getDocs(collection(db, 'loans', loanId, 'docs')),
        getDocs(q)
      ]);
      count = snapshot.size;
      lastDocs = lastDocsSnapshot.docs.map(d => d.data().name);
    }
    
    await updateDoc(loanRef, { 
      documentCount: count,
      lastDocs: lastDocs,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error updating loan doc stats:', e);
  }
};

export const syncAllLoanDocStats = async () => {
  const loans = await getLoans();
  const promises = loans.map(l => updateLoanDocStats(l.id!));
  await Promise.all(promises);
};

// Sub-collections: Documents
export const getLoanDocs = async (loanId: string): Promise<LoanDocument[]> => {
  const path = `loans/${loanId}/docs`;
  try {
    const q = query(collection(db, 'loans', loanId, 'docs'), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as LoanDocument));
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

export const addLoanDoc = async (loanId: string, docData: Omit<LoanDocument, 'id'>) => {
  const path = `loans/${loanId}/docs`;
  try {
    const docRef = await addDoc(collection(db, 'loans', loanId, 'docs'), docData);
    return docRef;
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, path);
  }
};

export const deleteLoanDoc = async (loanId: string, docId: string, docUrl?: string) => {
  const path = `loans/${loanId}/docs/${docId}`;
  console.log(`[DEBUG] deleteLoanDoc START. Loan: ${loanId}, Doc: ${docId}, URL: ${docUrl}`);
  
  try {
    // 1. Delete from Firestore FIRST to ensure UI update
    console.log(`[DEBUG] Firestore deletion attempt: ${path}`);
    await deleteDoc(doc(db, 'loans', loanId, 'docs', docId));
    console.log(`[DEBUG] Firestore deletion SUCCESS for document ${docId}`);

    // UI will update because of the subscription in AdminDashboard

    // 2. Then attempt Storage deletion
    if (docUrl && (docUrl.includes('firebasestorage') || docUrl.includes('googleapis'))) {
      try {
        const fileRef = ref(storage, docUrl);
        console.log(`[DEBUG] Storage deletion attempt. Path: ${fileRef.fullPath}`);
        await deleteObject(fileRef);
        console.log(`[DEBUG] Storage deletion SUCCESS.`);
      } catch (storageErr: any) {
        console.warn("[DEBUG] Storage deletion FAILED but Firestore is already gone:", storageErr.code, storageErr.message);
      }
    }
  } catch (e: any) {
    console.error(`[DEBUG] deleteLoanDoc CRITICAL FAILURE for ${path}:`, e.code, e.message);
    // Explicitly throw a more readable error for the UI
    const errorMsg = e.code === 'permission-denied' ? 'Permission Denied: You are not authorized to delete this document.' : (e.message || 'Unknown Firestore error');
    throw new Error(errorMsg);
  }
};

export const uploadFile = async (
  path: string, 
  file: File, 
  onProgress?: (progress: number, snapshot?: any) => void
): Promise<string> => {
  // 25MB client-side limit to match security rules
  const MAX_SIZE = 25 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    const error = new Error(`File "${file.name}" exceeds the 25MB limit.`);
    (error as any).code = 'storage/size-limit-exceeded';
    throw error;
  }

  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress, snapshot);
      }, 
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

export const subscribeToLoanDocs = (loanId: string, callback: (docs: LoanDocument[]) => void, onError?: (error: any) => void) => {
  const q = query(collection(db, 'loans', loanId, 'docs'), orderBy('uploadedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as LoanDocument));
    callback(docs);
  }, (error) => {
    const path = `loans/${loanId}/docs`;
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.LIST, path);
  });
};
