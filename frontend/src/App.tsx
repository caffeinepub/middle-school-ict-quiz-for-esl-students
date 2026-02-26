import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import Quiz from './components/Quiz';

export default function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="flex min-h-screen w-full flex-col bg-background">
                <Header />
                
                <main className="flex-1 py-8">
                    <Quiz />
                </main>

                <Footer />
                <Toaster />
            </div>
        </ThemeProvider>
    );
}
