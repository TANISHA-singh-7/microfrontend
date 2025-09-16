import React, { useState, useEffect, useMemo, useRef } from 'react'
import { realTimeCrossOriginSync } from '../utils/realTimeCrossOriginSync'

const Play = () => <span>▶️</span>
const Pause = () => <span>⏸️</span>
const Plus = () => <span>➕</span>
const Trash2 = () => <span>🗑️</span>
const Search = () => <span>🔍</span>
const Music = () => <span>🎵</span>
const Clock = () => <span>⏰</span>
const User = () => <span>👤</span>
const Disc = () => <span>💿</span>

const initialSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    genre: "Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    genre: "Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 3,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    genre: "Pop Rock",
    year: 2021,
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 4,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    genre: "Dance Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 5,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: "2:21",
    genre: "Pop",
    year: 2021,
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 6,
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:58",
    genre: "Indie Pop",
    year: 2020,
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center&auto=format&q=80"
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
              className={`btn-primary p-4 rounded-full transform transition-all duration-300 ${
                isPlaying ? 'pulse-glow scale-110' : 'scale-90 group-hover:scale-100'
              }`}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
          </div>
        </div>
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 hover:scale-100 shadow-lg"
          >
            <Trash2 />
          </button>
        )}
      </div>
      
      <div className="space-y-3 relative z-10">
        <h3 className="font-bold text-lg text-white truncate group-hover:gradient-text transition-all duration-300">
          {song.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors duration-300">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <User />
          </div>
          <span className="truncate font-medium">{song.artist}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20">
            <Disc />
          </div>
          <span className="truncate">{song.album}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 text-xs font-semibold rounded-full border border-purple-500/30">
            {song.genre}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-lg">
            <Clock />
            <span className="font-mono">{song.duration}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 font-medium bg-black/10 px-2 py-1 rounded-lg inline-block">
          {song.year}
        </div>
      </div>
    </div>
  )
}

const AddSongModal = ({ onClose, onAdd }) => {
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    genre: '',
    year: new Date().getFullYear()
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewSong(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(newSong)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-effect-strong rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold gradient-text">Add New Song</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={newSong.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="Song title"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Artist *
            </label>
            <input
              type="text"
              name="artist"
              value={newSong.artist}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="Artist name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Album *
            </label>
            <input
              type="text"
              name="album"
              value={newSong.album}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="Album name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold gradient-text-accent">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={newSong.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="3:45"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold gradient-text-accent">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={newSong.year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="2023"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold gradient-text-accent">
              Genre
            </label>
            <select
              name="genre"
              value={newSong.genre}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none"
            >
              <option value="">Select genre</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="R&B">R&B</option>
              <option value="Country">Country</option>
              <option value="Electronic">Electronic</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Indie">Indie</option>
              <option value="Alternative">Alternative</option>
              <option value="Metal">Metal</option>
              <option value="Folk">Folk</option>
              <option value="Blues">Blues</option>
              <option value="Reggae">Reggae</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-colors duration-200"
            >
              Add Song
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const StandaloneMusicLibrary = ({ userRole = 'user' }) => {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('title')

  const isAdmin = userRole === 'admin'

  useEffect(() => {
    setSongs(initialSongs)

    const syncData = realTimeCrossOriginSync.getData()
    if (syncData && Array.isArray(syncData) && syncData.length > 0) {
      setSongs(syncData)
    }

    const handleDataChange = (data) => {
      if (data && Array.isArray(data)) {
        setSongs(data)
      }
    }

    realTimeCrossOriginSync.subscribe(handleDataChange)

    return () => {
      realTimeCrossOriginSync.unsubscribe(handleDataChange)
    }
  }, [])

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
    
    realTimeCrossOriginSync.setData(updatedSongs)
  }

  const handleDeleteSong = (id) => {
    const updatedSongs = songs.filter(song => song.id !== id)
    setSongs(updatedSongs)
    
    realTimeCrossOriginSync.setData(updatedSongs)
    
    if (currentSong?.id === id) {
      setCurrentSong(null)
      setIsPlaying(false)
    }
  }

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const searchLower = searchTerm.toLowerCase()
      return (
        song.title.toLowerCase().includes(searchLower) ||
        song.artist.toLowerCase().includes(searchLower) ||
        song.album.toLowerCase().includes(searchLower) ||
        song.genre.toLowerCase().includes(searchLower)
      )
    })
  }, [songs, searchTerm])

  const sortedSongs = useMemo(() => {
    return [...filteredSongs].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist)
      if (sortBy === 'album') return a.album.localeCompare(b.album)
      if (sortBy === 'year') return b.year - a.year
      return 0
    })
  }, [filteredSongs, sortBy])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Music Library</h1>
            <p className="text-gray-400">Your personal music collection</p>
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus />
              Add New Song
            </button>
          )}
        </div>

        <div className="glass-effect-strong rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-black/20 border border-blue-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none"
              >
                <option value="title">Sort by Title</option>
                <option value="artist">Sort by Artist</option>
                <option value="album">Sort by Album</option>
                <option value="year">Sort by Year</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sortedSongs.length === 0 ? (
        <div className="text-center py-20">
          <Music className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No songs found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'Add some songs to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedSongs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={isPlaying && currentSong?.id === song.id}
              onPlay={() => handlePlay(song)}
              onDelete={isAdmin ? () => handleDeleteSong(song.id) : null}
            />
          ))}
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
              {isPlaying ? <Pause /> : <Play />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StandaloneMusicLibrary