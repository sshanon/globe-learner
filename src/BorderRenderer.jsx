import { useEffect, useState } from 'react'
import * as THREE from 'three'

// Convert lat/lon to 3D coordinates on sphere
const latLonToVector3 = (lat, lon, radius = 2.01) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return [x, y, z]
}

const CountryBorder = ({ coordinates }) => {
  const lineSegments = []

  // Handle MultiPolygon and Polygon
  const processCoordinates = (coords) => {
    coords.forEach(ring => {
      if (Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
        // It's a polygon with multiple rings
        processCoordinates(ring)
      } else if (Array.isArray(ring[0]) && typeof ring[0][0] === 'number') {
        // It's a simple ring - process it as line segments
        const points = []

        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i]
          const prevLon = i > 0 ? ring[i - 1][0] : null

          // Detect date line crossing (longitude jump > 180 degrees)
          if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
            // Break the line here
            if (points.length > 1) {
              lineSegments.push([...points])
            }
            points.length = 0 // Clear for new segment
          }

          points.push(new THREE.Vector3(...latLonToVector3(lat, lon)))
        }

        // Add remaining points
        if (points.length > 1) {
          lineSegments.push(points)
        }
      }
    })
  }

  processCoordinates(coordinates)

  if (lineSegments.length === 0) return null

  return (
    <group>
      {lineSegments.map((points, idx) => (
        <line key={idx}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" opacity={0.25} transparent />
        </line>
      ))}
    </group>
  )
}

const ContinentBorder = ({ coordinates }) => {
  const lineSegments = []

  const processCoordinates = (coords) => {
    coords.forEach(ring => {
      if (Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
        processCoordinates(ring)
      } else if (Array.isArray(ring[0]) && typeof ring[0][0] === 'number') {
        const points = []

        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i]
          const prevLon = i > 0 ? ring[i - 1][0] : null

          // Detect date line crossing
          if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
            if (points.length > 1) {
              lineSegments.push([...points])
            }
            points.length = 0
          }

          points.push(new THREE.Vector3(...latLonToVector3(lat, lon)))
        }

        if (points.length > 1) {
          lineSegments.push(points)
        }
      }
    })
  }

  processCoordinates(coordinates)

  if (lineSegments.length === 0) return null

  return (
    <group>
      {lineSegments.map((points, idx) => (
        <line key={idx}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" opacity={0.9} transparent linewidth={4} />
        </line>
      ))}
    </group>
  )
}

export const BorderRenderer = ({ type = 'countries', showContinentBorders = false }) => {
  const [geoData, setGeoData] = useState(null)

  useEffect(() => {
    // Try Natural Earth for better accuracy
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(geojson => setGeoData(geojson))
      .catch(() => {
        // Fallback to previous source
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          .then(res => res.json())
          .then(geojson => setGeoData(geojson))
          .catch(err => console.error('Failed to load borders:', err))
      })
  }, [])

  if (!geoData) return null

  // Group countries by continent for coloring
  const continentColors = {
    'Africa': '#ff6b6b33',
    'Asia': '#4ecdc433',
    'Europe': '#45b7d133',
    'North America': '#ffd93d33',
    'South America': '#95e1d333',
    'Oceania': '#f38181333'
  }

  if (type === 'continents') {
    return (
      <group>
        {geoData.features.map((feature, idx) => {
          const continent = feature.properties?.CONTINENT || feature.properties?.continent
          const color = continentColors[continent] || '#ffffff33'

          return (
            <ContinentBorder
              key={idx}
              coordinates={feature.geometry.coordinates}
            />
          )
        })}
      </group>
    )
  }

  return (
    <group>
      {geoData.features.map((feature, idx) => (
        <CountryBorder
          key={idx}
          coordinates={feature.geometry.coordinates}
        />
      ))}
    </group>
  )
}

export default BorderRenderer
