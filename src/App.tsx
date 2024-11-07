import React, { useState } from 'react';
import { Plus, LayoutDashboard, Calendar as CalendarIcon } from 'lucide-react';
import { Goal, Habit, Period } from './types';
import { GoalCard } from './components/GoalCard';
import { HabitList } from './components/HabitList';
import { Calendar } from './components/Calendar';
import { NewGoalModal } from './components/NewGoalModal';
import { NewHabitModal } from './components/NewHabitModal';

// Sample data
const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Learn French A2',
    description: 'Master basic French conversation skills',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-01'),
    progress: 35,
  },
  {
    id: '2',
    title: 'Daily Exercise Routine',
    description: 'Build a consistent workout habit',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-01'),
    progress: 65,
  },
];

const initialHabits: Habit[] = [
  {
    id: '1',
    title: 'Practice Busuu',
    description: '15 minutes of language learning',
    date: new Date(),
    completed: false,
    goalIds: ['1'],
  },
  {
    id: '2',
    title: 'Listen to French Podcast',
    description: 'One episode during commute',
    date: new Date(),
    completed: true,
    goalIds: ['1'],
  },
  {
    id: '3',
    title: 'Morning Workout',
    description: '30 minutes exercise',
    date: new Date(),
    completed: false,
    goalIds: ['2'],
  },
];

function App() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'dashboard' | 'calendar'>('dashboard');
  const [period, setPeriod] = useState<Period>('30days');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

  const toggleHabit = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
    updateGoalProgress();
  };

  const updateGoalProgress = () => {
    const goalProgress = new Map<string, { completed: number; total: number }>();

    habits.forEach((habit) => {
      habit.goalIds.forEach((goalId) => {
        const current = goalProgress.get(goalId) || { completed: 0, total: 0 };
        current.total++;
        if (habit.completed) {
          current.completed++;
        }
        goalProgress.set(goalId, current);
      });
    });

    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        const progress = goalProgress.get(goal.id);
        return {
          ...goal,
          progress: progress
            ? Math.round((progress.completed / progress.total) * 100)
            : 0,
        };
      })
    );
  };

  const handleEditGoal = (goal: Goal) => {
    // Implement edit goal functionality
    console.log('Edit goal:', goal);
  };

  const handleNewGoal = (goalData: Omit<Goal, 'id' | 'progress'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: String(goals.length + 1),
      progress: 0,
    };
    setGoals([...goals, newGoal]);
  };

  const createHabitForDate = (
    habitData: Omit<Habit, 'id' | 'completed'>,
    date: Date
  ): Habit => ({
    ...habitData,
    id: String(Date.now() + Math.random()),
    date: new Date(date),
    completed: false,
  });

  const handleNewHabit = (
    habitData: Omit<Habit, 'id' | 'completed'>,
    repeat: boolean
  ) => {
    if (!repeat) {
      const newHabit = createHabitForDate(habitData, habitData.date);
      setHabits((prev) => [...prev, newHabit]);
      return;
    }

    // Find the latest end date among selected goals
    const endDate = goals
      .filter((goal) => habitData.goalIds.includes(goal.id))
      .reduce(
        (latest, goal) =>
          latest > goal.endDate ? latest : goal.endDate,
        habitData.date
      );

    // Create a habit for each day from start to end date
    const newHabits: Habit[] = [];
    let currentDate = new Date(habitData.date);

    while (currentDate <= endDate) {
      newHabits.push(createHabitForDate(habitData, currentDate));
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    setHabits((prev) => [...prev, ...newHabits]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">Crier</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'dashboard'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'calendar'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsNewGoalModalOpen(true)}
                className="ml-4 px-4 py-2 rounded-md bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Goal</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' ? (
          <>
            {/* Goals Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEditGoal}
                  />
                ))}
              </div>
            </section>

            {/* Habits Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Today's Habits
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {(['30days', 'week', 'month'] as Period[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          period === p
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p === '30days' ? '30 Days' : p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsNewHabitModalOpen(true)}
                    className="px-3 py-1 rounded-md bg-indigo-600 text-white flex items-center gap-1 hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Habit</span>
                  </button>
                </div>
              </div>
              <HabitList habits={habits} onToggle={toggleHabit} />
            </section>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Calendar
                habits={habits}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('default', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
                <button
                  onClick={() => setIsNewHabitModalOpen(true)}
                  className="px-3 py-1 rounded-md bg-indigo-600 text-white flex items-center gap-1 hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Habit</span>
                </button>
              </div>
              <HabitList
                habits={habits.filter(
                  (habit) =>
                    habit.date.getDate() === selectedDate.getDate() &&
                    habit.date.getMonth() === selectedDate.getMonth() &&
                    habit.date.getFullYear() === selectedDate.getFullYear()
                )}
                onToggle={toggleHabit}
              />
            </div>
          </div>
        )}
      </main>

      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        onSave={handleNewGoal}
      />

      <NewHabitModal
        isOpen={isNewHabitModalOpen}
        onClose={() => setIsNewHabitModalOpen(false)}
        onSave={handleNewHabit}
        goals={goals}
      />
    </div>
  );
}

export default App;