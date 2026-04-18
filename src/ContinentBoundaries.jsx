import { useEffect, useState } from 'react'
import * as THREE from 'three'

// Convert lat/lon to 3D coordinates on sphere
const latLonToVector3 = (lat, lon, radius = 2.02) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return [x, y, z]
}

const ContinentOutline = ({ coordinates }) => {
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
          <lineBasicMaterial color="#ff6600" opacity={1.0} transparent={false} />
        </line>
      ))}
    </group>
  )
}

export const ContinentBoundaries = () => {
  const [continentData, setContinentData] = useState(null)

  useEffect(() => {
    // Fetch continent/land mass boundaries from Natural Earth
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson')
      .then(res => res.json())
      .then(geojson => setContinentData(geojson))
      .catch((err) => {
        console.error('Failed to load continent boundaries:', err)
        // Fallback to lower resolution
        fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson')
          .then(res => res.json())
          .then(geojson => setContinentData(geojson))
          .catch(err => console.error('Failed to load continent boundaries (fallback):', err))
      })
  }, [])

  if (!continentData) return null

  return (
    <group>
      {continentData.features.map((feature, idx) => (
        <ContinentOutline
          key={idx}
          coordinates={feature.geometry.coordinates}
        />
      ))}
    </group>
  )
}

export default ContinentBoundaries
