'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { signupSchema } from '@/lib/validators/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Building2, User, Mail, Lock, Globe } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        organizationName: '',
        organizationSlug: '',
        fullName: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 30);
    };

    const handleOrgNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            organizationName: name,
            organizationSlug: generateSlug(name),
        }));
    };

    const handleSignup = async () => {
        setLoading(true);

        const result = signupSchema.safeParse(formData);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            setLoading(false);
            return;
        }

        try {
            // Check if slug is available
            const { data: existingOrg } = await supabase
                .from('organizations')
                .select('id')
                .eq('slug', formData.organizationSlug)
                .single();

            if (existingOrg) {
                toast.error('This organization URL is already taken');
                setLoading(false);
                return;
            }

            // Create organization first
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .insert({
                    name: formData.organizationName,
                    slug: formData.organizationSlug,
                })
                .select()
                .single();

            if (orgError) {
                toast.error(orgError.message);
                setLoading(false);
                return;
            }

            // Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: formData.fullName,
                        organization_id: org.id,
                    },
                },
            });

            if (authError) {
                // Clean up organization if auth failed
                await supabase.from('organizations').delete().eq('id', org.id);
                toast.error(authError.message);
                setLoading(false);
                return;
            }

            // Create user profile
            if (authData.user) {
                const { error: userError } = await supabase.from('users').insert({
                    id: authData.user.id,
                    email: formData.email,
                    full_name: formData.fullName,
                    organization_id: org.id,
                    role: 'admin',
                });

                if (userError) {
                    console.error('User profile creation error:', userError);
                }
            }

            toast.success('Account created! Please check your email to confirm.');
            router.push('/login');
        } catch (err) {
            console.error('Signup error:', err);
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Card className="bg-card border-border shadow-sm">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-semibold text-foreground">Create your organization</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Get started with EthicsGate in just a few steps
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Organization section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Organization Details</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="org-name" className="text-foreground">Organization Name</Label>
                            <Input
                                id="org-name"
                                placeholder="University of Example"
                                value={formData.organizationName}
                                onChange={(e) => handleOrgNameChange(e.target.value)}
                                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="org-slug" className="text-foreground">Organization URL</Label>
                            <div className="flex items-center">
                                <div className="px-3 py-2 bg-muted border border-r-0 border-border rounded-l-md text-sm text-muted-foreground">
                                    <Globe className="h-4 w-4 inline mr-1" />
                                    ethicsgate.com/
                                </div>
                                <Input
                                    id="org-slug"
                                    placeholder="university-of-example"
                                    value={formData.organizationSlug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, organizationSlug: e.target.value }))}
                                    className="rounded-l-none bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-border" />

                {/* Admin account section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Your Account (Admin)</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full-name" className="text-foreground">Full Name</Label>
                            <Input
                                id="full-name"
                                placeholder="Dr. Jane Smith"
                                value={formData.fullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Work Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="jane.smith@university.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {loading ? 'Creating your organization...' : 'Create Organization'}
                </Button>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
