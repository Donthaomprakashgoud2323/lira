
import React, { useState, useEffect } from 'react';
import { AppView, Task, Message } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import TaskBoard from './components/TaskBoard';
import WellnessHub from './components/WellnessHub';
import LiraVoice from './components/LiraVoice';
import { generateLiraResponse } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Load persistence
  useEffect(() => {
    const savedTasks = localStorage.getItem('lira_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    
    const savedMessages = localStorage.getItem('lira_messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    localStorage.setItem('lira_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lira_messages', JSON.stringify(messages));
  }, [messages]);

  const handleAddTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    const response = await generateLiraResponse(text);
    
    const liraMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, liraMsg]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-24 bg-[#fdfaf6] selection:bg-indigo-100">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen">
        {currentView === AppView.DASHBOARD && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif text-gray-900 tracking-tight">
                  Bonjour, <span className="gradient-text italic">L'Ami</span>
                </h1>
                <p className="text-xl text-gray-500 mt-4 max-w-md">
                  Welcome back to your sanctuary. Lira is ready to assist your mind and your schedule.
                </p>
              </div>
              <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4 border-white">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <i className="fa-solid fa-cloud-sun text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Perfect Morning</p>
                  <p className="text-xs text-gray-500">72°F in your world</p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <LiraVoice />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-8 rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">Focus Tasks</h3>
                      <button onClick={() => setCurrentView(AppView.TASKS)} className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                      {tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-gray-300' : 'bg-indigo-400'}`}></div>
                          <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
                        </div>
                      ))}
                      {tasks.length === 0 && <p className="text-sm text-gray-400 italic">No tasks today. Enjoy the peace.</p>}
                    </div>
                  </div>
                  <div className="glass p-8 rounded-[2rem] space-y-4 bg-indigo-50/30">
                     <h3 className="font-bold text-lg">Daily Affirmation</h3>
                     <p className="text-gray-600 italic">"You are not your output. You are the stillness between your breaths."</p>
                     <div className="pt-2">
                        <button className="text-indigo-600 text-sm font-bold hover:gap-3 flex items-center gap-2 transition-all">
                          Read more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </button>
                     </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 h-[600px]">
                <ChatInterface 
                  messages={messages} 
                  onSendMessage={handleSendMessage} 
                  isTyping={isTyping} 
                />
              </div>
            </div>
          </div>
        )}

        {currentView === AppView.CHAT && (
          <div className="h-[80vh] max-w-2xl mx-auto animate-in fade-in duration-500">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isTyping={isTyping} 
            />
          </div>
        )}

        {currentView === AppView.TASKS && (
          <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
            <TaskBoard 
              tasks={tasks} 
              onAddTask={handleAddTask} 
              onToggleTask={handleToggleTask} 
              onDeleteTask={handleDeleteTask} 
            />
          </div>
        )}

        {currentView === AppView.PAMPER && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <WellnessHub />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
