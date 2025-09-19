import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { Footer } from './Components/Footer/Footer'
import { Header } from './Components/Header/Header'
import { MainPage } from './pages/MainPage/MainPage'
import { MovieInfo } from './pages/MovieInfo/MovieInfo'
import { Genres } from './pages/Genres/Genres'
import { GenrePage } from './pages/GenrePage/GenrePage'
import { Account } from './pages/Account/Account'
import { ModalProvider } from './contexts/ModalContext'
import { AuthModal } from './Components/Modal/AuthModal'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AuthProvider } from './contexts/AuthContext'

import './App.css'

function App() {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('userProfile')
    const authorized = localStorage.getItem('isLoggedIn')

    if (stored && authorized === 'true') {
      const user = JSON.parse(stored)
      setName(user.firstName)
    }
  }, [])

  return (
    <AuthProvider>
      <FavoritesProvider>
        <ModalProvider>
          <Router>
            <Header name={name} />
            <AuthModal setName={setName} />
            <AnimatedRoutes setName={setName} />
            <Footer />
          </Router>
        </ModalProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}

function AnimatedRoutes({ setName }: { setName: React.Dispatch<React.SetStateAction<string | null>> }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MainPage />
            </motion.div>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MovieInfo />
            </motion.div>
          }
        />
        <Route
          path="/genres"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Genres />
            </motion.div>
          }
        />
        <Route
          path="/genres/:genre"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GenrePage />
            </motion.div>
          }
        />
        <Route
          path="/account"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Account setName={setName} />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default App
