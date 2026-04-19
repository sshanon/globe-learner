import useStore from './store'
import { getPointsForLevel } from './countryData'

const UI = () => {
  const { currentLevel, currentCountry, score, feedback, setLevel, resetScore, nextQuestion } = useStore()

  const VERSION = 'v2.2'

  const levelNames = {
    1: 'יבשות',
    2: 'זיהוי יבשת',
    3: 'זיהוי אזור',
    4: 'מיקום מדויק'
  }

  const levelPoints = {
    1: 1,
    2: 3,
    3: 5,
    4: 10
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      zIndex: 1000
    }}>
      {/* Version indicator */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        fontSize: '11px',
        background: 'rgba(0,0,0,0.6)',
        padding: '4px 8px',
        borderRadius: '4px',
        opacity: 0.5
      }}>
        {VERSION}
      </div>

      {/* Top bar - Question prompt */}
      <div style={{
        padding: '16px',
        background: 'rgba(0,0,0,0.85)',
        textAlign: 'center',
        borderBottom: '2px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '6px' }}>
          {levelNames[currentLevel]} • {levelPoints[currentLevel]} נקודות
        </div>
        {currentCountry && (
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,1)',
            color: '#ffffff'
          }}>
            {currentLevel === 1 ? `איפה ${currentCountry}?` :
             currentLevel === 2 ? `באיזו יבשת נמצאת ${currentCountry}?` :
             currentLevel === 3 ? `באיזה אזור נמצאת ${currentCountry}?` :
             `איפה ${currentCountry}?`}
          </div>
        )}
      </div>

      {/* Feedback overlay */}
      {feedback && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: feedback.correct ? 'rgba(0,200,0,0.9)' : 'rgba(200,0,0,0.9)',
          padding: '30px 50px',
          borderRadius: '12px',
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          {feedback.correct ? '✓ נכון!' : '✗ לא נכון'}
          {feedback.correctAnswer && (
            <div style={{ fontSize: '16px', marginTop: '10px', opacity: 0.9 }}>
              התשובה הנכונה: {feedback.correctAnswer}
            </div>
          )}
          {!feedback.correct && (
            <div
              style={{
                fontSize: '16px',
                marginTop: '15px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                pointerEvents: 'auto'
              }}
              onClick={nextQuestion}
            >
              לשאלה הבאה
            </div>
          )}
        </div>
      )}

      {/* Bottom controls */}
      <div style={{
        marginTop: 'auto',
        padding: '20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
      }}>
        {/* Score */}
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          ניקוד: {score}
        </div>

        {/* Level selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '12px',
          pointerEvents: 'auto'
        }}>
          {[1, 2, 3, 4].map(level => (
            <button
              key={level}
              onClick={() => setLevel(level)}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: currentLevel === level ? 'bold' : 'normal',
                background: currentLevel === level ? '#0066cc' : 'rgba(100,100,100,0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              L{level}
            </button>
          ))}
        </div>

        {/* Reset button */}
        <div style={{
          textAlign: 'center',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={resetScore}
            style={{
              padding: '8px 20px',
              fontSize: '12px',
              background: 'rgba(200,0,0,0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            אפס ניקוד
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default UI
