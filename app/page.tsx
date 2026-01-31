'use client';

import { useAuth, useTasks, useHabits, useSparkyTasks } from '@/lib/hooks';
import { useState } from 'react';

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(user?.uid);
  const { habits, addHabit, completeHabit } = useHabits(user?.uid);
  const { sparkyTasks, addSparkyTask, updateSparkyTask } = useSparkyTasks(user?.uid);
  
  const [newTask, setNewTask] = useState('');
  const [taskCategory, setTaskCategory] = useState<'want' | 'have'>('want');
  const [newHabit, setNewHabit] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'sparky' | 'analytics'>('tasks');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">MEKA Command Center</h1>
          <p className="text-gray-400 mb-8">Your personal task and project management dashboard</p>
          <button
            onClick={signInWithGoogle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Sign in with Google
          </button>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">MEKA Command Center</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">{user.displayName}</span>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex">
          {['tasks', 'habits', 'sparky', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-4 font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Task */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
              <form onSubmit={handleAddTask} className="flex gap-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                >
                  <option value="want">Want to Do</option>
                  <option value="have">Have to Do</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Want to Do */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Want to Do</h2>
              <div className="space-y-3">
                {wantTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                      task.status === 'completed'
                        ? 'bg-gray-700/50 border-gray-600 opacity-60'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                        task.status === 'completed'
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-400 hover:border-blue-500'
                      }`}
                    >
                      {task.status === 'completed' && '✓'}
                    </button>
                    <span className={`flex-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {wantTasks.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
                )}
              </div>
            </div>

            {/* Have to Do */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">Have to Do</h2>
              <div className="space-y-3">
                {haveTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                      task.status === 'completed'
                        ? 'bg-gray-700/50 border-gray-600 opacity-60'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                        task.status === 'completed'
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-400 hover:border-orange-500'
                      }`}
                    >
                      {task.status === 'completed' && '✓'}
                    </button>
                    <span className={`flex-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {haveTasks.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="max-w-2xl">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Habit</h2>
              <form onSubmit={handleAddHabit} className="flex gap-4">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="New habit (e.g., Gym, Read, Meditate)"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition"
                >
                  Add Habit
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <div key={habit.id} className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{habit.name}</h3>
                    <p className="text-gray-400">Current streak: {habit.streak} days</p>
                  </div>
                  <button
                    onClick={() => completeHabit(habit.id, habit.streak)}
                    className="bg-green-600 hover:bg-green-700 w-12 h-12 rounded-full flex items-center justify-center text-xl transition"
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sparky' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Sparky's Active Tasks</h2>
            <div className="space-y-4">
              {sparkyTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-gray-800 rounded-lg p-6 border-l-4 ${
                    task.status === 'completed'
                      ? 'border-green-500'
                      : task.status === 'in-progress'
                      ? 'border-blue-500'
                      : task.status === 'error'
                      ? 'border-red-500'
                      : 'border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs uppercase font-semibold px-2 py-1 rounded ${
                      task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      task.status === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {task.status}
                    </span>
                    <span className={`text-xs uppercase font-semibold px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority} priority
                    </span>
                  </div>
                  <p className="text-lg">{task.description}</p>
                  {task.notes && (
                    <p className="text-gray-400 mt-2 text-sm">{task.notes}</p>
                  )}
                </div>
              ))}
              {sparkyTasks.length === 0 && (
                <p className="text-gray-500 text-center py-12">
                  No active Sparky tasks. I'll add tasks here when I'm working on things for you!
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{tasks.length}</div>
              <div className="text-gray-400">Total Tasks</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">{completedTasks.length}</div>
              <div className="text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">{habits.length}</div>
              <div className="text-gray-400">Active Habits</div>
            </div>
            
            <div className="md:col-span-3 bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Completion Rate</h3>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%`
                  }}
                />
              </div>
              <p className="text-gray-400 mt-2">
                {tasks.length > 0
                  ? `${Math.round((completedTasks.length / tasks.length) * 100)}% of tasks completed`
                  : 'No tasks yet'}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
