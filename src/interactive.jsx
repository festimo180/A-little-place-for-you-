import React, { useState } from "react";
import {
  ArrowLeft, ArrowRight, Trophy, Sparkles, RotateCcw,
  Check, X, Gift, Heart, Star, Gamepad2, Shuffle,
  Brain, Award, Lightbulb, PartyPopper
} from "lucide-react";

const questions = [
  {
    q: "What food has Festus identified as his favourite?",
    a: ["Jollof rice", "Pasta", "Pizza", "Burgers"],
    c: 1,
    why: "Pasta is Festus's stated favourite food."
  },
  {
    q: "Which music genre does Festus enjoy?",
    a: ["Afrobeats", "Country", "Heavy metal", "Classical opera"],
    c: 0,
    why: "Festus has identified Afrobeats as his music preference."
  },
  {
    q: "Which pair describes Festus's hobbies?",
    a: ["Reading and swimming", "Cooking and painting", "Singing and dancing", "Running and cycling"],
    c: 2,
    why: "Singing and dancing are both among Festus's stated hobbies."
  },
  {
    q: "Which two values does Festus particularly appreciate?",
    a: ["Fame and popularity", "Honesty and loyalty", "Wealth and status", "Competition and victory"],
    c: 1,
    why: "Festus has specifically named honesty and loyalty."
  },
  {
    q: "Festus says he would rather have which of these?",
    a: ["A beautiful lie", "An easy excuse", "The truth", "A flattering rumour"],
    c: 2,
    why: "His stated philosophy is that he would rather have the truth than a beautiful lie."
  },
  {
    q: "What kind of things does Festus say he notices?",
    a: ["Only expensive things", "Little details others may miss", "Only major celebrations", "Only fashionable things"],
    c: 1,
    why: "Festus describes himself as someone who notices little things."
  },
  {
    q: "Which natural subject is among Festus's interests?",
    a: ["Nature", "Deep-sea engineering", "Space mining", "Volcanology"],
    c: 0,
    why: "Festus has mentioned that he loves nature."
  },
  {
    q: "How does Festus describe his personality in his introduction?",
    a: ["Quiet in every situation", "Small in height, big in personality", "Serious and formal", "Shy and mysterious"],
    c: 1,
    why: "That is the wording of Festus's own introduction."
  },
  {
    q: "What is the main purpose of A Little Place for You?",
    a: ["To sell products", "To host competitive tournaments", "To offer warmth, fun, memories and comfort", "To publish news"],
    c: 2,
    why: "The website is intended as a welcoming place to laugh, breathe, remember and feel cared for."
  },
  {
    q: "Which statement best reflects Festus's idea of loyalty?",
    a: ["Being present only when life is easy", "Agreeing with everything", "Being there when life gets complicated", "Never having disagreements"],
    c: 2,
    why: "Festus describes loyalty as being there for each other when life gets complicated."
  },
  {
    q: "A friend tells Festus something difficult. Which response best matches his stated values?",
    a: ["Tell them what they want to hear, even if it is false", "Listen honestly and treat them with loyalty", "Ignore them until they feel better", "Turn it into a public joke"],
    c: 1,
    why: "Honesty, loyalty and making people feel comfortable are central to the website's message."
  },
  {
    q: "Which combination is entirely consistent with Festus's known interests?",
    a: ["Pasta, Afrobeats, singing and dancing", "Pizza, country music, chess and boxing", "Rice, opera, painting and cycling", "Burgers, jazz, fishing and golf"],
    c: 0,
    why: "All four details in that combination match facts Festus has shared."
  },
  {
    q: "Someone assumes Festus only cares about grand gestures. Which known detail challenges that assumption?",
    a: ["He notices little things", "He dislikes music", "He avoids nature", "He values popularity above honesty"],
    c: 0,
    why: "Festus has said he notices little things and appreciates what makes ordinary days memorable."
  },
  {
    q: "Which is the most accurate description of the tone Festus wants for this website?",
    a: ["Cold and corporate", "Competitive and intimidating", "Playful, caring and welcoming", "Strictly educational"],
    c: 2,
    why: "The intended personality is playful, gentle, funny and caring."
  },
  {
    q: "A visitor is having a difficult day. Which idea most closely matches why Festus created this website?",
    a: ["Make them prove they are happy", "Give them a place to feel welcome without pressure", "Ask them to compete for attention", "Tell them to hide their feelings"],
    c: 1,
    why: "The website is meant to be a place where people can feel appreciated and comfortable without pressure."
  }
];

