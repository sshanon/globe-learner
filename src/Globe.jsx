import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { countries, CONTINENTS, REGIONS } from './countryData'
import useStore from './store'

// Convert lat/lon to 3D coordinates on sphere
const latLonToVector3 = (lat, lon, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

const CountryMarker = ({ name, lat, lon, onCountryClick, isTarget, showFeedback }) => {
  const position = latLonToVector3(lat, lon)
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      onClick={() => onCountryClick(name)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial
        color={
          showFeedback && isTarget ? '#00ff00' :
          hovered ? '#ffff00' :
          '#ff0000'
        }
      />
      {(hovered || (showFeedback && isTarget)) && (
        <Html distanceFactor={8}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            pointerEvents: 'none'
          }}>
            {name}
          </div>
        </Html>
      )}
    </mesh>
  )
}

const ContinentMarker = ({ continent, onContinentClick }) => {
  // Approximate continent centers
  const continentCenters = {
    [CONTINENTS.AFRICA]: { lat: 0, lon: 20 },
    [CONTINENTS.ASIA]: { lat: 45, lon: 100 },
    [CONTINENTS.EUROPE]: { lat: 55, lon: 25 },
    [CONTINENTS.NORTH_AMERICA]: { lat: 45, lon: -100 },
    [CONTINENTS.SOUTH_AMERICA]: { lat: -15, lon: -60 },
    [CONTINENTS.OCEANIA]: { lat: -25, lon: 140 }
  }

  const center = continentCenters[continent]
  if (!center) return null

  const position = latLonToVector3(center.lat, center.lon, 2.1)
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      onClick={() => onContinentClick(continent)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial
        color={hovered ? '#ffff00' : '#00aaff'}
        transparent
        opacity={0.6}
      />
      <Html distanceFactor={8}>
        <div style={{
          background: 'rgba(0,100,200,0.8)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          {continent}
        </div>
      </Html>
    </mesh>
  )
}

const RegionMarker = ({ region, onRegionClick }) => {
  // Approximate region centers
  const regionCenters = {
    [REGIONS.WESTERN_EUROPE]: { lat: 50, lon: 5 },
    [REGIONS.SOUTHERN_EUROPE]: { lat: 42, lon: 15 },
    [REGIONS.NORTHERN_EUROPE]: { lat: 60, lon: 10 },
    [REGIONS.EASTERN_EUROPE]: { lat: 50, lon: 30 },
    [REGIONS.NORTH_AFRICA]: { lat: 25, lon: 10 },
    [REGIONS.SOUTHERN_AFRICA]: { lat: -25, lon: 25 },
    [REGIONS.MIDDLE_EAST]: { lat: 30, lon: 45 },
    [REGIONS.EAST_ASIA]: { lat: 35, lon: 110 },
    [REGIONS.SOUTH_ASIA]: { lat: 20, lon: 78 },
    [REGIONS.SOUTHEAST_ASIA]: { lat: 10, lon: 105 }
  }

  const center = regionCenters[region]
  if (!center) return null

  const position = latLonToVector3(center.lat, center.lon, 2.1)
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      onClick={() => onRegionClick(region)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshBasicMaterial
        color={hovered ? '#ffff00' : '#ff6600'}
        transparent
        opacity={0.6}
      />
      <Html distanceFactor={8}>
        <div style={{
          background: 'rgba(200,100,0,0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          fontSize: '12px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          {region}
        </div>
      </Html>
    </mesh>
  )
}

const Earth = () => {
  const meshRef = useRef()

  // Slow auto-rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#1a4d2e"
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  )
}

const GlobeScene = () => {
  const { currentLevel, currentCountry, feedback, checkAnswer, checkContinent, checkRegion } = useStore()

  const handleCountryClick = (countryName) => {
    if (feedback?.correct) return // Prevent clicks during feedback
    if (currentLevel === 4 || currentLevel === 3 || currentLevel === 2) {
      checkAnswer(countryName)
    }
  }

  const handleContinentClick = (continent) => {
    if (feedback?.correct) return
    if (currentLevel === 1 || currentLevel === 2) {
      checkContinent(continent)
    }
  }

  const handleRegionClick = (region) => {
    if (feedback?.correct) return
    if (currentLevel === 3) {
      checkRegion(region)
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Earth />

      {/* Level 1: Show continents */}
      {currentLevel === 1 && Object.values(CONTINENTS).map(continent => (
        <ContinentMarker
          key={continent}
          continent={continent}
          onContinentClick={handleContinentClick}
        />
      ))}

      {/* Level 2: Show all countries + continents */}
      {currentLevel === 2 && (
        <>
          {Object.values(CONTINENTS).map(continent => (
            <ContinentMarker
              key={continent}
              continent={continent}
              onContinentClick={handleContinentClick}
            />
          ))}
        </>
      )}

      {/* Level 3: Show regions */}
      {currentLevel === 3 && Object.values(REGIONS).map(region => (
        <RegionMarker
          key={region}
          region={region}
          onRegionClick={handleRegionClick}
        />
      ))}

      {/* Level 4: Show country markers */}
      {currentLevel === 4 && Object.entries(countries)
        .filter(([_, data]) => data.level === 4)
        .map(([name, data]) => (
          <CountryMarker
            key={name}
            name={name}
            lat={data.lat}
            lon={data.lon}
            onCountryClick={handleCountryClick}
            isTarget={name === currentCountry}
            showFeedback={feedback !== null}
          />
        ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={3 * Math.PI / 4}
      />
    </>
  )
}

const Globe = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <GlobeScene />
      </Canvas>
    </div>
  )
}

export default Globe
