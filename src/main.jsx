import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Heart, Home, UserRound, Sparkles, Images, Mail, Moon,
  Music2, Volume2, VolumeX, ArrowRight, ArrowLeft,
  Sun, CloudRain, Cloud, Waves, Coffee, Wind, Camera,
  Mic, Lock, Send, Menu, X, Star, Gift, Clock,
  BookHeart, Smile, ChevronRight, Check, Upload,
  MessageCircle, Trophy, Gamepad2, Leaf, ShieldCheck
} from "lucide-react";
import "./index.css";
import { FestusQuiz, FunRoom } from "./interactive.jsx";
import { MemoriesStudio } from "./memories.jsx";

const sections = [
  { id: "home", label: "Welcome", icon: Home },
  { id: "festus", label: "My World", icon: UserRound },
  { id: "comfort", label: "A Little Comfort", icon: Heart },
  { id: "fun", label: "Fun Room", icon: Sparkles },
  { id: "memories", label: "Little Memories", icon: Images },
  { id: "inbox", label: "The Little Inbox", icon: Mail },
  { id: "peace", label: "Peaceful Corner", icon: Moon }
];

const envelopes = [
  "Something I've Always Wanted to Tell You",
  "Our Funniest Moments",
  "A Memory I Will Never Forget",
  "Something I Appreciate About You",
  "Ask Festus Anything",
  "Something Embarrassing",
  "My Little Life Update",
  "Things We Should Do Someday",
  "A Voice Message for You",
  "Something Else on My Mind"
];

const moods = [
  { id: "sad", label: "I'm feeling sad", icon: CloudRain },
  { id: "lonely", label: "I feel lonely", icon: Cloud },
  { id: "overwhelmed", label: "Everything is a lot", icon: Waves },
  { id: "bored", label: "I'm bored", icon: Coffee },
  { id: "happy", label: "I'm feeling happy", icon: Sun }
];

const messages = {
  sad: "You don't have to pretend to be okay around me. Even on your worst days, you deserve someone who listens. Be gentle with yourself today.",
  lonely: "Even if we don't talk every day, it doesn't mean I stopped caring. You matter, including on the quiet days.",
  overwhelmed: "One thing at a time. You don't have to solve your entire life before bedtime. Take a breath. You are allowed to pause.",
  bored: "If life isn't entertaining you today, perhaps it's time for a little harmless chaos. Let's find something fun!",
  happy: "I hope you get a thousand little reasons to smile today. Keep that beautiful energy going!"
};

const surprises = [
  "You are someone's favourite notification. Please behave accordingly.",
  "If overthinking was an Olympic sport, I know some people who would bring home gold. Please rest.",
  "You don't have to be productive every second. You're a human being, not a rechargeable generator.",
  "Please don't let one bad day convince you that your whole life is a Nollywood tragedy.",
  "Your presence makes ordinary moments a little more interesting. Don't forget that.",
  "A reminder from Festus: drink some water. Yes, this is your official notification."
];

