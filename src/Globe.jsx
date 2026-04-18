import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { countries, CONTINENTS, REGIONS } from './countryData'
import useStore from './store'
import BorderRenderer from './BorderRenderer'
import ContinentBoundaries from './ContinentBoundaries'

// Convert lat/lon to 3D coordinates on sphere
const latLonToVector3 = (lat, lon, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

const CountryMarker = ({ name, lat, lon, onCountryClick, isTarget, showFeedback, visible = true }) => {
  const position = latLonToVector3(lat, lon)
  const [hovered, setHovered] = useState(false)

  // For Level 4, make markers invisible but still clickable
  if (!visible) {
    return (
      <mesh
        position={position}
        onClick={() => onCountryClick(name)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial
          color="#ffffff"
          opacity={0}
          transparent
        />
      </mesh>
    )
  }

  return (
    <mesh
      position={position}
      onClick={() => onCountryClick(name)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshBasicMaterial
        color={
          showFeedback && isTarget ? '#00ff00' :
          hovered ? '#ffff00' :
          '#ffffff'
        }
        opacity={showFeedback && isTarget ? 1 : hovered ? 0.8 : 0.4}
        transparent
      />
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
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshBasicMaterial
        color="#00aaff"
        transparent
        opacity={0}
        visible={false}
      />
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
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshBasicMaterial
        color="#ff6600"
        transparent
        opacity={0}
        visible={false}
      />
    </mesh>
  )
}

const Equator = () => {
  const points = []
  const radius = 2.02

  // Create circle of points around equator
  for (let i = 0; i <= 360; i += 2) {
    const theta = (i + 180) * (Math.PI / 180)
    const x = -(radius * Math.cos(theta))
    const z = radius * Math.sin(theta)
    const y = 0
    points.push(new THREE.Vector3(x, y, z))
  }

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
      <lineBasicMaterial color="#ffaa00" opacity={0.3} transparent linewidth={1} />
    </line>
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
      <meshBasicMaterial
        color="#a8d5a8"
      />
    </Sphere>
  )
}

const GlobeScene = () => {
  const { currentLevel, currentCountry, feedback, checkAnswer, checkContinent, checkRegion } = useStore()

  const handleCountryClick = (countryName) => {
    if (feedback?.correct) return // Prevent clicks during feedback

    if (currentLevel === 3) {
      // Level 3: Check if clicked country's region matches
      const clickedCountryData = countries[countryName]
      if (clickedCountryData && clickedCountryData.region) {
        checkRegion(clickedCountryData.region)
      }
    } else if (currentLevel === 4) {
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
      <ambientLight intensity={1.2} />
      <Earth />

      {/* Always show equator */}
      <Equator />

      {/* Show borders based on level */}
      {currentLevel === 1 && <BorderRenderer type="continents" brightness="high" />}
      {currentLevel === 2 && <BorderRenderer type="continents" brightness="high" />}
      {currentLevel === 3 && <BorderRenderer type="countries" brightness="high" />}
      {currentLevel === 4 && <BorderRenderer type="countries" brightness="high" />}

      {/* Always show continent boundaries (thick orange outlines) */}
      <ContinentBoundaries />

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

      {/* Level 3: Invisible clickable areas */}
      {currentLevel === 3 && Object.entries(countries)
        .filter(([_, data]) => data.level === 3 || data.level === 4)
        .map(([name, data]) => (
          <CountryMarker
            key={name}
            name={name}
            lat={data.lat}
            lon={data.lon}
            onCountryClick={handleCountryClick}
            isTarget={name === currentCountry}
            showFeedback={feedback !== null}
            visible={false}
          />
        ))}

      {/* Level 4: Invisible clickable areas */}
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
            visible={false}
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
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#001e3c']} />
        <GlobeScene />
      </Canvas>
    </div>
  )
}

export default Globe
