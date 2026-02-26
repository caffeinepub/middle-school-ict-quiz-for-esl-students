import { Monitor } from 'lucide-react';

export default function Header() {
    return (
        <header className="border-b bg-card shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Monitor className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Middle School ICT Quiz</h1>
                        <p className="text-sm text-muted-foreground">Learn about computers and technology</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
