import { useState, useRef, useEffect } from "react";

const WGW_LOGO = "https://whiteglovewellness.com/wp-content/uploads/2024/04/W-logo.png";

// ─── Shared styles ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: #ffffff;
    --off-white: #f8f6f3;
    --warm-gray: #f0ede8;
    --mid-gray: #d6d0c8;
    --text-dark: #1a1714;
    --text-mid: #4a4540;
    --text-light: #8a8278;
    --gold: #b89a6a;
    --gold-light: #d4b88a;
    --gold-pale: #f0e8d8;
    --border: #e8e2d8;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Jost', sans-serif;
    --shadow-soft: 0 2px 24px rgba(26,23,20,0.06);
    --shadow-card: 0 4px 40px rgba(26,23,20,0.08);
    --transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body {
    font-family: var(--font-body);
    background: var(--white);
    color: var(--text-dark);
    -webkit-font-smoothing: antialiased;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .nav-logo img { width: 32px; height: 32px; object-fit: contain; filter: invert(1); }
  .nav-brand {
    font-family: var(--font-display);
    font-size: 16px; font-weight: 500; letter-spacing: 0.12em;
    color: var(--text-dark); text-transform: uppercase;
  }
  .nav-tagline {
    font-family: var(--font-body);
    font-size: 11px; font-weight: 300; letter-spacing: 0.2em;
    color: var(--text-light); text-transform: uppercase;
  }

  /* PAGE WRAPPER */
  .page {
    min-height: 100vh;
    padding-top: 80px;
    animation: fadeIn 0.6s ease forwards;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  /* GOLD DIVIDER */
  .divider {
    width: 40px; height: 1px; background: var(--gold);
    margin: 20px auto;
  }
  .divider-left { margin: 20px 0; }

  /* STEP INDICATOR */
  .step-indicator {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-bottom: 48px;
  }
  .step-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--mid-gray); transition: var(--transition);
  }
  .step-dot.active { background: var(--gold); transform: scale(1.4); }
  .step-dot.done { background: var(--gold-light); }

  /* BUTTONS */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 40px;
    background: var(--text-dark);
    color: var(--white);
    border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 11px;
    font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase;
    transition: var(--transition);
  }
  .btn-primary:hover { background: var(--gold); }
  .btn-primary:disabled { background: var(--mid-gray); cursor: not-allowed; }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px;
    background: transparent;
    color: var(--text-dark);
    border: 1px solid var(--border); cursor: pointer;
    font-family: var(--font-body); font-size: 11px;
    font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase;
    transition: var(--transition);
  }
  .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }

  .btn-gold {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 40px;
    background: var(--gold);
    color: var(--white);
    border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 11px;
    font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase;
    transition: var(--transition);
  }
  .btn-gold:hover { background: var(--text-dark); }

  /* CARDS */
  .card {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 32px;
    transition: var(--transition);
  }
  .card:hover { box-shadow: var(--shadow-card); border-color: var(--gold-light); }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 1px dashed var(--mid-gray);
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
    background: var(--off-white);
    position: relative;
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--gold);
    background: var(--gold-pale);
  }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  /* FORM ELEMENTS */
  .form-group { margin-bottom: 24px; }
  .form-label {
    display: block; margin-bottom: 8px;
    font-size: 10px; font-weight: 500; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--text-light);
  }
  .form-input {
    width: 100%; padding: 12px 16px;
    border: 1px solid var(--border);
    background: var(--white);
    font-family: var(--font-body); font-size: 14px;
    color: var(--text-dark); outline: none;
    transition: var(--transition);
  }
  .form-input:focus { border-color: var(--gold); }
  .form-select {
    width: 100%; padding: 12px 16px;
    border: 1px solid var(--border);
    background: var(--white);
    font-family: var(--font-body); font-size: 14px;
    color: var(--text-dark); outline: none;
    appearance: none; cursor: pointer;
    transition: var(--transition);
  }
  .form-select:focus { border-color: var(--gold); }

  /* RANGE SLIDER */
  .slider-wrap { position: relative; padding: 8px 0; }
  .form-range {
    width: 100%; height: 2px;
    appearance: none; background: var(--border);
    outline: none; cursor: pointer;
  }
  .form-range::-webkit-slider-thumb {
    appearance: none; width: 16px; height: 16px;
    background: var(--gold); border-radius: 50%;
    cursor: pointer;
  }
  .slider-labels {
    display: flex; justify-content: space-between;
    margin-top: 6px;
    font-size: 10px; color: var(--text-light); letter-spacing: 0.1em;
  }

  /* RECORD BUTTON */
  .record-btn {
    width: 64px; height: 64px; border-radius: 50%;
    border: 2px solid var(--gold);
    background: var(--white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; margin: 0 auto 16px;
    transition: var(--transition);
  }
  .record-btn:hover { background: var(--gold-pale); }
  .record-btn.recording {
    background: #fee2e2; border-color: #ef4444;
    animation: pulse-red 1.2s ease infinite;
  }
  @keyframes pulse-red {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
    50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
  }

  /* LOADING */
  .loading-page {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: var(--off-white);
    gap: 40px;
  }
  .waveform {
    display: flex; align-items: center; gap: 4px; height: 48px;
  }
  .wave-bar {
    width: 3px; background: var(--gold);
    border-radius: 2px;
    animation: wave 1.2s ease-in-out infinite;
  }
  .wave-bar:nth-child(1) { animation-delay: 0s; }
  .wave-bar:nth-child(2) { animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { animation-delay: 0.4s; }
  .wave-bar:nth-child(6) { animation-delay: 0.3s; }
  .wave-bar:nth-child(7) { animation-delay: 0.2s; }
  .wave-bar:nth-child(8) { animation-delay: 0.1s; }
  .wave-bar:nth-child(9) { animation-delay: 0s; }
  @keyframes wave {
    0%, 100% { height: 8px; opacity: 0.4; }
    50% { height: 40px; opacity: 1; }
  }

  /* REPORT */
  .report-header {
    background: var(--off-white);
    border-bottom: 1px solid var(--border);
    padding: 64px 0 48px;
    text-align: center;
  }
  .score-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border);
    border: 1px solid var(--border);
    margin: 40px 0;
  }
  .score-cell {
    background: var(--white);
    padding: 24px 20px; text-align: center;
  }
  .score-pct {
    font-family: var(--font-display);
    font-size: 36px; font-weight: 300;
    color: var(--text-dark); line-height: 1;
  }
  .score-pct.low { color: #c17b2a; }
  .score-pct.mid { color: var(--text-mid); }
  .score-pct.high { color: #4a7c59; }
  .score-name {
    font-size: 9px; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--text-light);
    margin-top: 8px;
  }
  .score-bar {
    height: 2px; background: var(--border); margin-top: 12px;
    position: relative; overflow: hidden;
  }
  .score-bar-fill {
    position: absolute; left: 0; top: 0; height: 100%;
    background: var(--gold); transition: width 1s ease;
  }

  .report-body {
    max-width: 760px; margin: 0 auto;
    padding: 0 32px 80px;
  }
  .report-section { margin-bottom: 48px; }
  .report-section-label {
    font-size: 9px; font-weight: 500; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 16px;
  }
  .report-text {
    font-family: var(--font-body);
    font-size: 15px; line-height: 1.85;
    color: var(--text-mid);
    white-space: pre-wrap;
  }
  .report-text strong { color: var(--text-dark); font-weight: 500; }

  .flag-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    background: #fef3e2; border: 1px solid #f0c070;
    font-size: 10px; font-weight: 500; letter-spacing: 0.15em;
    text-transform: uppercase; color: #8a5c10;
    margin: 4px;
  }

  .cta-bar {
    background: var(--off-white);
    border-top: 1px solid var(--border);
    padding: 48px 32px; text-align: center;
  }

  /* DISCLAIMER */
  .disclaimer {
    font-size: 11px; color: var(--text-light);
    font-style: italic; line-height: 1.7;
    padding: 16px 0; border-top: 1px solid var(--border);
    text-align: center; margin-top: 32px;
  }

  /* TOGGLE TABS */
  .tab-row {
    display: flex; border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }
  .tab-btn {
    padding: 12px 24px; background: none; border: none;
    font-family: var(--font-body); font-size: 11px;
    font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-light); cursor: pointer;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: var(--transition);
  }
  .tab-btn.active {
    color: var(--text-dark);
    border-bottom-color: var(--gold);
  }

  /* LAYOUT HELPERS */
  .container { max-width: 1100px; margin: 0 auto; padding: 0 48px; }
  .container-narrow { max-width: 760px; margin: 0 auto; padding: 0 48px; }
  .center { text-align: center; }
  .mt-8 { margin-top: 8px; }
  .mt-16 { margin-top: 16px; }
  .mt-24 { margin-top: 24px; }
  .mt-32 { margin-top: 32px; }
  .mt-48 { margin-top: 48px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  @media (max-width: 768px) {
    .nav { padding: 16px 24px; }
    .container, .container-narrow { padding: 0 24px; }
    .grid-2 { grid-template-columns: 1fr; }
    .score-grid { grid-template-columns: repeat(2, 1fr); }
    .nav-tagline { display: none; }
  }
`;

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <a className="nav-logo" href="#">
        <img src={WGW_LOGO} alt="WGW" onError={e => { e.target.style.display='none'; }} />
        <div>
          <div className="nav-brand">White Glove Wellness</div>
          <div className="nav-tagline">BioSignal Intelligence</div>
        </div>
      </a>
      <a href="https://whiteglovewellness.com/contact-us/" target="_blank" rel="noopener noreferrer">
        <button className="btn-secondary">Contact Us</button>
      </a>
    </nav>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function Steps({ current }) {
  return (
    <div className="step-indicator">
      {[0,1,2,3].map(i => (
        <div key={i} className={`step-dot ${i === current ? 'active' : i < current ? 'done' : ''}`} />
      ))}
    </div>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  return (
    <div className="page" style={{ background: 'var(--white)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 48px 0', textAlign: 'center' }}>
        <Steps current={0} />

        <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 24 }}>
          BioSignal Intelligence Scan
        </p>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-dark)', marginBottom: 24 }}>
          Your Body<br />
          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Speaks.</em><br />
          We Listen.
        </h1>

        <div className="divider" />

        <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: 'var(--text-mid)', maxWidth: 520, margin: '0 auto 48px' }}>
          Upload a clear photo and a short voice recording. Our system cross-references your biometric signals and generates a personalized, data-forward wellness insight report — in under a minute.
        </p>

        <button className="btn-primary" onClick={onStart} style={{ fontSize: 11 }}>
          Begin Your Scan →
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Non-Diagnostic', sub: 'Wellness insights only' },
            { label: 'Private', sub: 'No data stored' },
            { label: 'Science-Based', sub: 'Biometric analysis' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <p className="disclaimer" style={{ maxWidth: 520, margin: '32px auto 0' }}>
          This tool provides non-diagnostic wellness insights only and does not constitute medical advice. Always consult a qualified healthcare provider for any health concerns.
        </p>
      </div>
    </div>
  );
}

// ─── Upload Screen ────────────────────────────────────────────────────────────
function UploadScreen({ onSubmit }) {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioTab, setAudioTab] = useState('upload');
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(5);
  const [goal, setGoal] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleAudioFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    setAudioURL(URL.createObjectURL(file));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioFile(new File([blob], 'recording.wav', { type: 'audio/wav' }));
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch { alert('Microphone access required for recording.'); }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const canSubmit = photo && audioFile;

  const handleSubmit = () => {
    onSubmit({ photo, audioFile, sleepHours, stressLevel, goal, symptoms });
  };

  const fmt = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="center" style={{ marginBottom: 48 }}>
          <Steps current={1} />
          <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Step 01</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text-dark)' }}>Upload Your Signals</h2>
          <div className="divider" />
          <p style={{ fontSize: 14, color: 'var(--text-light)', fontWeight: 300, maxWidth: 500, margin: '0 auto' }}>
            A clear front-facing photo and a 20–30 second voice sample. Our system will do the rest.
          </p>
        </div>

        <div className="grid-2" style={{ marginBottom: 32 }}>
          {/* PHOTO */}
          <div className="card">
            <p className="form-label">Face Photo</p>
            <div className="upload-zone" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handlePhoto} />
              {photoPreview ? (
                <img src={photoPreview} alt="preview" style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--mid-gray)' }}>◎</div>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 300 }}>Click or drag photo here</p>
                  <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 4 }}>JPG or PNG · Natural light · Front-facing</p>
                </>
              )}
            </div>
            {photo && <p style={{ fontSize: 11, color: 'var(--gold)', marginTop: 10, letterSpacing: '0.1em' }}>✓ {photo.name}</p>}
          </div>

          {/* AUDIO */}
          <div className="card">
            <p className="form-label">Voice Recording</p>
            <div className="tab-row">
              <button className={`tab-btn ${audioTab === 'upload' ? 'active' : ''}`} onClick={() => setAudioTab('upload')}>Upload WAV</button>
              <button className={`tab-btn ${audioTab === 'record' ? 'active' : ''}`} onClick={() => setAudioTab('record')}>Record Now</button>
            </div>

            {audioTab === 'upload' ? (
              <div className="upload-zone" style={{ minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" accept="audio/wav,audio/*" onChange={handleAudioFile} />
                <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--mid-gray)' }}>♪</div>
                <p style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 300 }}>Click or drag audio file here</p>
                <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 4 }}>WAV preferred · 20–30 seconds</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <button className={`record-btn ${recording ? 'recording' : ''}`} onClick={recording ? stopRecording : startRecording}>
                  {recording
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)"><circle cx="12" cy="12" r="7"/></svg>
                  }
                </button>
                <p style={{ fontSize: 12, color: recording ? '#ef4444' : 'var(--text-light)', fontWeight: recording ? 500 : 300 }}>
                  {recording ? `Recording… ${fmt(recordingTime)}` : 'Tap to begin recording'}
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 4 }}>
                  Speak naturally for 20–30 seconds
                </p>
              </div>
            )}

            {audioURL && (
              <div style={{ marginTop: 12 }}>
                <audio controls src={audioURL} style={{ width: '100%', height: 36 }} />
                <p style={{ fontSize: 11, color: 'var(--gold)', marginTop: 6, letterSpacing: '0.1em' }}>✓ Audio ready</p>
              </div>
            )}
          </div>
        </div>

        {/* SELF REPORT */}
        <div className="card" style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 4 }}>Self-Report</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 24, fontWeight: 300 }}>Optional — helps calibrate your results</p>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Sleep Hours Last Night</label>
              <div className="slider-wrap">
                <input type="range" className="form-range" min={3} max={12} step={0.5} value={sleepHours}
                  onChange={e => setSleepHours(parseFloat(e.target.value))} />
                <div className="slider-labels">
                  <span>3 hrs</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{sleepHours} hrs</span>
                  <span>12 hrs</span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Stress Level Today</label>
              <div className="slider-wrap">
                <input type="range" className="form-range" min={1} max={10} step={1} value={stressLevel}
                  onChange={e => setStressLevel(parseInt(e.target.value))} />
                <div className="slider-labels">
                  <span>1 — Low</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{stressLevel} / 10</span>
                  <span>10 — High</span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Wellness Goal</label>
              <select className="form-select" value={goal} onChange={e => setGoal(e.target.value)}>
                <option value="">Select a goal</option>
                {['Energy & Vitality','Sleep Quality','Joint & Muscle Health','Cognitive Performance','Longevity','Stress Relief','Hormone Balance','Other'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Any Symptoms Today?</label>
              <input type="text" className="form-input" placeholder="e.g. fatigue, tension headache…"
                value={symptoms} onChange={e => setSymptoms(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={!canSubmit} style={{ fontSize: 11 }}>
            {canSubmit ? 'Analyze My BioSignals →' : 'Upload Photo + Audio to Continue'}
          </button>
          {!canSubmit && (
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 12 }}>
              {!photo ? '⚬ Photo required' : ''} {!audioFile ? '⚬ Audio required' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  const messages = [
    'Reading facial tension markers…',
    'Analyzing vocal patterns…',
    'Cross-referencing biometric signals…',
    'Mapping nervous system indicators…',
    'Generating your wellness report…',
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % messages.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="loading-page">
      <div style={{ textAlign: 'center' }}>
        <img src={WGW_LOGO} alt="WGW" style={{ width: 48, marginBottom: 32, opacity: 0.3, filter: 'invert(1)' }}
          onError={e => { e.target.style.display='none'; }} />

        <div className="waveform" style={{ justifyContent: 'center', marginBottom: 40 }}>
          {Array.from({length: 9}, (_,i) => (
            <div key={i} className="wave-bar" style={{ animationDelay: `${[0,.1,.2,.3,.4,.3,.2,.1,0][i]}s` }} />
          ))}
        </div>

        <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
          Analysis in Progress
        </p>

        <p key={msgIdx} style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300,
          color: 'var(--text-mid)', animation: 'fadeIn 0.5s ease',
          minHeight: 32
        }}>
          {messages[msgIdx]}
        </p>

        <div style={{ marginTop: 48, display: 'flex', gap: 8, justifyContent: 'center' }}>
          {Array.from({length: 5}, (_,i) => (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: i === msgIdx % 5 ? 'var(--gold)' : 'var(--border)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Report Screen ────────────────────────────────────────────────────────────
function ScoreRow({ label, value, description }) {
  const pct = Math.round((value ?? 0) * 100);
  const getStatus = v => v >= 0.65 ? { word: 'Optimal', color: '#4a7c59' } : v >= 0.35 ? { word: 'Moderate', color: '#8a7050' } : { word: 'Attention', color: '#b06030' };
  const status = getStatus(value ?? 0);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto',
      alignItems: 'start', gap: 24,
      padding: '28px 0', borderBottom: '1px solid var(--border)',
      animation: 'fadeIn 0.5s ease forwards',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dark)' }}>
            {label}
          </p>
          <span style={{
            fontSize: 9, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: status.color, padding: '3px 8px',
            border: `1px solid ${status.color}22`,
            background: `${status.color}08`,
          }}>
            {status.word}
          </span>
        </div>
        {description && (
          <p style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 300, lineHeight: 1.7, maxWidth: 480 }}>
            {description}
          </p>
        )}
        <div style={{ marginTop: 12, height: 1, background: 'var(--border)', position: 'relative', maxWidth: 320 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${pct}%`, background: status.color,
            transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
      </div>
      <div style={{ textAlign: 'right', paddingTop: 2 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 300,
          color: status.color, lineHeight: 1,
        }}>{pct}</span>
        <span style={{ fontSize: 14, color: 'var(--text-light)', fontWeight: 300 }}>%</span>
      </div>
    </div>
  );
}