function App() {
  const [page, setPage] = useState("home");
  const [visitorName, setVisitorName] = useState(
    () => localStorage.getItem("littlePlaceVisitorName") || ""
  );
  const [nameInput, setNameInput] = useState("");
  const [showName, setShowName] = useState(
    () => !localStorage.getItem("littlePlaceVisitorName")
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const [musicVolume, setMusicVolume] = useState(0.45);
  const ambientRef = useRef(null);
  const [ambientMode, setAmbientMode] = useState("");
  const [ambientVolume, setAmbientVolume] = useState(0.22);
  const [showMusicPrompt, setShowMusicPrompt] = useState(
    () => !localStorage.getItem("littlePlaceMusicChoice")
  );
  const [mood, setMood] = useState("sad");
  const [surprise, setSurprise] = useState("");
  const [selectedEnvelope, setSelectedEnvelope] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [breathing, setBreathing] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    document.title = "A Little Place for You — From Festus, with love.";
  }, []);

  function saveName(e) {
    e.preventDefault();
    const clean = nameInput.trim();
    if (!clean) return;
    localStorage.setItem("littlePlaceVisitorName", clean);
    setVisitorName(clean);
    setShowName(false);
  }

  function stopAmbient() {
    const current = ambientRef.current;
    if (current) {
      current.sources.forEach(source => {
        try { source.stop(); } catch (_) {}
      });
      try { current.ctx.close(); } catch (_) {}
      ambientRef.current = null;
    }
    setAmbientMode("");
  }

  function startAmbient(mode) {
    if (ambientMode === mode) {
      stopAmbient();
      return;
    }

    stopAmbient();

    const music = audioRef.current;
    if (music) {
      music.pause();
      setMusicOn(false);
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setSubmissionNotice("Your browser does not support these audio sounds.");
      return;
    }

    try {
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.value = ambientVolume;
      master.connect(ctx.destination);

      const sources = [];

      if (mode === "rain" || mode === "ocean") {
        const length = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        const soundGain = ctx.createGain();

        if (mode === "rain") {
          filter.type = "highpass";
          filter.frequency.value = 650;
          soundGain.gain.value = 0.42;
        } else {
          filter.type = "lowpass";
          filter.frequency.value = 520;
          soundGain.gain.value = 0.30;

          const wave = ctx.createOscillator();
          const waveDepth = ctx.createGain();
          wave.type = "sine";
          wave.frequency.value = 0.085;
          waveDepth.gain.value = 0.16;
          wave.connect(waveDepth);
          waveDepth.connect(soundGain.gain);
          wave.start();
          sources.push(wave);
        }

        noise.connect(filter);
        filter.connect(soundGain);
        soundGain.connect(master);
        noise.start();
        sources.push(noise);
      } else if (mode.startsWith("tone-")) {
        const frequency = Number(mode.slice(5));
        const tone = ctx.createOscillator();
        const toneGain = ctx.createGain();

        tone.type = "sine";
        tone.frequency.value = frequency;
        toneGain.gain.value = 0.12;

        tone.connect(toneGain);
        toneGain.connect(master);
        tone.start();
        sources.push(tone);
      }

      ambientRef.current = { ctx, sources, master };
      ctx.resume();
      setAmbientMode(mode);
      setSubmissionNotice("");
    } catch (error) {
      console.error("Ambient audio error:", error);
      setSubmissionNotice("That sound could not start. Please try again.");
    }
  }

  function changeAmbientVolume(e) {
    const volume = Number(e.target.value);
    setAmbientVolume(volume);
    if (ambientRef.current) {
      ambientRef.current.master.gain.value = volume;
    }
  }

  function startMusic() {
    stopAmbient();
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = musicVolume;
    audio.play().then(() => {
      setMusicOn(true);
      setShowMusicPrompt(false);
      localStorage.setItem("littlePlaceMusicChoice", "yes");
      setSubmissionNotice("");
    }).catch(() => {
      setSubmissionNotice("Music could not start. Please try the music control.");
    });
  }

  function skipMusic() {
    localStorage.setItem("littlePlaceMusicChoice", "no");
    setShowMusicPrompt(false);
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      stopAmbient();
      audio.volume = musicVolume;
      audio.play().then(() => {
        setMusicOn(true);
        setSubmissionNotice("");
      }).catch(() => {
        setSubmissionNotice("Music could not start. Please try again.");
      });
    } else {
      audio.pause();
      setMusicOn(false);
    }
  }

  function changeMusicVolume(e) {
    const volume = Number(e.target.value);
    setMusicVolume(volume);
    if (audioRef.current) audioRef.current.volume = volume;
  }

  function changeName() {
    setNameInput(visitorName);
    setShowName(true);
  }

  function navigate(id) {
    setPage(id);
    setMenuOpen(false);
    setSelectedEnvelope("");
    setSubmissionNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function revealSurprise() {
    const item = surprises[Math.floor(Math.random() * surprises.length)];
    setSurprise(item);
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSubmissionNotice("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmissionNotice("Please choose an image smaller than 5 MB.");
      return;
    }
    setPhotoPreview(file.name);
  }

  const activeSection = sections.find(s => s.id === page);
  const greeting = visitorName ? `Welcome, ${visitorName}.` : "I'm glad you're here.";

  return (
    <div className="site-shell">
      <div className="anime-background" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src="/videos/anime-background.mp4" type="video/mp4" />
        </video>
        <div className="anime-background-overlay" />
      </div>

      <audio ref={audioRef} src="/audio/runaway.mp3" loop preload="metadata" />

      <header className="topbar">
        <button className="brand" onClick={() => navigate("home")}>
          <span className="brand-mark"><Heart size={17} /></span>
          <span>
            <strong>A Little Place for You</strong>
            <small>FROM FESTUS, WITH LOVE.</small>
          </span>
        </button>

        <nav className="desktop-nav">
          {sections.map(s => (
            <button key={s.id}
              className={page === s.id ? "nav-link active" : "nav-link"}
              onClick={() => navigate(s.id)}>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <button className="icon-button" title="Change your name" onClick={changeName}>
            <UserRound size={17} />
          </button>
          <button className="icon-button mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav">
          {sections.map(s => (
            <button key={s.id} onClick={() => navigate(s.id)}>
              <s.icon size={17} /> {s.label}
            </button>
          ))}
        </nav>
      )}

      <main>
        {page === "home" && (
          <section className="welcome-page">
            <div className="hero-video-wrap">
              <video className="hero-video" autoPlay muted loop playsInline
                poster="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85">
                <source src="/videos/welcome.mp4" type="video/mp4" />
              </video>
              <div className="hero-overlay" />
              <div className="hero-content">
                <span className="eyebrow"><span /> A LITTLE CORNER OF THE INTERNET</span>
                <p className="hero-greeting">{greeting}</p>
                <h1>A little place<br /><em>for you.</em></h1>
                <p className="hero-description">
                  A place to laugh, breathe, remember, explore and simply be yourself.
                  No pressure. No expectations. Just a little warmth.
                </p>
                <button className="primary-button" onClick={() => navigate("comfort")}>
                  Explore your little place <ArrowRight size={17} />
                </button>
                <div className="hero-signature">From Festus, with love <Heart size={13} /></div>
              </div>
              <div className="hero-bottom-note">
                <span>TAKE YOUR TIME</span><span className="scroll-line" /><span>SCROLL TO EXPLORE</span>
              </div>
            </div>

            <section className="welcome-intro content-width">
              <span className="eyebrow">YOU'RE RIGHT WHERE YOU NEED TO BE</span>
              <h2>Not every day has to be extraordinary.</h2>
              <p>Sometimes, all you need is a little laugh, a kind word, a familiar memory
                or somewhere to breathe. That's what this place is for.</p>
              <div className="welcome-tiles">
                {[
                  ["My World", "A little introduction to the person behind this place.", UserRound, "festus"],
                  ["Find Comfort", "A gentle reminder that you matter.", Heart, "comfort"],
                  ["Have Some Fun", "Because life needs a little silliness.", Sparkles, "fun"]
                ].map(([title, desc, Icon, id]) => (
                  <button className="welcome-tile" key={id} onClick={() => navigate(id)}>
                    <Icon size={22} /><strong>{title}</strong><span>{desc}</span>
                    <ArrowRight size={16} className="tile-arrow" />
                  </button>
                ))}
              </div>
            </section>
          </section>
        )}

        {page === "festus" && (
          <section className="page-section content-width">
            <PageHeading eyebrow="THE PERSON BEHIND THIS LITTLE PLACE"
              title={<>A little about <em>me.</em></>}
              description="Well, since you're here, we might as well get acquainted." />
            <div className="about-layout">
              <div className="about-photo">
                <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85"
                  alt="Golden sunrise over a peaceful landscape" />
                <span className="photo-caption">A little sunshine, a little chaos.</span>
              </div>
              <div className="about-copy">
                <span className="eyebrow">HELLO, I'M FESTUS</span>
                <h2>Small in height.<br /><em>BIG in personality.</em></h2>
                <p>I'm funny, playful and probably noticing something nobody else noticed.
                  I love the little things that make ordinary days memorable.</p>
                <p>This website is my way of creating a place where the people I care about
                  can feel appreciated, comfortable and welcome.</p>
                <div className="signature">Festus <Heart size={16} /></div>
              </div>
            </div>
            <div className="section-label"><span>THE LITTLE DETAILS</span></div>
            <div className="fact-grid">
              <Fact icon="🍝" label="Favourite food" value="Pasta" />
              <Fact icon="🎶" label="Music" value="Afrobeats" />
              <Fact icon="🎤" label="Hobbies" value="Singing & dancing" />
              <Fact icon="🌿" label="Little things" value="Nature & details" />
              <Fact icon="🤍" label="I value" value="Honesty & loyalty" />
              <Fact icon="✨" label="Personality" value="Funny & playful" />
            </div>
            <div className="quote-panel">
              <span className="eyebrow">A LITTLE PHILOSOPHY</span>
              <h2>"I'd rather have the truth than a beautiful lie."</h2>
              <p>Honesty and loyalty mean a lot to me. Being there for each other
                matters, especially when life gets complicated.</p>
            </div>
            <FestusQuiz />
          </section>
        )}

        {page === "comfort" && (
          <section className="page-section content-width">
            <PageHeading eyebrow="A SOFTER CORNER"
              title={<>How are you, <em>really?</em></>}
              description="You don't have to pretend here. Choose what feels closest to how you're feeling." />
            <div className="mood-grid">
              {moods.map(m => <button key={m.id}
                className={mood === m.id ? "mood-card selected" : "mood-card"}
                onClick={() => setMood(m.id)}>
                <m.icon size={23} /><span>{m.label}</span>
                {mood === m.id && <Check size={16} />}
              </button>)}
            </div>
            <div className="comfort-message">
              <span className="eyebrow">A LITTLE NOTE FOR YOU</span>
              <Heart className="message-heart" size={25} />
              <p>{messages[mood]}</p>
              <span className="message-sign">— Festus</span>
            </div>
            <div className="comfort-grid">
              <FeatureCard icon={Mail} title="Open When..."
                description="Little letters for the days when you need them."
                onClick={() => navigate("inbox")} />
              <FeatureCard icon={Wind} title="Take a moment"
                description="Slow down with a gentle breathing exercise."
                onClick={() => navigate("peace")} />
              <FeatureCard icon={Star} title="Tiny victories"
                description="Small wins deserve to be celebrated too." />
              <FeatureCard icon={Gift} title="A virtual hug"
                description="Sending you the warmest, biggest virtual hug."
                onClick={() => setSurprise("Consider this your very big virtual hug. 🫂")} />
            </div>
            {surprise && <div className="inline-surprise">{surprise}
              <button onClick={() => setSurprise("")}>Close</button></div>}
          </section>
        )}

        {page === "fun" && (
          <section className="page-section content-width">
            <PageHeading eyebrow="A LITTLE LESS SERIOUS"
              title={<>Welcome to the <em>Fun Room.</em></>}
              description="Your responsibilities can wait for five minutes. Probably." />
            <FunRoom />
          </section>
        )}

        {page === "memories" && (
          <section className="page-section content-width">
            <PageHeading eyebrow="THE MOMENTS THAT STAY"
              title={<>Little <em>Memories.</em></>}
              description="Some moments deserve to stay a little longer." />
            <div className="memory-banner">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1500&q=85"
                alt="Beautiful mountain lake" />
              <div><span className="eyebrow">A PLACE FOR THE GOOD TIMES</span>
                <h2>Remember this?</h2><p>Your favourite moments, funny stories and photographs will live here.</p></div>
            </div>
            <MemoriesStudio />
          </section>
        )}

        {page === "inbox" && (
          <section className="page-section content-width">
            <PageHeading eyebrow="A PRIVATE LITTLE CORNER"
              title={<>The Little <em>Inbox.</em></>}
              description="Some things are easier to share when there's a little space to say them. This is yours." />
            {!selectedEnvelope ? (
              <>
                <div className="privacy-note"><Lock size={19} />
                  <div><strong>Your message is personal.</strong>
                    <span>Your name is required. Submissions are intended for Festus only.
                      They will not appear on the public website.</span></div>
                </div>
                <div className="envelope-grid">
                  {envelopes.map((e, i) => <button key={e}
                    className="envelope-card" onClick={() => {
                      setSelectedEnvelope(e); setSubmissionNotice(""); setPhotoPreview("");
                    }}>
                    <span className="envelope-number">{String(i + 1).padStart(2, "0")}</span>
                    <Mail size={23} /><strong>{e}</strong>
                    <span className="envelope-open">Open envelope <ArrowRight size={14} /></span>
                  </button>)}
                </div>
              </>
            ) : (
              <div className="submission-card">
                <button className="back-link" onClick={() => setSelectedEnvelope("")}>
                  <ArrowLeft size={15} /> All envelopes
                </button>
                <span className="eyebrow">YOUR LITTLE MESSAGE</span>
                <h2>{selectedEnvelope}</h2>
                <form onSubmit={e => {
                  e.preventDefault();
                  setSubmissionNotice("This is a front-end preview. Your message has NOT been sent. We'll connect secure private delivery before launch.");
                }}>
                  <label>Your name</label>
                  <input value={visitorName} readOnly required />
                  <small className="field-help">Using the name you already introduced yourself with.</small>
                  <label>Your message</label>
                  <textarea required rows="6" placeholder="Take your time. Write whatever you'd like to share..." />
                  <label className="upload-label"><Camera size={17} /> Add a photograph (optional)
                    <input type="file" accept="image/*" onChange={handlePhoto} />
                  </label>
                  {photoPreview && <p className="field-help">Selected: {photoPreview}</p>}
                  <label className="upload-label"><Mic size={17} /> Add a voice message (optional)
                    <input type="file" accept="audio/*" />
                  </label>
                  <p className="field-help">Please don't include passwords, addresses or highly sensitive information.</p>
                  <button className="primary-button" type="submit">Preview submission <ArrowRight size={16} /></button>
                  {submissionNotice && <div className="notice-box"><ShieldCheck size={18} />{submissionNotice}</div>}
                </form>
              </div>
            )}
          </section>
        )}

        {page === "peace" && (
          <section className="page-section content-width peaceful-page">
            <PageHeading eyebrow="A QUIETER CORNER"
              title={<>Let the world <em>slow down.</em></>}
              description="There's nowhere you need to rush to right now. Take a little moment for yourself." />
            <div className="peace-hero">
              <img src="https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1600&q=85"
                alt="Peaceful night sky" />
              <div className="peace-overlay">
                <Moon size={29} />
                <h2>You are allowed to pause.</h2>
                <p>Rest is not a reward. You deserve it, too.</p>
              </div>
            </div>
            <div className="breathing-card">
              <span className="eyebrow">A GENTLE BREATHING MOMENT</span>
              <div className={breathing ? "breath-circle breathing" : "breath-circle"}>
                <Wind size={27} />
              </div>
              <h2>{breathing ? "Breathe gently..." : "Ready for a little pause?"}</h2>
              <p>Follow a comfortable, gentle breathing rhythm. No forced breath holds.
                Stop whenever you want.</p>
              <button className="secondary-button" onClick={() => setBreathing(!breathing)}>
                {breathing ? "Pause exercise" : "Begin breathing exercise"}
              </button>
            </div>
            <div className="section-label"><span>CHOOSE YOUR ATMOSPHERE</span></div>

            <div className="quiet-reminder">
              <strong>A little note before you listen</strong>
              <p>Find a quiet, comfortable place if you can. Lower the volume, put distractions aside and listen gently. You can stop whenever you wish.</p>
            </div>

            <div className="sound-grid">
              <button type="button"
                className={ambientMode === "rain" ? "sound-card sound-choice active" : "sound-card sound-choice"}
                onClick={() => startAmbient("rain")}>
                <CloudRain size={22} />
                <span>Gentle Rain</span>
                <small>{ambientMode === "rain" ? "Playing · Tap to stop" : "Soft rainfall ambience"}</small>
              </button>

              <button type="button"
                className={ambientMode === "ocean" ? "sound-card sound-choice active" : "sound-card sound-choice"}
                onClick={() => startAmbient("ocean")}>
                <Waves size={22} />
                <span>Ocean Waves</span>
                <small>{ambientMode === "ocean" ? "Playing · Tap to stop" : "Slow, rolling wave ambience"}</small>
              </button>
            </div>

            <div className="frequency-heading">
              <span className="eyebrow">OPTIONAL AMBIENT TONES</span>
              <h3>Explore gentle frequencies</h3>
              <p>These are simple sound tones, not scientifically established healing frequencies. Keep them quiet and choose what feels comfortable.</p>
            </div>

            <div className="frequency-grid">
              {[
                { hz: 174, note: "Low ambient tone" },
                { hz: 285, note: "Soft ambient tone" },
                { hz: 396, note: "Gentle ambient tone" },
                { hz: 432, note: "Popular tuning tone" },
                { hz: 528, note: "Popular ambient tone" }
              ].map(item => (
                <button type="button" key={item.hz}
                  className={ambientMode === `tone-${item.hz}` ? "frequency-card active" : "frequency-card"}
                  onClick={() => startAmbient(`tone-${item.hz}`)}>
                  <strong>{item.hz} <small>Hz</small></strong>
                  <span>{item.note}</span>
                  <small>{ambientMode === `tone-${item.hz}` ? "Playing · Tap to stop" : "Tap to listen"}</small>
                </button>
              ))}
            </div>

            <div className="ambient-volume">
              <label htmlFor="ambient-volume">Relaxation sound volume</label>
              <input id="ambient-volume" type="range" min="0" max="0.5" step="0.01"
                value={ambientVolume} onChange={changeAmbientVolume} />
              <span>{Math.round(ambientVolume * 100)}%</span>
              <button type="button" className="secondary-button" onClick={stopAmbient}
                disabled={!ambientMode}>
                Stop relaxation sound
              </button>
            </div>
            <div className="quote-panel"><h2>"You are not a burden for needing someone. Sometimes, we all need somewhere to rest."</h2><p>— Festus</p></div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-heart"><Heart size={20} /></div>
        <h2>A little place for you.</h2>
        <p>Made with care, from Festus to you.</p>
        <div className="footer-links">
          {sections.map(s => <button key={s.id} onClick={() => navigate(s.id)}>{s.label}</button>)}
        </div>
        <span className="copyright">YOU ARE ALWAYS WELCOME HERE · © {new Date().getFullYear()}</span>
      </footer>

      <div className="music-control">
        <button type="button" onClick={toggleMusic} title="Play or pause background music">
          {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>{musicOn ? "Music on" : "Music off"}</span>
        </button>
        <input
          aria-label="Music volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={musicVolume}
          onChange={changeMusicVolume}
          title="Adjust music volume"
        />
      </div>

      {showName && (
        <div className="welcome-modal">
          <form className="name-card" onSubmit={saveName}>
            <div className="modal-heart"><Heart size={23} /></div>
            <span className="eyebrow">BEFORE YOU COME IN</span>
            <h2>What should I <em>call you?</em></h2>
            <p>I'd love to welcome you properly. You only need to tell me once on this device.</p>
            <input autoFocus value={nameInput} onChange={e => setNameInput(e.target.value)}
              placeholder="Your first name" maxLength={40} required />
            <button className="primary-button" type="submit">That's me <ArrowRight size={16} /></button>
            <small>Your name stays in this browser and can be changed later.</small>
          </form>
        </div>
      )}

      {!showName && showMusicPrompt && (
        <div className="music-welcome-modal">
          <div className="music-welcome-card">
            <div className="modal-heart"><Music2 size={23} /></div>
            <span className="eyebrow">A LITTLE SOUNDTRACK</span>
            <h2>Shall we add a little <em>music?</em></h2>
            <p>Would you like Runaway by AURORA to play softly while you explore this little place?</p>
            <button className="primary-button" type="button" onClick={startMusic}>
              <Volume2 size={17} /> Play music
            </button>
            <button className="music-later-button" type="button" onClick={skipMusic}>
              Maybe later
            </button>
            <small>You can pause the music or change its volume at any time.</small>
          </div>
        </div>
      )}
    </div>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return <div className="page-heading">
    <span className="eyebrow">{eyebrow}</span>
    <h1>{title}</h1><p>{description}</p>
  </div>;
}

function Fact({ icon, label, value }) {
  return <div className="fact-card"><span>{icon}</span><small>{label}</small><strong>{value}</strong></div>;
}

function FeatureCard({ icon: Icon, title, description, onClick }) {
  return <button className="feature-card" onClick={onClick || (() => {})}>
    <Icon size={23} /><strong>{title}</strong><span>{description}</span>
    <ChevronRight size={16} className="feature-arrow" />
  </button>;
}

function MemoryCard({ icon: Icon, title, desc }) {
  return <div className="memory-card"><Icon size={23} /><strong>{title}</strong><p>{desc}</p></div>;
}

createRoot(document.getElementById("root")).render(<App />);
