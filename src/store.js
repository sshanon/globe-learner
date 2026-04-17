import { create } from 'zustand'
import { getRandomCountry, getPointsForLevel, countries } from './countryData'

const useStore = create((set, get) => ({
  // Game state
  currentLevel: 4,
  currentCountry: null,
  score: parseInt(localStorage.getItem('globelearn_score') || '0'),
  feedback: null, // { correct: boolean, country: string }

  // Actions
  setLevel: (level) => {
    set({ currentLevel: level })
    get().nextQuestion()
  },

  nextQuestion: () => {
    const { currentLevel } = get()
    const country = getRandomCountry(currentLevel)
    set({ currentCountry: country, feedback: null })
  },

  checkAnswer: (clickedCountry) => {
    const { currentCountry, currentLevel, score } = get()
    const isCorrect = clickedCountry === currentCountry

    if (isCorrect) {
      const points = getPointsForLevel(currentLevel)
      const newScore = score + points
      set({ score: newScore, feedback: { correct: true, country: currentCountry } })
      localStorage.setItem('globelearn_score', newScore.toString())

      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        get().nextQuestion()
      }, 1500)
    } else {
      set({ feedback: { correct: false, country: currentCountry } })
    }
  },

  checkContinent: (clickedContinent) => {
    const { currentCountry, currentLevel, score } = get()
    const correctContinent = countries[currentCountry].continent
    const isCorrect = clickedContinent === correctContinent

    if (isCorrect) {
      const points = getPointsForLevel(currentLevel)
      const newScore = score + points
      set({ score: newScore, feedback: { correct: true, country: currentCountry } })
      localStorage.setItem('globelearn_score', newScore.toString())

      setTimeout(() => {
        get().nextQuestion()
      }, 1500)
    } else {
      set({ feedback: { correct: false, country: currentCountry, correctAnswer: correctContinent } })
    }
  },

  checkRegion: (clickedRegion) => {
    const { currentCountry, currentLevel, score } = get()
    const correctRegion = countries[currentCountry].region
    const isCorrect = clickedRegion === correctRegion

    if (isCorrect) {
      const points = getPointsForLevel(currentLevel)
      const newScore = score + points
      set({ score: newScore, feedback: { correct: true, country: currentCountry } })
      localStorage.setItem('globelearn_score', newScore.toString())

      setTimeout(() => {
        get().nextQuestion()
      }, 1500)
    } else {
      set({ feedback: { correct: false, country: currentCountry, correctAnswer: correctRegion } })
    }
  },

  resetScore: () => {
    set({ score: 0 })
    localStorage.setItem('globelearn_score', '0')
  }
}))

export default useStore
