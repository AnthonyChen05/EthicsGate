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
        <Card className="bg-white border-[#E8E3DB] shadow-sm">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-semibold text-[#3D3835]">Welcome back</CardTitle>
                <CardDescription className="text-[#7A756F]">
                    Sign in to continue to your dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="password" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#F0EBE3]">
                        <TabsTrigger
                            value="password"
                            className="data-[state=active]:bg-white data-[state=active]:text-[#3D3835] text-[#7A756F]"
                        >
                            Password
                        </TabsTrigger>
                        <TabsTrigger
                            value="magic"
                            className="data-[state=active]:bg-white data-[state=active]:text-[#3D3835] text-[#7A756F]"
                        >
                            Email Link
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="password" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#4A4540]">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#A8A39D]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[#4A4540]">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#A8A39D]" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handlePasswordLogin}
                            disabled={loading}
                            className="w-full bg-[#C77B58] hover:bg-[#B06A48] text-white"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </TabsContent>

                    <TabsContent value="magic" className="space-y-4">
                        <div className="bg-[#FDF8F4] border border-[#F0EBE3] rounded-lg p-4 mb-4">
                            <div className="flex gap-3">
                                <Sparkles className="h-5 w-5 text-[#C77B58] flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-[#6B6560]">
                                    We&apos;ll send you a secure link to sign in without a password.
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="magic-email" className="text-[#4A4540]">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#A8A39D]" />
                                <Input
                                    id="magic-email"
                                    type="email"
                                    placeholder="you@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleMagicLink}
                            disabled={loading}
                            className="w-full bg-[#C77B58] hover:bg-[#B06A48] text-white"
                        >
                            {loading ? 'Sending...' : 'Send Sign-In Link'}
                        </Button>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm">
                    <span className="text-[#7A756F]">New to EthicsGate? </span>
                    <Link href="/signup" className="text-[#C77B58] hover:text-[#B06A48] font-medium">
                        Create an organization
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
