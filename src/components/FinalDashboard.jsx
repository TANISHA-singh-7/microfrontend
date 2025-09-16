import React from 'react'
import { useAuth } from '../context/AuthContext'
import WorkingMusicLibrary from './WorkingMusicLibrary'

const FinalDashboard = () => {
  const { user, isAdmin } = useAuth()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.username}! 🎵
        </h2>
        <p className="text-gray-400">
          {isAdmin ? 'Manage your music library with full admin access' : 'Discover and enjoy your favorite music'}
        </p>
      </div>

      <WorkingMusicLibrary userRole={isAdmin ? 'admin' : 'user'} />
    </div>
  )
}

export default FinalDashboard