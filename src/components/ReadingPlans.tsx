'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import type { ReadingPlan } from '@/lib/types/readingPlan';

const categories = [
  'All',
  'Bible Study',
  'Character Study',
  'Devotional',
  'Evangelism',
  'Faith',
  'Prayer',
  'Relationships',
  'Trust',
  'Wisdom'
];

const readingPlans: ReadingPlan[] = [
  {
    id: 'giving-jesus-away',
    title: '[Giving Jesus Away] to Seek and to Save',
    days: 3,
    image: '/assets/plans/giving-jesus-away.jpg',
    category: 'Evangelism',
    description: 'Learn how to share your faith with others in a natural and loving way.',
    content: [] // TODO: Add actual content
  },
  {
    id: 'complicated-people',
    title: 'How to Deal With Complicated People',
    days: 7,
    image: '/assets/plans/complicated-people.jpg',
    category: 'Relationships',
    description: 'Learn how to navigate difficult relationships with love and wisdom.',
    content: [] // TODO: Add actual content
  },
  {
    id: 'sermon-mount',
    title: 'BibleProject | Sermon on the Mount',
    days: 10,
    image: '/assets/plans/sermon-mount.jpg',
    category: 'Bible Study',
    description: 'Explore the teachings of Jesus in the Sermon on the Mount.',
    content: [] // TODO: Add actual content
  },
  {
    id: 'finding-freedom',
    title: 'Finding Freedom: Trusting God',
    days: 5,
    image: '/assets/plans/finding-freedom.jpg',
    category: 'Faith',
    description: 'Discover the freedom that comes from trusting in God.',
    content: [] // TODO: Add actual content
  },
  {
    id: 'boat-middle-lake',
    title: 'In a Boat in the Middle of a Lake: Trusting the God Who Meets Us in Our Storm',
    days: 5,
    image: '/assets/plans/boat-middle-lake.jpg',
    category: 'Trust',
    description: 'Learn to trust God in the midst of life\'s storms.',
    content: [] // TODO: Add actual content
  },
  {
    id: 'rahab',
    title: 'Rahab: How God Uses the Unlikely',
    days: 5,
    image: '/assets/plans/rahab.jpg',
    category: 'Character Study',
    description: 'Explore the story of Rahab and how God uses unlikely people.',
    content: [] // TODO: Add actual content
  }
];

export default function ReadingPlans() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPlans = readingPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-semibold text-gray-800">
          Free Reading Plans and Devotionals
        </h2>
        <p className="text-gray-600 mt-2">
          Bible Plans help you engage with God's Word every day, a little at a time.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex-shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-primary/50
                     appearance-none bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
            onClick={() => router.push(`/plans/${plan.id}`)}
          >
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={plan.image}
                alt={plan.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm line-clamp-2">{plan.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-primary font-medium">{plan.category}</div>
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {plan.title}
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{plan.days} Days</span>
                <button className="text-primary hover:text-primary/80 font-medium">
                  Start plan
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          No plans found matching your search criteria.
        </div>
      )}
    </div>
  );
}