const facts = [
  { text: "Festus's favourite food is pasta.", yes: true },
  { text: "Festus enjoys Afrobeats.", yes: true },
  { text: "Festus's stated hobbies include singing and dancing.", yes: true },
  { text: "Festus has said that he values honesty and loyalty.", yes: true },
  { text: "Festus has said he loves nature.", yes: true },
  { text: "Festus said he would rather have a beautiful lie than the truth.", yes: false },
  { text: "Festus describes himself as small in height and big in personality.", yes: true },
  { text: "Festus has described himself as someone who notices little things.", yes: true }
];

const challenges = [
  "Describe your day using only three emojis.",
  "Give someone a genuine compliment today.",
  "Find something beautiful around you and take a moment to appreciate it.",
  "Make up a ridiculous name for an imaginary restaurant.",
  "Send someone a message that might make them smile.",
  "Name five things that made you smile recently.",
  "Try to go one minute without checking your phone.",
  "Make up a two-line song about your current mood."
];

const awards = [
  ["CEO of Making People Laugh", "For bringing laughter wherever you go."],
  ["Professional Overthinker", "For thinking about a thought inside another thought."],
  ["Golden Heart Award", "For showing kindness when it matters."],
  ["Main Character Energy", "For making ordinary moments memorable."],
  ["Chief Memory Keeper", "For holding on to the little moments."],
  ["Certified Good Vibes", "For bringing a little sunshine along."]
];

const choices = [
  ["A quiet evening with music", "A spontaneous adventure"],
  ["Unlimited pasta", "Unlimited concert tickets"],
  ["A perfect memory", "A surprise holiday"],
  ["Rainy afternoons", "Golden sunsets"],
  ["A funny voice note", "A thoughtful handwritten letter"]
];

