'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        institution: '',
        role: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission - in production, send to your backend/email service
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, open mailto with pre-filled data
        const subject = encodeURIComponent(`EthicsGate Demo Request from ${formData.institution}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\nInstitution: ${formData.institution}\nRole: ${formData.role}\n\nMessage:\n${formData.message}`
        );
        window.location.href = `mailto:gamertonystuck@gmail.com?subject=${subject}&body=${body}`;

        setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
                <header className="p-4">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-[#C77B58]" />
                        <span className="text-lg font-semibold text-[#3D3835]">EthicsGate</span>
                    </Link>
                </header>

                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white border-[#E8E3DB] text-center">
                        <CardContent className="pt-8 pb-8">
                            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-[#7A9E7E]" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#3D3835] mb-2">Thank you!</h2>
                            <p className="text-[#6B6560] mb-6">
                                Your email client should open with your request. If it doesn&apos;t,
                                please email us directly at gamertonystuck@gmail.com
                            </p>
                            <Button asChild variant="outline" className="border-[#E8E3DB]">
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
            <header className="p-4">
                <Link href="/" className="inline-flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-[#C77B58]" />
                    <span className="text-lg font-semibold text-[#3D3835]">EthicsGate</span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-[#3D3835] mb-2">
                            Request a Demo
                        </h1>
                        <p className="text-[#6B6560]">
                            Tell us about your institution and we&apos;ll be in touch shortly.
                        </p>
                    </div>

                    <Card className="bg-white border-[#E8E3DB]">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[#4A4540]">Your Name</Label>
                                        <Input
                                            id="name"
                                            required
                                            placeholder="Dr. Jane Smith"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="bg-white border-[#E8E3DB] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#4A4540]">Work Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="jane@university.edu"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="bg-white border-[#E8E3DB] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="institution" className="text-[#4A4540]">Institution</Label>
                                    <Input
                                        id="institution"
                                        required
                                        placeholder="University of Example"
                                        value={formData.institution}
                                        onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                                        className="bg-white border-[#E8E3DB] focus:border-[#C77B58] focus:ring-[#C77B58]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-[#4A4540]">Your Role</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                                    >
                                        <SelectTrigger className="bg-white border-[#E8E3DB] focus:border-[#C77B58] focus:ring-[#C77B58]">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#E8E3DB]">
                                            <SelectItem value="irb_admin">IRB Administrator</SelectItem>
                                            <SelectItem value="irb_chair">IRB Chair</SelectItem>
                                            <SelectItem value="compliance">Research Compliance Officer</SelectItem>
                                            <SelectItem value="researcher">Principal Investigator</SelectItem>
                                            <SelectItem value="it">IT/Systems Administrator</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-[#4A4540]">
                                        How can we help?
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us about your current IRB process and what you're looking to improve..."
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        className="bg-white border-[#E8E3DB] focus:border-[#C77B58] focus:ring-[#C77B58] resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#C77B58] hover:bg-[#B06A48] text-white"
                                >
                                    {loading ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Request
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-[#7A756F] mt-4">
                        We typically respond within 24 hours.
                    </p>
                </div>
            </main>
        </div>
    );
}
