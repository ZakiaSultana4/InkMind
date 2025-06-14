// components/AIAssistant.tsx
'use client';

import React, { useState } from 'react';

interface Props {
  title: string;
  content: string;
  onUpdateContent: (newContent: string) => void;
  onUpdateTags: (tags: string[]) => void;
}

const AIAssistant: React.FC<Props> = ({ title, content, onUpdateContent, onUpdateTags }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const callAI = async (task: 'summarize' | 'tags' | 'generate') => {
    setLoading(true);

    const prompt =
      task === 'summarize'
        ? `Summarize the following blog post:\n\n${content}`
        : task === 'tags'
        ? `Suggest 5 tags for the following blog content. Return the tags as a comma-separated list:\n\n${content}`
        : `Write a full blog post based on the title: "${title}"`;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (task === 'summarize') setSummary(data.result);
      else if (task === 'tags') onUpdateTags(data.result.split(',').map((tag: string) => tag.trim()));
      else onUpdateContent(data.result);
    } catch (err) {
      alert('AI request failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 h-fit flex flex-col">
      <h3 className="text-xl font-bold mb-6 text-gray-800">AI Assistant</h3>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => callAI('summarize')}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Summarizing...' : 'Generate Summary'}
        </button>

        <button
          onClick={() => callAI('tags')}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Suggesting tags...' : 'Suggest Tags'}
        </button>

        <button
          onClick={() => callAI('generate')}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-purple-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Full Blog'}
        </button>
      </div>

      {summary && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-300 text-gray-700 text-sm whitespace-pre-line">
          <h4 className="font-semibold mb-2 text-gray-900">Summary</h4>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
