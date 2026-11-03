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
    {/* Top wooden roller */}
    <div className="roller roller-top">
      <span className="roller-cap left" />
      <span className="roller-cap right" />
    </div>
    <div className="scroll-seal" aria-hidden="true">
      <span>S <small>&</small> D</span>
      <i>✦</i>
    </div>

    {/* Parchment invitation */}
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

        {/* Bride's parents */}
        <p className="parents">
          {invite.brideParents}
        </p>

        <p className="invite-line">
          Cordially request the honour of your presence
          at the wedding celebration of their beloved daughter
        </p>

        {/* Bride and groom */}
        <h2 className="couple-lockup">
          {BRIDE}
          <span>and</span>
          {GROOM}
        </h2>

        {/* Groom's parents */}
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

        {/* Wedding details */}
        <p className="invite-line event-details">
          {DATE_LABEL}
          <br />
          {invite.time}
          <br />
          {VENUE_FULL}
        </p>

        <div className="scroll-ornament">❧</div>
      </div>
    </div>

    {/* Bottom wooden roller */}
    <div className="roller roller-bottom">
      <span className="roller-cap left" />
      <span className="roller-cap right" />
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
      <style jsx>{`
        .paper.scroll-wrap {
          position: relative; isolation: isolate; display: flex; justify-content: center;
          width: 100%; max-width: none; min-height: 0; margin: 0; padding: 110px 80px 130px;
          box-sizing: border-box; overflow: hidden; background: #f3e8d8;
          background-image: radial-gradient(ellipse at 15% 20%,rgba(185,145,91,.12),transparent 35%),
            radial-gradient(ellipse at 85% 80%,rgba(185,145,91,.1),transparent 35%),
            repeating-linear-gradient(0deg,rgba(133,103,67,.025) 0 1px,transparent 1px 5px);
        }
        .paper.scroll-wrap::before,.paper.scroll-wrap::after { display:none!important; content:none!important; }
        .scroll { --roller-h:64px; --overhang:72px; position:relative; z-index:2; width:min(760px,calc(100vw - 240px)); margin:0 auto; padding-top:24px; filter:drop-shadow(0 22px 22px rgba(68,43,23,.23)); isolation:isolate; }
        .scroll-body { position:relative; box-sizing:border-box; width:100%; max-height:0; min-height:0; overflow:hidden; opacity:0; padding:0 68px;
          background-color:#e9d0a8; background-image:radial-gradient(ellipse at center,rgba(255,248,229,.78),transparent 68%),
          repeating-linear-gradient(0deg,rgba(115,75,37,.035) 0 1px,transparent 1px 5px),
          linear-gradient(90deg,#cda879 0%,#ead2ac 5%,#f7e9cf 17%,#f6e7cc 83%,#e5c99d 95%,#c79e6c 100%);
          box-shadow:inset 18px 0 25px -20px #68421f,inset -18px 0 25px -20px #68421f,inset 0 0 35px rgba(125,77,30,.12);
          clip-path:polygon(1% 0,99% 0,100% 7%,99% 15%,100% 23%,99% 32%,100% 42%,99% 51%,100% 61%,99% 72%,100% 83%,99% 94%,98% 100%,2% 100%,1% 94%,0 84%,1% 73%,0 62%,1% 51%,0 40%,1% 29%,0 18%,1% 8%);
          transition:max-height 2.6s cubic-bezier(.65,0,.35,1),min-height 2.6s cubic-bezier(.65,0,.35,1),opacity 1s ease,padding 2s ease; }
        .scroll.is-open .scroll-body { max-height:1600px; min-height:1120px; opacity:1; padding:0 68px; }
        .parchment-content { min-height:1120px; box-sizing:border-box; padding:65px 0 55px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }
        .roller { position:absolute; z-index:6; left:calc(-1 * var(--overhang)); width:calc(100% + 2 * var(--overhang)); height:var(--roller-h); border:1px solid rgba(83,49,22,.55); border-radius:999px;
          box-sizing:border-box; overflow:visible; background:linear-gradient(180deg,#fff0c9 0%,#d8ae70 14%,#9d672f 27%,#f0d29a 43%,#c18a49 58%,#855126 78%,#f2d8a4 94%,#89572c 100%);
          box-shadow:0 9px 16px rgba(60,37,18,.35),inset 0 5px 7px rgba(255,248,220,.8),inset 0 -5px 8px rgba(69,39,17,.35); transition:top 2.6s cubic-bezier(.65,0,.35,1),opacity .7s ease; }
        .roller::before { content:""; position:absolute; inset:7px 32px; border-radius:inherit; background:repeating-linear-gradient(90deg,transparent 0 24px,rgba(91,54,23,.23) 25px 28px,rgba(255,237,192,.35) 29px 32px,transparent 33px 46px); }
        .roller-top { top:0; } .roller-bottom { top:0; opacity:0; }
        .scroll.is-open .roller-top { top:0; } .scroll.is-open .roller-bottom { top:calc(100% - var(--roller-h)); opacity:1; }
        .roller-cap { position:absolute; top:8px; width:48px; height:46px; border-radius:48%; border:1px solid rgba(68,40,19,.65); background:linear-gradient(90deg,#4c2b16,#98612f,#e4bd7d,#a66e36,#563116); box-shadow:inset 0 3px 5px rgba(255,238,195,.6),0 3px 5px rgba(48,28,13,.3); }
        .roller-cap::before { content:""; position:absolute; inset:5px 10px; border-left:4px solid rgba(69,39,17,.45); border-right:4px solid rgba(255,231,181,.5); border-radius:50%; }
        .roller-cap.left { left:-29px; } .roller-cap.right { right:-29px; transform:scaleX(-1); }
        .scroll-seal { position:absolute; z-index:9; top:9px; left:50%; width:92px; height:92px; display:flex; align-items:center; justify-content:center; transform:translateX(-50%) rotate(-5deg); border:3px solid #5c1021; border-radius:46% 54% 51% 49%/53% 46% 54% 47%; color:#f0d29a;
          background:radial-gradient(circle at 32% 24%,rgba(255,178,155,.35),transparent 25%),radial-gradient(circle at 48% 45%,#a52c40 0%,#86172c 54%,#4b091b 100%); box-shadow:0 7px 13px rgba(48,16,20,.45),inset 0 3px 5px rgba(255,210,185,.35),inset 0 -5px 8px rgba(40,4,16,.45); transition:opacity .6s ease,transform .8s ease; }
        .scroll-seal::before { content:""; position:absolute; inset:8px; border:1px solid rgba(239,198,132,.8); border-radius:48%; box-shadow:inset 0 0 0 2px rgba(70,8,23,.35); }
        .scroll-seal span { position:relative; z-index:1; font:24px Georgia,serif; letter-spacing:1px; text-shadow:0 1px 2px #3a0714; }
        .scroll-seal small { font-size:12px; font-style:italic; } .scroll-seal i { position:absolute; bottom:12px; font-size:10px; font-style:normal; }
        .scroll.is-open .scroll-seal { opacity:0; transform:translate(-50%,-18px) scale(.7) rotate(12deg); }
        .parchment-content .arabic { margin:0 0 12px; color:#79172b; font-size:43px; line-height:1.65; }
        .parchment-content .verse { margin:0 0 24px; color:#986a3b; font:21px Georgia,serif; }
        .parchment-content .rule { display:flex; align-items:center; justify-content:center; gap:17px; margin:24px auto; color:#b88b48; }
        .parchment-content .rule i { display:block; width:78px; height:1px; background:linear-gradient(90deg,transparent,#b88b48); }
        .parchment-content .rule i:last-child { transform:rotate(180deg); }
        .parchment-content .parents { margin:0; color:#93683f; font:19px/1.8 Georgia,serif; }
        .parchment-content .invite-line { max-width:610px; margin:17px 0; color:#4c3428; font:20px/1.8 Georgia,serif; }
        .parchment-content .couple-lockup { margin:18px 0; color:#7e172b; font:400 clamp(39px,4.2vw,55px)/1.35 Georgia,"Times New Roman",serif; }
        .parchment-content .couple-lockup span { display:block; margin:3px 0; color:#ad7d3c; font-size:31px; font-style:italic; }
        .parchment-content .groom-parents { margin-top:10px; } .parchment-content .event-details { max-width:630px; margin-top:22px; font-size:20px; line-height:1.9; }
        .scroll-ornament { margin-top:19px; color:#a77b3e; font:30px Georgia,serif; }
        @media(max-width:800px) { .paper.scroll-wrap{padding:95px 48px 115px}.scroll{--roller-h:48px;--overhang:43px;width:min(100%,620px)}.scroll-body,.scroll.is-open .scroll-body{padding-left:38px;padding-right:38px}.scroll.is-open .scroll-body,.parchment-content{min-height:980px}.parchment-content{padding:55px 0}.parchment-content .arabic{font-size:35px}.parchment-content .verse{font-size:17px}.parchment-content .parents{font-size:16px}.parchment-content .invite-line{font-size:17px}.parchment-content .couple-lockup{font-size:clamp(30px,6vw,43px)}.parchment-content .event-details{font-size:16px}.roller-cap{width:38px;height:37px;top:5px}.roller-cap.left{left:-24px}.roller-cap.right{right:-24px}.scroll-seal{width:76px;height:76px}.scroll-seal span{font-size:20px} }
        @media(max-width:480px) { .paper.scroll-wrap{padding:78px 37px 95px}.scroll{--roller-h:40px;--overhang:29px;width:100%;padding-top:19px}.scroll-body,.scroll.is-open .scroll-body{padding-left:22px;padding-right:22px}.scroll.is-open .scroll-body,.parchment-content{min-height:850px}.parchment-content{padding:44px 0}.parchment-content .arabic{font-size:29px}.parchment-content .verse{font-size:14px}.parchment-content .parents{font-size:13px}.parchment-content .invite-line{font-size:14px}.parchment-content .couple-lockup{font-size:clamp(25px,7vw,34px)}.parchment-content .couple-lockup span{font-size:21px}.parchment-content .rule{margin:18px auto}.parchment-content .rule i{width:42px}.parchment-content .event-details{font-size:13px}.roller-cap{width:31px;height:30px;top:4px}.roller-cap.left{left:-20px}.roller-cap.right{right:-20px}.scroll-seal{width:63px;height:63px}.scroll-seal span{font-size:17px} }
        @media(prefers-reduced-motion:reduce){.scroll-body,.roller,.scroll-seal{transition-duration:.01ms!important}}
      `}</style>
    </main>
  );
}
