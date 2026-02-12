import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="p-4">
                <Link href="/" className="inline-flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold text-foreground">EthicsGate</span>
                </Link>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                    © 2026 Paperplane Software Solutions
                </p>
            </footer>
        </div>
    );
}
