import React, { useState, useRef } from 'react';

export default function UploadScreen({ onSubmit, onBack }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [audioRecording, setAudioRecording] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(5);
  const [primaryGoal, setPrimaryGoal] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioPreview(URL.createObjectURL(file));
      setAudioRecording(file);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
      setAudioRecording(file);
      setAudioPreview(URL.createObjectURL(blob));
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  const handleSubmitClick = () => {
    if (photoInputRef.current && photoInputRef.current.files[0] && audioRecording) {
      onSubmit(photoInputRef.current.files[0], audioRecording, {
        symptoms,
        sleepHours,
        stressLevel,
        primaryGoal,
      });
    }
  };

  const photoInputRef = useRef(null);

  const isReady = photoPreview && audioRecording;

  return (
    <div className="p-8 max-w-3xl w-full">
      <button onClick={onBack} className="text-gold mb-4">
        &larr; Back
      </button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="card p-6 rounded-md flex-1">
          <label className="form-label">Face Photo</label>
          <div className="row">
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={photoInputRef}
              onChange={handlePhotoChange}
              className="input"
            />
          </div>
          {photoPreview && (
            <img src={photoPreview} alt="preview" className="mt-4 max-h-48 rounded-md" />
          )}
          <p className="text-sm mt-3 muted">Use a clear, front-facing photo in natural light</p>
        </div>

        <div className="card p-6 rounded-md flex-1">
          <label className="form-label">Voice Recording</label>
          <div className="flex gap-3 mb-3">
            <button
              className="file-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Upload WAV
            </button>
            <button
              className="file-btn"
              onClick={startRecording}
            >
              Record Now
            </button>
            <button
              className="file-btn"
              onClick={stopRecording}
            >
              Stop
            </button>
          </div>
          <input
            type="file"
            accept="audio/wav"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleAudioChange}
          />
          {audioPreview && (
            <audio controls src={audioPreview} className="mt-2" />
          )}
          <p className="text-sm mt-3 muted">Speak naturally for 20–30 seconds. Read aloud, count, or describe your day.</p>
        </div>
      </div>
      <div className="mt-6 card p-6 rounded-md">
        <h3 className="font-semibold mb-3 section-acc">Optional self-report</h3>
        <label className="form-label">
          Sleep hours last night
          <input
            type="number"
            min="0"
            max="24"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            className="input ml-2 w-24"
          />
        </label>
        <label className="form-label">
          <div className="row">Stress level today <div className="ml-2">{stressLevel}</div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(e.target.value)}
              className="ml-3"
            />
          </div>
        </label>
        <label className="form-label">
          Primary wellness goal
          <select
            value={primaryGoal}
            onChange={(e) => setPrimaryGoal(e.target.value)}
            className="input ml-2"
          >
            <option value="">Select one</option>
            <option value="Energy">Energy</option>
            <option value="Sleep">Sleep</option>
            <option value="Joint Health">Joint Health</option>
            <option value="Cognitive Performance">Cognitive Performance</option>
            <option value="Longevity">Longevity</option>
            <option value="Stress Relief">Stress Relief</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="form-label">
          Any symptoms today
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="input w-full mt-2"
            rows={3}
          />
        </label>
      </div>
      <button
        className={`mt-6 px-6 py-3 rounded-md font-semibold ${
          isReady ? 'btn-gold' : 'bg-gray-600 cursor-not-allowed'
        }`}
        disabled={!isReady}
        onClick={handleSubmitClick}
      >
        Analyze My BioSignals
      </button>
    </div>
  );
}
