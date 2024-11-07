import React from 'react';
import { Target, Calendar, CheckCircle2 } from 'lucide-react';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
        </div>
        <button
          onClick={() => onEdit(goal)}
          className="text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Edit goal</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      
      {goal.description && (
        <p className="mt-2 text-sm text-gray-600">{goal.description}</p>
      )}
      
      <div className="mt-4">
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">{goal.progress}% Complete</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(goal.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <CheckCircle2 className="w-4 h-4" />
              <span>{new Date(goal.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}