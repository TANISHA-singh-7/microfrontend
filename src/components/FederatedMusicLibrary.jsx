import React, { Suspense, lazy } from 'react'

const RemoteMusicLibrary = lazy(() => import('musicLibrary/MusicLibrary'))

const FederatedMusicLibrary = ({ userRole = 'user' }) => {
  return (
    <div className="federated-music-library">
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading Music Library...</p>
            </div>
          </div>
        }
      >
        <RemoteMusicLibrary userRole={userRole} />
      </Suspense>
    </div>
  )
}

export default FederatedMusicLibrary