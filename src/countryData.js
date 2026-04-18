// Country data with levels, coordinates (lat, lon), and continent/region info

export const CONTINENTS = {
  AFRICA: 'אפריקה',
  ASIA: 'אסיה',
  EUROPE: 'אירופה',
  NORTH_AMERICA: 'צפון אמריקה',
  SOUTH_AMERICA: 'דרום אמריקה',
  OCEANIA: 'אוקיאניה'
}

export const REGIONS = {
  WESTERN_EUROPE: 'מערב אירופה',
  SOUTHERN_EUROPE: 'דרום אירופה',
  NORTHERN_EUROPE: 'צפון אירופה',
  EASTERN_EUROPE: 'מזרח אירופה',
  NORTH_AFRICA: 'צפון אפריקה',
  SOUTHERN_AFRICA: 'דרום אפריקה',
  MIDDLE_EAST: 'המזרח התיכון',
  EAST_ASIA: 'מזרח אסיה',
  SOUTH_ASIA: 'דרום אסיה',
  SOUTHEAST_ASIA: 'דרום מזרח אסיה'
}

export const countries = {
  // Level 4 - Exact placement (10 points)
  'ישראל': { lat: 31.5, lon: 34.8, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'לבנון': { lat: 33.9, lon: 35.5, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'סוריה': { lat: 35.0, lon: 38.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'מצרים': { lat: 26.8, lon: 30.8, continent: CONTINENTS.AFRICA, region: REGIONS.NORTH_AFRICA, level: 4 },
  'ירדן': { lat: 31.0, lon: 36.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 4 },
  'ארה"ב': { lat: 37.0, lon: -95.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 4 },
  'קנדה': { lat: 56.0, lon: -106.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 4 },
  'מקסיקו': { lat: 23.0, lon: -102.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 4 },
  'אוסטרליה': { lat: -25.0, lon: 133.0, continent: CONTINENTS.OCEANIA, region: null, level: 4 },
  'ניו זילנד': { lat: -41.0, lon: 174.0, continent: CONTINENTS.OCEANIA, region: null, level: 4 },
  'יפן': { lat: 36.0, lon: 138.0, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'סין': { lat: 35.0, lon: 105.0, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'מונגוליה': { lat: 46.0, lon: 105.0, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'רוסיה': { lat: 60.0, lon: 100.0, continent: CONTINENTS.ASIA, region: null, level: 4 },
  'הודו': { lat: 20.0, lon: 77.0, continent: CONTINENTS.ASIA, region: REGIONS.SOUTH_ASIA, level: 4 },
  'דרום קוריאה': { lat: 37.0, lon: 127.5, continent: CONTINENTS.ASIA, region: REGIONS.EAST_ASIA, level: 4 },
  'ברזיל': { lat: -10.0, lon: -55.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 4 },

  // Level 3 - Area placement (5 points)
  'גרמניה': { lat: 51.0, lon: 10.5, continent: CONTINENTS.EUROPE, region: REGIONS.WESTERN_EUROPE, level: 3 },
  'צרפת': { lat: 46.0, lon: 2.0, continent: CONTINENTS.EUROPE, region: REGIONS.WESTERN_EUROPE, level: 3 },
  'איטליה': { lat: 42.8, lon: 12.8, continent: CONTINENTS.EUROPE, region: REGIONS.SOUTHERN_EUROPE, level: 3 },
  'קפריסין': { lat: 35.0, lon: 33.0, continent: CONTINENTS.EUROPE, region: REGIONS.SOUTHERN_EUROPE, level: 3 },
  'בריטניה': { lat: 54.0, lon: -2.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 3 },
  'אירלנד': { lat: 53.0, lon: -8.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 3 },
  'ספרד': { lat: 40.0, lon: -4.0, continent: CONTINENTS.EUROPE, region: REGIONS.SOUTHERN_EUROPE, level: 3 },
  'מרוקו': { lat: 32.0, lon: -5.0, continent: CONTINENTS.AFRICA, region: REGIONS.NORTH_AFRICA, level: 3 },
  'דרום אפריקה': { lat: -29.0, lon: 24.0, continent: CONTINENTS.AFRICA, region: REGIONS.SOUTHERN_AFRICA, level: 3 },
  'טורקיה': { lat: 39.0, lon: 35.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 3 },

  // Level 2 - Continent only (3 points)
  'ארגנטינה': { lat: -34.0, lon: -64.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'צ׳ילה': { lat: -30.0, lon: -71.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'קוסטה ריקה': { lat: 10.0, lon: -84.0, continent: CONTINENTS.NORTH_AMERICA, region: null, level: 2 },
  'בוליביה': { lat: -17.0, lon: -65.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'ונצואלה': { lat: 8.0, lon: -66.0, continent: CONTINENTS.SOUTH_AMERICA, region: null, level: 2 },
  'תאילנד': { lat: 15.0, lon: 100.0, continent: CONTINENTS.ASIA, region: REGIONS.SOUTHEAST_ASIA, level: 2 },
  'איראן': { lat: 32.0, lon: 53.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 2 },
  'ערב הסעודית': { lat: 24.0, lon: 45.0, continent: CONTINENTS.ASIA, region: REGIONS.MIDDLE_EAST, level: 2 },
  'נורווגיה': { lat: 60.0, lon: 8.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 2 },
  'שוודיה': { lat: 62.0, lon: 15.0, continent: CONTINENTS.EUROPE, region: REGIONS.NORTHERN_EUROPE, level: 2 }
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
