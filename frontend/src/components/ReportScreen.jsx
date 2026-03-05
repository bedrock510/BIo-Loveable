import React from 'react';

export default function ReportScreen({ data }) {
  if (!data) return null;

  const { report } = data;

  const download = () => {
    window.print();
  };

  return (
    <div className="card p-8 max-w-3xl w-full rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-serif font-semibold">White Glove Wellness® BioSignal Report</h1>
        <div className="text-sm muted">{data.session_id}</div>
      </div>
      <p className="text-sm italic mb-6 muted">Non-diagnostic wellness insights; not medical advice.</p>
      <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br>') }} />
      <div className="mt-6 flex gap-4">
        <a
          href="https://whiteglovewellness.com/contact-us"
          className="px-4 py-2 btn-gold rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Speak with a Care Coordinator
        </a>
        <button
          onClick={download}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}
