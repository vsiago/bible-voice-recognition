"use client"
import { useEffect, useState } from 'react';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [bibleText, setBibleText] = useState([]);
  const [result, setResult] = useState('');

  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Reconhecimento de Voz</h1>
      <h2>Transcrição:</h2>
      <p>{transcript}</p>
      <h2>Resultado da Busca:</h2>
      <p>{result}</p>
    </div>
  );
}
