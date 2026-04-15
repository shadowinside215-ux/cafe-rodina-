import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin based on email or firestore role
        const adminEmail = "dragonballsam86@gmail.com";
        if (currentUser.email === adminEmail && currentUser.emailVerified) {
          setIsAdmin(true);
        } else {
          // Fallback to checking firestore role
          const userDocRef = doc(db, 'users', currentUser.uid);
          onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().role === 'admin') {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          });
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
