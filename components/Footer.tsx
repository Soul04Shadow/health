import {
  Brain,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="relative z-10 pt-16 pb-0 bg-gradient-to-b from-orange-50/50 via-white to-orange-50/30 mt-auto overflow-hidden w-full">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary rounded-full blur-xl"></div>
        <div className="absolute top-20 right-1/4 w-16 h-16 bg-primary/30 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-lg"></div>
      </div>

      <div className="w-full relative">
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-none pt-8 pb-4 px-8 md:pt-12 md:pb-6 md:px-12 shadow-xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <span className="text-3xl font-bold text-primary">
                  YouthGuide
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-pretty mb-6">
                Your AI-powered companion for mental wellness. We're committed
                to supporting young people with personalized, accessible mental
                health resources and guidance.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>hello@youthguide.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+1 (555) 123-YOUTH</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6 text-primary">
                Platform
              </h3>
              <ul className="space-y-3">
                {["Dashboard", "AI Chat", "Mood Tracking", "Resources"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm hover:translate-x-1 inline-block"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* About Links */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6 text-primary">About</h3>
              <ul className="space-y-3">
                {["Our Mission", "How It Works", "Our Team", "Research"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm hover:translate-x-1 inline-block"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Support Links */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6 text-primary">
                Support
              </h3>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6 text-primary">
                Stay Connected
              </h3>

              {/* Newsletter */}
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none text-sm mb-2"
                />
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm py-2">
                  Subscribe
                </Button>
              </div>

              {/* Social Media */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
                >
                  <Instagram className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
                >
                  <Twitter className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
                >
                  <Linkedin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Sub-footer */}
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2025 YouthGuide. Powered by GenAI for Mental Wellness.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Made with ❤️ for mental wellness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
