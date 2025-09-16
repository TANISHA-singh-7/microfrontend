
class CrossOriginSync {
  constructor(key = 'globalMusicLibrary') {
    this.key = key
    this.listeners = new Set()
    this.lastKnownUpdate = 0
    this.pollInterval = null
    this.isPolling = false
  }

  getData() {
    try {
      const item = localStorage.getItem(this.key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  setData(data) {
    try {
      const timestamp = Date.now()
      const dataWithTimestamp = {
        ...data,
        lastUpdated: timestamp
      }
      localStorage.setItem(this.key, JSON.stringify(dataWithTimestamp))
      this.lastKnownUpdate = timestamp

      this.listeners.forEach(listener => listener(data))

      this.updateSharedFile(dataWithTimestamp)
      
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  async updateSharedFile(data) {
    try {
      await fetch('/shared-data.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.log('Shared file update not available (expected in dev mode)')
    }
  }

  async checkSharedFile() {
    try {
      const response = await fetch('/shared-data.json?' + Date.now()) 
      if (response.ok) {
        const sharedData = await response.json()

        if (sharedData.lastUpdated && sharedData.lastUpdated > this.lastKnownUpdate) {
          this.lastKnownUpdate = sharedData.lastUpdated

          localStorage.setItem(this.key, JSON.stringify(sharedData))

          this.listeners.forEach(listener => listener(sharedData))
        }
      }
    } catch (error) {
      console.log('Shared file check failed (expected in some environments)')
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)

    if (this.listeners.size === 1 && !this.isPolling) {
      this.startPolling()
    }

    return () => {
      this.listeners.delete(listener)

      if (this.listeners.size === 0) {
        this.stopPolling()
      }
    }
  }

  startPolling() {
    if (this.isPolling) return
    this.isPolling = true

    this.pollInterval = setInterval(() => {
      this.checkSharedFile()
    }, 2000)

    this.checkSharedFile()
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    this.isPolling = false
  }

  init() {
    const handleStorageChange = (e) => {
      if (e.key === this.key && e.newValue) {
        try {
          const data = JSON.parse(e.newValue)
          if (data.lastUpdated > this.lastKnownUpdate) {
            this.lastKnownUpdate = data.lastUpdated
            this.listeners.forEach(listener => listener(data))
          }
        } catch (error) {
          console.error('Error parsing storage event:', error)
        }
      }
    }

    const handleMessage = (e) => {
      if (e.data.type === 'MUSIC_LIBRARY_UPDATE' && e.data.songs) {
        const data = {
          songs: e.data.songs,
          lastUpdated: e.data.lastUpdated || Date.now()
        }
        if (data.lastUpdated > this.lastKnownUpdate) {
          this.lastKnownUpdate = data.lastUpdated
          localStorage.setItem(this.key, JSON.stringify(data))
          this.listeners.forEach(listener => listener(data))
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('message', handleMessage)
      this.stopPolling()
    }
  }

  broadcast(data) {
    const message = {
      type: 'MUSIC_LIBRARY_UPDATE',
      songs: data.songs,
      lastUpdated: data.lastUpdated
    }

    try {
      if (window.parent !== window) {
        window.parent.postMessage(message, '*')
      }

      if (window.opener) {
        window.opener.postMessage(message, '*')
      }

      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('music-library-sync')
        channel.postMessage(message)
        channel.close()
      }
    } catch (error) {
      console.log('Cross-origin messaging not available:', error.message)
    }
  }
}

export const crossOriginSync = new CrossOriginSync()

crossOriginSync.init()