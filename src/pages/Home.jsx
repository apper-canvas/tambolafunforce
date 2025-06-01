import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-light to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ApperIcon name="Target" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">TambolaFun</h1>
                <p className="text-white/80 text-sm">Play Tambola Online</p>
              </div>
            </motion.div>
            
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-6">
                Play Tambola
                <span className="block text-3xl md:text-5xl lg:text-6xl mt-2">Like Never Before</span>
              </h2>
              <p className="text-lg md:text-xl text-surface-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Create rooms, invite friends, and enjoy the classic Tambola experience with real-time gameplay, 
                automatic ticket generation, and instant winner detection.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft">
                <ApperIcon name="Users" className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-surface-700">Multiplayer</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft">
                <ApperIcon name="Zap" className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-surface-700">Real-time</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft">
                <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-surface-700">Auto Winners</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Game Feature */}
      <MainFeature />

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-surface-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Why Choose TambolaFun?
            </h3>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Experience the joy of Tambola with modern features and seamless gameplay
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "Gamepad2",
                title: "Easy Room Creation",
                description: "Create private rooms with unique codes and invite friends to join your Tambola game instantly."
              },
              {
                icon: "Grid3X3",
                title: "Smart Tickets",
                description: "Automatically generated tickets with traditional Tambola rules and instant number marking."
              },
              {
                icon: "Crown",
                title: "Pattern Recognition",
                description: "Automatic detection of Single Line, Double Line, and Full House patterns with instant winner announcements."
              },
              {
                icon: "Timer",
                title: "Real-time Calling",
                description: "Live number calling with visual history and synchronized gameplay across all players."
              },
              {
                icon: "Shield",
                title: "Fair Play",
                description: "Secure random number generation and automatic verification ensure fair gameplay for everyone."
              },
              {
                icon: "Smartphone",
                title: "Mobile Friendly",
                description: "Play seamlessly on any device with our responsive design optimized for mobile and desktop."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-tambola transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-surface-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-surface-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ApperIcon name="Target" className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">TambolaFun</span>
            </div>
            <p className="text-surface-400 mb-6">
              Bringing the joy of Tambola to the digital world
            </p>
            <div className="flex justify-center gap-6">
              <motion.button 
                className="p-3 bg-surface-800 rounded-xl hover:bg-surface-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Github" className="w-5 h-5" />
              </motion.button>
              <motion.button 
                className="p-3 bg-surface-800 rounded-xl hover:bg-surface-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Twitter" className="w-5 h-5" />
              </motion.button>
              <motion.button 
                className="p-3 bg-surface-800 rounded-xl hover:bg-surface-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Mail" className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home