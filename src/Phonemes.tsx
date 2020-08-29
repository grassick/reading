import _ from 'lodash'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import './animate.css'

const starSound = new Audio("https://freesound.org/data/previews/332/332629_5794274-lq.mp3")

let itemTexts = `
-a-
-ai-
-ain-
-an-
-au-
-b-
-bl-
-ca-
-ce-
-ch-
-ci-
-co-
-d-
-eau-
-ei-
-en-
-eu-
-eux-
-f-
-ge-
-gn-
-gou-
-i-
-in-
-j-
-l-
-m-
-n-
-oi-
-oin-
-on-
-ou-
-our-
-p-
-ph-
-qu-
-r-
-s-
-t-
-tion-
-tr-
-u-
-ui-
-un-
-v-
-z-
-ça-
-è-
-é-
-ê-
`.split("\n").map(ph => ph.trim()).filter(ph => ph)

// itemTexts = `
// -m-ain
// -r-ou-ge
// -t-ou-t-ou
// qu-elle
// d-r-a-p-eau
// v-é-l-o
// m-ar-ch-é
// é-t-oi-l-e
// co-rr-i-g-é
// m-on-tr-e
// `.split("\n").map(ph => ph.trim()).filter(ph => ph)

// itemTexts = ["un", "à", "en", "le", "et", "être", "de", "avoir", "que", "ne", "dans", 
// "ce", "il", "qui", "pas", "pour", "sur", "se", "son", "plus", "pouvoir", "par", "je", "avec", 
// "tout", "faire", "nous", "mettre", "autre", "on", "mais", "leur", "comme", "ou", "si", "avant", "y",
//  "dire", "elle", "devoir", "donner", "deux", "même", "prendre", "où", "aussi", "celui", "bien", "cela", 
//  "une fois", "vous", "encore", "vouloir", "nouveau", "aller", "entre", "premier", "aucun", "déjà", "grand", 
//  "mon", "me", "moins", "quelque", "lui", "un temps", "très", "savoir", "faut", "voir", "notre", "sans", 
//  "dont", "une raison", "un monde", "non", "un monsieur", "un an", "un jour", "trouver", "demander", "alors", "après", 
//  "venir", "une personne", "rendre", "une part", "dernier", "lequel", "pendant", "passer", "peu", "depuis", 
//  "bon", "comprendre", "rester", "un point", "ainsi", "une heure"]

interface Item {
  text: string
  correct: number
}

export const Phonemes = () => {
  const [queue, setQueue] = useState<Item[]>(_.shuffle(itemTexts).map(t => ({ text: t, correct: 0 })))
  const [stars, setStars] = useState(0)

  const right = () => { 
    const newQueue = queue.slice(1)
    const correct = queue[0].correct + 1

    if (correct >= 2) {
      setStars(stars + 1)
    }

    newQueue.splice(_.random(8, queue.length - 1), 0, { text: queue[0].text, correct: correct })
    setQueue(newQueue)
  }

  const wrong = () => {
    const newQueue = queue.slice(1)
    newQueue.splice(_.random(4, 8), 0, queue[0])
    setQueue(newQueue)
  }

  const handleKeyDown = (ev: KeyboardEvent) => {
    if (ev.keyCode == 39) {
      right()
    }
    if (ev.keyCode == 37) {
      wrong()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => { window.removeEventListener("keydown", handleKeyDown)}
  })

  // Convert text into pieces
  let text = queue[0].text.split("-").map((str, index) => {
    if (index > 0) {
      return <span><span style={{ paddingLeft: 10, paddingRight: 10, color: "#EEE" }}>-</span>{str}</span>
    }
    else {
      return <span>{str}</span>
    }
  })

  return <div style={{ height: "100%" }}>
    <div style={{ textAlign: "center", position: "absolute", left: 0, top: 50, right: 100, opacity: 0.3 }}>
      { [...Array(stars).keys()].map(() => <div className="star animated bounceInDown">&#x2605;</div>) }
      &nbsp;
      <span className="star">{stars}</span>
    </div>
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 80 }}>
      { text }
    </div>
  </div>
}
