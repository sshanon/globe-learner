import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'

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
  const points = []

  // Handle MultiPolygon and Polygon
  const processCoordinates = (coords) => {
    coords.forEach(ring => {
      if (Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
        // It's a polygon with multiple rings
        processCoordinates(ring)
      } else if (Array.isArray(ring[0]) && typeof ring[0][0] === 'number') {
        // It's a simple ring
        ring.forEach(([lon, lat]) => {
          points.push(new THREE.Vector3(...latLonToVector3(lat, lon)))
        })
      }
    })
  }

  processCoordinates(coordinates)

  if (points.length < 2) return null

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" opacity={0.3} transparent linewidth={1} />
    </line>
  )
}

const ContinentBorder = ({ coordinates }) => {
  const points = []

  const processCoordinates = (coords) => {
    coords.forEach(ring => {
      if (Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
        processCoordinates(ring)
      } else if (Array.isArray(ring[0]) && typeof ring[0][0] === 'number') {
        ring.forEach(([lon, lat]) => {
          points.push(new THREE.Vector3(...latLonToVector3(lat, lon)))
        })
      }
    })
  }

  processCoordinates(coordinates)

  if (points.length < 2) return null

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#00ffff" opacity={0.6} transparent linewidth={2} />
    </line>
  )
}

export const BorderRenderer = ({ type = 'countries' }) => {
  const [geoData, setGeoData] = useState(null)

  useEffect(() => {
    // Fetch simplified world data from Natural Earth via CDN
    const url = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Convert TopoJSON to GeoJSON
        // For now, we'll use a simpler GeoJSON source
        // Let's use a direct GeoJSON source instead
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          .then(res => res.json())
          .then(geojson => setGeoData(geojson))
          .catch(err => console.error('Failed to load GeoJSON:', err))
      })
      .catch(() => {
        // Fallback to alternative source
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          .then(res => res.json())
          .then(geojson => setGeoData(geojson))
          .catch(err => console.error('Failed to load borders:', err))
      })
  }, [])

  if (!geoData) return null

  if (type === 'continents') {
    // Group countries by continent and merge borders
    // For simplicity, just show all country borders with different styling
    return (
      <group>
        {geoData.features.map((feature, idx) => (
          <ContinentBorder
            key={idx}
            coordinates={feature.geometry.coordinates}
          />
        ))}
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
