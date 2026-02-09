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
import { Building2, User, Mail, Lock, Globe, BookOpen } from 'lucide-react';

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
        <Card className="bg-white border-[#E8E3DB] shadow-sm">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-semibold text-[#3D3835]">Create your organization</CardTitle>
                <CardDescription className="text-[#7A756F]">
                    Get started with EthicsGate in just a few steps
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Organization section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#6B6560]">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Organization Details</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="org-name" className="text-[#4A4540]">Organization Name</Label>
                            <Input
                                id="org-name"
                                placeholder="University of Example"
                                value={formData.organizationName}
                                onChange={(e) => handleOrgNameChange(e.target.value)}
                                className="bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="org-slug" className="text-[#4A4540]">Organization URL</Label>
                            <div className="flex items-center">
                                <div className="px-3 py-2 bg-[#F0EBE3] border border-r-0 border-[#E8E3DB] rounded-l-md text-sm text-[#7A756F]">
                                    <Globe className="h-4 w-4 inline mr-1" />
                                    ethicsgate.com/
                                </div>
                                <Input
                                    id="org-slug"
                                    placeholder="university-of-example"
                                    value={formData.organizationSlug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, organizationSlug: e.target.value }))}
                                    className="rounded-l-none bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-[#E8E3DB]" />

                {/* Admin account section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#6B6560]">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Your Account (Admin)</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full-name" className="text-[#4A4540]">Full Name</Label>
                            <Input
                                id="full-name"
                                placeholder="Dr. Jane Smith"
                                value={formData.fullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                className="bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#4A4540]">Work Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#A8A39D]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="jane.smith@university.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="pl-10 bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-[#C77B58] hover:bg-[#B06A48] text-white"
                >
                    {loading ? 'Creating your organization...' : 'Create Organization'}
                </Button>

                <div className="text-center text-sm">
                    <span className="text-[#7A756F]">Already have an account? </span>
                    <Link href="/login" className="text-[#C77B58] hover:text-[#B06A48] font-medium">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
