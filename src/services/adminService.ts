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
import { db, auth } from '../lib/firebase';

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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
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

export const deleteLoanDoc = async (loanId: string, docId: string) => {
  const path = `loans/${loanId}/docs/${docId}`;
  try {
    await deleteDoc(doc(db, 'loans', loanId, 'docs', docId));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, path);
  }
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
