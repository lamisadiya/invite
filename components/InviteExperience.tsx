
"use client";

import { useEffect, useRef, useState } from "react";
import { invite } from "@/data/invite";

const {
  groom: GROOM,
  bride: BRIDE,
  dateLabel: DATE_LABEL,
  venue: VENUE,
  venueFull: VENUE_FULL,
  mapsUrl: MAPS,
  photos: PHOTOS,
  events: EVENTS,
  dateISO,
} = invite;

const BG_IMAGE = "/invite/bg.webp";

const burgundyBackground = {
  backgroundImage: `url(${BG_IMAGE})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

function calendarUrl(title: string) {
  const text = encodeURIComponent(`${title} — ${GROOM} & ${BRIDE}`);
  const details = encodeURIComponent(
    `${title} of ${GROOM} and ${BRIDE} at ${VENUE_FULL}`
  );
  const loc = encodeURIComponent(VENUE_FULL);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${invite.calendarStart}/${invite.calendarEnd}&details=${details}&location=${loc}`;
}

function Petals({ count = 10 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 17) % 80}%`,
            animationDelay: `${i * 0.7}s`,
            transform: `rotate(${i * 28}deg)`,
            opacity: 0.6 + (i % 4) * 0.1,
          }}
        />
      ))}
    </>
  );
}
function GoldPetals({ count = 10 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="goldpetal"
          style={{
            left: `${(i * 34) % 100}%`,
            top: `${(i * 75) % 80}%`,
            animationDelay: `${i * 0.7}s`,
            transform: `rotate(${i * 48}deg)`,
            opacity: 0.5 + (i % 4) * 0.1,
          }}
        />
      ))}
    </>
  );
}

export function InviteExperience() {
  const [phase, setPhase] = useState<"sealed" | "burst" | "open">("sealed");
  const [scrollOpen, setScrollOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [drag, setDrag] = useState(0);
  const dragRef = useRef(0);
  const [photo, setPhoto] = useState(0);
  const [book, setBook] = useState<"cover" | "open" | "back">("cover");
  const [page, setPage] = useState(0);

  // Music player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const [tick, setTick] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

  const scrollRef = useRef<HTMLElement>(null);

  // Start music when the visitor opens the invitation
  useEffect(() => {
    if (phase !== "open") return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    audio.loop = true;

    audio.play().catch(() => {
      // Browser may block autoplay.
      // Visitor can start music using the floating button.
    });
  }, [phase]);

  // Automatically open the invitation scroll
  useEffect(() => {
    if (phase !== "burst") return;

    const id = window.setTimeout(() => setPhase("open"), 1100);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;

    const openIfVisible = () => {
      const node = scrollRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        setScrollOpen(true);
      }
    };

    openIfVisible();

    window.addEventListener("scroll", openIfVisible, { passive: true });

    const timer = window.setTimeout(openIfVisible, 400);

    return () => {
      window.removeEventListener("scroll", openIfVisible);
      window.clearTimeout(timer);
    };
  }, [phase]);

  // Photo slideshow
  useEffect(() => {
    if (phase !== "open") return;

    const id = window.setInterval(
      () => setPhoto((n) => (n + 1) % PHOTOS.length),
      2800
    );

    return () => window.clearInterval(id);
  }, [phase]);

  // Wedding countdown
  useEffect(() => {
    const target = new Date(dateISO).getTime();

    const run = () => {
      const diff = Math.max(0, target - Date.now());
      const pad = (n: number) => String(n).padStart(2, "0");

      setTick({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    };

    run();

    const id = window.setInterval(run, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Music mute / unmute
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // If music has not started yet, start it
    if (audio.paused) {
      audio.muted = false;

      try {
        await audio.play();
        setIsMuted(false);
      } catch (error) {
        console.error("Music playback failed:", error);
      }

      return;
    }

    // Toggle mute
    const nextMuted = !audio.muted;

    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  if (phase !== "open") {
    return (
      <section className={`envelope-screen${phase === "burst" ? " is-burst" : ""}`}>
        <div className="envelope-frame">
          <img
            className="envelope-photo"
            src="/invite/envelope.jpg"
            alt="Cream invitation envelope with a wax seal"
          />

          <span className="burst" />

          <button
            className="seal-hit"
            aria-label="Open the invitation"
            onClick={() => setPhase("burst")}
          />

          <p className="tap-hint">Tap the seal</p>
        </div>
      </section>
    );
  }
const EVENTS = [...invite.events].sort(
  (a, b) =>
    new Date(a.dateISO).getTime() -
    new Date(b.dateISO).getTime()
);
  const event = EVENTS[page]!;

  return (
    <main>
      {/* Background Wedding Music */}
      <audio
        ref={audioRef}
        src="/invite/music.wav"
        loop
        preload="auto"
      />

      {/* Floating Music Button */}
      <button
        className={`music-toggle ${isMuted ? "muted" : "playing"}`}
        onClick={toggleMusic}
        aria-label={isMuted ? "Unmute wedding music" : "Mute wedding music"}
        title={isMuted ? "Unmute music" : "Mute music"}
      >
        <span className="music-icon">
          {isMuted ? "♪" : "♫"}
        </span>

        {isMuted && <span className="music-muted-mark" />}
      </button>

      <header className="hero">
        <img className="hero-bg" src="/invite/hero.jpg" alt="" />
        <div className="hero-shade" />

        <span className="lantern left" />
        <span className="lantern right" />

        <div className="hero-copy">
          <p className="kicker">The wedding invitation of</p>

          <h1 className="script-names">
            {GROOM}
            <em>&</em>
            {BRIDE}
          </h1>
        </div>
      </header>

      <section
        className="scroll-reference-section"
        ref={scrollRef}
        aria-label="Wedding invitation scroll"
      >
        <div
          className={`scroll-reference-art${scrollOpen ? " is-open" : ""}`}
        >
          <img
            src="/invite/wedding-scroll-reference.png"
            alt={`Vintage parchment wedding invitation for ${BRIDE} and ${GROOM}`}
            className="scroll-reference-image"
          />
        </div>
      </section>

      {/* MEET THE COUPLE */}
      <section className="paper section center">
        <img className="corner-flora tl" src="/invite/corner2.png" alt="" />
        <img className="corner-flora tr" src="/invite/corner2.png" alt="" />

        <p className="sec-label">Getting to know us</p>
        <h2 className="sec-title">Meet The Couple</h2>
        <p className="sec-sub">
          Two hearts, one beautiful journey together.
        </p>

        <div className="couple-row">
          <article className="person">
            <div className="frame">
              <img src="/invite/groom.png" alt="Shadman Azad" />
            </div>
            <p className="role">The Groom</p>
            <h3>{GROOM}</h3>
            <p>Son of {invite.groomParents}</p>
          </article>

          <article className="person">
            <div className="frame">
              <img src="/invite/bride.png" alt="Farhat Lamisa Diya" />
            </div>
            <p className="role">The Bride</p>
            <h3>{BRIDE}</h3>
            <p>Daughter of {invite.brideParents}</p>
          </article>
        </div>

        <p className="quote">
          “Two souls, one heart — joined by faith and a promise of forever.”
        </p>
      </section>

      {/* SAVE THE DATE */}
      <section
        className="wine-band section center"
        style={burgundyBackground}
      >
        <Petals count={14} />
<GoldPetals count={14} />
        <p className="sec-label">A little surprise</p>
        <h2 className="sec-title">Save The Date</h2>

        <p className="sec-sub">
          Behind this seal lies a date that will begin our forever.
          {!dateOpen && " Pull down to discover our special day."}
        </p>

        <div
          className="pull-card"
          onPointerDown={(e) => {
            if (dateOpen) return;

            dragRef.current = e.clientY;

            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (dateOpen || dragRef.current === 0) return;

            setDrag(
              Math.max(0, Math.min(90, e.clientY - dragRef.current))
            );
          }}
          onPointerUp={() => {
            if (dateOpen) return;

            if (drag > 48) setDateOpen(true);

            setDrag(0);
            dragRef.current = 0;
          }}
        >
          {dateOpen ? (
            <div className="revealed">
              <p className="role">We’re getting married</p>
              <strong>{DATE_LABEL}</strong>
              <p>
                {invite.time} · {VENUE}
              </p>

              <div className="count">
                <div>
                  <b>{tick.d}</b>
                  <span>Days</span>
                </div>
                <div>
                  <b>{tick.h}</b>
                  <span>Hours</span>
                </div>
                <div>
                  <b>{tick.m}</b>
                  <span>Minutes</span>
                </div>
                <div>
                  <b>{tick.s}</b>
                  <span>Seconds</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="date-seal"
              style={{ transform: `translateY(${drag}px)` }}
              onClick={() => setDateOpen(true)}
              aria-label="Open wedding date"
            >
              <img
                src="/invite/Seal.png"
                alt="Shadman and Diya wax seal"
                className="date-seal-image"
              />
              <span className="pull-note">PULL DOWN</span>
            </button>
          )}
        </div>
      </section>

     {/**  {/* PHOTO MEMORIES */}
      <section className="paper section center">
        <Petals count={15} />
<GoldPetals count={15}/>
        <p className="sec-label">Captured moments</p>
        <h2 className="sec-title">Photo Memories</h2>
        <p className="sec-sub">
          Every smile, every laugh, every stolen glance — captured forever.
        </p>

        <div className="lights">
          <div className="wire" />

          {[8, 22, 36, 50, 64, 78, 92].map((left) => (
            <span
              key={left}
              className="bulb"
              style={{ left: `${left}%` }}
            />
          ))}

          <div className="polaroid" key={photo}>
            <img src={PHOTOS[photo]} alt="" />
          </div>

          <p className="counter">
            {String(photo + 1).padStart(2, "0")} /{" "}
            {String(PHOTOS.length).padStart(2, "0")}
          </p>
        </div>
      </section>

      {/* WEDDING FUNCTIONS */}
<section className="paper section">
  <Petals count={10} />
  <GoldPetals count={10} />

  <div className="book-stage">
    {book === "cover" && (
      <button
        className="cover"
        onClick={() => {
          setPage(0);
          setBook("open");
        }}
      ><h3>Wedding Functions</h3>
        <p className="role">Together</p>

        

        <p>We would love to see you at each one.</p>

        <ul>
          {EVENTS.map((item) => (
            <li key={item.title}>
              <span>{item.title}</span>
              <span>{item.when}</span>
            </li>
          ))}
        </ul>

        <p className="tap-cover">TAP THE COVER TO OPEN</p>
      </button>
    )}

    {book === "open" && (
      <div className="spread">
        {/* LEFT PAGE */}
        <div className="page">
          <p className="role">
            Event · {String(page + 1).padStart(2, "0")}
          </p>

          <img src={event.image} alt={event.title} />

          <p>{event.blurb}</p>
        </div>

        {/* RIGHT PAGE */}
        <div className="page">
          <h3>{event.title}</h3>

          <p>{event.when}</p>

          <p>{event.time}</p>

          <p>{event.place}</p>

          <div className="actions">
            <a
              className="pill"
              href={
                event.title === "Holud"
                  ? "https://www.google.com/maps/search/?api=1&query=Lazzi+Polli+Resort"
                  : MAPS
              }
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>

            <a
              className="ghost"
              href={calendarUrl(event.title)}
              target="_blank"
              rel="noreferrer"
            >
              Add to Calendar
            </a>

            <button
              className="ghost"
              onClick={() => setBook("cover")}
            >
              Close
            </button>
          </div>
        </div>

        {/* BOOK NAVIGATION */}
        <div className="nav-row">
          <button
            className="ghost"
            disabled={page === 0}
            onClick={() =>
              setPage((n) => Math.max(0, n - 1))
            }
          >
            Previous
          </button>

          <span className="counter">
            {String(page + 1).padStart(2, "0")} /{" "}
            {String(EVENTS.length).padStart(2, "0")}
          </span>

          <button
            className="ghost"
            onClick={() => {
              if (page >= EVENTS.length - 1) {
                setBook("back");
              } else {
                setPage((n) => n + 1);
              }
            }}
          >
            {page >= EVENTS.length - 1 ? "End" : "Next"}
          </button>
        </div>
      </div>
    )}

    {book === "back" && (
      <button
        className="back-cover"
        onClick={() => setBook("cover")}
      >
        <p>We can’t wait to celebrate with you</p>
      </button>
    )}
  </div>
</section>
      {/* TORN STRIP */}
      <div className="torn" style={burgundyBackground} />

      {/* VENUE */}
      <section
        className="wine-band section center"
        style={burgundyBackground}
      >
        <p className="sec-label">Find us</p>
        <h2 className="sec-title">The Venue</h2>
        <p className="sec-sub">Where hearts unite</p>

        <div className="venue-layout">
          <img src="/invite/venue.jpg" alt="Wedding at ICCB" />

          <div className="venue-copy">
            <p className="role">The venue</p>
            <h3>{VENUE}</h3>
            <p>{VENUE_FULL}</p>

            <p>
              {DATE_LABEL}
              <br />
              {invite.time}
            </p>

            <div className="actions">
              <a
                className="pill"
                href={MAPS}
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <div
        className="torn"
        style={{
          ...burgundyBackground,
          transform: "scaleY(-1)",
        }}
      />

      {/* CLOSING */}
      <footer className="paper closing">
        <Petals count={12} />
        <GoldPetals count={12}/>
        <p className="closing-quote">
          “Two souls, one heart, one beautiful journey.”
        </p>

        <div className="mini-seal">
          <img src="/invite/Seal.png" alt="Wedding wax seal" />
        </div>

        <p className="closing-names">
          {GROOM} & {BRIDE}
        </p>

        <p className="thanks">
          Thank you for being part of our celebration
        </p>

        <p>
          <br />
        </p>
      </footer>

      <style jsx>{`
        /* SCROLL INVITATION */

        .scroll-reference-section {
          position: relative;
          isolation: isolate;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #ead8bd;
        }

        .scroll-reference-art {
          width: min(100%, 760px);
          margin: 0 auto;
          opacity: 1;
          clip-path: inset(49.5% 0 49.5% 0);
          transform: scale(.985);
          transform-origin: center;
          transition:
            clip-path 2.5s cubic-bezier(.2,.75,.2,1),
            transform 2.5s cubic-bezier(.2,.75,.2,1);
        }

        .scroll-reference-art.is-open {
          clip-path: inset(0 0 0 0);
          transform: scale(1);
        }

        .scroll-reference-image {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        @media (min-width: 1000px) {
          .scroll-reference-art {
            width: min(100%, 720px);
          }
        }

        @media (max-width: 600px) {
          .scroll-reference-art {
            width: 100%;
            clip-path: inset(49.5% 0 49.5% 0);
          }

          .scroll-reference-art.is-open {
            clip-path: inset(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-reference-art {
            transition: none;
            transform: none;
          }
        }

        /* FLOATING WEDDING MUSIC BUTTON */

        .music-toggle {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 9999;

          width: 56px;
          height: 56px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #d6b875;
          border-radius: 50%;

          background: linear-gradient(
            145deg,
            #761e35,
            #4b1023
          );

          color: #f4dfaa;
          cursor: pointer;

          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.25),
            inset 0 1px 3px rgba(255, 230, 180, 0.25);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .music-toggle:hover {
          transform: scale(1.1);

          box-shadow:
            0 6px 22px rgba(0, 0, 0, 0.3),
            0 0 12px rgba(214, 184, 117, 0.3);
        }

        .music-icon {
          font-family: Georgia, serif;
          font-size: 29px;
          line-height: 1;
        }

        .music-toggle.playing .music-icon {
          animation: musicRotate 3s linear infinite;
        }

        .music-muted-mark {
          position: absolute;
          width: 29px;
          height: 2px;
          background: #f4dfaa;
          transform: rotate(-45deg);
          border-radius: 5px;
        }

        @keyframes musicRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .music-toggle {
            width: 48px;
            height: 48px;
            right: 16px;
            bottom: 18px;
          }

          .music-icon {
            font-size: 25px;
          }
        }
      `}</style>
    </main>
  );
}
