
import React, { useState } from 'react';

const WellnessHub: React.FC = () => {
  const [activeRitual, setActiveRitual] = useState<string | null>(null);

  const rituals = [
    { id: 'breathe', icon: 'fa-wind', title: 'Guided Breathing', description: '4-7-8 technique for instant calm', color: 'bg-blue-50 text-blue-600' },
    { id: 'affirm', icon: 'fa-sun', title: 'Affirmations', description: 'Gentle reminders of your worth', color: 'bg-amber-50 text-amber-600' },
    { id: 'journal', icon: 'fa-book-open', title: 'Gratitude Spark', description: 'Three small joys from today', color: 'bg-rose-50 text-rose-600' },
    { id: 'tea', icon: 'fa-mug-hot', title: 'Tea Ceremony', description: 'A slow ritual of mindfulness', color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="text-center">
        <h2 className="text-4xl font-serif text-gray-800 mb-2">The Sanctuary</h2>
        <p className="text-gray-500 italic">"Be patient with yourself. Nothing in nature blooms all year."</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rituals.map((ritual) => (
          <button
            key={ritual.id}
            onClick={() => setActiveRitual(ritual.id)}
            className="text-left glass p-8 rounded-[2.5rem] hover:shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-50/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
            <div className={`w-14 h-14 ${ritual.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
              <i className={`fa-solid ${ritual.icon} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{ritual.title}</h3>
            <p className="text-gray-500 leading-relaxed">{ritual.description}</p>
          </button>
        ))}
      </div>

      <div className="glass p-10 rounded-[3rem] text-center bg-gradient-to-br from-indigo-50/50 to-white">
        <h3 className="text-2xl font-serif mb-4">A Note from Lira</h3>
        <p className="text-gray-600 leading-relaxed max-w-lg mx-auto italic">
          "I want you to know that you are doing your best, and that is more than enough. 
          Your worth is not measured by your productivity, but by the kindness you show 
          to yourself. Take a deep breath. I am proud of you."
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${i + 20}/40/40`} className="w-10 h-10 rounded-full border-2 border-white" alt="Avatar" />
            ))}
          </div>
          <p className="text-sm text-gray-500 flex items-center">Join 4.2k others in self-care today</p>
        </div>
      </div>
    </div>
  );
};

export default WellnessHub;
