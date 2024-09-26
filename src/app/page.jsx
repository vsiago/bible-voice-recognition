"use client"
import { useEffect, useState } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline'; // Importação correta para v2

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [bibleText, setBibleText] = useState([]);
  const [result, setResult] = useState('');

  useEffect(() => {
    fetch('/bible.json')
      .then((response) => response.json())
      .then((data) => setBibleText(data));
  }, []);

  useEffect(() => {
    if (transcript) {
      searchInBible(transcript);
    }
  }, [transcript]);

  const searchInBible = (transcript) => {
    const found = bibleText.find(entry => entry.text.toLowerCase().includes(transcript.toLowerCase()));
    setResult(found ? `Encontrado: ${found.book} ${found.chapter}:${found.verse} - "${found.text}"` : 'Texto não encontrado.');
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };
    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-600">
      <h1 className="text-3xl font-bold mb-5">Reconhecimento de Voz da Bíblia</h1>
      <div className="text-lg mb-3">Transcrição:</div>
      <p className="border p-4 rounded-lg shadow-lg bg-white">{transcript}</p>
      <div className="text-lg mt-5">Resultado da Busca:</div>
      <p className="border p-4 rounded-lg shadow-lg bg-white">{result}</p>
      <button 
        onClick={startRecognition}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 rounded-full shadow-lg transition duration-300 hover:bg-blue-600"
      >
        <MicrophoneIcon className="h-8 w-8 text-white" />
      </button>
    </div>
  );
}
