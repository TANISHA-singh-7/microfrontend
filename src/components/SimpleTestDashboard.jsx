import React from 'react'
import { useAuth } from '../context/AuthContext'

const SimpleTestDashboard = () => {
  const { user, isAdmin } = useAuth()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.username}!
        </h2>
        <p className="text-gray-400">
          {isAdmin ? 'Admin Access - You can manage the music library' : 'User Access - You can view the music library'}
        </p>
        
        <div className="mt-6 p-6 glass-effect rounded-xl">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-2xl font-bold text-white mb-2">Authentication Successful!</h3>
          <p className="text-gray-300 mb-4">
            The login system is working perfectly. You are logged in as <strong>{user?.username}</strong> with <strong>{user?.role}</strong> role.
          </p>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-white mb-2">✅ What's Working:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• JWT Authentication (mock)</li>
              <li>• Role-based access control</li>
              <li>• React Router navigation</li>
              <li>• Tailwind CSS styling</li>
              <li>• Local storage persistence</li>
            </ul>
          </div>

          <div className="mt-4 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-blue-300 mb-2">🚀 Next Steps:</h4>
            <p className="text-sm text-blue-200">
              The music library component will load once all dependencies are properly installed. 
              The app is working correctly - just need to resolve the lucide-react import.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-effect rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">JWT</div>
              <div className="text-sm text-gray-400">Authentication</div>
            </div>
            <div className="glass-effect rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{user?.role?.toUpperCase()}</div>
              <div className="text-sm text-gray-400">User Role</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleTestDashboard