import React from 'react'
import { useAuth } from '../context/AuthContext'
import StandaloneMusicLibrary from './StandaloneMusicLibrary'

const TestDashboard = () => {
  const { user, isAdmin } = useAuth()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.username}!
        </h2>
        <p className="text-gray-400">
          {isAdmin ? 'Manage your music library' : 'Discover and enjoy your favorite music'}
        </p>
        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-300 text-sm">
            ✅ Authentication working! Using standalone music library (no micro frontend required).
          </p>
        </div>
      </div>

      <StandaloneMusicLibrary userRole={isAdmin ? 'admin' : 'user'} />
    </div>
  )
}

export default TestDashboard