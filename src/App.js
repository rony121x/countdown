import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import "./App.css";

const TARGET_DATE = new Date("2025-10-22T00:44:00");

export default function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [images, setImages] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [dialogs, setDialogs] = useState([]);
  const [celebrating, setCelebrating] = useState(false);

  // Hearts & images
  useEffect(() => {
    setHearts(
      Array.from({ length: 25 }).map(() => ({
        left: Math.random() * 100,
        size: 10 + Math.random() * 20,
        duration: 4 + Math.random() * 4,
      }))
    );

    setImages(
      ["/meowl1.jpg", "/meowl2.jpg", "/meowl3.jpg", "/meowl4.jpg"].map((src) => ({
        src,
        left: Math.random() * 100,
        size: 60 + Math.random() * 40,
        duration: 8 + Math.random() * 5,
      }))
    );
  }, []);

  // Countdown + confetti
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
        setCelebrating(true);

        // Confetti burst
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#ff69b4", "#ffb6c1", "#ffc0cb", "#ff1493"],
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#ff69b4", "#ffb6c1", "#ffc0cb", "#ff1493"],
          });

          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calendar setup
  const [daysArray, setDaysArray] = useState([]);
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(TARGET_DATE);
    const days = [];
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

  // Mouse tracking for cat paw
  useEffect(() => {
    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Random dialogue boxes
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setDialogs((prev) => [
        ...prev,
        {
          id,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        },
      ]);

      setTimeout(() => {
        setDialogs((prev) => prev.filter((d) => d.id !== id));
      }, 2000);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* Hearts */}
      {hearts.map((h, i) => (
        <div
          key={i}
          className="heart"
          style={{
            left: `${h.left}vw`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animationDuration: `${h.duration}s`,
          }}
        ></div>
      ))}

      {/* Images */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt="floating"
          className="floating-image"
          style={{
            left: `${img.left}vw`,
            width: `${img.size}px`,
            animationDuration: `${img.duration}s`,
          }}
        />
      ))}

      {/* Dialogue boxes */}
      {dialogs.map((d) => (
        <div
          key={d.id}
          className="love-dialog"
          style={{ left: `${d.x}vw`, top: `${d.y}vh` }}
        >
          I LOVE YOU &lt;3
        </div>
      ))}

      <div className="content-wrapper">
  { !showCalendar ? (
    <div className="content">
      <h1 className="glow-text">MILON HOBE KOTO DINEEEEEE</h1>
      <h1 className="glow-text">
        {timeLeft
          ? `💞 ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s 💞`
          : celebrating
            ? "🎉 WE MET! YIPPIEEEEEEEEEEEE! 🎉"
            : ""
        }
      </h1>
      <button onClick={() => setShowCalendar(true)}>View Calendar</button>
    </div>
  ) : (
    <div className="calendar-view">
      <h2 className="calendar-title">Days Until We Meet</h2>
      <div className="calendar-grid">
        {daysArray.map((d, i) => (
          <div
            key={i}
            className={`calendar-cell ${
              d.target ? "target-day" : d.passed ? "passed-day" : "upcoming-day"
            }`}
          >
            {d.date.getDate()}
          </div>
        ))}
      </div>
      <button onClick={() => setShowCalendar(false)}>Back to Countdown</button>
    </div>
  )}
</div>

      {/* Cat paw */}
      <img
        src="/catpaw.png"
        alt="cat paw cursor"
        className="cat-paw-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
    </div>
  );
}
