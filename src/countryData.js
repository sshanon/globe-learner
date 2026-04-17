// Country data with levels, coordinates (lat, lon), and continent/region info

export const CONTINENTS = {
  AFRICA: 'Africa',
  ASIA: 'Asia',
  EUROPE: 'Europe',
  NORTH_AMERICA: 'North America',
  SOUTH_AMERICA: 'South America',
  OCEANIA: 'Oceania'
}

export const REGIONS = {
  WESTERN_EUROPE: 'Western Europe',
  SOUTHERN_EUROPE: 'Southern Europe',
  NORTHERN_EUROPE: 'Northern Europe',
  EASTERN_EUROPE: 'Eastern Europe',
  NORTH_AFRICA: 'North Africa',
  SOUTHERN_AFRICA: 'Southern Africa',
  MIDDLE_EAST: 'Middle East',
  EAST_ASIA: 'East Asia',
  SOUTH_ASIA: 'South Asia',
  SOUTHEAST_ASIA: 'Southeast Asia'
}

export const countries = {
  // Level 4 - Exact placement (10 points)
  'Israel': { lat: 31.5, lon: 34.8, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'Lebanon': { lat: 33.9, lon: 35.5, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'Syria': { lat: 35.0, lon: 38.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'Egypt': { lat: 26.8, lon: 30.8, continent: CONTINENTS.AFRICA, region: REGIONS.NORTH_AFRICA, level: 4 },
  'Jordan': { lat: 31.0, lon: 36.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'USA': { lat: 37.0, lon: -95.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 4 },
  'Canada': { lat: 56.0, lon: -106.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 4 },
  'Mexico': { lat: 23.0, lon: -102.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 4 },
  'Australia': { lat: -25.0, lon: 133.0, continent: CONTINENTS.OCEANIA, region: null, level: 4 },
  'New Zealand': { lat: -41.0, lon: 174.0, continent: CONTINENTS.OCEANIA, region: null, level: 4 },
  'Japan': { lat: 36.0, lon: 138.0, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'China': { lat: 35.0, lon: 105.0, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'Mongolia': { lat: 46.0, lon: 105.0, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'Russia': { lat: 60.0, lon: 100.0, continent: CONTINENTS.ASIA, region: null, level: 4 },
  'India': { lat: 20.0, lon: 77.0, continent: CONTINENTS.ASIA, region: REGIONS.SOUTH_ASIA, level: 4 },
  'South Korea': { lat: 37.0, lon: 127.5, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'Brazil': { lat: -10.0, lon: -55.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 4 },

  // Level 3 - Area placement (5 points)
  'Germany': { lat: 51.0, lon: 10.5, continent: CONTINENTS.EUROPE, region: REGIONS.WESTERN_EUROPE, level: 3 },
  'France': { lat: 46.0, lon: 2.0, continent: CONTINENTS.EUROPE, region: REGIONS.WESTERN_EUROPE, level: 3 },
  'Italy': { lat: 42.8, lon: 12.8, continent: CONTINENTS.EUROPE, region: REGIONS.SOUTHERN_EUROPE, level: 3 },
  'Cyprus': { lat: 35.0, lon: 33.0, continent: CONTINENTS.EUROPE, region: REGIONS.SOUTHERN_EUROPE, level: 3 },
  'UK': { lat: 54.0, lon: -2.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 3 },
  'Ireland': { lat: 53.0, lon: -8.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 3 },
  'Spain': { lat: 40.0, lon: -4.0, continent: CONTINENTS.EUROPE, region: REGIONS.SOUTHERN_EUROPE, level: 3 },
  'Morocco': { lat: 32.0, lon: -5.0, continent: CONTINENTS.AFRICA, region: REGIONS.NORTH_AFRICA, level: 3 },
  'South Africa': { lat: -29.0, lon: 24.0, continent: CONTINENTS.AFRICA, region: REGIONS.SOUTHERN_AFRICA, level: 3 },
  'Turkey': { lat: 39.0, lon: 35.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 3 },

  // Level 2 - Continent only (3 points)
  'Argentina': { lat: -34.0, lon: -64.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'Chile': { lat: -30.0, lon: -71.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'Costa Rica': { lat: 10.0, lon: -84.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 2 },
  'Bolivia': { lat: -17.0, lon: -65.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'Venezuela': { lat: 8.0, lon: -66.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'Thailand': { lat: 15.0, lon: 100.0, continent: CONTINENTS.ASIA, region: REGIONS.SOUTHEAST_ASIA, level: 2 },
  'Iran': { lat: 32.0, lon: 53.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 2 },
  'Saudi Arabia': { lat: 24.0, lon: 45.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 2 },
  'Norway': { lat: 60.0, lon: 8.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 2 },
  'Sweden': { lat: 62.0, lon: 15.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 2 }
}

export const getCountriesByLevel = (level) => {
  return Object.entries(countries)
    .filter(([_, data]) => data.level === level)
    .map(([name]) => name)
}

export const getRandomCountry = (level) => {
  const levelCountries = getCountriesByLevel(level)
  return levelCountries[Math.floor(Math.random() * levelCountries.length)]
}

export const getPointsForLevel = (level) => {
  const points = { 1: 1, 2: 3, 3: 5, 4: 10 }
  return points[level] || 0
}
