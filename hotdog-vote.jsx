import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Boogaloo&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');`;

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Mono', monospace;
    background: #FFF9F0;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 60px;
    position: relative;
  }

  /* Mustard zigzag top border */
  .wrapper::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 12px;
    background: repeating-linear-gradient(
      90deg,
      #F5C400 0px, #F5C400 20px,
      #E8380D 20px, #E8380D 40px
    );
    z-index: 100;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
    margin-top: 20px;
  }

  .hotdog-emoji {
    font-size: 72px;
    display: block;
    animation: wobble 3s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.15));
  }

  @keyframes wobble {
    0%, 100% { transform: rotate(-5deg) scale(1); }
    50% { transform: rotate(5deg) scale(1.05); }
  }

  h1 {
    font-family: 'Boogaloo', cursive;
    font-size: clamp(2.2rem, 6vw, 4rem);
    color: #1A0A00;
    line-height: 1.1;
    margin-top: 16px;
    letter-spacing: 1px;
  }

  h1 span {
    color: #E8380D;
  }

  .subtitle {
    font-size: 0.8rem;
    color: #8B6040;
    margin-top: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  /* VOTE CARDS */
  .vote-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
    max-width: 680px;
    margin-bottom: 40px;
  }

  @media (max-width: 500px) {
    .vote-section { grid-template-columns: 1fr; }
  }

  .vote-card {
    border: 3px solid #1A0A00;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    position: relative;
    overflow: hidden;
    user-select: none;
  }

  .vote-card::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .vote-card:hover:not(.voted) {
    transform: translateY(-4px);
    box-shadow: 6px 6px 0 #1A0A00;
  }

  .vote-card:active:not(.voted) {
    transform: translateY(0);
    box-shadow: 2px 2px 0 #1A0A00;
  }

  .card-yes {
    background: #FFF3C4;
  }
  .card-yes:hover:not(.voted) { background: #FFE566; }

  .card-no {
    background: #FFE5E0;
  }
  .card-no:hover:not(.voted) { background: #FFB8A8; }

  .card-emoji {
    font-size: 52px;
    display: block;
    margin-bottom: 12px;
  }

  .card-label {
    font-family: 'Boogaloo', cursive;
    font-size: 1.8rem;
    color: #1A0A00;
    display: block;
    margin-bottom: 6px;
  }

  .card-desc {
    font-size: 0.72rem;
    color: #6B4C2A;
    line-height: 1.5;
    font-style: italic;
  }

  .vote-card.selected {
    border-width: 4px;
    transform: scale(1.03);
  }
  .card-yes.selected { border-color: #D4A000; box-shadow: 6px 6px 0 #D4A000; }
  .card-no.selected { border-color: #E8380D; box-shadow: 6px 6px 0 #E8380D; }

  .checkmark {
    position: absolute;
    top: 12px; right: 14px;
    font-size: 1.4rem;
  }

  /* RESULTS */
  .results-box {
    width: 100%;
    max-width: 680px;
    border: 3px solid #1A0A00;
    border-radius: 16px;
    background: white;
    padding: 28px 28px 32px;
    box-shadow: 5px 5px 0 #1A0A00;
  }

  .results-title {
    font-family: 'Boogaloo', cursive;
    font-size: 1.2rem;
    color: #1A0A00;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bar-row {
    margin-bottom: 18px;
  }

  .bar-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 0.78rem;
    color: #3A2010;
  }

  .bar-label { font-weight: 500; }
  .bar-pct { font-weight: 500; }

  .bar-track {
    height: 28px;
    border-radius: 8px;
    background: #F0E8DC;
    border: 2px solid #1A0A00;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .bar-yes .bar-fill { background: linear-gradient(90deg, #F5C400, #FFE566); }
  .bar-no .bar-fill { background: linear-gradient(90deg, #E8380D, #FF6B4A); }

  .total-votes {
    text-align: center;
    font-size: 0.75rem;
    color: #8B6040;
    margin-top: 20px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .total-votes strong {
    font-size: 1.4rem;
    font-family: 'Boogaloo', cursive;
    color: #1A0A00;
    display: block;
    margin-bottom: 2px;
  }

  /* Verdict */
  .verdict {
    text-align: center;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 2px dashed #D4B896;
  }

  .verdict-text {
    font-family: 'Boogaloo', cursive;
    font-size: 1.5rem;
    color: #1A0A00;
  }

  .verdict-sub {
    font-size: 0.72rem;
    color: #8B6040;
    margin-top: 4px;
    font-style: italic;
  }

  /* already voted message */
  .already-voted {
    text-align: center;
    font-size: 0.78rem;
    color: #8B6040;
    margin-top: 16px;
    font-style: italic;
  }

  /* loading */
  .loading {
    text-align: center;
    color: #8B6040;
    font-size: 0.85rem;
    padding: 20px;
    letter-spacing: 0.05em;
  }

  .pop {
    animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes pop {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .confetti-wrap {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 200;
  }

  .footer-quote {
    margin-top: 48px;
    font-size: 0.72rem;
    color: #C4A882;
    text-align: center;
    font-style: italic;
    max-width: 360px;
    line-height: 1.6;
  }
`;

function Confetti({ show }) {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#F5C400', '#E8380D', '#4CAF50', '#2196F3', '#FF69B4'][i % 5],
    delay: Math.random() * 0.5,
    size: 8 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  if (!show) return null;

  return (
    <div className="confetti-wrap">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: 0,
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          animation: `fall ${1.5 + Math.random()}s ease-in ${p.delay}s forwards`,
          transform: `rotate(${p.rotation}deg)`,
        }} />
      ))}
    </div>
  );
}

const VERDICTS = {
  yes: [
    "🌭 The people have spoken. It's a sandwich.",
    "🥪 Science (democracy) has settled this.",
    "🌭 A sandwich by any other name would taste as sweet.",
  ],
  no: [
    "🌭 The hotdog transcends categorization.",
    "🚫 Some things cannot be sandwiched. This is one.",
    "🌭 It stands alone. It always has.",
  ],
  tied: [
    "🤝 A nation divided. As it should be.",
    "⚖️ Perfect democracy. Perfect chaos.",
    "😤 No consensus. This debate lives on.",
  ]
};

function getVerdict(yesVotes, noVotes) {
  const total = yesVotes + noVotes;
  if (total === 0) return null;
  const diff = yesVotes - noVotes;
  if (Math.abs(diff) < total * 0.03) {
    return VERDICTS.tied[Math.floor(Date.now() / 10000) % VERDICTS.tied.length];
  }
  const arr = yesVotes > noVotes ? VERDICTS.yes : VERDICTS.no;
  return arr[Math.floor(Date.now() / 10000) % arr.length];
}

export default function HotdogVote() {
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [userVote, setUserVote] = useState(null); // 'yes' | 'no' | null
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        // Load vote counts (shared across all users)
        const yesResult = await window.storage.get('hotdog:yes', true).catch(() => null);
        const noResult = await window.storage.get('hotdog:no', true).catch(() => null);
        const yesCount = yesResult ? parseInt(yesResult.value) || 0 : 0;
        const noCount = noResult ? parseInt(noResult.value) || 0 : 0;
        setVotes({ yes: yesCount, no: noCount });

        // Load user's personal vote
        const myVote = await window.storage.get('hotdog:myVote', false).catch(() => null);
        if (myVote) setUserVote(myVote.value);
      } catch (e) {
        // storage not available
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleVote(choice) {
    if (userVote) return;

    const newVotes = { ...votes, [choice]: votes[choice] + 1 };

    // If they previously voted differently (shouldn't happen but just in case)
    // just add the new vote
    setVotes(newVotes);
    setUserVote(choice);
    setShowConfetti(true);
    setAnimKey(k => k + 1);
    setTimeout(() => setShowConfetti(false), 2500);

    try {
      await window.storage.set(`hotdog:${choice}`, String(newVotes[choice]), true);
      await window.storage.set('hotdog:myVote', choice, false);
    } catch (e) {
      // storage error, votes are still shown locally
    }
  }

  const total = votes.yes + votes.no;
  const yesPct = total === 0 ? 50 : Math.round((votes.yes / total) * 100);
  const noPct = total === 0 ? 50 : 100 - yesPct;
  const verdict = getVerdict(votes.yes, votes.no);

  return (
    <>
      <style>{FONTS}{styles}</style>
      <Confetti show={showConfetti} />
      <div className="wrapper">
        <div className="header">
          <span className="hotdog-emoji">🌭</span>
          <h1>Is a hot dog<br />a <span>sandwich?</span></h1>
          <p className="subtitle">The most important question of our time</p>
        </div>

        <div className="vote-section">
          <div
            className={`vote-card card-yes ${userVote === 'yes' ? 'selected' : ''}`}
            onClick={() => handleVote('yes')}
            role="button"
            tabIndex={0}
          >
            {userVote === 'yes' && <span className="checkmark">✓</span>}
            <span className="card-emoji">✅</span>
            <span className="card-label">YES</span>
            <span className="card-desc">It's meat. In bread. That's literally a sandwich.</span>
          </div>

          <div
            className={`vote-card card-no ${userVote === 'no' ? 'selected' : ''}`}
            onClick={() => handleVote('no')}
            role="button"
            tabIndex={0}
          >
            {userVote === 'no' && <span className="checkmark">✓</span>}
            <span className="card-emoji">❌</span>
            <span className="card-label">NO</span>
            <span className="card-desc">A hot dog is its own category. It deserves respect.</span>
          </div>
        </div>

        {userVote && <p className="already-voted">your vote is locked in. no take-backs.</p>}

        <div className="results-box">
          <div className="results-title">📊 Global Verdict</div>

          {loading ? (
            <div className="loading">tallying votes from around the world...</div>
          ) : (
            <div key={animKey} className="pop">
              <div className="bar-row bar-yes">
                <div className="bar-meta">
                  <span className="bar-label">YES — it's a sandwich</span>
                  <span className="bar-pct">{yesPct}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${yesPct}%` }} />
                </div>
              </div>

              <div className="bar-row bar-no">
                <div className="bar-meta">
                  <span className="bar-label">NO — it is its own thing</span>
                  <span className="bar-pct">{noPct}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${noPct}%` }} />
                </div>
              </div>

              <div className="total-votes">
                <strong>{total.toLocaleString()}</strong>
                votes cast worldwide
              </div>

              {verdict && (
                <div className="verdict">
                  <div className="verdict-text">{verdict}</div>
                  <div className="verdict-sub">based on {total.toLocaleString()} votes · updates in real time</div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="footer-quote">
          "A sandwich is defined by its context, its culture, its condiments.<br />
          The hot dog contains multitudes." — probably someone, somewhere
        </p>
      </div>
    </>
  );
}
