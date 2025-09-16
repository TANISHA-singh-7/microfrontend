
class CrossOriginMusicSync {
  constructor() {
    this.storageKey = 'musicLibrary'
    this.syncKey = 'musicLibrarySync'
    this.listeners = new Set()
    this.isUpdating = false

    window.addEventListener('storage', this.handleStorageEvent.bind(this))

    window.addEventListener('message', this.handleMessage.bind(this))

    this.broadcastInterval = setInterval(() => {
      this.broadcastData()
    }, 2000)
  }

  handleStorageEvent(event) {
    if (event.key === this.storageKey && !this.isUpdating) {
      const data = this.parseData(event.newValue)
      if (data) {
        this.notifyListeners(data)
      }
    }
  }

  handleMessage(event) {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001']
    if (!allowedOrigins.includes(event.origin)) {
      return
    }

    if (event.data && event.data.type === 'MUSIC_LIBRARY_SYNC') {
      const { songs, timestamp } = event.data.payload

      const currentData = this.getData()
      const currentTimestamp = currentData?.timestamp || 0
      
      if (timestamp > currentTimestamp && !this.isUpdating) {
        this.isUpdating = true
        this.setData({ songs, timestamp })
        this.notifyListeners(songs)
        setTimeout(() => {
          this.isUpdating = false
        }, 100)
      }
    }
  }

  parseData(jsonString) {
    try {
      return jsonString ? JSON.parse(jsonString) : null
    } catch (error) {
      console.error('Error parsing music library data:', error)
      return null
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey)
    if (data) {
      try {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          return { songs: parsed, timestamp: Date.now() }
        }
        return parsed
      } catch (error) {
        console.error('Error parsing stored data:', error)
        return null
      }
    }
    return null
  }

  setData(data) {
    try {
      const dataWithTimestamp = {
        songs: Array.isArray(data) ? data : data.songs,
        timestamp: data.timestamp || Date.now()
      }
      
      this.isUpdating = true
      localStorage.setItem(this.storageKey, JSON.stringify(dataWithTimestamp))

      this.broadcastData(dataWithTimestamp)
      
      setTimeout(() => {
        this.isUpdating = false
      }, 100)
    } catch (error) {
      console.error('Error saving music library data:', error)
    }
  }

  broadcastData(data = null) {
    const dataToSend = data || this.getData()
    if (!dataToSend) return

    const message = {
      type: 'MUSIC_LIBRARY_SYNC',
      payload: dataToSend
    }

    try {
      const channel = new BroadcastChannel('musicLibrarySync')
      channel.postMessage(message)
      channel.close()
    } catch (error) {
      console.warn('BroadcastChannel not supported:', error)
    }

    try {
      localStorage.setItem('musicLibrarySync', JSON.stringify({
        ...dataToSend,
        syncTimestamp: Date.now()
      }))
    } catch (error) {
      console.error('Error setting sync data:', error)
    }
  }

  subscribe(callback) {
    this.listeners.add(callback)

    return () => {
      this.listeners.delete(callback)
    }
  }

  notifyListeners(songs) {
    this.listeners.forEach(callback => {
      try {
        callback(songs)
      } catch (error) {
        console.error('Error in sync listener:', error)
      }
    })
  }

  destroy() {
    window.removeEventListener('storage', this.handleStorageEvent.bind(this))
    window.removeEventListener('message', this.handleMessage.bind(this))
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval)
    }
    this.listeners.clear()
  }
}

export const crossOriginMusicSync = new CrossOriginMusicSync()

export { CrossOriginMusicSync }