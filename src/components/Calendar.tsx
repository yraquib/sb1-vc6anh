import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '../types';

interface CalendarProps {
  habits: Habit[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export function Calendar({ habits, onDateSelect, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getHabitsForDate = (date: Date) =>
    habits.filter(
      (habit) =>
        habit.date.getDate() === date.getDate() &&
        habit.date.getMonth() === date.getMonth() &&
        habit.date.getFullYear() === date.getFullYear()
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
              )
            }
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
              )
            }
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {previousMonthDays.map((_, index) => (
          <div key={`prev-${index}`} className="p-2" />
        ))}

        {days.map((day) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const dayHabits = getHabitsForDate(date);
          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear();
          const hasHabits = dayHabits.length > 0;
          const allCompleted =
            hasHabits && dayHabits.every((habit) => habit.completed);

          return (
            <button
              key={day}
              onClick={() => onDateSelect(date)}
              className={`p-2 relative rounded-lg transition-colors ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span
                className={`text-sm ${
                  isSelected ? 'font-semibold' : 'font-medium'
                }`}
              >
                {day}
              </span>
              {hasHabits && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                    allCompleted ? 'bg-green-500' : 'bg-indigo-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}