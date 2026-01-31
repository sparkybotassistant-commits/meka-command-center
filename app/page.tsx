'use client';

import { useAuth, useTasks, useHabits, useSparkyTasks } from '@/lib/hooks';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(user?.uid);
  const { habits, addHabit, completeHabit } = useHabits(user?.uid);
  const { sparkyTasks } = useSparkyTasks(user?.uid);
  
  const [newTask, setNewTask] = useState('');
  const [taskCategory, setTaskCategory] = useState<'want' | 'have'>('want');
  const [newHabit, setNewHabit] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'sparky' | 'analytics'>('tasks');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#c9a962] text-2xl font-light tracking-widest animate-pulse">MEKA COMMAND CENTER</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e] via-[#0a0a0f] to-[#0f1218]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#c9a962]/5 to-transparent" />
        
        <div className="relative z-10 text-center px-6">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-4">Personal Command Center</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              MEKA
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
              Your mission control for tasks, habits, and productivity. Built for the way you work.
            </p>
            <button
              onClick={signInWithGoogle}
              className="group relative bg-[#c9a962] text-[#0a0a0f] px-10 py-4 font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#e0c078] hover:scale-105 hover:shadow-[0_0_40px_rgba(201,169,98,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    await addTask({
      title: newTask,
      category: taskCategory,
      status: 'pending'
    });
    setNewTask('');
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    
    await addHabit(newHabit);
    setNewHabit('');
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(taskId, { status: newStatus as any });
  };

  const wantTasks = tasks.filter(t => t.category === 'want');
  const haveTasks = tasks.filter(t => t.category === 'have');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c9a962] to-[#a88b4a] rounded-lg flex items-center justify-center font-bold text-[#0a0a0f] text-lg">M</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MEKA</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {user.displayName}
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-[#c9a962] transition uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'tasks', label: 'Tasks', icon: '◉' },
              { id: 'habits', label: 'Habits', icon: '◈' },
              { id: 'sparky', label: 'Sparky', icon: '◉' },
              { id: 'analytics', label: 'Analytics', icon: '◆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-[#c9a962]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="mr-2 opacity-60">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-xl p-6 border border-white/5">
                <div className="text-3xl font-bold text-white mb-1">{tasks.length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Total Tasks</div>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-xl p-6 border border-white/5">
                <div className="text-3xl font-bold text-[#c9a962] mb-1">{pendingTasks.length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-xl p-6 border border-white/5">
                <div className="text-3xl font-bold text-green-400 mb-1">{completedTasks.length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-xl p-6 border border-white/5">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Done</div>
              </div>
            </div>

            {/* Add Task */}
            <div className="bg-gradient-to-br from-[#1a1f2e] to-[#1a1f2e]/50 rounded-2xl p-8 border border-white/5">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="text-[#c9a962]">+</span> Add New Mission
              </h2>
              <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a962]/50 transition"
                />
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="bg-[#0a0a0f] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#c9a962]/50 transition"
                >
                  <option value="want">Want to Do</option>
                  <option value="have">Have to Do</option>
                </select>
                <button
                  type="submit"
                  className="bg-[#c9a962] hover:bg-[#e0c078] text-[#0a0a0f] px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-[0_0_30px_rgba(201,169,98,0.3)]"
                >
                  Add Task
                </button>
              </form>
            </div>

            {/* Task Columns */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Want to Do */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    Want to Do
                  </h3>
                  <span className="text-sm text-gray-500">{wantTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {wantTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group bg-gradient-to-r from-[#1a1f2e] to-[#1a1f2e]/50 rounded-xl p-5 border border-white/5 hover:border-blue-400/30 transition-all duration-300 ${
                        task.status === 'completed' ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            task.status === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-600 hover:border-blue-400 group-hover:border-gray-500'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {wantTasks.length === 0 && (
                    <div className="text-center py-12 text-gray-600 border border-dashed border-white/10 rounded-xl">
                      No tasks yet. Add one above!
                    </div>
                  )}
                </div>
              </div>

              {/* Have to Do */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full" />
                    Have to Do
                  </h3>
                  <span className="text-sm text-gray-500">{haveTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {haveTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group bg-gradient-to-r from-[#1a1f2e] to-[#1a1f2e]/50 rounded-xl p-5 border border-white/5 hover:border-orange-400/30 transition-all duration-300 ${
                        task.status === 'completed' ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            task.status === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-600 hover:border-orange-400 group-hover:border-gray-500'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {haveTasks.length === 0 && (
                    <div className="text-center py-12 text-gray-600 border border-dashed border-white/10 rounded-xl">
                      No tasks yet. Add one above!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-[#1a1f2e] to-[#1a1f2e]/50 rounded-2xl p-8 border border-white/5">
              <h2 className="text-lg font-semibold mb-6">Add New Habit</h2>
              <form onSubmit={handleAddHabit} className="flex gap-4">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="What habit do you want to build?"
                  className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a962]/50 transition"
                />
                <button
                  type="submit"
                  className="bg-[#c9a962] hover:bg-[#e0c078] text-[#0a0a0f] px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-[0_0_30px_rgba(201,169,98,0.3)]"
                >
                  Add
                </button>
              </form>
            </div>

            <div className="grid gap-4">
              {habits.map((habit) => (
                <div key={habit.id} className="bg-gradient-to-r from-[#1a1f2e] to-[#1a1f2e]/50 rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#c9a962]/20 transition-all">
                  <div>
                    <h3 className="font-semibold text-lg text-white">{habit.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {habit.streak > 0 ? (
                        <span className="text-[#c9a962]">🔥 {habit.streak} day streak</span>
                      ) : (
                        'Start your streak today'
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => completeHabit(habit.id, habit.streak)}
                    className="w-14 h-14 bg-[#0a0a0f] border-2 border-gray-700 rounded-full flex items-center justify-center text-2xl transition-all hover:border-[#c9a962] hover:bg-[#c9a962]/10 group-hover:scale-110"
                  >
                    ✓
                  </button>
                </div>
              ))}
              {habits.length === 0 && (
                <div className="text-center py-16 text-gray-600 border-2 border-dashed border-white/10 rounded-2xl">
                  <div className="text-4xl mb-4">◈</div>
                  <p>No habits tracked yet. Start building one!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sparky' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Sparky's Active Operations</h2>
              <p className="text-gray-500">What your AI assistant is working on</p>
            </div>
            
            <div className="space-y-4">
              {sparkyTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gradient-to-r from-[#1a1f2e] to-[#1a1f2e]/30 rounded-2xl p-6 border-l-4 border-l-[#c9a962] border-y border-r border-white/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                        task.status === 'error' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`} />
                      <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        task.status === 'error' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-lg text-white">{task.description}</p>
                  {task.notes && (
                    <p className="text-gray-500 mt-3 text-sm">{task.notes}</p>
                  )}
                </div>
              ))}
              {sparkyTasks.length === 0 && (
                <div className="text-center py-20 text-gray-600 border-2 border-dashed border-white/10 rounded-2xl">
                  <div className="text-6xl mb-4 opacity-50">🤖</div>
                  <p className="text-lg mb-2">No active operations</p>
                  <p className="text-sm">Sparky will add tasks here when working on your projects</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-2xl p-8 border border-white/5 text-center">
                <div className="text-5xl font-bold text-[#c9a962] mb-2">{tasks.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Total Tasks</div>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-2xl p-8 border border-white/5 text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">{completedTasks.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-2xl p-8 border border-white/5 text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">{habits.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Habits</div>
              </div>
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#252b3d] rounded-2xl p-8 border border-white/5 text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Success Rate</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e] to-[#1a1f2e]/50 rounded-2xl p-8 border border-white/5">
              <h3 className="text-xl font-semibold mb-6">Progress Overview</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Task Completion</span>
                    <span className="text-[#c9a962] font-semibold">
                      {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-3 bg-[#0a0a0f] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#c9a962] to-[#e0c078] rounded-full transition-all duration-1000"
                      style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Want to Do vs Have to Do</span>
                    <span className="text-blue-400 font-semibold">{wantTasks.length} / {haveTasks.length}</span>
                  </div>
                  <div className="h-3 bg-[#0a0a0f] rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${tasks.length > 0 ? (wantTasks.length / tasks.length) * 100 : 0}%` }}
                    />
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${tasks.length > 0 ? (haveTasks.length / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
