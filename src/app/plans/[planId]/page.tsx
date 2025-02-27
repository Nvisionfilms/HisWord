'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, CheckCircle } from 'lucide-react';
import type { ReadingPlan, UserPlanProgress } from '@/lib/types/readingPlan';

export default function PlanPage() {
  const { planId } = useParams();
  const [plan, setPlan] = useState<ReadingPlan | null>(null);
  const [progress, setProgress] = useState<UserPlanProgress | null>(null);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    // TODO: Fetch plan and progress from Supabase
  }, [planId]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading plan...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Plan Header */}
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="text-sm font-medium mb-2">{plan.category}</div>
          <h1 className="text-3xl font-serif font-bold mb-2">{plan.title}</h1>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{plan.days} Days</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="glass-container p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ 
                width: `${progress ? (progress.completedDays.length / plan.days) * 100 : 0}%` 
              }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {progress ? `${progress.completedDays.length}/${plan.days} days` : '0/0 days'}
          </span>
        </div>
      </div>

      {/* Day Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {plan.content.map((day, index) => (
          <motion.button
            key={day.day}
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentDay(day.day)}
            className={`p-4 rounded-lg border ${
              currentDay === day.day
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Day {day.day}</div>
                <div className="font-medium">{day.title}</div>
              </div>
              {progress?.completedDays.includes(day.day) && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Current Day Content */}
      {plan.content[currentDay - 1] && (
        <div className="space-y-8">
          <div className="verse-card">
            <h3 className="text-xl font-semibold mb-4">Today's Reading</h3>
            <div className="space-y-4">
              {plan.content[currentDay - 1].verses.map((verse, index) => (
                <div key={index} className="verse-text">{verse}</div>
              ))}
            </div>
          </div>

          <div className="verse-card">
            <h3 className="text-xl font-semibold mb-4">Devotional</h3>
            <div className="prose prose-amber">
              {plan.content[currentDay - 1].devotional}
            </div>
          </div>

          <div className="verse-card">
            <h3 className="text-xl font-semibold mb-4">Reflection Questions</h3>
            <ul className="space-y-4">
              {plan.content[currentDay - 1].questions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="verse-card">
            <h3 className="text-xl font-semibold mb-4">Prayer</h3>
            <div className="italic text-gray-700">
              {plan.content[currentDay - 1].prayer}
            </div>
          </div>

          <button
            onClick={() => {
              // TODO: Mark day as complete
            }}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg
                     hover:bg-primary/90 transition-colors font-medium"
          >
            Mark Day {currentDay} as Complete
          </button>
        </div>
      )}
    </div>
  );
}
