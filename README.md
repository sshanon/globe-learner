# GlobeLearn POC

A geography learning app using an interactive 3D globe.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open in browser:
- Desktop: http://localhost:3000
- Mobile: http://YOUR_IP:3000 (find your IP with `ipconfig` or `ifconfig`)

## How to Play

### Level 1: Continents (1 point)
- Tap the continent markers to identify continents

### Level 2: Continent Classification (3 points)
- Given a country name, tap the correct continent

### Level 3: Region Placement (5 points)
- Given a country name, tap the correct region (e.g., "Western Europe", "Middle East")

### Level 4: Exact Location (10 points)
- Given a country name, tap the exact country marker on the globe

## Controls

- **Drag** to rotate the globe
- **Tap level buttons** (L1-L4) to switch levels
- **Reset button** clears your score
- Score persists in localStorage

## Countries by Level

### Level 4 (17 countries)
Israel, Lebanon, Syria, Egypt, Jordan, USA, Canada, Mexico, Australia, New Zealand, Japan, China, Mongolia, Russia, India, South Korea, Brazil

### Level 3 (10 countries)
Germany, France, Italy, Cyprus, UK, Ireland, Spain, Morocco, South Africa, Turkey

### Level 2 (10 countries)
Argentina, Chile, Costa Rica, Bolivia, Venezuela, Thailand, Iran, Saudi Arabia, Norway, Sweden

## Mobile Testing

For best results, test on an actual phone:
1. Make sure your phone and computer are on the same network
2. Find your computer's IP address
3. On your phone, navigate to `http://YOUR_IP:3000`
4. Add to home screen for full-screen experience
