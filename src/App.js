import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import "./App.css";

/**
 * IMPORTANT:
 * - Change TARGET_DATE to your meeting datetime string.
 * - Replace image filenames in POLAROIDS & FLOAT_IMAGES arrays with files you put into /public
 * - Replace PAW_ICON with your paw icon filename for the progress bar.
 */
const TARGET_DATE = new Date("2025-11-19T07:00:00"); // <-- change this
const START_DATE = new Date("2025-10-22T10:00:00"); // <-- optional: start of waiting period (change if desired)

const POLAROIDS = [
  { id: 1, src: "/photo1.jpg", caption: "<3!!" },
  { id: 2, src: "/photo2.jpg", caption: "Mwahhhhh!!" },
  { id: 3, src: "/photo3.jpg", caption: "We are so cute :3!!" },
];

const FLOAT_IMAGES = ["/meowl1.jpg", "/meowl2.jpg", "/meowl3.jpg", "/meowl4.jpg"];
const PAW_ICON = "/catpaw.png"; // small paw icon for progress bar
const CAT_PAW = "/catpaw.png"; // cursor

export default function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [floatImgs, setFloatImgs] = useState([]);
  const [polaroids, setPolaroids] = useState([]);
  const [activePolaroid, setActivePolaroid] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [dialogs, setDialogs] = useState([]);
  const [celebrating, setCelebrating] = useState(false);
  const [daysArray, setDaysArray] = useState([]);
  const dialogTimerRef = useRef(null);

  // Setup floating hearts/images/polaroids positions (react way)
  useEffect(() => {
    setHearts(
      Array.from({ length: 22 }).map(() => ({
        left: Math.random() * 100,
        size: 10 + Math.random() * 18,
        duration: 5 + Math.random() * 5,
      }))
    );

    setFloatImgs(
      FLOAT_IMAGES.map((src) => ({
        src,
        left: Math.random() * 100,
        size: 60 + Math.random() * 40,
        duration: 8 + Math.random() * 6,
      }))
    );

    // Polaroids: keep them floating too; positions random
    setPolaroids(
      POLAROIDS.map((p) => ({
        ...p,
        left: Math.random() * 80 + 10,
        duration: 6 + Math.random() * 6,
        scale: 0.9 + Math.random() * 0.3,
      }))
    );
  }, []);

  // Countdown + confetti trigger when reaches zero
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = TARGET_DATE - now;
      if (diff <= 0) {
        setTimeLeft(null);
        setCelebrating(true);
        runConfettiBurst();
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Confetti continuous-ish burst for a duration
  function runConfettiBurst() {
    const duration = 5 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff69b4", "#ffb6c1", "#ffc0cb", "#ff1493"],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff69b4", "#ffb6c1", "#ffc0cb", "#ff1493"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // Calendar grid (days from start of current month to target)
  useEffect(() => {
    const now = new Date();
    const start = START_DATE
    const end = new Date(TARGET_DATE);
    const days = [];
    // Prepend empty boxes for weekday alignment
    const firstDayOfWeek = START_DATE.getDay(); // 0 = Sunday
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    let current = new Date(start);
    while (current <= end) {
      days.push({
        date: new Date(current),
        passed: current < now,
        target: current.toDateString() === TARGET_DATE.toDateString(),
      });
      current.setDate(current.getDate() + 1);
    }
    setDaysArray(days);
  }, []);

  // Mouse tracking for cat paw cursor
  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Random dialogue boxes spawning
  useEffect(() => {
    dialogTimerRef.current = setInterval(() => {
      const id = Date.now() + Math.random();
      setDialogs((prev) => [
        ...prev,
        { id, x: Math.random() * 80 + 10, y: Math.random() * 70 + 10 },
      ]);
      // remove after 2s
      setTimeout(() => {
        setDialogs((prev) => prev.filter((d) => d.id !== id));
      }, 2000);
    }, 1400);

    return () => clearInterval(dialogTimerRef.current);
  }, []);

  // open letter when polaroid clicked
  const onPolaroidClick = (p) => {
    setActivePolaroid(p);
    setShowLetter(true);
  };

  // progress percent between START_DATE and TARGET_DATE
  const getProgressPercent = () => {
    const now = Date.now();
    const total = TARGET_DATE - START_DATE;
    const elapsed = now - START_DATE;
    const pct = total <= 0 ? 100 : Math.max(0, Math.min(100, (elapsed / total) * 100));
    return Math.round(pct);
  };

  // small helper for key-safe rendering of time string
  const renderTimeString = () => {
    if (!timeLeft) return celebrating ? "🎉 WE MET!!! YIPPPEEEEEEEEEE 🎉" : "";
    return `💞 ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s💞`;
  };

  return (
    <div className="app-root">
      {/* Light pink animated gradient background */}
      <div className="animated-gradient" />

      {/* Floating hearts */}
      {hearts.map((h, i) => (
        <div
          key={`heart-${i}`}
          className="heart"
          style={{
            left: `${h.left}vw`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            zIndex: 0,
          }}
        />
      ))}

      {/* Floating images */}
      {floatImgs.map((f, i) => (
        <img
          key={`floatimg-${i}`}
          src={f.src}
          alt=""
          className="floating-image"
          style={{
            left: `${f.left}vw`,
            width: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            zIndex: 0,
          }}
        />
      ))}

      {/* Floating polaroids (clickable) */}
      {polaroids.map((p) => (
        <div
          key={`polaroid-${p.id}`}
          className="polaroid"
          style={{
            left: `${p.left}vw`,
            animationDuration: `${p.duration}s`,
            transform: `scale(${p.scale})`,
            zIndex: 2,
          }}
          onClick={() => onPolaroidClick(p)}
        >
          <div className="polaroid-frame">
            <img src={p.src} alt={p.caption} />
            <div className="polaroid-caption">{p.caption}</div>
          </div>
        </div>
      ))}

      {/* Random little dialogue boxes */}
      {dialogs.map((d) => (
        <div
          key={`dialog-${d.id}`}
          className="love-dialog"
          style={{ left: `${d.x}vw`, top: `${d.y}vh`, zIndex: 5 }}
        >
          I LOVE YOU &lt;3
        </div>
      ))}

      {/* Top area: title, progress bar and content / calendar toggle */}
      <div className="top-controls">
        <h1 className="title-text">MILON HOBE KOTO DINEEEEE</h1>

        {/* Cat-themed progress bar */}
        <div className="cat-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercent()}%` }}
            >
              <img src={PAW_ICON} alt="paw" className="paw-icon" />
            </div>
          </div>
          <div className="progress-label"> {getProgressPercent()}% of the wait done 🐾</div>
        </div>

        <div className="controls-row">
          <button className="main-btn" onClick={() => setShowCalendar((s) => !s)}>
            {showCalendar ? "⏰ Back to Countdown" : "📅 View Calendar"}
          </button>
        </div>
      </div>

      {/* Main middle area: countdown or calendar */}
      <div className="main-area">
        {!showCalendar ? (
          <div className="countdown-area">
            {/* big centered timer / celebration */}
            <div className="big-timer">
              <div className="timer-text">{renderTimeString()}</div>
            </div>
          </div>
        ) : (
          <div className="calendar-area">
            <h2 className="calendar-title"></h2>
            <div className="calendar-grid">
              {["S","M","T","W","T","F","S"].map((d, idx) => (
                <div key={`hdr-${idx}`} className="calendar-header">{d}</div>
              ))}
              {daysArray.map((d, i) =>
                d === null ? (
                  <div key={`empty-${i}`} className="calendar-box empty" />
                ) : (
                  <div
                    key={`day-${i}`}
                    className={`calendar-box ${
                      d.target ? "meeting-day" : d.passed ? "past-day" : "future-day"
                    }`}
                  >
                    {d.date.getDate()}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Digital letter overlay */}
      {showLetter && activePolaroid && (
        <div
          className="letter-overlay"
          onClick={() => {
            setShowLetter(false);
            setActivePolaroid(null);
          }}
        >
          <div className="envelope" onClick={(e) => e.stopPropagation()}>
            <div className="envelope-top" />
            <div className="letter-content">
              <h2>Dear Love,</h2>
              <p>
                {activePolaroid.caption}
              </p>
              <p>
                I can't wait to finally hold you. Every day brings me closer to that smile.
                Until then, this little note keeps you close to my heart.
              </p>
              <p className="signature">— your kitty 🐾</p>
              <button
                className="close-letter"
                onClick={() => {
                  setShowLetter(false);
                  setActivePolaroid(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cat paw custom cursor */}
      <img
        src={CAT_PAW}
        alt="cat paw cursor"
        className="cat-paw-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y, zIndex: 9999 }}
        draggable={false}
      />
    </div>
  );
}
