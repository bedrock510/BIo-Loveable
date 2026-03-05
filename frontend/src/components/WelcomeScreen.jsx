import React from 'react';

export default function WelcomeScreen({ onBegin }) {
  return (
    <div className="card text-center p-10 max-w-lg">
      <h1 className="text-4xl font-semibold mb-2 logo">White Glove Wellness®</h1>
      <h2 className="text-2xl mb-4 headline">Your BioSignal Intelligence Scan</h2>
      <p className="mb-6 muted">
        Upload a clear photo and a short voice recording. Our system will analyze your biometric
        signals and generate a personalized wellness insight report.
      </p>
      <button
        className="px-8 py-3 btn-gold rounded-md font-semibold text-base"
        onClick={onBegin}
      >
        Begin Scan
      </button>
    </div>
  );
}
