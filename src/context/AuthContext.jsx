import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { ref, get, set, update, serverTimestamp } from 'firebase/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mapFirebaseUser = (firebaseUser) => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    avatar: firebaseUser.photoURL || '',
    __sessionType: 'firebase'
  };
};

const toHex = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const hashPassword = async (password, saltHex) => {
  let salt = saltHex;
  if (!salt) {
    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
    salt = toHex(saltBytes);
  }
  const data = new TextEncoder().encode(`${password}:${salt}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return { salt, hash: toHex(digest) };
};

const emailKeyOf = (email) => email.toLowerCase().replace(/\./g, ',');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user'); // Debug log
      
      if (firebaseUser) {
        const normalizedUser = mapFirebaseUser(firebaseUser);
        console.log('Setting user:', normalizedUser); // Debug log
        setUser(normalizedUser);
        try {
          localStorage.setItem('biolift-user', JSON.stringify(normalizedUser));
        } catch {}

        try {
          const userRef = ref(db, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          if (!snapshot.exists()) {
            await set(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              avatar: firebaseUser.photoURL || '',
              membership: 'free',
              level: 'beginner',
              points: 0,
              rank: 'Rookie',
              createdAt: serverTimestamp()
            });
          }
        } catch (e) {
          console.error('Failed to bootstrap user profile:', e);
        }
      } else {
        console.log('No Firebase user, checking localStorage'); // Debug log
        try {
          const saved = localStorage.getItem('biolift-user');
          if (saved) {
            const parsed = JSON.parse(saved);
            console.log('Found saved user:', parsed); // Debug log
            if (parsed && parsed.__sessionType === 'local') {
              setUser(parsed);
            } else {
              setUser(null);
            }
          } else {
            console.log('No saved user in localStorage'); // Debug log
            setUser(null);
          }
        } catch {
          console.log('Error reading localStorage'); // Debug log
          setUser(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const googleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const emailKey = emailKeyOf(email);
      const emailRef = ref(db, `emails/${emailKey}`);
      const emailSnap = await get(emailRef);
      if (!emailSnap.exists()) {
        return { success: false, error: 'Invalid credentials' };
      }
      const uid = emailSnap.val();
      const userRef = ref(db, `users/${uid}`);
      const userSnap = await get(userRef);
      if (!userSnap.exists()) {
        return { success: false, error: 'Account not found' };
      }
      const userRecord = userSnap.val();
      const stored = userRecord.password;
      if (!stored?.salt || !stored?.hash) {
        return { success: false, error: 'Account password not set' };
      }
      const { hash } = await hashPassword(password, stored.salt);
      if (hash !== stored.hash) {
        return { success: false, error: 'Invalid credentials' };
      }
      const sessionUser = {
        uid,
        email: userRecord.email || '',
        name: userRecord.name || '',
        avatar: userRecord.avatar || '',
        membership: userRecord.membership || 'free',
        level: userRecord.level || 'beginner',
        points: userRecord.points || 0,
        rank: userRecord.rank || 'Rookie',
        __sessionType: 'local'
      };
      setUser(sessionUser);
      try {
        localStorage.setItem('biolift-user', JSON.stringify(sessionUser));
      } catch {}
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const emailLower = email.toLowerCase();
      const emailKey = emailKeyOf(emailLower);
      const existing = await get(ref(db, `emails/${emailKey}`));
      if (existing.exists()) {
        return { success: false, error: 'Email already in use' };
      }
      const uid = crypto.randomUUID();
      const { salt, hash } = await hashPassword(password);
      const userRecord = {
        uid,
        email: emailLower,
        name,
        avatar: '',
        membership: 'free',
        level: 'beginner',
        points: 0,
        rank: 'Rookie',
        createdAt: serverTimestamp(),
        password: { salt, hash }
      };
      await update(ref(db), {
        [`users/${uid}`]: userRecord,
        [`emails/${emailKey}`]: uid
      });
      const sessionUser = {
        uid,
        email: emailLower,
        name,
        avatar: '',
        membership: 'free',
        level: 'beginner',
        points: 0,
        rank: 'Rookie',
        __sessionType: 'local'
      };
      setUser(sessionUser);
      try {
        localStorage.setItem('biolift-user', JSON.stringify(sessionUser));
      } catch {}
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem('biolift-user');
    } catch {}
  };

  const updateUser = async (updates) => {
    if (!user?.uid) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    try {
      await update(ref(db, `users/${user.uid}`), updates);
    } catch (e) {
      console.error('Failed to update user profile:', e);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    googleSignIn,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};