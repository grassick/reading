import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import './App.css'
import { unstable_batchedUpdates } from 'react-dom'

// const phrases = `

// J'aime les chiens.
// Il y a un chien à Winnipeg.
// Son nom est Felix.
// Je veux aller le voir.
// Je veux jouer avec lui.
// Je vais me cacher et il va me trouver.
// Je vais aussi jouer avec Benji, mais Felix est plus beau.
// Cet été, je vais aller à Winnipeg encore.
// On va faire du camping et avoir des aventures.
// Je veux faire des explosions avec mon père et mon grandpère.
// On va lancer une balle très haut dans le ciel!
// Je veux utiliser le télescope de grandpa encore pour voir des planètes.
// Ma planète favorite est Mars.

// `.split("\n").map(ph => ph.trim()).filter(ph => ph)

const phrases = `

Je veux faire des explosions avec mon père et mon grandpère.
On va lancer une balle très haut dans le ciel!
Je veux utiliser le télescope de grandpa encore pour voir des planètes.
Ma planète favorite est Mars.
J'aime aussi Jupiter. Il est très grand!
Sur Jupiter, il y a une tache rouge.
La tache rouge est une tempète.
La tempète est trois fois plus grande que la terre.

`.split("\n").map(ph => ph.trim()).filter(ph => ph)


const timerSize = 50

const fiveWordSpeed = 20000

// Timestamps when words are successful
let wordTimes: number[] = []

export const App = () => {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [stars, setStars] = useState(0)
  const runningRef = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    setInterval(() => {
      if (runningRef.current) {
        setElapsed(e => e + 0.1)
      }
    }, 100)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    const fraction = 1 - (elapsed / (5*60.0)) 
    
    ctx.clearRect(0, 0, timerSize, timerSize)

    if (fraction <= 0) {
      return
    }

    ctx.beginPath()
    ctx.moveTo(timerSize/2, timerSize/2)
    ctx.arc(timerSize/2, timerSize/2, timerSize/2, -Math.PI/2, -Math.PI/2 + fraction * 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = running ? "#DDF" : "#DDD"
    ctx.fill()
  }, [elapsed, running])

  const phrase = phrases[phraseIndex] || ""

  const renderPhrase = () => {
    if (!phrase) {
      return "..."
    }
    const words = phrase.split(" ")
    return words.map((w, index) => 
      <span style={{ paddingLeft: 5, paddingRight: 5, display: "inline-block", backgroundColor: index == wordIndex ? "#FFFFAA" : "white" }} >{w}</span>
    )
  }

  const nextWord = () => { 
    // Record time
    wordTimes.unshift(Date.now())
    if (wordTimes.length >= 5 && (wordTimes[4] - wordTimes[0]) < fiveWordSpeed) {
      setStars(stars + 1)
      wordTimes = []
    }

    if (wordIndex >= phrase.split(" ").length - 1) {
      setPhraseIndex(Math.max(0, phraseIndex + 1))
      setWordIndex(0)
    }
    else {
      setWordIndex(wordIndex + 1)
    }
  }

  const toggleRunning = () => {
    runningRef.current = !runningRef.current     
    setRunning(runningRef.current)
  }

  const wordCount = phrases.join(" ").split(" ").length

  return <div style={{ height: "100%" }}>
    <div style={{position: "absolute", left: 10, top: 10, color: "#EEE" }}>{wordCount} words - {(elapsed / 60.0).toFixed(1)} m</div>
    <div style={{ textAlign: "center", color: "#dcdc33", fontSize: 30 }}>
      { [...Array(stars).keys()].map(() => <span>&#x2605;</span>) }
      &nbsp;
    </div>
    <canvas height={timerSize} width={timerSize} style={{position: "absolute", right: 10, top: 10 }} ref={canvasRef} onClick={toggleRunning} />
    <div style={{ marginTop: timerSize, fontSize: 40, padding: 10, paddingBottom: 800 }} onClick={nextWord}>
      { renderPhrase() }
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, userSelect: "none"}}>
      <div className="big-button" onClick={() => { 
        setPhraseIndex(Math.max(0, phraseIndex - 1))
        setWordIndex(0)
      }}>&lt;&lt;</div>
      <div className="big-button" onClick={() => { setWordIndex(Math.max(0, wordIndex - 1))}}>&lt;</div>
      <div className="big-button" onClick={nextWord}>&gt;</div>
      <div className="big-button" onClick={() => { 
        setPhraseIndex(Math.max(0, phraseIndex + 1))
        setWordIndex(0)
      }}>&gt;&gt;</div>
    </div>
  </div>
}
