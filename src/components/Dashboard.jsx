import React, { Suspense } from 'react'
import { useAuth } from '../context/AuthContext'
import FederatedMusicLibrary from './FederatedMusicLibrary'
import StandaloneMusicLibrary from './StandaloneMusicLibrary'

const MusicLibraryComponent = ({ userRole }) => {
  try {
    return <FederatedMusicLibrary userRole={userRole} />
  } catch (error) {
    console.warn('Federated music library not available, using standalone:', error)
    return <StandaloneMusicLibrary userRole={userRole} />
  }
}

const Dashboard = () => {
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
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading Music Library...</p>
          </div>
        </div>
      }>
        <ErrorBoundary fallback={<StandaloneMusicLibrary userRole={isAdmin ? 'admin' : 'user'} />}>
          <MusicLibraryComponent userRole={isAdmin ? 'admin' : 'user'} />
        </ErrorBoundary>
      </Suspense>
    </div>
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Micro frontend loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export default Dashboard