'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validators/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Mail, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordLogin = async () => {
        setLoading(true);

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        toast.success('Welcome back!');
        router.push('/dashboard');
        router.refresh();
    };

    const handleMagicLink = async () => {
        setLoading(true);

        if (!email) {
            toast.error('Please enter your email');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        toast.success('Check your email for the sign-in link');
        setLoading(false);
    };

    return (
        <Card className="bg-card border-border shadow-sm">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-semibold text-foreground">Welcome back</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Sign in to continue to your dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="password" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
                        <TabsTrigger
                            value="password"
                            className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
                        >
                            Password
                        </TabsTrigger>
                        <TabsTrigger
                            value="magic"
                            className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
                        >
                            Email Link
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="password" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handlePasswordLogin}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </TabsContent>

                    <TabsContent value="magic" className="space-y-4">
                        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
                            <div className="flex gap-3">
                                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-muted-foreground">
                                    We&apos;ll send you a secure link to sign in without a password.
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="magic-email" className="text-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="magic-email"
                                    type="email"
                                    placeholder="you@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleMagicLink}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {loading ? 'Sending...' : 'Send Sign-In Link'}
                        </Button>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">New to EthicsGate? </span>
                    <Link href="/signup" className="text-primary hover:text-primary/90 font-medium">
                        Create an organization
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
