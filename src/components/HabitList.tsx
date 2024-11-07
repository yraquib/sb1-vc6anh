import React from 'react';
import { CheckCircle, Circle, Target } from 'lucide-react';
import { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string) => void;
}

export function HabitList({ habits, onToggle }: HabitListProps) {
  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggle(habit.id)}
              className={`rounded-full transition-colors ${
                habit.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              {habit.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <div>
              <h4 className="font-medium text-gray-900">{habit.title}</h4>
              {habit.description && (
                <p className="text-sm text-gray-600">{habit.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <span className="text-sm text-gray-600">
              {habit.goalIds.length} goal{habit.goalIds.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}