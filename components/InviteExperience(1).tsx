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
        /* Antique parchment scroll section */
        .scroll-wrap {
          position: relative;
          isolation: isolate;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          min-height: 1180px;
          box-sizing: border-box;
          overflow: hidden;
          perspective: 1400px;
          padding: 125px 28px 145px;
          background-color: #f4eadb;
          background-image:
            radial-gradient(circle at 8% 18%, rgba(181, 132, 65, .30) 0 1px, transparent 2px),
            radial-gradient(circle at 91% 29%, rgba(181, 132, 65, .25) 0 1px, transparent 2px),
            radial-gradient(circle at 13% 76%, rgba(181, 132, 65, .24) 0 1px, transparent 2px),
            radial-gradient(circle at 88% 83%, rgba(181, 132, 65, .27) 0 1px, transparent 2px),
            linear-gradient(110deg, #f1e5d4, #fbf4e9 48%, #f0e3d1);
        }

        /* No burgundy torn-paper borders: keep the surrounding surface ivory */
        .scroll-wrap::before,
        .scroll-wrap::after {
          content: none;
          display: none;
        }

        .scroll {
          --roller-height: 54px;
          --roller-overhang: 58px;
          position: relative;
          z-index: 2;
          width: min(100%, 700px);
          margin: 0 auto;
          padding-top: 22px;
          transform-style: preserve-3d;
          isolation: isolate;
          filter: drop-shadow(0 18px 20px rgba(89, 59, 30, .16));
        }

        .scroll-body {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          padding: 0 68px;
          background-color: #f4dfbd;
          background-image:
            radial-gradient(ellipse at 50% 42%, rgba(255, 249, 231, .92), transparent 68%),
            radial-gradient(ellipse at 3% 50%, rgba(145, 91, 42, .18), transparent 24%),
            radial-gradient(ellipse at 98% 52%, rgba(145, 91, 42, .16), transparent 22%),
            repeating-linear-gradient(0deg, rgba(124, 82, 42, .025) 0 1px, transparent 1px 4px),
            linear-gradient(90deg, #dfc49a 0%, #f5e5c8 5%, #f9edda 18%, #f7e9d0 82%, #f1dfbf 95%, #d9b98b 100%);
          box-shadow:
            inset 18px 0 28px -22px rgba(89, 52, 21, .62),
            inset -18px 0 28px -22px rgba(89, 52, 21, .62),
            inset 0 0 35px rgba(128, 83, 37, .08);
          clip-path: polygon(
            1.5% 0, 98.5% 0, 99.5% 2%, 99% 5%, 100% 9%,
            99.2% 15%, 100% 22%, 99% 29%, 99.7% 37%,
            98.9% 45%, 100% 53%, 99.1% 61%, 100% 70%,
            99% 78%, 99.7% 87%, 98.7% 96%, 98% 100%,
            2% 100%, 1.2% 97%, 0.5% 90%, 1.1% 82%,
            0% 73%, 1% 64%, 0.3% 55%, 1.1% 46%,
            0% 37%, 1% 28%, 0.3% 19%, 1.1% 10%, 0.5% 4%
          );
          transition:
            max-height 2.6s cubic-bezier(.65, 0, .35, 1),
            opacity 1.1s ease,
            padding 2s ease;
        }

        .parchment-content {
          min-height: 0;
          padding: 48px 0 52px;
          text-align: center;
        }

        .scroll.is-open .scroll-body {
          max-height: 1450px;
          min-height: 1050px;
          opacity: 1;
          padding: 0 68px;
          transition:
            max-height 2.6s cubic-bezier(.65, 0, .35, 1),
            opacity 1.1s ease .35s,
            padding 2s ease;
        }

        /* Wrapped parchment rollers with carved wooden finials */
        .roller {
          position: absolute;
          z-index: 6;
          left: calc(-1 * var(--roller-overhang));
          width: calc(100% + var(--roller-overhang) + var(--roller-overhang));
          height: var(--roller-height);
          box-sizing: border-box;
          border: 1px solid rgba(112, 72, 34, .34);
          border-radius: 999px;
          background:
            linear-gradient(180deg,
              #fff0ce 0%, #e7c990 13%, #c18c4c 25%,
              #f1d9a8 42%, #e6c58d 61%, #b27b3d 82%, #f1d6a0 100%);
          box-shadow:
            0 9px 15px rgba(69, 42, 18, .30),
            inset 0 4px 6px rgba(255, 250, 226, .88),
            inset 0 -5px 7px rgba(94, 55, 19, .30);
          transition:
            top 2.55s cubic-bezier(.65, 0, .35, 1),
            transform 2.55s ease;
          overflow: visible;
        }

        .roller::before {
          content: "";
          position: absolute;
          inset: 5px 18px;
          border-radius: inherit;
          background:
            linear-gradient(180deg, rgba(255,255,255,.38), transparent 38%, rgba(105,66,29,.12)),
            repeating-linear-gradient(90deg, transparent 0 19px, rgba(111,72,33,.10) 20px 21px, transparent 22px 34px);
          pointer-events: none;
        }

        .roller-top { top: 0; }
        .roller-bottom { top: 0; transform: translateY(0); }
        .scroll.is-open .roller-top { top: 0; }
        .scroll.is-open .roller-bottom {
          top: calc(100% - var(--roller-height));
          transform: translateY(0);
        }

        .roller-cap {
          position: absolute;
          z-index: 3;
          top: 5px;
          width: 43px;
          height: 42px;
          border: 1px solid rgba(74, 42, 18, .52);
          border-radius: 48%;
          background: linear-gradient(90deg,
            #573316 0%, #8d5a2b 16%, #d4a35c 32%,
            #f0d39a 47%, #a66d32 67%, #69401f 86%, #d8ad6d 100%);
          box-shadow: 0 3px 5px rgba(48, 29, 13, .32), inset 0 2px 4px rgba(255, 238, 194, .62);
        }

        .roller-cap::before {
          content: "";
          position: absolute;
          top: 5px;
          bottom: 5px;
          left: 9px;
          right: 9px;
          border-left: 3px solid rgba(75, 43, 19, .45);
          border-right: 3px solid rgba(255, 229, 174, .45);
          border-radius: 50%;
        }

        .roller-cap::after {
          content: "";
          position: absolute;
          top: 12px;
          left: -10px;
          width: 13px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(90deg, #593519, #c18c4d, #74451f);
          box-shadow: 0 1px 3px rgba(52, 30, 12, .35);
        }

        .roller-cap.left { left: -27px; }
        .roller-cap.right { right: -27px; transform: scaleX(-1); }

        /* Wax seal remains attached to the upper roller */
        .scroll-seal {
          position: absolute;
          z-index: 9;
          top: 27px;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 76px;
          box-sizing: border-box;
          border: 3px solid rgba(255, 220, 178, .55);
          border-radius: 48% 52% 50% 48%;
          color: #f4d99d;
          background: radial-gradient(circle at 34% 25%, #a83d4b, #78172b 65%, #4b0c1c);
          box-shadow: 0 5px 11px rgba(53, 23, 18, .35), inset 0 2px 6px rgba(255, 225, 203, .28);
          font-family: Georgia, serif;
          font-size: 19px;
          letter-spacing: 1px;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .scroll-seal span { margin: 0 3px; font-size: 12px; font-style: italic; }

        .parchment-content .arabic {
          margin: 0 0 12px;
          color: #851d32;
          font-size: 39px;
          line-height: 1.7;
        }

        .parchment-content .verse {
          margin: 0 0 27px;
          color: #946a40;
          font-family: Georgia, serif;
          font-size: 19px;
        }

        .parchment-content .rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 25px auto;
          color: #bd934e;
        }

        .parchment-content .rule i {
          display: block;
          width: 72px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #bd934e);
        }

        .parchment-content .rule i:last-child { transform: rotate(180deg); }

        .parchment-content .parents {
          color: #956b42;
          font-family: Georgia, serif;
          font-size: 18px;
          line-height: 1.8;
        }

        .parchment-content .invite-line {
          margin: 18px 0;
          color: #513a2e;
          font-family: Georgia, serif;
          font-size: 19px;
          line-height: 1.8;
        }

        .parchment-content .couple-lockup {
          margin: 20px 0;
          color: #83192d;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(36px, 4.5vw, 49px);
          font-weight: 400;
          line-height: 1.4;
        }

        .parchment-content .couple-lockup span {
          display: block;
          margin: 2px 0;
          color: #b48b4c;
          font-size: 29px;
          font-style: italic;
        }

        .parchment-content .groom-parents { margin-top: 12px; }
        .parchment-content .event-details { margin-top: 28px; }

        .scroll-ornament {
          margin-top: 22px;
          color: #ad8545;
          font-family: Georgia, serif;
          font-size: 30px;
        }

        @media (max-width: 700px) {
          .scroll-wrap {
            min-height: 980px;
            padding: 105px 34px 120px;
          }
          .scroll {
            --roller-height: 43px;
            --roller-overhang: 32px;
            width: 100%;
          }
          .scroll-body { padding-right: 28px; padding-left: 28px; }
          .scroll.is-open .scroll-body {
            min-height: 850px;
            padding-right: 28px;
            padding-left: 28px;
          }
          .parchment-content { padding-top: 42px; padding-bottom: 42px; }
          .parchment-content .arabic { font-size: 30px; }
          .parchment-content .verse { font-size: 15px; }
          .parchment-content .parents { font-size: 14px; }
          .parchment-content .invite-line { font-size: 15px; }
          .parchment-content .couple-lockup { font-size: clamp(27px, 7vw, 38px); }
          .parchment-content .couple-lockup span { font-size: 23px; }
          .roller-cap { width: 34px; height: 34px; top: 4px; }
          .roller-cap.left { left: -21px; }
          .roller-cap.right { right: -21px; }
          .scroll-seal { width: 62px; height: 62px; top: 21px; font-size: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-body, .roller { transition-duration: .01ms !important; }
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

              {/* The bride's family is hosting and inviting guests */}
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
