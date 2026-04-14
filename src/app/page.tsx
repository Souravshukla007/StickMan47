import Hangman from '@/components/Hangman';
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <Hangman />
                <Link
                    href="/games"
                    className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full 
                             border border-white/10 backdrop-blur-sm transition-all duration-300 
                             hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1"
                >
                    View Game History
                </Link>
            </div>
        </main>
    );
}