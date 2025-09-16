class RealTimeCrossOriginSync {
  constructor() {
    this.storageKey = 'musicLibrary'
    this.syncKey = 'musicLibraryLastSync'
    this.sharedKey = 'sharedMusicLibrary'
    this.listeners = new Set()
    this.isUpdating = false
    this.lastSyncTime = 0
    this.pollInterval = null
    this.origin = window.location.origin
    
    window.addEventListener('storage', this.handleStorageEvent.bind(this))
    
    this.startPolling()
    
    try {
      this.channel = new BroadcastChannel('musicLibrarySync')
      this.channel.addEventListener('message', this.handleBroadcastMessage.bind(this))
    } catch (error) {
      console.warn('BroadcastChannel not supported')
    }
    
    window.addEventListener('message', this.handleWindowMessage.bind(this))
  }

  handleStorageEvent(event) {
    if (event.key === this.storageKey && !this.isUpdating) {
      const data = this.parseStorageData(event.newValue)
      if (data && data.songs) {
        this.notifyListeners(data.songs)
      }
    }
  }

  handleBroadcastMessage(event) {
    if (event.data && event.data.type === 'MUSIC_LIBRARY_SYNC' && !this.isUpdating) {
      const { songs } = event.data.payload
      if (songs) {
        this.notifyListeners(songs)
      }
    }
  }

  startPolling() {
    this.pollInterval = setInterval(() => {
      this.checkForUpdates()
    }, 1000)
  }

  handleWindowMessage(event) {
    const trustedOrigins = [
      'http://localhost:5173',
      'http://localhost:3001'
    ]

    const isTrustedOrigin = trustedOrigins.includes(event.origin) || event.origin === 'null' || event.origin === 'about:blank'
    
    if (!isTrustedOrigin) return
    
    if (event.data && event.data.type === 'MUSIC_LIBRARY_SYNC' && !this.isUpdating) {
      const { songs, timestamp } = event.data.payload
      if (songs) {
        console.log(`[5173] Received sync message from ${event.origin}:`, songs.length, 'songs')
        this.isUpdating = true
        localStorage.setItem(this.storageKey, JSON.stringify({ songs, timestamp }))
        localStorage.setItem(this.syncKey, JSON.stringify({ timestamp, origin: event.origin }))
        this.lastSyncTime = timestamp
        
        this.notifyListeners(songs)
        
        setTimeout(() => {
          this.isUpdating = false
        }, 100)

        if (event.source) {
          try {
            event.source.postMessage({
              type: 'MUSIC_LIBRARY_SYNC_ACK',
              payload: { received: true, timestamp }
            }, event.origin === 'null' ? '*' : event.origin)
          } catch (e) {
            console.warn('[5173] Failed to acknowledge sync message:', e)
          }
        }
      }
    }
  }
  
  checkForUpdates() {
    if (this.isUpdating) return

    try {
      
      const syncData = localStorage.getItem(this.syncKey)
      if (syncData) {
        const { timestamp } = JSON.parse(syncData)
        if (timestamp > this.lastSyncTime) {
          console.log(`[5173] Found newer data in localStorage, timestamp: ${timestamp}`)
          this.lastSyncTime = timestamp
          const data = this.getData()
          if (data && data.songs) {
            this.notifyListeners(data.songs)
          }
        }
      }

      try {
        const sharedData = sessionStorage.getItem(this.sharedKey)
        if (sharedData) {
          const data = JSON.parse(sharedData)
          if (data && data.songs && data.timestamp > this.lastSyncTime) {
            console.log(`[5173] Found newer data in sessionStorage, timestamp: ${data.timestamp}`)
            this.lastSyncTime = data.timestamp
            this.notifyListeners(data.songs)

            this.isUpdating = true
            localStorage.setItem(this.storageKey, sharedData)
            localStorage.setItem(this.syncKey, JSON.stringify({
              timestamp: data.timestamp,
              origin: 'sessionStorage'
            }))
            setTimeout(() => {
              this.isUpdating = false
            }, 100)
          }
        }
      } catch (e) {
        
      }

      this.broadcastToCrossOrigin()
    } catch (error) {
    }
  }

  parseStorageData(jsonString) {
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

  broadcastToCrossOrigin() {
    try {
      const data = this.getData()
      if (!data || !data.songs) return
      
      const targetOrigins = [
        'http://localhost:5173',
        'http://localhost:3001'
      ]
      
      const otherOrigins = targetOrigins.filter(origin => origin !== this.origin)
      
      const message = {
        type: 'MUSIC_LIBRARY_SYNC',
        payload: data
      }

      otherOrigins.forEach(origin => {
        
        const iframes = Array.from(document.querySelectorAll('iframe'))
        let foundIframe = false

        for (const iframe of iframes) {
          try {
            
            if (iframe.contentWindow && iframe.contentWindow.postMessage) {
              
              iframe.contentWindow.postMessage(message, origin)
              console.log(`[5173] Sent sync message to iframe (${origin})`, data.songs.length)
              foundIframe = true
              break
            }
          } catch (e) {
            
          }
        }

        if (!foundIframe) {
          
          if (window.opener) {
            window.opener.postMessage(message, '*')
          }
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, '*')
          }

          try {
            sessionStorage.setItem(this.sharedKey, JSON.stringify(data))
            console.log(`[5173] Stored data in sessionStorage for cross-origin sync with ${origin}`)
          } catch (e) {
            console.warn(`[5173] Failed to use sync bridge:`, e)
          }
        }
      })
    } catch (error) {
      console.error('Error broadcasting to cross-origin:', error)
    }
  }
  
  setData(data) {
    try {
      const dataWithTimestamp = {
        songs: Array.isArray(data) ? data : data.songs,
        timestamp: data.timestamp || Date.now()
      }
      
      this.isUpdating = true
      
      localStorage.setItem(this.storageKey, JSON.stringify(dataWithTimestamp))
      
      localStorage.setItem(this.syncKey, JSON.stringify({
        timestamp: dataWithTimestamp.timestamp,
        origin: this.origin
      }))
      
      sessionStorage.setItem(this.sharedKey, JSON.stringify(dataWithTimestamp))
      
      this.broadcastToSameOrigin(dataWithTimestamp)
      
      this.broadcastToCrossOrigin()
      
      this.lastSyncTime = dataWithTimestamp.timestamp
      
      setTimeout(() => {
        this.isUpdating = false
      }, 100)
    } catch (error) {
      console.error('Error saving music library data:', error)
      this.isUpdating = false
    }
  }

  broadcastToSameOrigin(data) {
    const message = {
      type: 'MUSIC_LIBRARY_SYNC',
      payload: data
    }

    if (this.channel) {
      try {
        this.channel.postMessage(message)
      } catch (error) {
        console.warn('Error broadcasting message:', error)
      }
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
    window.removeEventListener('message', this.handleWindowMessage.bind(this))
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
    
    if (this.channel) {
      this.channel.close()
    }
    
    this.listeners.clear()
  }
}

export const realTimeCrossOriginSync = new RealTimeCrossOriginSync()

export { RealTimeCrossOriginSync }