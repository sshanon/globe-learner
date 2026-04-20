import { useEffect, useState } from 'react'
import * as THREE from 'three'

// Convert lat/lon to 3D coordinates on sphere
const latLonToVector3 = (lat, lon, radius = 2.015) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return [x, y, z]
}

// Calculate center of polygon
const getPolygonCenter = (coordinates) => {
  let totalLat = 0, totalLon = 0, count = 0

  const extractPoints = (coords) => {
    coords.forEach(ring => {
      if (Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
        extractPoints(ring)
      } else if (Array.isArray(ring[0]) && typeof ring[0][0] === 'number') {
        ring.forEach(([lon, lat]) => {
          totalLat += lat
          totalLon += lon
          count++
        })
      }
    })
  }

  extractPoints(coordinates)

  return count > 0 ? { lat: totalLat / count, lon: totalLon / count } : null
}

// Check if a point is inside a polygon bounds
const isPointInBounds = (lat, lon, coordinates) => {
  let minLat = Infinity, maxLat = -Infinity
  let minLon = Infinity, maxLon = -Infinity

  const extractBounds = (coords) => {
    coords.forEach(ring => {
      if (Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
        extractBounds(ring)
      } else if (Array.isArray(ring[0]) && typeof ring[0][0] === 'number') {
        ring.forEach(([lon, lat]) => {
          minLat = Math.min(minLat, lat)
          maxLat = Math.max(maxLat, lat)
          minLon = Math.min(minLon, lon)
          maxLon = Math.max(maxLon, lon)
        })
      }
    })
  }

  extractBounds(coordinates)

  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon
}

// Calculate distance between two points
const getDistance = (lat1, lon1, lat2, lon2) => {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2))
}

const CountryBorderHighlight = ({ coordinates, color }) => {
  const lineSegments = []

  const processCoordinates = (coords, radius = 2.015) => {
    coords.forEach(ring => {
      if (Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
        processCoordinates(ring, radius)
      } else if (Array.isArray(ring[0]) && typeof ring[0][0] === 'number') {
        const points = []

        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i]
          const prevLon = i > 0 ? ring[i - 1][0] : null

          // Detect date line crossing
          if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
            if (points.length > 1) {
              lineSegments.push({ points: [...points], radius })
            }
            points.length = 0
          }

          const phi = (90 - lat) * (Math.PI / 180)
          const theta = (lon + 180) * (Math.PI / 180)
          const x = -(radius * Math.sin(phi) * Math.cos(theta))
          const z = radius * Math.sin(phi) * Math.sin(theta)
          const y = radius * Math.cos(phi)
          points.push(new THREE.Vector3(x, y, z))
        }

        if (points.length > 1) {
          lineSegments.push({ points, radius })
        }
      }
    })
  }

  // Render at multiple radii to create thick, bold borders
  processCoordinates(coordinates, 2.025)
  processCoordinates(coordinates, 2.023)
  processCoordinates(coordinates, 2.021)
  processCoordinates(coordinates, 2.019)
  processCoordinates(coordinates, 2.017)
  processCoordinates(coordinates, 2.015)

  if (lineSegments.length === 0) return null

  return (
    <group>
      {lineSegments.map((segment, idx) => (
        <line key={idx}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={segment.points.length}
              array={new Float32Array(segment.points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={color}
            opacity={1.0}
            transparent={false}
            linewidth={5}
          />
        </line>
      ))}
    </group>
  )
}

// Cache the GeoJSON data globally to avoid repeated fetches
let cachedGeoJSON = null
let geoJSONPromise = null

const loadGeoJSON = () => {
  if (cachedGeoJSON) {
    return Promise.resolve(cachedGeoJSON)
  }

  if (geoJSONPromise) {
    return geoJSONPromise
  }

  geoJSONPromise = fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson')
    .then(res => res.json())
    .then(geojson => {
      cachedGeoJSON = geojson
      geoJSONPromise = null
      return geojson
    })
    .catch(err => {
      console.error('Failed to load country geometry:', err)
      geoJSONPromise = null
      return null
    })

  return geoJSONPromise
}

export const HighlightedCountry = ({ countryLat, countryLon, isCorrect }) => {
  const [countryGeometry, setCountryGeometry] = useState(null)

  useEffect(() => {
    // Load GeoJSON and find matching country
    loadGeoJSON().then(geojson => {
      if (!geojson) return

      // Find all features that contain the country coordinates in their bounding box
      const candidates = geojson.features.filter(feature =>
        isPointInBounds(countryLat, countryLon, feature.geometry.coordinates)
      )

      if (candidates.length === 0) return

      // If multiple candidates, pick the one whose center is closest to the target
      let bestMatch = candidates[0]
      let bestDistance = Infinity

      candidates.forEach(feature => {
        const center = getPolygonCenter(feature.geometry.coordinates)
        if (center) {
          const distance = getDistance(countryLat, countryLon, center.lat, center.lon)
          if (distance < bestDistance) {
            bestDistance = distance
            bestMatch = feature
          }
        }
      })

      if (bestMatch) {
        setCountryGeometry(bestMatch.geometry.coordinates)
      }
    })
  }, [countryLat, countryLon])

  if (!countryGeometry) return null

  const color = isCorrect ? '#00ff00' : '#ff0000'

  return <CountryBorderHighlight coordinates={countryGeometry} color={color} />
}

export default HighlightedCountry
