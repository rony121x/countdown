import React, { useEffect, useState, useRef } from "react";

import "./App.css";

/* ✨ CHANGE THIS SENTENCE ONLY ✨ */
const LOVE_SENTENCE = "i miss you so much. Just ask me to wait and I'll wait however long it takes shumi, I can't lose you, please. I refuse to believe we end up like this. Please dont leave me. If you are reading this, im still right here shumi. Come back to me.";

/* Assets */
const POLAROIDS = [
  { id: 1, src: "/photo1.jpg", caption: "<3!!" },
  { id: 2, src: "/photo2.jpg", caption: "Mwahhhhh!!" },
  { id: 3, src: "/photo3.jpg", caption: "We are so cute :3!!" },
];

const FLOAT_IMAGES = [
  "/meowl1.jpg",
  "/meowl2.jpg",
  "/meowl3.jpg",
  "/meowl4.jpg",
];

const CAT_PAW = "/catpaw.png";
const CENTER_PHOTO = "/.jpg"; 
export default function App() {
  const [hearts, setHearts] = useState([]);
  const [floatImgs, setFloatImgs] = useState([]);
  const [polaroids, setPolaroids] = useState([]);
  const [activePolaroid, setActivePolaroid] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [dialogs, setDialogs] = useState([]);
  const dialogTimerRef = useRef(null);

  /* Floating hearts, images, polaroids */
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

    setPolaroids(
      POLAROIDS.map((p) => ({
        ...p,
        left: Math.random() * 80 + 10,
        duration: 6 + Math.random() * 6,
        scale: 0.9 + Math.random() * 0.3,
      }))
    );
  }, []);

  /* Cat paw cursor tracking */
  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Random I LOVE YOU dialog boxes */
  useEffect(() => {
    dialogTimerRef.current = setInterval(() => {
      const id = Date.now() + Math.random();
      setDialogs((prev) => [
        ...prev,
        { id, x: Math.random() * 80 + 10, y: Math.random() * 70 + 10 },
      ]);

      setTimeout(() => {
        setDialogs((prev) => prev.filter((d) => d.id !== id));
      }, 2000);
    }, 1400);

    return () => clearInterval(dialogTimerRef.current);
  }, []);

  /* Polaroid click → letter */
  const onPolaroidClick = (p) => {
    setActivePolaroid(p);
    setShowLetter(true);
  };

  return (
    <div className="app-root">
      {/* Animated pink background */}
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
          }}
        />
      ))}

      {/* Floating polaroids */}
      {polaroids.map((p) => (
        <div
          key={`polaroid-${p.id}`}
          className="polaroid"
          style={{
            left: `${p.left}vw`,
            animationDuration: `${p.duration}s`,
            transform: `scale(${p.scale})`,
          }}
          onClick={() => onPolaroidClick(p)}
        >
          <div className="polaroid-frame">
            <img src={p.src} alt={p.caption} />
            <div className="polaroid-caption">{p.caption}</div>
          </div>
        </div>
      ))}

      {/* Random dialog boxes */}
      {dialogs.map((d) => (
        <div
          key={`dialog-${d.id}`}
          className="love-dialog"
          style={{ left: `${d.x}vw`, top: `${d.y}vh` }}
        >
          I LOVE YOU &lt;3
        </div>
      ))}
{/* 🌸 STATIC CENTER FRAME (non-interactive) */}
      <div className="center-frame">
        <img src={CENTER_PHOTO} alt="Us" />
      </div>

      {/* ✨ THE ONLY TEXT ON SCREEN ✨ */}
      <div className="main-area">
        <h1 className="title-text single-love-text">
          {LOVE_SENTENCE}
        </h1>
      </div>

      {/* Letter overlay */}
      {showLetter && activePolaroid && (
        <div
          className="letter-overlay"
          onClick={() => {
            setShowLetter(false);
            setActivePolaroid(null);
          }}
        >
          <div className="envelope" onClick={(e) => e.stopPropagation()}>
            <div className="letter-content">
              <h2>Dear Love,</h2>
              <p>{activePolaroid.caption}</p>
              <p>
                I can't wait to finally hold you. Until then, this little note
                keeps you close to my heart.
              </p>
              <p className="signature">— :3 🐾</p>
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

      {/* Cat paw cursor */}
      <img
        src={CAT_PAW}
        alt="cat paw cursor"
        className="cat-paw-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y }}
        draggable={false}
      />
    </div>
  );
}

