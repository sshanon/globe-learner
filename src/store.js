import { create } from 'zustand'
import { getRandomCountry, getPointsForLevel, countries, CONTINENTS } from './countryData'

const useStore = create((set, get) => ({
  // Game state
  currentLevel: 1,
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

    if (currentLevel === 1) {
      // For Level 1, pick a random continent
      const continents = Object.values(CONTINENTS)
      const randomContinent = continents[Math.floor(Math.random() * continents.length)]
      set({ currentCountry: randomContinent, feedback: null })
    } else {
      const country = getRandomCountry(currentLevel)
      set({ currentCountry: country, feedback: null })
    }
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

    let isCorrect, correctAnswer

    if (currentLevel === 1) {
      // Level 1: Direct continent matching
      isCorrect = clickedContinent === currentCountry
      correctAnswer = currentCountry
    } else {
      // Level 2: Country -> Continent matching
      correctAnswer = countries[currentCountry].continent
      isCorrect = clickedContinent === correctAnswer
    }

    if (isCorrect) {
      const points = getPointsForLevel(currentLevel)
      const newScore = score + points
      set({ score: newScore, feedback: { correct: true, country: currentCountry } })
      localStorage.setItem('globelearn_score', newScore.toString())

      setTimeout(() => {
        get().nextQuestion()
      }, 1500)
    } else {
      set({ feedback: { correct: false, country: currentCountry, correctAnswer } })
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
