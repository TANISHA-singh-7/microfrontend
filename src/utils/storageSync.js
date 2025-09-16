
export const createStorageSync = (key, initialValue) => {
  const listeners = new Set()

  const getValue = () => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  }

  const setValue = (value) => {
    try {
      const stringValue = JSON.stringify(value)
      localStorage.setItem(key, stringValue)

      listeners.forEach(listener => listener(value))

      window.dispatchEvent(new CustomEvent('storageSync', {
        detail: { key, value: stringValue }
      }))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  const subscribe = (listener) => {
    listeners.add(listener)

    return () => listeners.delete(listener)
  }

  const initCrossTabSync = () => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue)
          listeners.forEach(listener => listener(newValue))
        } catch (error) {
          console.error('Error parsing storage event:', error)
        }
      }
    }

    const handleCustomSync = (e) => {
      if (e.detail.key === key) {
        try {
          const newValue = JSON.parse(e.detail.value)
          listeners.forEach(listener => listener(newValue))
        } catch (error) {
          console.error('Error parsing custom sync event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('storageSync', handleCustomSync)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('storageSync', handleCustomSync)
    }
  }

  return {
    getValue,
    setValue,
    subscribe,
    initCrossTabSync
  }
}