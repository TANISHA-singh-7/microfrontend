import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Play, Pause, Plus, Trash2, Search, Filter, Music, Clock, User, Disc } from 'lucide-react'
import { realTimeCrossOriginSync as musicLibrarySync } from '../utils/realTimeCrossOriginSync.js'

const MusicLibraryIframe = () => {
  return (
    <iframe
      src="http://localhost:3001/sync-bridge.html"
      style={{ display: 'none' }}
      title="Music Library Sync"
      id="music-library-sync-iframe"
    />
  )
}

const initialSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    genre: "Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
    audioUrl: "https://example.com/audio/blinding-lights.mp3"
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    genre: "Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop&crop=center",
    audioUrl: "https://example.com/audio/watermelon-sugar.mp3"
  },
  {
    id: 3,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    genre: "Pop Rock",
    year: 2021,
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center",
    audioUrl: "https://example.com/audio/good-4-u.mp3"
  },
  {
    id: 4,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    genre: "Dance Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center&auto=format&q=80",
    audioUrl: "https://example.com/audio/levitating.mp3"
  },
  {
    id: 5,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: "2:21",
    genre: "Pop",
    year: 2021,
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop&crop=center&auto=format&q=80",
    audioUrl: "https://example.com/audio/stay.mp3"
  },
  {
    id: 6,
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:58",
    genre: "Indie Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center&auto=format&q=80",
    audioUrl: "https://example.com/audio/heat-waves.mp3"
  }
]

const SongCard = ({ song, isPlaying, onPlay, onDelete }) => {
  return (
    <div className="glass-effect-strong rounded-2xl p-5 music-card-hover group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {isPlaying && (
        <div className="absolute top-3 left-3 z-10">
          <div className="music-visualizer">
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
          </div>
        </div>
      )}

      <div className="relative mb-5">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={song.cover}
            alt={song.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={onPlay}
              className={`btn-primary p-4 rounded-full transform transition-all duration-300 ${isPlaying ? 'pulse-glow scale-110' : 'scale-90 group-hover:scale-100'
                }`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 hover:scale-100 shadow-lg"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-3 relative z-10">
        <h3 className="font-bold text-lg text-white truncate group-hover:gradient-text transition-all duration-300">
          {song.title}
        </h3>

        <div className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors duration-300">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <User size={14} />
          </div>
          <span className="truncate font-medium">{song.artist}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20">
            <Disc size={14} />
          </div>
          <span className="truncate">{song.album}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 text-xs font-semibold rounded-full border border-purple-500/30">
            {song.genre}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-lg">
            <Clock size={12} />
            <span className="font-mono">{song.duration}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 font-medium bg-black/10 px-2 py-1 rounded-lg inline-block">
          {song.year}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          boxShadow: '0 0 30px rgba(102, 126, 234, 0.2)'
        }}>
      </div>
    </div>
  )
}

const AddSongModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    genre: '',
    year: new Date().getFullYear()
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.artist || !formData.album) {
      alert('Please fill in all required fields (Title, Artist, Album)')
      return
    }

    if (formData.duration && !/^[0-9]+:[0-5][0-9]$/.test(formData.duration)) {
      alert('Please enter duration in MM:SS format (e.g., 3:45)')
      return
    }

    const currentYear = new Date().getFullYear()
    if (formData.year < 1900 || formData.year > currentYear + 1) {
      alert(`Please enter a valid year between 1900 and ${currentYear + 1}`)
      return
    }

    const songData = {
      ...formData
    }

    onAdd(songData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 slide-in-up">
      <div className="glass-effect-strong rounded-3xl p-8 w-full max-w-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse"></div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 pulse-glow">
              <Music className="gradient-text-accent" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Add New Song</h2>
              <p className="text-gray-400 text-sm">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300 hover:scale-110"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Song Title *
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-400/50"
                placeholder="Enter song title..."
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Artist *
            </label>
            <div className="relative">
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-400/50"
                placeholder="Enter artist name..."
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Album *
            </label>
            <div className="relative">
              <input
                type="text"
                name="album"
                value={formData.album}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-green-500/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-green-400/50"
                placeholder="Enter album name..."
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-teal-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold gradient-text-accent">
                Duration
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-yellow-400/50"
                  placeholder="3:45"
                  pattern="^[0-9]+:[0-5][0-9]$"
                  title="Please enter duration in MM:SS format (e.g., 3:45)"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold gradient-text-accent">
                Year
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-pink-500/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-pink-400/50"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-red-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Genre
            </label>
            <div className="relative">
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-indigo-500/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition-all duration-300 hover:border-indigo-400/50 appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-800">Select genre...</option>
                <option value="Pop" className="bg-gray-800">Pop</option>
                <option value="Rock" className="bg-gray-800">Rock</option>
                <option value="Hip Hop" className="bg-gray-800">Hip Hop</option>
                <option value="R&B" className="bg-gray-800">R&B</option>
                <option value="Electronic" className="bg-gray-800">Electronic</option>
                <option value="Jazz" className="bg-gray-800">Jazz</option>
                <option value="Classical" className="bg-gray-800">Classical</option>
                <option value="Country" className="bg-gray-800">Country</option>
                <option value="Indie" className="bg-gray-800">Indie</option>
                <option value="Alternative" className="bg-gray-800">Alternative</option>
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 hover:text-white rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-3 px-6 font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                <Music size={18} />
                Add Song
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const WorkingMusicLibrary = ({ userRole = 'user' }) => {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [groupBy, setGroupBy] = useState('none')
  const [filterBy, setFilterBy] = useState('all')

  const isExternalUpdate = useRef(false)

  const isAdmin = userRole === 'admin'

  useEffect(() => {
    if (!document.getElementById('music-library-sync-iframe')) {
      const iframe = document.createElement('iframe')
      iframe.src = 'http://localhost:3001/sync-bridge.html'
      iframe.style.display = 'none'
      iframe.title = 'Music Library Sync'
      iframe.id = 'music-library-sync-iframe'
      document.body.appendChild(iframe)
    }

    return () => {
      const iframe = document.getElementById('music-library-sync-iframe')
      if (iframe) {
        document.body.removeChild(iframe)
      }
    }
  }, [])

  useEffect(() => {
    const data = musicLibrarySync.getData()
    if (data && Array.isArray(data) && data.length > 0) {
      console.log('[5173] Loading existing songs from localStorage:', data.length)
      setSongs(data)
    } else {
      console.log('[5173] Initializing with default songs')
      setSongs(initialSongs)
      musicLibrarySync.setData(initialSongs)
    }

    const unsubscribe = musicLibrarySync.subscribe((data) => {
      if (Array.isArray(data)) {
        console.log('[5173] Received sync update:', data.length, 'songs')
        isExternalUpdate.current = true
        setSongs(data)
        setTimeout(() => {
          isExternalUpdate.current = false
        }, 100)
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (songs.length > 0 && !isExternalUpdate.current) {
      console.log('[5173] Saving songs to localStorage:', songs.length)
      musicLibrarySync.setData(songs)
    }
  }, [songs])

  const processedSongs = useMemo(() => {
    let filtered = songs

    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.album.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter(song => song.genre === filterBy)
    }

    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'artist':
          return a.artist.localeCompare(b.artist)
        case 'album':
          return a.album.localeCompare(b.album)
        case 'year':
          return b.year - a.year
        default:
          return 0
      }
    })

    return filtered
  }, [songs, searchTerm, sortBy, filterBy])

  const groupedSongs = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Songs': processedSongs }
    }

    return processedSongs.reduce((groups, song) => {
      const key = song[groupBy]
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(song)
      return groups
    }, {})
  }, [processedSongs, groupBy])

  const handlePlay = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const handleAddSong = (newSong) => {
    const song = {
      ...newSong,
      id: Date.now(),
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center&auto=format&q=80"
    }
    const updatedSongs = [...songs, song]
    setSongs(updatedSongs)
    setShowAddModal(false)

    // Explicitly sync the data after adding a song
    musicLibrarySync.setData(updatedSongs)
  }

  const handleDeleteSong = (songId) => {
    const updatedSongs = songs.filter(song => song.id !== songId)
    setSongs(updatedSongs)

    // Explicitly sync the data after deleting a song
    musicLibrarySync.setData(updatedSongs)

    if (currentSong?.id === songId) {
      setCurrentSong(null)
      setIsPlaying(false)
    }
  }

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(songs.map(song => song.genre))]
    return uniqueGenres.sort()
  }, [songs])

  return (
    <div className="space-y-8 slide-in-up">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>

        <div className="glass-effect-strong rounded-3xl p-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 pulse-glow">
                  <Music className="gradient-text" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">Music Library</h1>
                  <div className="flex items-center gap-4 text-gray-300">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      {songs.length} songs
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isAdmin
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                      : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                      {isAdmin ? '👑 Admin Access' : '👁️ View Only'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 float-animation"
              >
                <Plus size={22} />
                Add New Song
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="glass-effect-strong rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold gradient-text-accent mb-2">Search & Filter</h3>
          <p className="text-gray-400 text-sm">Find your perfect track</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" size={20} />
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 hover:border-blue-400/50"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white transition-all duration-300 hover:border-purple-400/50 appearance-none cursor-pointer"
            >
              <option value="title" className="bg-gray-800">📝 Sort by Title</option>
              <option value="artist" className="bg-gray-800">🎤 Sort by Artist</option>
              <option value="album" className="bg-gray-800">💿 Sort by Album</option>
              <option value="year" className="bg-gray-800">📅 Sort by Year</option>
            </select>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-green-500/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-300 hover:border-green-400/50 appearance-none cursor-pointer"
            >
              <option value="none" className="bg-gray-800">🔄 No Grouping</option>
              <option value="artist" className="bg-gray-800">👥 Group by Artist</option>
              <option value="album" className="bg-gray-800">💿 Group by Album</option>
              <option value="genre" className="bg-gray-800">🎵 Group by Genre</option>
            </select>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-teal-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-orange-500/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white transition-all duration-300 hover:border-orange-400/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-gray-800">🌟 All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-gray-800">🎶 {genre}</option>
              ))}
            </select>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {processedSongs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-effect-strong rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 w-fit mx-auto mb-3 group-hover:pulse-glow">
              <Music className="text-blue-400" size={24} />
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">{processedSongs.length}</div>
            <div className="text-sm text-gray-400 font-medium">Songs</div>
          </div>
          <div className="glass-effect-strong rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 w-fit mx-auto mb-3 group-hover:pulse-glow">
              <User className="text-purple-400" size={24} />
            </div>
            <div className="text-3xl font-bold gradient-text-secondary mb-1">
              {[...new Set(processedSongs.map(s => s.artist))].length}
            </div>
            <div className="text-sm text-gray-400 font-medium">Artists</div>
          </div>
          <div className="glass-effect-strong rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 w-fit mx-auto mb-3 group-hover:pulse-glow">
              <Disc className="text-green-400" size={24} />
            </div>
            <div className="text-3xl font-bold gradient-text-accent mb-1">
              {[...new Set(processedSongs.map(s => s.album))].length}
            </div>
            <div className="text-sm text-gray-400 font-medium">Albums</div>
          </div>
          <div className="glass-effect-strong rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 w-fit mx-auto mb-3 group-hover:pulse-glow">
              <Filter className="text-yellow-400" size={24} />
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">
              {[...new Set(processedSongs.map(s => s.genre))].length}
            </div>
            <div className="text-sm text-gray-400 font-medium">Genres</div>
          </div>
        </div>
      )}

      { }
      <div className="space-y-6">
        {Object.entries(groupedSongs).map(([groupName, groupSongs]) => (
          <div key={groupName}>
            {groupBy !== 'none' && (
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Music size={20} />
                {groupName}
                <span className="text-sm text-gray-400">({groupSongs.length})</span>
              </h3>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupSongs.map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={isPlaying && currentSong?.id === song.id}
                  onPlay={() => handlePlay(song)}
                  onDelete={isAdmin ? () => handleDeleteSong(song.id) : null}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {processedSongs.length === 0 && (
        <div className="text-center py-20">
          <Music size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No songs found</h3>
          <p className="text-gray-500">
            {searchTerm || filterBy !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add some songs to get started'}
          </p>
        </div>
      )}

      {showAddModal && (
        <AddSongModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSong}
        />
      )}

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-slate-700/50 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-white">{currentSong.title}</h4>
                <p className="text-sm text-gray-400">{currentSong.artist}</p>
              </div>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-200"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkingMusicLibrary