import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  category: 'want' | 'have';
  status: 'pending' | 'in-progress' | 'completed';
  project?: string;
  dueDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted?: Timestamp;
  createdAt: Timestamp;
}

interface SparkyTask {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes?: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = () => signOut(auth);

  return { user, loading, signInWithGoogle, logout };
}

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return;
    await addDoc(collection(db, 'tasks'), {
      ...task,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
}

export function useHabits(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habit[];
      setHabits(habitsData);
    });

    return unsubscribe;
  }, [userId]);

  const addHabit = async (name: string) => {
    if (!userId) return;
    await addDoc(collection(db, 'habits'), {
      name,
      userId,
      streak: 0,
      createdAt: Timestamp.now()
    });
  };

  const completeHabit = async (habitId: string, currentStreak: number) => {
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, {
      streak: currentStreak + 1,
      lastCompleted: Timestamp.now()
    });
  };

  return { habits, addHabit, completeHabit };
}

export function useSparkyTasks(userId: string | undefined) {
  const [sparkyTasks, setSparkyTasks] = useState<SparkyTask[]>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'sparkyTasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SparkyTask[];
      setSparkyTasks(tasksData);
    });

    return unsubscribe;
  }, [userId]);

  const addSparkyTask = async (description: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!userId) return;
    await addDoc(collection(db, 'sparkyTasks'), {
      description,
      priority,
      status: 'pending',
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  };

  const updateSparkyTask = async (taskId: string, updates: Partial<SparkyTask>) => {
    const taskRef = doc(db, 'sparkyTasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  return { sparkyTasks, addSparkyTask, updateSparkyTask };
}
