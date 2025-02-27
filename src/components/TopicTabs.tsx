'use client'

import { useState } from 'react'

const tabs = ['Plans', 'Videos', 'Images']

export default function TopicTabs() {
  const [activeTab, setActiveTab] = useState('Plans')

  return (
    <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${
              activeTab === tab
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
