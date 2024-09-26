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
      .then((data) => {
        setBibleText(data);
        console.log('Texto da Bíblia carregado:', data); // Verifica os dados carregados
      });
  }, []);

  useEffect(() => {
    if (transcript) {
      searchInBible(transcript);
    }
  }, [transcript]);

  const searchInBible = (transcript) => {
    console.log('Transcrição recebida:', transcript); // Verifica a transcrição
    const threshold = 3; // Limite de distância para considerar uma correspondência
    const results = bibleText.filter(entry => {
      const distance = levenshteinDistance(transcript.toLowerCase(), entry.text.toLowerCase());
      console.log(`Comparando "${transcript.toLowerCase()}" com "${entry.text.toLowerCase()}" - Distância: ${distance}`); // Verifica cada comparação
      return distance <= threshold;
    });

    // Atualiza o resultado
    setResult(results.length > 0 ? results.map(res => `Encontrado: ${res.book} ${res.chapter}:${res.verse} - "${res.text}"`).join('\n') : 'Texto não encontrado.');
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log('Transcrição de voz:', text); // Verifica a transcrição de voz
      setTranscript(text);
    };
    recognition.start();
  };

  const levenshteinDistance = (s1, s2) => {
    if (s1 === s2) return 0; // Se os textos forem iguais
    if (s1.length === 0) return s2.length; // Se s1 estiver vazio
    if (s2.length === 0) return s1.length; // Se s2 estiver vazio

    const dp = Array(s1.length + 1)
      .fill(null)
      .map(() => Array(s2.length + 1).fill(null));

    for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // Deletar
          dp[i][j - 1] + 1, // Inserir
          dp[i - 1][j - 1] + cost // Substituir
        );
      }
    }
    return dp[s1.length][s2.length];
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-600">
      <h1 className="text-2xl font-bold text-center my-20">Reconhecimento de <br /> Voz da Bíblia</h1>
      <div className="text-lg mb-3">Transcrição:</div>
      <p className="border p-4 rounded-lg shadow-lg bg-gray-700 w-[80%]">{transcript}</p>
      <div className="text-lg mt-5">Resultado da Busca:</div>
      <p className="border p-4 rounded-lg shadow-lg bg-gray-700 w-[80%]">{result}</p>
      <button 
        onClick={startRecognition}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 rounded-full shadow-lg transition duration-300 hover:bg-blue-600"
      >
        <MicrophoneIcon className="h-8 w-8 text-white" />
      </button>
    </div>
  );
}
