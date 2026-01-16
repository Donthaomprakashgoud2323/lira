
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (title: string, priority: Task['priority']) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle, priority);
    setNewTaskTitle('');
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700'
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif text-gray-800">Gentle Productivity</h2>
        <p className="text-gray-500">Let's organize your day, one step at a time.</p>
      </header>

      <form onSubmit={handleSubmit} className="glass p-6 rounded-3xl space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-medium hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            Add
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">Priority:</span>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-4 py-1.5 rounded-full capitalize transition-all ${
                priority === p ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </form>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 glass rounded-3xl border-dashed border-2 border-gray-200">
            <i className="fa-solid fa-feather-pointed text-gray-300 text-4xl mb-4"></i>
            <p className="text-gray-400">Your task list is empty. Take a moment for yourself.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-5 glass rounded-2xl transition-all group ${task.completed ? 'opacity-60' : 'hover:shadow-lg hover:border-indigo-100'}`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-200'
                  }`}
                >
                  {task.completed && <i className="fa-solid fa-check text-[10px]"></i>}
                </button>
                <span className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.title}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-2"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
