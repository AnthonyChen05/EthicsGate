import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  FileText,
  MessageSquare,
  Shield,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: 'Streamlined Submissions',
      description: 'Researchers submit proposals through an intuitive editor designed for clarity and ease of use.',
    },
    {
      icon: MessageSquare,
      title: 'Collaborative Review',
      description: 'Reviewers comment directly on proposal text with helpful feedback and guidance.',
    },
    {
      icon: CheckCircle,
      title: 'Clear Decision Process',
      description: 'Transparent workflow from submission to approval, with helpful status updates along the way.',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Your research data is protected with institutional-grade security and access controls.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Bring your entire research team together with role-based access and permissions.',
    },
    {
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Built-in guidance helps researchers understand ethics requirements and best practices.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#E8E3DB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-[#C77B58]" />
              <span className="text-xl font-semibold text-[#3D3835]">
                EthicsGate
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="text-[#6B6560] hover:text-[#3D3835] hover:bg-[#F0EBE3]"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-[#C77B58] hover:bg-[#B06A48] text-white shadow-sm"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EBE3] text-[#7A756F] text-sm mb-6">
            <Sparkles className="h-4 w-4 text-[#C77B58]" />
            Trusted by research institutions
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#3D3835] mb-5 leading-tight">
            Ethics review that feels
            <br />
            <span className="text-[#C77B58]">
              helpful, not hurdle
            </span>
          </h1>
          <p className="text-lg text-[#6B6560] mb-8 max-w-xl mx-auto leading-relaxed">
            EthicsGate guides your research proposals through institutional review
            with clarity, collaboration, and care. No more confusing forms or opaque processes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#C77B58] hover:bg-[#B06A48] text-white shadow-sm px-6"
            >
              <Link href="/contact">
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#E8E3DB] text-[#6B6560] hover:bg-[#F0EBE3] hover:text-[#3D3835] px-6"
            >
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#3D3835] mb-3">
              Research ethics, simplified
            </h2>
            <p className="text-[#6B6560] max-w-xl mx-auto">
              We&apos;ve reimagined the IRB process to support researchers rather than slow them down.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-[#E8E3DB] rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FDF8F4] flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-[#C77B58]" />
                </div>
                <h3 className="text-lg font-medium text-[#3D3835] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#7A756F] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center bg-white border border-[#E8E3DB] rounded-2xl p-8 sm:p-10">
          <GraduationCap className="h-10 w-10 text-[#C77B58] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#3D3835] mb-3">
            Ready to simplify your ethics review?
          </h2>
          <p className="text-[#6B6560] mb-6">
            Join institutions that have made research ethics approachable and efficient.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#C77B58] hover:bg-[#B06A48] text-white shadow-sm px-6"
          >
            <Link href="/contact">
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[#E8E3DB]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#C77B58]" />
            <span className="font-medium text-[#3D3835]">EthicsGate</span>
          </div>
          <p className="text-[#7A756F] text-sm">
            © 2026 Paperplane Software Solutions
          </p>
        </div>
      </footer>
    </div>
  );
}
