"use client";

import { useEffect, useRef, useState } from "react";
import { invite } from "@/data/invite";

const { groom: GROOM, bride: BRIDE, dateLabel: DATE_LABEL, venue: VENUE, venueFull: VENUE_FULL, mapsUrl: MAPS, photos: PHOTOS, events: EVENTS, dateISO } = invite;

function calendarUrl(title: string) {
  const text = encodeURIComponent(`${title} — ${GROOM} & ${BRIDE}`);
  const details = encodeURIComponent(`${title} of ${GROOM} and ${BRIDE} at ${VENUE_FULL}`);
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
            opacity: 0.35 + (i % 4) * 0.1,
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
  const [tick, setTick] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const scrollRef = useRef<HTMLElement>(null);

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
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) setScrollOpen(true);
    };
    openIfVisible();
    window.addEventListener("scroll", openIfVisible, { passive: true });
    const timer = window.setTimeout(openIfVisible, 400);
    return () => {
      window.removeEventListener("scroll", openIfVisible);
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;
    const id = window.setInterval(() => setPhoto((n) => (n + 1) % PHOTOS.length), 2800);
    return () => window.clearInterval(id);
  }, [phase]);

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

  if (phase !== "open") {
    return (
      <section className={`envelope-screen${phase === "burst" ? " is-burst" : ""}`}>
        <div className="envelope-frame">
          <img className="envelope-photo" src="/invite/envelope.jpg" alt="Cream invitation envelope with a wax seal" />
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

  const event = EVENTS[page]!;

  return (
    <main>
      <style jsx>{`
        .scroll-wrap {
          position: relative;
          isolation: isolate;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          perspective: 1200px;
          padding: 132px 20px;
          background: #f8efe5;
        }

    
        

        .scroll {
          --roller-height: 30px;
          --roller-overhang: 30px;
          position: relative;
          z-index: 1;
          width: min(100%, 440px);
          margin: 0 auto;
          padding-top: 15px;
          transform-style: preserve-3d;
          isolation: isolate;
        }

        .scroll-body {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          padding: 0 34px;
          border-radius: 2px;
          background:
            radial-gradient(ellipse at 50% 45%, rgba(255, 252, 239, 0.94), transparent 72%),
            linear-gradient(
              90deg,
              #e6d4b5 0%,
              #f4e9d5 5%,
              #fbf2e2 15%,
              #f8efdf 85%,
              #f0e2ca 95%,
              #dfc9a7 100%
            );
          box-shadow:
            inset 12px 0 18px -17px rgba(74, 43, 19, 0.65),
            inset -12px 0 18px -17px rgba(74, 43, 19, 0.65),
            0 8px 22px rgba(70, 45, 22, 0.12);
          clip-path: polygon(
            0.8% 0%, 99.2% 0%, 100% 1.5%, 99.5% 4%,
            100% 97%, 99.2% 100%, 0.8% 100%, 0% 98%,
            0.5% 3%
          );
          transition:
            max-height 2.35s cubic-bezier(0.65, 0, 0.35, 1),
            opacity 0.9s ease,
            padding 2s ease;
        }

        .parchment-content {
          min-height: 0;
          padding: 25px 0 28px;
          text-align: center;
        }

        .scroll.is-open .scroll-body {
          max-height: 1000px;
          opacity: 1;
          padding: 0 34px;
          transition:
            max-height 2.5s cubic-bezier(0.65, 0, 0.35, 1),
            opacity 1.1s ease 0.35s,
            padding 2s ease;
        }

        .roller {
          position: absolute;
          z-index: 6;
          left: calc(-1 * var(--roller-overhang));
          width: calc(100% + var(--roller-overhang) + var(--roller-overhang));
          height: var(--roller-height);
          border: 1px solid rgba(105, 66, 28, 0.38);
          border-radius: 999px;
          background:
            linear-gradient(
              180deg,
              #fff2c8 0%,
              #e5c783 10%,
              #a87535 24%,
              #f1d99c 43%,
              #c18e43 67%,
              #805326 88%,
              #e5c37c 100%
            );
          box-shadow:
            0 7px 12px rgba(66, 42, 17, 0.34),
            inset 0 3px 4px rgba(255, 249, 222, 0.85),
            inset 0 -4px 5px rgba(91, 54, 17, 0.42);
          transition:
            top 2.45s cubic-bezier(0.65, 0, 0.35, 1),
            transform 2.45s ease;
          overflow: visible;
        }

        .roller::before {
          content: "";
          position: absolute;
          inset: 2px 5px;
          border-radius: inherit;
          background: repeating-linear-gradient(
            90deg,
            transparent 0 8px,
            rgba(103, 65, 25, 0.2) 9px 11px,
            rgba(255, 239, 190, 0.22) 12px 14px,
            transparent 15px 20px
          );
          pointer-events: none;
        }

        .roller-top {
          top: 0;
        }

        .roller-bottom {
          top: 0;
          transform: translateY(0);
        }

        .scroll.is-open .roller-top {
          top: 0;
        }

        .scroll.is-open .roller-bottom {
          top: calc(100% - var(--roller-height));
          transform: translateY(0);
        }

        .roller-cap {
          position: absolute;
          z-index: 2;
          top: 3px;
          width: 23px;
          height: 22px;
          border: 1px solid rgba(105, 66, 28, 0.4);
          border-radius: 50%;
          background: linear-gradient(
            90deg,
            #75471f 0%,
            #bd8a43 18%,
            #f0d69a 42%,
            #a87532 72%,
            #f0d99c 100%
          );
          box-shadow:
            0 2px 4px rgba(55, 32, 12, 0.28),
            inset 0 1px 3px rgba(255, 245, 210, 0.7);
        }

        .roller-cap.left {
          left: -8px;
        }

        .roller-cap.right {
          right: -8px;
        }

        .scroll-seal {
          position: absolute;
          z-index: 8;
          top: 50%;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 57px;
          height: 57px;
          border: 2px solid rgba(255, 220, 178, 0.55);
          border-radius: 50%;
          color: #f6dfc0;
          background:
            radial-gradient(circle at 35% 28%, #bd5260, #7e172d 68%, #4d1020);
          box-shadow:
            0 4px 9px rgba(53, 23, 18, 0.3),
            inset 0 2px 5px rgba(255, 225, 203, 0.3);
          font-family: Georgia, serif;
          font-size: 16px;
          letter-spacing: 1px;
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
          transition:
            opacity 0.45s ease,
            transform 0.65s ease;
          pointer-events: none;
        }

        .scroll-seal span {
          margin: 0 3px;
          font-size: 11px;
          font-style: italic;
        }

        .scroll.is-open .scroll-seal {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.45) rotate(-18deg);
        }

        .parchment-content .arabic {
          margin: 0 0 8px;
          color: #851d32;
          font-size: 27px;
          line-height: 1.7;
        }

        .parchment-content .verse {
          margin: 0 0 18px;
          font-family: Georgia, serif;
          font-size: 13px;
        }

        .parchment-content .rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 19px auto;
          color: #c49b51;
        }

        .parchment-content .rule i {
          display: block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c49b51);
        }

        .parchment-content .rule i:last-child {
          transform: rotate(180deg);
        }

        .parchment-content .parents {
          color: #96724e;
          font-family: Georgia, serif;
          font-size: 13px;
          line-height: 1.8;
        }

        .parchment-content .invite-line {
          margin: 10px 0;
          color: #563b31;
          font-family: Georgia, serif;
          font-size: 13px;
          line-height: 1.8;
        }

        .parchment-content .couple-lockup {
          margin: 13px 0;
          color: #851d32;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(27px, 6vw, 35px);
          font-weight: 400;
          line-height: 1.35;
        }

        .parchment-content .couple-lockup span {
          display: block;
          margin: 1px 0;
          color: #bd995b;
          font-size: 21px;
          font-style: italic;
        }

        .parchment-content .groom-parents {
          margin-top: 8px;
        }

        .parchment-content .event-details {
          margin-top: 17px;
        }

        .scroll-ornament {
          margin-top: 12px;
          color: #b58c4d;
          font-family: Georgia, serif;
          font-size: 24px;
        }

        @media (max-width: 480px) {
          .scroll-wrap {
            padding: 118px 28px;
          }

          .scroll-wrap::before,
          .scroll-wrap::after {
            height: 88px;
          }

          .scroll {
            --roller-overhang: 22px;
            width: 100%;
          }

          .scroll.is-open .scroll-body {
            padding-right: 23px;
            padding-left: 23px;
          }

          .parchment-content .couple-lockup {
            font-size: clamp(25px, 7vw, 32px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-body,
          .roller,
          .scroll-seal {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
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

      <section className="paper scroll-wrap" ref={scrollRef}>
        <Petals count={8} />

        <div className={`scroll ${scrollOpen ? "is-open" : ""}`}>
          {/* Wooden roller at the top */}
          <div className="roller roller-top" aria-hidden="true">
            <span className="roller-cap left" />
            <span className="roller-cap right" />
          </div>

          {/* The invitation is printed directly on the parchment */}
          <div className="scroll-body">
            <div className="parchment-content">
              <p className="arabic">وَخَلَقْنَاكُمْ أَزْوَاجًا</p>

              <p className="parents verse">
                “And We created you in pairs.”
              </p>

              <div className="rule">
                <i />
                ✦
                <i />
              </div>

              
              <p className="parents">
                {invite.brideParents}
              </p>

              <p className="invite-line">
                Cordially request the honour of your presence at the
                wedding celebration of their beloved daughter
              </p>

              <h2 className="couple-lockup">
                {BRIDE}
                <span>and</span>
                {GROOM}
              </h2>

              <p className="parents groom-parents">
                Son of
                <br />
                {invite.groomParents}
              </p>

              <div className="rule">
                <i />
                ✦
                <i />
              </div>

              <p className="invite-line event-details">
                {DATE_LABEL}
                <br />
                {invite.time}
                <br />
                {VENUE_FULL}
              </p>

              <div className="scroll-ornament" aria-hidden="true">
                ❧
              </div>
            </div>
          </div>

          {/* The lower roller travels down as the parchment unfolds */}
          <div className="roller roller-bottom" aria-hidden="true">
            <span className="roller-cap left" />
            <span className="roller-cap right" />
          </div>

          {/* Visible only while the scroll is rolled closed */}
          <div className="scroll-seal" aria-hidden="true">
            S <span>&</span> D
          </div>
        </div>
      </section>
      <section className="paper section center">
        <img className="corner-flora tl" src="/invite/corner.jpg" alt="" />
        <img className="corner-flora tr" src="/invite/corner.jpg" alt="" />
        <p className="sec-label">Getting to know us</p>
        <h2 className="sec-title">Meet The Couple</h2>
        <p className="sec-sub">Two hearts, one beautiful journey together.</p>
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
        <p className="quote">“Two souls, one heart — joined by faith and a promise of forever.”</p>
      </section>

      <section className="wine-band section center">
        <Petals count={14} />
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
            setDrag(Math.max(0, Math.min(90, e.clientY - dragRef.current)));
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
              <p>{invite.time} · {VENUE}</p>
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
            >
              PULL
              <span className="pull-note">PULL DOWN TO REVEAL</span>
            </button>
          )}
        </div>
      </section>

      <section className="paper section center">
        <Petals count={8} />
        <p className="sec-label">Captured moments</p>
        <h2 className="sec-title">Photo Memories</h2>
        <p className="sec-sub">Every smile, every laugh, every stolen glance — captured forever.</p>
        <div className="lights">
          <div className="wire" />
          {[8, 22, 36, 50, 64, 78, 92].map((left) => (
            <span key={left} className="bulb" style={{ left: `${left}%` }} />
          ))}
          <div className="polaroid" key={photo}>
            <img src={PHOTOS[photo]} alt="" />
          </div>
          <p className="counter">
            {String(photo + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
          </p>
        </div>
      </section>

      <section className="paper section">
        <Petals count={6} />
        <div className="book-stage">
          {book === "cover" && (
            <button className="cover" onClick={() => setBook("open")}>
              <p className="role">Together</p>
              <h3>Wedding Functions</h3>
              <p>We would love to see you at each one.</p>
              <ul>
                {EVENTS.map((item) => (
                  <li key={item.title}>
                    <span>{item.title}</span>
                    <span>1 Jan 2027</span>
                  </li>
                ))}
              </ul>
              <p className="tap-cover">TAP THE COVER TO OPEN</p>
            </button>
          )}
          {book === "open" && (
            <div className="spread">
              <div className="page">
                <p className="role">Event · {String(page + 1).padStart(2, "0")}</p>
                <img src={event.image} alt="" />
                <p>{event.blurb}</p>
              </div>
              <div className="page">
                <h3>{event.title}</h3>
                <p>{event.when}</p>
                <p>{event.time}</p>
                <p>{VENUE_FULL}</p>
                <div className="actions">
                  <a className="pill" href={MAPS} target="_blank" rel="noreferrer">
                    Get Directions
                  </a>
                  <a className="ghost" href={calendarUrl(event.title)} target="_blank" rel="noreferrer">
                    Add to Calendar
                  </a>
                  <button className="ghost" onClick={() => setBook("cover")}>
                    Close
                  </button>
                </div>
              </div>
              <div className="nav-row">
                <button
                  className="ghost"
                  disabled={page === 0}
                  onClick={() => setPage((n) => Math.max(0, n - 1))}
                >
                  Previous
                </button>
                <span className="counter">
                  {String(page + 1).padStart(2, "0")} / {String(EVENTS.length).padStart(2, "0")}
                </span>
                <button
                  className="ghost"
                  onClick={() => {
                    if (page >= EVENTS.length - 1) setBook("back");
                    else setPage((n) => n + 1);
                  }}
                >
                  {page >= EVENTS.length - 1 ? "End" : "Next"}
                </button>
              </div>
            </div>
          )}
          {book === "back" && (
            <button className="back-cover" onClick={() => setBook("cover")}>
              <p>We can’t wait to celebrate with you</p>
            </button>
          )}
        </div>
      </section>

      <div className="torn" />
      <section className="wine-band section center">
        <p className="sec-label">Find us</p>
        <h2 className="sec-title">The Venue</h2>
        <p className="sec-sub">Where hearts unite</p>
        <div className="venue-layout">
          <img src="/invite/venue.jpg" alt="Wedding mandap at ICCB" />
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
              <a className="pill" href={MAPS} target="_blank" rel="noreferrer">
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="torn" style={{ transform: "scaleY(-1)" }} />

      <footer className="paper closing">
        <Petals count={12} />
        <p className="closing-quote">“Two souls, one heart, one beautiful journey.”</p>
        <div className="mini-seal">S & D</div>
        <p className="closing-names">
          {GROOM} & {BRIDE}
        </p>
        <p className="thanks">Thank you for being part of our celebration</p>
        <p>
          {DATE_LABEL}
          <br />
          {VENUE}
        </p>
      </footer>
    </main>
  );
}
