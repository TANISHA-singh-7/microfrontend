
class SimpleCrossOriginSync {
  constructor(key = 'globalMusicLibrary') {
    this.key = key
    this.listeners = new Set()
    this.pollInterval = null
    this.lastChecksum = null
    this.isInitialized = false
  }

  calculateChecksum(data) {
    return JSON.stringify(data).length + (data.songs ? data.songs.length : 0)
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
      this.lastChecksum = this.calculateChecksum(dataWithTimestamp)
      console.log(`[${window.location.port}] Setting data:`, data.songs?.length, 'songs')

      this.broadcast(dataWithTimestamp)
      
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  checkForUpdates() {
    try {
      const data = this.getData()
      if (data) {
        const currentChecksum = this.calculateChecksum(data)

        if (this.lastChecksum !== currentChecksum) {
          this.lastChecksum = currentChecksum
          console.log(`[${window.location.port}] Data changed, notifying listeners:`, data.songs?.length, 'songs')
          this.listeners.forEach(listener => listener(data))
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)

    if (this.listeners.size === 1) {
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
    if (this.pollInterval) return

    this.pollInterval = setInterval(() => {
      this.checkForUpdates()
    }, 1000)

    this.checkForUpdates()
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  broadcast(data) {
    const message = {
      type: 'MUSIC_LIBRARY_SYNC',
      data: data,
      timestamp: Date.now(),
      source: window.location.origin
    }

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*')
      }

      if (window.opener && window.opener !== window) {
        window.opener.postMessage(message, '*')
      }

      const currentPort = window.location.port
      const otherPort = currentPort === '5173' ? '3001' : '5173'
      const otherOrigin = `http://localhost:${otherPort}`
      
      try {
        sessionStorage.setItem('sharedMusicLibrary', JSON.stringify(data))
        console.log(`[${currentPort}] Stored data in sessionStorage for cross-origin sync with ${otherPort}`)
      }
      catch (e) {
        console.log('Could not open other window for sync')
      }

      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('music-library-sync')
        channel.postMessage(message)
        channel.close()
      }

    } catch (error) {
      console.log('Broadcast failed:', error.message)
    }
  }

  init() {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'MUSIC_LIBRARY_SYNC') {
        const { data, timestamp, source } = event.data

        if (source === window.location.origin) {
          return
        }

        if (data && data.songs) {
          try {
            console.log(`[${window.location.port}] Received sync from ${source}:`, data.songs?.length, 'songs')
            localStorage.setItem(this.key, JSON.stringify(data))
            this.lastChecksum = this.calculateChecksum(data)
            this.listeners.forEach(listener => listener(data))
          } catch (error) {
            console.error('Error processing sync message:', error)
          }
        }
      }
    }

    let channel
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('music-library-sync')
      channel.onmessage = handleMessage
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
      if (channel) {
        channel.close()
      }
      this.stopPolling()
    }
  }
}

export const simpleCrossOriginSync = new SimpleCrossOriginSync()

simpleCrossOriginSync.init()