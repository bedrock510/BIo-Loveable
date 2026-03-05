import React from 'react';

export default function LoadingScreen({ message }) {
  return (
    <div className="text-center p-8">
      <div className="animate-pulse text-gold text-6xl mb-6">⭘</div>
      <p className="muted">{message}</p>
    </div>
  );
}
