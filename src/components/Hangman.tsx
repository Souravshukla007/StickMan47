'use client';
import { useState, useEffect } from 'react';

export default function Hangman() {
    const [word, setWord] = useState('');
    const [guessed, setGuessed] = useState<string[]>([]);
    const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

    const fetchWord = async () => {
        const res = await fetch('/api/words');
        const data = await res.json();
        setWord(data.word.toLowerCase());
    };

    useEffect(() => {
        fetchWord();
    }, []);

    const handleGuess = (letter: string) => {
        if (status !== 'playing' || guessed.includes(letter)) return;
        const newGuessed = [...guessed, letter];
        setGuessed(newGuessed);

        const wrongGuesses = newGuessed.filter(l => !word.includes(l));
        if (wrongGuesses.length >= 6) setStatus('lost');
        else if (word.split('').every(l => newGuessed.includes(l))) setStatus('won');
    };

    useEffect(() => {
        if (status !== 'playing' && word) {
            fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word, guessed, status }),
            });
        }
    }, [status]);

    const wrongGuessesCount = guessed.filter(l => !word.includes(l)).length;
    const maxGuesses = 6;

    const getLetterStyle = (letter: string) => {
        if (!guessed.includes(letter)) return "bg-white/10 hover:bg-white/20 text-white hover:scale-110 active:scale-95";
        if (word.includes(letter)) return "bg-emerald-500/80 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105 pointer-events-none";
        return "bg-rose-500/20 text-white/50 opacity-50 pointer-events-none";
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl 
                        p-8 md:p-12 rounded-3xl 
                        bg-white/5 backdrop-blur-xl border border-white/10 
                        shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            
            <div className="flex items-center gap-3 mb-8">
               <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
                   Mystery Word
               </h1>
               <span className="text-4xl animate-bounce">🤔</span>
            </div>

            <div className="w-full max-w-xs mb-8">
                <div className="flex justify-between text-sm mb-2 font-medium text-white/70">
                    <span>Attempts left</span>
                    <span className={maxGuesses - wrongGuessesCount <= 2 ? "text-rose-400 font-bold" : ""}>
                        {maxGuesses - wrongGuessesCount} / {maxGuesses}
                    </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div 
                        className={`h-full transition-all duration-500 ease-out ${
                            wrongGuessesCount >= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-blue-500'
                        }`}
                        style={{ width: `${100 - (wrongGuessesCount / maxGuesses) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
                {word.split('').map((l, i) => {
                    const isRevealed = guessed.includes(l) || status !== 'playing';
                    const isMissed = status === 'lost' && !guessed.includes(l);
                    
                    return (
                        <div 
                            key={i}
                            className={`flex items-center justify-center w-12 h-16 md:w-16 md:h-20 
                                      rounded-xl text-3xl font-bold uppercase transition-all duration-300
                                      ${isRevealed 
                                          ? isMissed ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white border-b-4 border-emerald-500/50 text-slate-900 shadow-lg scale-110' 
                                          : 'bg-white/5 border border-white/10 text-transparent'}`}
                        >
                            {isRevealed ? l : ''}
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-xl mb-8">
                {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
                    <button
                        key={letter}
                        onClick={() => handleGuess(letter)}
                        disabled={guessed.includes(letter) || status !== 'playing'}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg text-lg font-medium 
                                  uppercase transition-all duration-200 
                                  shadow-sm ${getLetterStyle(letter)}`}
                    >
                        {letter}
                    </button>
                ))}
            </div>

            {status !== 'playing' && (
                <div className={`mt-2 p-6 rounded-2xl border w-full text-center transform transition-all duration-500 scale-100 ${
                    status === 'won' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                    <h2 className="text-2xl font-bold mb-4">
                        {status === 'won' ? '🎉 You cracked it!' : '💀 Game Over'}
                    </h2>
                    {status === 'lost' && (
                        <p className="text-white/80 mb-4">The word was <strong className="text-white uppercase">{word}</strong></p>
                    )}
                    <button
                        onClick={() => {
                            setGuessed([]);
                            setStatus('playing');
                            fetchWord();
                        }}
                        className={`px-8 py-3 rounded-full font-bold text-white transition-all duration-300 
                                  hover:scale-105 active:scale-95 shadow-lg ${
                            status === 'won' 
                                ? 'bg-emerald-500 hover:bg-emerald-400 hover:shadow-emerald-500/25' 
                                : 'bg-rose-500 hover:bg-rose-400 hover:shadow-rose-500/25'
                        }`}
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}
