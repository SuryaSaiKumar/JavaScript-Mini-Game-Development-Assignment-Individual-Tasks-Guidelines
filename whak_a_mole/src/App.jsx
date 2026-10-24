import { useEffect, useState } from 'react'
import holesImage from './assets/holes_10.jpg'
import './App.css'

// Game constants
// The game length in seconds is const game_length = 30
//the image i have chossen is 9 holes so const hole_count = 9
const GAME_LENGTH = 30
const HOLE_COUNT = 9

// Returns a random hole index that is not the same as the current one
function getNextMole(current) {
  const next = Math.floor(Math.random() * (HOLE_COUNT - 1))
  return next >= current ? next + 1 : next
}
// The main game component
function App() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_LENGTH)
  const [moleIndex, setMoleIndex] = useState(4)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  //here the useEffect is used to set the timer for the game , it will run only when the isplaying state is true
  //the decrement of the time left is done every second and when the time left reaches 0 the game will stop

  useEffect(() => {
    if (!isPlaying) return undefined
    //starting at time 30 seconds counts down to 0
    let remaining = GAME_LENGTH
    const timer = window.setInterval(() => {
      remaining -= 1
      setTimeLeft(remaining)

      if (remaining === 0) {
        window.clearInterval(timer)
        setIsPlaying(false)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isPlaying])
  //if the game is playing the mole will move to a new hole every 850 milliseconds
  useEffect(() => {
    if (!isPlaying) return undefined

    const movement = window.setInterval(() => {
      setMoleIndex((current) => getNextMole(current))
    }, 850)

    return () => window.clearInterval(movement)
  }, [isPlaying])

  //this function is used to start the game and reset the score and time left to the initial values
  //score is set to 0, time left is set to GAME_LENGTH, mole index is set to a random hole index and hasPlayed and isPlaying are set to true
  function startGame() {
    setScore(0)
    setTimeLeft(GAME_LENGTH)
    setMoleIndex(Math.floor(Math.random() * HOLE_COUNT))
    setHasPlayed(true)
    setIsPlaying(true)
  }

  function whackMole(index) {
    if (!isPlaying || index !== moleIndex) return

    setScore((current) => current + 1)
    setMoleIndex((current) => getNextMole(current))
  }

  return (
    //the main game page is rendered here with the score, time left, and mole holes
    <main className="game-page">
      <div className="game-shell">
        <header className="game-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">✿</span>
            <span className="brand-name">MOLE<span>MEADOW</span></span>
          </div>
          <p className="game-tagline">A little garden game</p>
        </header>
        //the game card is rendered here with the score, time left, and mole holes
        <section className="game-card" aria-label="Whack-a-mole game">
          <div className="game-intro">
            <span className="eyebrow">THE 30-SECOND CHALLENGE</span>
            <h1>Whack-a-mole!</h1>
            <p>They pop up, you tap fast. How many can you catch?</p>
          </div>
            //the scoreboard is rendered here with the score and time left 
          <div className="scoreboard" aria-label="Game stats">
            <div className="stat">
              <span className="stat-label">SCORE</span>
              <span className="stat-value" aria-live="polite">{score}</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className={`stat timer-stat${timeLeft <= 10 ? ' timer-warning' : ''}`}>
              <span className="stat-label">TIME LEFT</span>
              <span className="stat-value" role="timer" aria-live="off">{timeLeft}<small>s</small></span>
            </div>
          </div>
            //the garden grid is rendered here with the mole holes and the mole 
          <div className={`garden${isPlaying ? ' garden-playing' : ''}`}>
            <div className="garden-grid" role="group" aria-label="Mole holes">
              {Array.from({ length: HOLE_COUNT }, (_, index) => {
                const row = Math.floor(index / 3)
                const column = index % 3
                const position = `${column * 50}% ${row * 50}%`
                //each mole hole is rendered here with the mole if it is active
                return (
                  <button
                    className={`hole${isPlaying && moleIndex === index ? ' hole-active' : ''}`}
                    key={index}
                    type="button"
                    onClick={() => whackMole(index)}
                    aria-label={isPlaying && moleIndex === index ? 'Whack the mole!' : 'Empty mole hole'}
                    aria-disabled={!isPlaying || moleIndex !== index}
                    style={{
                      '--hole-position': position,
                      backgroundImage: `url("${holesImage}")`,
                    }}
                  >
                    {isPlaying && moleIndex === index && (
                      <span className="mole" aria-hidden="true">
                        <span className="mole-ear mole-ear-left" />
                        <span className="mole-ear mole-ear-right" />
                        <span className="mole-face">
                          <span className="mole-eye mole-eye-left" />
                          <span className="mole-eye mole-eye-right" />
                          <span className="mole-nose" />
                        </span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {!isPlaying && (
              <div className={`game-overlay${hasPlayed ? ' game-overlay-finished' : ''}`}>
                <div className="overlay-card">
                  <span className="overlay-sparkle" aria-hidden="true">
                    {hasPlayed ? '✦' : '🌼'}
                  </span>
                  <h2>{hasPlayed ? 'Time’s up!' : 'Ready, gardener?'}</h2>
                  <p>
                    {hasPlayed
                      ? `You caught ${score} mole${score === 1 ? '' : 's'}!`
                      : 'Catch as many cheeky moles as you can.'}
                  </p>
                  <button className="play-button" type="button" onClick={startGame}>
                    {hasPlayed ? 'Play again' : 'Let’s play'}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="game-hint">
            <span aria-hidden="true">☝</span>
            {isPlaying ? 'Tap a mole before it hops away!' : 'Keep your eyes peeled for a pop-up and more,Start tapping away!'}
          </p>
        </section>

        <footer className="game-footer">
          <span>Made for quick smiles</span>
          <span aria-hidden="true">✿</span>
        </footer>
      </div>
    </main>
  )
}

export default App
