import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Goal, Habit } from '../types';

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'completed'>, repeat: boolean) => void;
  goals: Goal[];
}

export function NewHabitModal({ isOpen, onClose, onSave, goals }: NewHabitModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [repeat, setRepeat] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        title,
        description,
        date: new Date(date),
        goalIds: selectedGoals,
      },
      repeat
    );
    setTitle('');
    setDescription('');
    setSelectedGoals([]);
    setRepeat(false);
    onClose();
  };

  const selectedGoalDates = goals
    .filter((goal) => selectedGoals.includes(goal.id))
    .reduce(
      (dates, goal) => {
        const start = new Date(goal.startDate);
        const end = new Date(goal.endDate);
        return {
          start: dates.start ? (start < dates.start ? start : dates.start) : start,
          end: dates.end ? (end > dates.end ? end : dates.end) : end,
        };
      },
      { start: null, end: null } as { start: Date | null; end: Date | null }
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">noveau habitude</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Goals
            </label>
            <div className="space-y-2">
              {goals.map((goal) => (
                <label key={goal.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGoals([...selectedGoals, goal.id]);
                      } else {
                        setSelectedGoals(selectedGoals.filter((id) => id !== goal.id));
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{goal.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={selectedGoalDates.start?.toISOString().split('T')[0]}
              max={selectedGoalDates.end?.toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {selectedGoals.length > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="repeat"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="repeat" className="text-sm text-gray-700">
                Repeat daily until goal end date
                {selectedGoalDates.end && (
                  <span className="text-gray-500">
                    {' '}
                    (until {selectedGoalDates.end.toLocaleDateString()})
                  </span>
                )}
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}