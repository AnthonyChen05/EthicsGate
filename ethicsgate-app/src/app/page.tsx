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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                EthicsGate
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Link href="#contact-sales">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            Trusted by research institutions
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-5 leading-tight">
            Ethics review that feels
            <br />
            <span className="text-primary">
              helpful, not hurdle
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            EthicsGate guides your research proposals through institutional review
            with clarity, collaboration, and care. No more confusing forms or opaque processes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm px-6"
            >
              <Link href="#contact-sales">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground px-6"
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
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
              Research ethics, simplified
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We&apos;ve reimagined the IRB process to support researchers rather than slow them down.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact-sales" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-2xl p-8 sm:p-10">
          <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Ready to simplify your ethics review?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join institutions that have made research ethics approachable and efficient.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm px-6"
          >
            <Link href="/contact">
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">EthicsGate</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 Paperplane Software Solutions
          </p>
        </div>
      </footer>
    </div>
  );
}
