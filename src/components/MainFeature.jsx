import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [gameState, setGameState] = useState('lobby') // lobby, playing, paused
  const [currentNumber, setCurrentNumber] = useState(null)
  const [calledNumbers, setCalledNumbers] = useState([])
  const [playerTicket, setPlayerTicket] = useState(null)
  const [markedNumbers, setMarkedNumbers] = useState(new Set())
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [players, setPlayers] = useState([])
  const [completedPatterns, setCompletedPatterns] = useState([])
  const [autoCall, setAutoCall] = useState(false)
  const [callInterval, setCallInterval] = useState(null)

  // Generate a random Tambola ticket
  const generateTicket = useCallback(() => {
    const ticket = Array(3).fill().map(() => Array(9).fill(null))
    
    for (let col = 0; col < 9; col++) {
      const min = col * 10 + (col === 0 ? 1 : 0)
      const max = col * 10 + 9
      const numbers = []
      
      while (numbers.length < 3) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min
        if (!numbers.includes(num)) {
          numbers.push(num)
        }
      }
      
      numbers.sort((a, b) => a - b)
      
      // Randomly place 1-2 numbers in each column, 2 numbers across the row
      const positions = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, Math.random() > 0.5 ? 1 : 2)
      positions.forEach((pos, idx) => {
        ticket[pos][col] = numbers[idx] || null
      })
    }
    
    // Ensure each row has exactly 5 numbers
    for (let row = 0; row < 3; row++) {
      const nonNullCount = ticket[row].filter(cell => cell !== null).length
      if (nonNullCount < 5) {
        // Add more numbers
        for (let col = 0; col < 9 && ticket[row].filter(cell => cell !== null).length < 5; col++) {
          if (ticket[row][col] === null) {
            const min = col * 10 + (col === 0 ? 1 : 0)
            const max = col * 10 + 9
            let num
            do {
              num = Math.floor(Math.random() * (max - min + 1)) + min
            } while (ticket.flat().includes(num))
            ticket[row][col] = num
          }
        }
      } else if (nonNullCount > 5) {
        // Remove excess numbers
        while (ticket[row].filter(cell => cell !== null).length > 5) {
          const nonNullIndices = ticket[row].map((cell, idx) => cell !== null ? idx : -1).filter(idx => idx !== -1)
          const randomIdx = nonNullIndices[Math.floor(Math.random() * nonNullIndices.length)]
          ticket[row][randomIdx] = null
        }
      }
    }
    
    return ticket
  }, [])

  // Generate next number
  const callNextNumber = useCallback(() => {
    if (calledNumbers.length >= 90) {
      setAutoCall(false)
      toast.info('All numbers called! Game complete!')
      return
    }
    
    let nextNumber
    do {
      nextNumber = Math.floor(Math.random() * 90) + 1
    } while (calledNumbers.includes(nextNumber))
    
    setCurrentNumber(nextNumber)
    setCalledNumbers(prev => [...prev, nextNumber])
    toast.success(`Number called: ${nextNumber}`)
  }, [calledNumbers])

  // Check for winning patterns
  const checkWinningPatterns = useCallback((ticket, marked) => {
    const patterns = []
    
    // Check rows (Single/Double Line)
    const completedRows = []
    for (let row = 0; row < 3; row++) {
      const rowNumbers = ticket[row].filter(cell => cell !== null)
      const markedInRow = rowNumbers.filter(num => marked.has(num))
      if (markedInRow.length === rowNumbers.length) {
        completedRows.push(row)
      }
    }
    
    if (completedRows.length === 1) {
      patterns.push('Single Line')
    } else if (completedRows.length === 2) {
      patterns.push('Double Line')
    } else if (completedRows.length === 3) {
      patterns.push('Full House')
    }
    
    return patterns
  }, [])

  // Mark number on ticket
  const markNumber = (number) => {
    if (!playerTicket || !calledNumbers.includes(number)) return
    
    const newMarkedNumbers = new Set(markedNumbers)
    if (newMarkedNumbers.has(number)) {
      newMarkedNumbers.delete(number)
    } else {
      newMarkedNumbers.add(number)
    }
    
    setMarkedNumbers(newMarkedNumbers)
    
    // Check for new patterns
    const patterns = checkWinningPatterns(playerTicket, newMarkedNumbers)
    const newPatterns = patterns.filter(p => !completedPatterns.includes(p))
    
    if (newPatterns.length > 0) {
      setCompletedPatterns(prev => [...prev, ...newPatterns])
      newPatterns.forEach(pattern => {
        toast.success(`🎉 ${pattern} completed!`)
      })
    }
  }

  // Create game room
  const createRoom = () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(newRoomCode)
    setIsHost(true)
    setPlayers([{ id: 1, name: playerName, isHost: true }])
    setPlayerTicket(generateTicket())
    setGameState('lobby')
    toast.success(`Room created: ${newRoomCode}`)
  }

  // Join game room
  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      toast.error('Please enter your name and room code')
      return
    }
    
    setIsHost(false)
    setPlayers([
      { id: 1, name: 'Host Player', isHost: true },
      { id: 2, name: playerName, isHost: false }
    ])
    setPlayerTicket(generateTicket())
    setGameState('lobby')
    toast.success(`Joined room: ${roomCode}`)
  }

  // Start game
  const startGame = () => {
    if (!isHost) return
    
    setGameState('playing')
    setCurrentNumber(null)
    setCalledNumbers([])
    setMarkedNumbers(new Set())
    setCompletedPatterns([])
    toast.success('Game started!')
}

  // Auto-call effect
  useEffect(() => {
    if (autoCall && gameState === 'playing') {
      const interval = setInterval(callNextNumber, 3000)
      setCallInterval(interval)
      return () => clearInterval(interval)
    } else if (callInterval) {
      clearInterval(callInterval)
      setCallInterval(null)
    }
  }, [autoCall, gameState, callNextNumber])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
            Live Tambola Game
          </h3>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Create or join a room and start playing instantly with friends
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {gameState === 'lobby' && !roomCode && (
              <motion.div
                key="join-create"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Create Room */}
                <div className="bg-white rounded-3xl p-8 shadow-tambola">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Plus" className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-surface-900 mb-2">Create Room</h4>
                    <p className="text-surface-600">Host a new Tambola game</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-surface-200 focus:border-primary focus:ring-0 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <motion.button
                      onClick={createRoom}
                      className="w-full game-button game-button-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ApperIcon name="Users" className="w-5 h-5 mr-2" />
                      Create Room
                    </motion.button>
                  </div>
                </div>

                {/* Join Room */}
                <div className="bg-white rounded-3xl p-8 shadow-tambola">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="UserPlus" className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-surface-900 mb-2">Join Room</h4>
                    <p className="text-surface-600">Enter a room code to join</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-surface-200 focus:border-secondary focus:ring-0 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Room Code
                      </label>
                      <input
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 rounded-xl border-2 border-surface-200 focus:border-secondary focus:ring-0 transition-colors uppercase tracking-wider"
                        placeholder="ABCD12"
                        maxLength={6}
                      />
                    </div>
                    
                    <motion.button
                      onClick={joinRoom}
                      className="w-full game-button game-button-secondary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ApperIcon name="LogIn" className="w-5 h-5 mr-2" />
                      Join Room
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'lobby' && roomCode && (
              <motion.div
                key="room-lobby"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-8 shadow-tambola"
              >
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-surface-900 mb-2">
                    Room: {roomCode}
                  </h4>
                  <p className="text-surface-600">Waiting for players to join...</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h5 className="text-lg font-semibold text-surface-800 mb-4">Players ({players.length})</h5>
                    <div className="space-y-2">
                      {players.map((player) => (
                        <div key={player.id} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <ApperIcon name={player.isHost ? "Crown" : "User"} className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{player.name}</span>
                          {player.isHost && (
                            <span className="text-xs bg-accent px-2 py-1 rounded-full">Host</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-surface-800 mb-4">Your Ticket</h5>
                    <div className="tambola-ticket p-4">
                      <div className="grid grid-cols-9 gap-1">
                        {playerTicket?.flat().map((cell, index) => (
                          <div
                            key={index}
                            className={`tambola-cell ${cell === null ? 'tambola-cell-empty' : 'tambola-cell-number'}`}
                          >
                            {cell || ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {isHost && (
                  <div className="text-center">
                    <motion.button
                      onClick={startGame}
                      className="game-button game-button-accent px-8"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                      Start Game
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div
                key="game-playing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-8"
              >
                {/* Game Controls */}
                <div className="xl:col-span-1 space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-tambola">
                    <h5 className="text-lg font-semibold text-surface-800 mb-4">Game Control</h5>
                    
                    <div className="text-center mb-6">
                      <AnimatePresence mode="wait">
                        {currentNumber && (
                          <motion.div
                            key={currentNumber}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="number-display animate-number-call mx-auto mb-4"
                          >
                            {currentNumber}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <p className="text-surface-600 mb-4">
                        Called: {calledNumbers.length} / 90
                      </p>
                    </div>

                    {isHost && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <motion.button
                            onClick={callNextNumber}
                            disabled={calledNumbers.length >= 90}
                            className="flex-1 game-button game-button-primary disabled:opacity-50"
                            whileHover={{ scale: calledNumbers.length < 90 ? 1.02 : 1 }}
                            whileTap={{ scale: calledNumbers.length < 90 ? 0.98 : 1 }}
                          >
                            <ApperIcon name="Volume2" className="w-4 h-4 mr-2" />
                            Call Number
                          </motion.button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-surface-700">Auto Call</span>
                          <motion.button
                            onClick={() => setAutoCall(!autoCall)}
                            className={`w-12 h-6 rounded-full transition-colors ${autoCall ? 'bg-primary' : 'bg-surface-300'}`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="w-5 h-5 bg-white rounded-full shadow-md"
                              animate={{ x: autoCall ? 28 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Called Numbers */}
                  <div className="bg-white rounded-3xl p-6 shadow-tambola">
                    <h5 className="text-lg font-semibold text-surface-800 mb-4">Called Numbers</h5>
                    <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                      {calledNumbers.map((number) => (
                        <div
                          key={number}
                          className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center text-sm font-medium"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patterns */}
                  <div className="bg-white rounded-3xl p-6 shadow-tambola">
                    <h5 className="text-lg font-semibold text-surface-800 mb-4">Your Patterns</h5>
                    <div className="space-y-2">
                      {['Single Line', 'Double Line', 'Full House'].map((pattern) => (
                        <div
                          key={pattern}
                          className={`pattern-indicator ${
                            completedPatterns.includes(pattern) 
                              ? pattern.includes('Single') ? 'pattern-single-line'
                                : pattern.includes('Double') ? 'pattern-double-line'
                                : 'pattern-full-house'
                              : 'bg-surface-100 text-surface-500'
                          }`}
                        >
                          {completedPatterns.includes(pattern) && (
                            <ApperIcon name="Check" className="w-4 h-4" />
                          )}
                          {pattern}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ticket */}
                <div className="xl:col-span-2">
                  <div className="bg-white rounded-3xl p-6 shadow-tambola">
                    <h5 className="text-lg font-semibold text-surface-800 mb-6">Your Ticket</h5>
                    
                    <div className="tambola-ticket p-6">
                      <div className="grid grid-cols-9 gap-2">
                        {playerTicket?.flat().map((cell, index) => (
                          <motion.div
                            key={index}
                            className={`tambola-cell ${
                              cell === null 
                                ? 'tambola-cell-empty' 
                                : markedNumbers.has(cell)
                                  ? 'tambola-cell-marked'
                                  : 'tambola-cell-number'
                            }`}
                            onClick={() => cell && markNumber(cell)}
                            whileHover={cell ? { scale: 1.05 } : {}}
                            whileTap={cell ? { scale: 0.95 } : {}}
                            animate={markedNumbers.has(cell) ? { scale: [1, 0.9, 1] } : {}}
                          >
                            {cell || ''}
                            {cell && markedNumbers.has(cell) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <ApperIcon name="Check" className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default MainFeature