import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Briefcase, Code2, GraduationCap, LifeBuoy, Wrench } from "lucide-react";

const services = [
  {
    title: "Portfolio Making",
    description: "Craft professional, impactful portfolios that highlight your strengths and achievements.",
    icon: Briefcase,
  },
  {
    title: "Website Making",
    description: "Modern, responsive websites tailored to your goals using the latest best practices.",
    icon: Code2,
  },
  {
    title: "AI Agents Making",
    description: "Build intelligent AI agents to automate tasks and deliver smart experiences.",
    icon: Brain,
  },
  {
    title: "Support for Projects",
    description: "Get expert guidance and support to move your projects forward with confidence.",
    icon: LifeBuoy,
  },
  {
    title: "Projects Help",
    description: "Hands-on help to debug, optimize, and complete your project milestones.",
    icon: Wrench,
  },
  {
    title: "Exam Support",
    description: "Focused preparation strategies and resources to help you excel in exams.",
    icon: GraduationCap,
  },
];

export default function Index() {
  return (
    <div className="">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-100 to-white" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Find Your Dream Job Today with <span className="text-primary">RepatiKosam</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-8">
              Explore curated opportunities and expert services designed to accelerate your career and projects.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/jobs">
                <Button size="lg">Browse Job Posts</Button>
              </Link>
              <a href="#services" className="text-primary hover:underline text-sm md:text-base">
                Learn about our services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Our Services</h2>
          <Link className="text-primary hover:underline" to="/contact">Need something custom?</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-foreground/70">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA to Jobs */}
      <section className="border-t bg-secondary/50">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold">Ready to take the next step?</h3>
            <p className="text-foreground/70">Browse current openings and apply in one click.</p>
          </div>
          <Link to="/jobs">
            <Button size="lg" variant="default">See Job Posts</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