function ReportScreen({ report, scores, flags }) {
  const activeFlags = Object.entries(flags || {}).filter(([,v]) => v);

  const scoreConfig = [
    { key: 'nervous_system_balance', label: 'Nervous System Balance', description: 'The equilibrium between your activating and restorative systems — a foundational marker of resilience.' },
    { key: 'stress_load', label: 'Stress Load', description: 'The cumulative tension your body is currently carrying, as read across facial and vocal signal patterns.' },
    { key: 'recovery_capacity', label: 'Recovery Capacity', description: 'Your system\'s current ability to restore and replenish between periods of demand.' },
    { key: 'breath_stability', label: 'Breath Stability', description: 'The consistency and regulation of your respiratory rhythm — a direct window into nervous system anchoring.' },
    { key: 'cognitive_fluency', label: 'Cognitive Fluency', description: 'The ease and clarity with which your mind is currently processing and engaging.' },
    { key: 'emotional_variability', label: 'Emotional Range', description: 'The richness and responsiveness of your emotional expression as detected through facial and vocal analysis.' },
    { key: 'vocal_strength_stability', label: 'Vocal Strength & Stability', description: 'How fully and consistently your voice is carrying energy and intention outward.' },
    { key: 'facial_tension_load', label: 'Facial Tension', description: 'The physical tension held in your face — brow, jaw, and eyes — as a measure of stored physiological load.' },
  ];

  // Parse report text into sections
  const parseReport = (text) => {
    if (!text) return [];
    const lines = text.split('\n').filter(l => l.trim());
    const sections = [];
    let current = null;
    for (const line of lines) {
      const isHeading = line.startsWith('##') || line.startsWith('**') || /^[A-Z][A-Za-z\s&]+:$/.test(line.trim());
      const clean = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/_/g, '');
      if (isHeading || (line.length < 60 && !line.includes('.'))) {
        if (current) sections.push(current);
        current = { heading: clean, body: [] };
      } else {
        if (!current) current = { heading: null, body: [] };
        if (clean.trim()) current.body.push(clean.trim());
      }
    }
    if (current) sections.push(current);
    return sections;
  };

  const sections = parseReport(report);

  return (
    <div className="page" style={{ paddingTop: 80, background: 'var(--white)' }}>

      {/* Masthead */}
      <div style={{
        background: 'var(--off-white)', borderBottom: '1px solid var(--border)',
        padding: '72px 0 56px',
      }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
            White Glove Wellness® — BioSignal Intelligence
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 300, color: 'var(--text-dark)', lineHeight: 1.1, marginBottom: 16 }}>
            Your Personal<br /><em style={{ fontStyle: 'italic' }}>Wellness Report</em>
          </h1>
          <div className="divider" />
          <p style={{ fontSize: 12, color: 'var(--text-light)', letterSpacing: '0.15em', marginTop: 20 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          {/* Attention notices — only if flags triggered */}
          {activeFlags.length > 0 && (
            <div style={{
              marginTop: 32, padding: '20px 28px',
              background: 'var(--white)', border: '1px solid #e8d5b0',
              textAlign: 'left',
            }}>
              <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
                Patterns Requiring Attention
              </p>
              {activeFlags.map(([key]) => (
                <p key={key} style={{ fontSize: 13, color: 'var(--text-mid)', fontWeight: 300, lineHeight: 1.7, marginBottom: 4 }}>
                  — {key.replace(/_/g, ' ').replace('possible ', '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} pattern detected
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout: scores left, report right */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, paddingTop: 64 }}>

          {/* Left — Signal Readings */}
          <div style={{ paddingRight: 56, paddingBottom: 80 }}>
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 32 }}>
              Signal Readings
            </p>

            {scores && scoreConfig.map(({ key, label, description }) => (
              <ScoreRow key={key} label={label} value={scores[key]} description={description} />
            ))}

          </div>

          {/* Vertical divider */}
          <div style={{ background: 'var(--border)', margin: '0 0' }} />

          {/* Right — Analysis */}
          <div style={{ paddingLeft: 56, paddingBottom: 80 }}>
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 32 }}>
              Personalized Analysis
            </p>

            {sections.length > 0 ? sections.map((section, i) => (
              <div key={i} style={{ marginBottom: 36, position: 'relative' }}>
                {section.heading && !section.heading.toLowerCase().includes('disclaimer') && (
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400,
                    color: 'var(--text-dark)', marginBottom: 12, lineHeight: 1.3,
                  }}>
                    {section.heading}
                  </p>
                )}



                {section.body.map((para, j) => (
                  !para.toLowerCase().includes('non-diagnostic') && (
                    <p key={j} style={{
                      fontSize: 14, lineHeight: 1.9, color: 'var(--text-mid)',
                      fontWeight: 300, marginBottom: 14,
                    }}>
                      {para}
                    </p>
                  )
                ))}
              </div>
            )) : (
              <p style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--text-mid)', fontWeight: 300 }}>
                {report || 'No report generated.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--off-white)', padding: '32px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--text-light)', fontStyle: 'italic', lineHeight: 1.8, maxWidth: 680, margin: '0 auto' }}>
          This report contains non-diagnostic wellness insights only and does not constitute medical advice. White Glove Wellness® services are wellness support — not FDA-approved treatments. Always consult a qualified healthcare provider for any health concerns.
        </p>
      </div>

      {/* CTA */}
      <div className="cta-bar">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, marginBottom: 8 }}>
          Ready to go deeper?
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 300, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
          A White Glove Wellness® care coordinator can walk you through these findings and design a protocol around your specific patterns.
        </p>
        <a href="https://whiteglovewellness.com/contact-us/" target="_blank" rel="noopener noreferrer">
          <button className="btn-gold">Speak with a Care Coordinator →</button>
        </a>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('welcome'); // welcome | upload | loading | report
  const [reportData, setReportData] = useState(null);

  const handleUploadSubmit = async (formData) => {
    setScreen('loading');

    try {
      const fd = new FormData();
      fd.append('photo', formData.photo);
      fd.append('audio', formData.audioFile);
      fd.append('symptoms', formData.symptoms || '');
      fd.append('sleep_hours', formData.sleepHours);
      fd.append('stress_level', formData.stressLevel);
      fd.append('primary_goal', formData.goal || '');

      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (data.emergency) {
        alert(data.message);
        setScreen('upload');
        return;
      }

      setReportData(data);
      setScreen('report');
    } catch (err) {
      alert('Analysis failed. Please ensure the backend is running at http://localhost:8000');
      setScreen('upload');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Nav />
      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('upload')} />}
      {screen === 'upload' && <UploadScreen onSubmit={handleUploadSubmit} />}
      {screen === 'loading' && <LoadingScreen />}
      {screen === 'report' && (
        <ReportScreen
          report={reportData?.report}
          scores={reportData?.scores}
          flags={reportData?.flags}
        />
      )}
    </>
  );
}
