'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function Navigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          The Word
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/favorites"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Favorites
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="py-2 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