const story = [
  {
    title: "The Mysterious Envelope",
    text: "You find a little envelope on your doorstep. Your name is written on it. What do you do?",
    options: ["Open it immediately", "Look around first"],
    next: [1, 2]
  },
  {
    title: "A Little Surprise",
    text: "Inside is a note inviting you to a secret picnic. There is a small map attached. Do you follow it?",
    options: ["Follow the map", "Keep the note as a memory"],
    next: [3, 4]
  },
  {
    title: "A Curious Discovery",
    text: "You notice a tiny flower beside the envelope. Someone has left a kind message. What now?",
    options: ["Take the flower", "Leave a kind note for someone else"],
    next: [4, 5]
  },
  {
    title: "The Picnic",
    text: "You arrive at a beautiful spot. There is pasta, music and a handwritten note. What do you choose first?",
    options: ["Enjoy the food", "Read the note"],
    next: [6, 6]
  },
  {
    title: "A Keepsake",
    text: "You decide to keep this little moment. What would make it special?",
    options: ["A photograph", "A written memory"],
    next: [6, 6]
  },
  {
    title: "Passing It On",
    text: "Your kind note makes somebody smile. What a lovely little chain reaction.",
    options: ["Continue the adventure", "Finish my story"],
    next: [6, 6]
  },
  {
    title: "The End — For Now",
    text: "The day ends with a happy little memory. Sometimes the smallest surprises become the sweetest stories.",
    options: ["Read the story again", "Return to the games"],
    next: [0, -1]
  }
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function FestusQuiz() {
  const [round, setRound] = useState(() => shuffle(questions).slice(0, 10));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const current = round[index];

  function choose(option) {
    if (answer !== null) return;
    setAnswer(option);
    if (option === current.c) setScore(s => s + 1);
    setShowWhy(true);
  }

  function next() {
    if (index === round.length - 1) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setAnswer(null);
      setShowWhy(false);
    }
  }

  function restart() {
    setRound(shuffle(questions).slice(0, 10));
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setFinished(false);
    setShowWhy(false);
  }

  return (
    <div className="interactive-panel quiz-engine">
      <div className="interactive-heading">
        <span className="eyebrow">THE KNOW-ME CHALLENGE</span>
        <h2>How well do you <em>know Festus?</em></h2>
        <p>Ten questions. Four choices. No asking Festus for hints. 😂</p>
      </div>

      {finished ? (
        <div className="game-result">
          <Trophy size={38} />
          <span className="eyebrow">YOUR FINAL SCORE</span>
          <h2>{score} / {round.length}</h2>
          <p>
            {score === 10 ? "Incredible! You know your Festus facts inside out." :
             score >= 8 ? "Very impressive. You have been paying attention!" :
             score >= 5 ? "Not bad! There are still a few things to discover." :
             "Aww, there's more to learn. Time for another round!"}
          </p>
          <button className="primary-button" onClick={restart}>
            Play another round <RotateCcw size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-progress-row">
            <span>QUESTION {index + 1} OF {round.length}</span>
            <span>SCORE: {score}</span>
          </div>
          <div className="quiz-progress"><span style={{ width: `${((index + 1) / round.length) * 100}%` }} /></div>
          <h3 className="quiz-question-title">{current.q}</h3>
          <div className="quiz-options">
            {current.a.map((option, i) => (
              <button
                key={option}
                className={`quiz-option ${answer === i ? (i === current.c ? "right" : "wrong") : ""} ${answer !== null && i === current.c ? "right" : ""}`}
                disabled={answer !== null}
                onClick={() => choose(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>{option}
                {answer !== null && i === current.c && <Check size={17} />}
                {answer === i && i !== current.c && <X size={17} />}
              </button>
            ))}
          </div>
          {showWhy && (
            <div className="quiz-explanation">
              <strong>{answer === current.c ? "You got it!" : "Not quite!"}</strong>
              <p>{current.why}</p>
              <button className="primary-button" onClick={next}>
                {index === round.length - 1 ? "See my result" : "Next question"} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function FunRoom() {
  const [game, setGame] = useState("");
  const [award, setAward] = useState(null);
  const [thisOrThat, setThisOrThat] = useState(0);
  const [thatAnswer, setThatAnswer] = useState("");
  const [factIndex, setFactIndex] = useState(0);
  const [factAnswer, setFactAnswer] = useState(null);
  const [wheelResult, setWheelResult] = useState("");
  const [wheelCount, setWheelCount] = useState(0);
  const [challenge, setChallenge] = useState("");
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [gift, setGift] = useState(-1);
  const [matched, setMatched] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [memoryDeck, setMemoryDeck] = useState(() => shuffle(["🌸","🌸","🌙","🌙","⭐","⭐","🦋","🦋","💛","💛","🍀","🍀"]));

  function resetMatch() {
    setMemoryDeck(shuffle(["🌸","🌸","🌙","🌙","⭐","⭐","🦋","🦋","💛","💛","🍀","🍀"]));
    setMatched([]);
    setFlipped([]);
    setMoves(0);
  }

  function flipCard(i) {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (memoryDeck[next[0]] === memoryDeck[next[1]]) {
        setMatched(m => [...m, ...next]);
        setFlipped([]);
      } else {
        window.setTimeout(() => setFlipped([]), 850);
      }
    }
  }

  function openGame(id) {
    setGame(id);
    setAward(null);
    setThatAnswer("");
    setFactAnswer(null);
    setWheelResult("");
    setChallenge("");
    setGift(-1);
  }

  const gameCards = [
    [ "match", "Memory Match", "Find all six matching pairs.", Brain ],
    [ "choice", "This or That", "Choose between two little dilemmas.", Shuffle ],
    [ "fact", "Guess the Fact", "Can you separate fact from fiction?", Lightbulb ],
    [ "wheel", "Surprise Wheel", "Let chance choose your next surprise.", Sparkles ],
    [ "challenge", "Funny Challenges", "Try a random little challenge.", Star ],
    [ "story", "Choose Your Adventure", "Your choices shape a tiny story.", Heart ],
    [ "gift", "Mystery Gift Boxes", "Open a box and discover what's inside.", Gift ],
    [ "awards", "Friendship Awards", "Reveal a funny friendship award.", Award ]
  ];

  function back() {
    setGame("");
    setAward(null);
  }

  return (
    <div className="fun-engine">
      {game === "" ? (
        <>
          <div className="interactive-heading">
            <span className="eyebrow">PICK YOUR LITTLE DISTRACTION</span>
            <h2>The games are <em>ready.</em></h2>
            <p>Choose something to play. No serious business allowed here.</p>
          </div>
          <div className="game-launch-grid">
            {gameCards.map(([id, title, desc, Icon]) => (
              <button className="game-launch-card" key={id} onClick={() => openGame(id)}>
                <Icon size={25} />
                <strong>{title}</strong>
                <span>{desc}</span>
                <small>PLAY NOW <ArrowRight size={13} /></small>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="interactive-panel active-game">
          <button className="back-link" onClick={back}><ArrowLeft size={15} /> All games</button>

          {game === "match" && (
            <>
              <span className="eyebrow">MEMORY MATCH</span>
              <h2>Find the matching pairs.</h2>
              <p>Moves: {moves} · Pairs: {matched.length / 2} / 6</p>
              <div className="match-grid">
                {memoryDeck.map((emoji, i) => (
                  <button key={i} className={`match-card ${matched.includes(i) ? "matched" : ""}`}
                    onClick={() => flipCard(i)} disabled={matched.includes(i) || flipped.includes(i) || flipped.length === 2}>
                    {matched.includes(i) || flipped.includes(i) ? emoji : "?"}
                  </button>
                ))}
              </div>
              {matched.length === memoryDeck.length && (
                <div className="game-result"><Trophy /><h3>You matched them all!</h3><p>You finished in {moves} moves.</p></div>
              )}
              <button className="secondary-button" onClick={resetMatch}>Restart game</button>
            </>
          )}

          {game === "choice" && (
            <>
              <span className="eyebrow">THIS OR THAT</span>
              <h2>Which would you choose?</h2>
              <p>Question {thisOrThat + 1} of {choices.length}</p>
              <div className="this-that-grid">
                {choices[thisOrThat].map(option => (
                  <button key={option} className={`this-that-option ${thatAnswer === option ? "selected" : ""}`}
                    onClick={() => setThatAnswer(option)}>{option}</button>
                ))}
              </div>
              {thatAnswer && (
                <div className="quiz-explanation">
                  <p>Interesting choice! There's no wrong answer here. 😂</p>
                  <button className="primary-button" onClick={() => {
                    setThisOrThat((thisOrThat + 1) % choices.length);
                    setThatAnswer("");
                  }}>Next choice <ArrowRight size={15} /></button>
                </div>
              )}
            </>
          )}

          {game === "fact" && (
            <>
              <span className="eyebrow">FACT OR FICTION?</span>
              <h2>Guess the fact.</h2>
              <p>{facts[factIndex].text}</p>
              {factAnswer === null ? (
                <div className="this-that-grid">
                  <button className="this-that-option" onClick={() => setFactAnswer(true)}>That's true</button>
                  <button className="this-that-option" onClick={() => setFactAnswer(false)}>That's false</button>
                </div>
              ) : (
                <div className="quiz-explanation">
                  <strong>{factAnswer === facts[factIndex].yes ? "You got it!" : "Not quite!"}</strong>
                  <p>This statement is {facts[factIndex].yes ? "true" : "false"}.</p>
                  <button className="primary-button" onClick={() => {
                    setFactIndex((factIndex + 1) % facts.length);
                    setFactAnswer(null);
                  }}>Next fact <ArrowRight size={15} /></button>
                </div>
              )}
            </>
          )}

          {game === "wheel" && (
            <>
              <span className="eyebrow">THE SURPRISE WHEEL</span>
              <div className={`wheel-disc ${wheelCount ? "wheel-spin" : ""}`}>✦</div>
              <h2>{wheelResult || "What will the wheel choose?"}</h2>
              <p>Spins: {wheelCount}</p>
              <button className="primary-button" onClick={() => {
                const items = ["Send someone a kind message.", "Take a little break.", "Find something that makes you laugh.", "Remember a happy moment.", "Give yourself a compliment.", "Play another game.", "Drink a glass of water.", "Enjoy your favourite song."];
                setWheelResult(items[Math.floor(Math.random() * items.length)]);
                setWheelCount(c => c + 1);
              }}>SPIN THE WHEEL <RotateCcw size={16} /></button>
            </>
          )}

          {game === "challenge" && (
            <>
              <span className="eyebrow">YOUR LITTLE CHALLENGE</span>
              <h2>Ready for something silly?</h2>
              <p>{challenge || "Generate a challenge and see what you get."}</p>
              <button className="primary-button" onClick={() => setChallenge(challenges[Math.floor(Math.random() * challenges.length)])}>Give me a challenge <Sparkles size={16} /></button>
              {challenge && <button className="secondary-button" onClick={() => setCompletedChallenges(c => [...c, challenge])}>Mark as completed <Check size={16} /></button>}
              <p>Challenges completed: {completedChallenges.length}</p>
            </>
          )}

          {game === "story" && (
            <>
              <span className="eyebrow">A TINY INTERACTIVE STORY</span>
              <h2>{story[storyIndex].title}</h2>
              <p>{story[storyIndex].text}</p>
              <div className="this-that-grid">
                {story[storyIndex].options.map((option, i) => (
                  <button key={option} className="this-that-option" onClick={() => {
                    const next = story[storyIndex].next[i];
                    if (next === -1) back();
                    else setStoryIndex(next);
                  }}>{option}</button>
                ))}
              </div>
              <button className="secondary-button" onClick={() => setStoryIndex(0)}>Restart story</button>
            </>
          )}

          {game === "gift" && (
            <>
              <span className="eyebrow">A LITTLE MYSTERY</span>
              <h2>Choose a gift box.</h2>
              <p>Each box hides a different surprise. Choose carefully... or don't. 😂</p>
              <div className="gift-grid">
                {["🎁","🎀","💝"].map((box, i) => (
                  <button key={i} className="gift-box" onClick={() => setGift(i)}>{gift === i ? ["💛","🌟","🌸"][i] : box}</button>
                ))}
              </div>
              {gift !== -1 && <div className="quiz-explanation"><strong>Your surprise:</strong><p>{["You deserve a little happiness today.","A reminder that someone is glad you exist.","A tiny wish for a beautiful day ahead."][gift]}</p></div>}
            </>
          )}

          {game === "awards" && (
            <>
              <span className="eyebrow">THE FRIENDSHIP AWARDS</span>
              <Trophy size={38} />
              <h2>{award ? award[0] : "Who deserves an award?"}</h2>
              <p>{award ? award[1] : "Generate a completely unofficial award for someone special."}</p>
              <button className="primary-button" onClick={() => setAward(awards[Math.floor(Math.random() * awards.length)])}>
                {award ? "Give me another award" : "Reveal an award"} <Award size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
