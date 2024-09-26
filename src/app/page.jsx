"use client"
import { useEffect, useState } from 'react';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [bibleText, setBibleText] = useState([]);
  const [result, setResult] = useState('');

  useEffect(() => {
    // Carregar o texto da Bíblia do JSON
    fetch('/bible.json')
      .then((response) => response.json())
      .then((data) => setBibleText(data.map(item => item.verse)));
  }, []);

  useEffect(() => {
    if (transcript) {
      searchInBible(transcript);
    }
  }, [transcript]);

  const searchInBible = (transcript) => {
    const found = bibleText.find(verse => verse.toLowerCase().includes(transcript.toLowerCase()));
    setResult(found ? `Encontrado: "${found}"` : 'Texto não encontrado.');
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
    <div style={{ padding: '20px' }}>
      <h1>Reconhecimento de Voz</h1>
      <button onClick={startRecognition}>Iniciar Reconhecimento</button>
      <h2>Transcrição:</h2>
      <p>{transcript}</p>
      <h2>Resultado da Busca:</h2>
      <p>{result}</p>
    </div>
  );
}
