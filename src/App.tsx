import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import './App.css'
import './animate.css'

// const phrases = `

// Félicien a six ans.
// Il est curieux comme une belette et drôle comme un singe.
// Il jette ses couvertures par terre quand il dort.
// Ce qu'il aime par-dessus tout, c'est partir en voyage avec ses parents.
// Papa s'appelle Tom. Ce qu'il aime par-dessus tout, c'est Félicien, les ratons laveurs et la musique.
// Maman s'appelle Anne. Ce qu'elle aime par-dessus tout, c'est Félicien, les livres et les choux à la crème.
// Je m'appelle Félicien. J'aime le soccer et les dinosaures, le caramel et les momies d'Égypte.
// Aujourd'hui, c'est mon anniversaire. J'ai six ans.

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
// Je veux faire des explosions avec mon père et mon grandpère.
// On va lancer une balle très haut dans le ciel!
// Je veux utiliser le télescope de grandpapa encore pour voir des planètes.
// Ma planète favorite est Mars.
// J'aime aussi Jupiter. Il est très grand!
// Sur Jupiter, il y a une tache rouge.
// La tache rouge est une tempète.
// La tempète est trois fois plus grande que la terre.
// Moi, j'aime les tempètes et les éclaires.
// J'espère voir une tornade un jour.

// `.split("\n").map(ph => ph.trim()).filter(ph => ph)

const starSound = new Audio("https://freesound.org/data/previews/332/332629_5794274-lq.mp3")

const phrases = `

Quand je suis à Winnipeg, je sors marcher avec mon grandpère.
On marche dans les bois proches de la maison.
Un jour quand on marchait, j'ai entendu un bruit dans le forêt.
C'était un petit bruit bizarre, mais mon grandpère ne l'a pas entendu.
Je lui ai demandé a entrer dans le forêt, mais on était en retard.
Le lendemain, on est retourné au même forêt.
Cette fois, mon grandpère a entendu le bruit aussi!
Nous sommes entrés dans le forêt pour explorer.
On n'entendait pu lr bruit, mais j'ai vu quelque chose par terre.
C'était des petites gouttes vertes par terre!
Les gouttes étaient lumineuses! Vertes et lumineuses!
Tout à coup, on avait peur par ce que les gouttes étaient si bizarre.
Nous avons suivi la piste des gouttes.
Nous avons trouvé une personne blessée par terre.
Mais la personne n'avait pas l'air humain.
Sa peau était verte et il était tout petit.
Son bras saignait, mais le sang n'était pas rouge.
C'était un extraterrestre, mais nous n'avions pas peur car il était petit et blessé.
Mon grand-père a décidé de l'aider.
Il a utilisé son couteau suisse pour couper un pansement.
Il l'a doucement enroulé autour du bras de l'extraterrestre.
L'extraterrestre a indiqué la piste de sang.
Mon grand-père a soigneusement ramassé l'extraterrestre et nous avons suivi la piste dans l'autre sens.
En marchant dans les bois, nous avons senti une odeur de brûlé.
Nous sommes arrivés à un endroit où les arbres ont été partiellement brûlés.
Il y avait un objet métallique sur le sol.
Il était rond et de la taille d'une grande baignoire.
C'était le vaisseau spatial de l'extraterrestre !
Grand-père a posé l'extraterrestre à côté du vaisseau.
Grand-père a sorti son téléphone pour prendre une photo.
L'extraterrestre a lentement grimpé dans son vaisseau.
Il nous a fait signe et a ensuite pointé dans la forêt, loin du navire.
Nous avons compris que le vaisseau allait décoller.
Il était dangereux de s'en approcher au décollage.
Nous avons fait un signe d'adieu et sommes allés dans la forêt.
Soudain, il y a eu un coup de vent.
Le vaisseau spatial s'est élevé dans les airs.
Il s'est mis à clignoter une fois, puis a disparu.


`.split("\n").map(ph => ph.trim()).filter(ph => ph)


const timerSize = 50

const fiveWordSpeed = 19000

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

  const nextWord = () => { 
    // Record time
    wordTimes.unshift(Date.now())
    if (wordTimes.length >= 5 && (wordTimes[0] - wordTimes[4]) < fiveWordSpeed) {
      setStars(stars + 1)
      starSound.play()
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

  const prevWord = () => {
    if (wordIndex > 0) {
      setWordIndex(wordIndex - 1)
    }
    else {
      setPhraseIndex(Math.max(0, phraseIndex - 1))
      setWordIndex(phrases[Math.max(0, phraseIndex - 1)].split(" ").length - 1)      
    }
  }

  const handleKeyDown = (ev: KeyboardEvent) => {
    if (ev.keyCode == 39) {
      nextWord()
    }
    if (ev.keyCode == 37) {
      prevWord()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => { window.removeEventListener("keydown", handleKeyDown)}
  })

  const phrase = phrases[phraseIndex] || ""

  const renderPhrase = () => {
    if (!phrase) {
      return "..."
    }
    const words = phrase.split(" ")
    return words.map((w, index) => 
      <span style={{ paddingLeft: 5, paddingRight: 5, display: "inline-block", backgroundColor: index == wordIndex ? "#FFFF88" : "white" }} >{w}</span>
    )
  }

  const toggleRunning = () => {
    runningRef.current = !runningRef.current     
    setRunning(runningRef.current)
  }

  const wordCount = phrases.join(" ").split(" ").length

  return <div style={{ height: "100%" }}>
    <div style={{position: "absolute", left: 10, top: 10, color: "#EEE" }}>{wordCount} words - {(elapsed / 60.0).toFixed(1)} m</div>
    <div style={{ textAlign: "center", position: "absolute", left: 0, top: 50, right: 100 }}>
      { [...Array(stars).keys()].map(() => <div className="star animated bounceInDown">&#x2605;</div>) }
      &nbsp;
      <span className="star">{stars}</span>
    </div>
    <canvas height={timerSize} width={timerSize} style={{position: "absolute", right: 10, top: 10 }} ref={canvasRef} onClick={toggleRunning} />
    <div style={{ marginTop: Math.max(timerSize, 150), fontSize: 60, padding: 10, paddingBottom: 800 }} onClick={nextWord}>
      { renderPhrase() }
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, userSelect: "none"}}>
      <div className="big-button" onClick={() => { 
        setPhraseIndex(Math.max(0, phraseIndex - 1))
        setWordIndex(0)
      }}>&lt;&lt;</div>
      <div className="big-button" onClick={prevWord}>&lt;</div>
      <div className="big-button" onClick={nextWord}>&gt;</div>
      <div className="big-button" onClick={() => { 
        setPhraseIndex(Math.max(0, phraseIndex + 1))
        setWordIndex(0)
      }}>&gt;&gt;</div>
    </div>
  </div>
}
