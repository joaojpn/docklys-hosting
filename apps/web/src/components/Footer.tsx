import { ExternalLink } from 'lucide-react'
import { Separator } from './ui/separator'

const DocklysLogo = () => (
  <svg width="20" height="16" viewBox="0 0 108 86" fill="none">
    <path d="M38.5 0C59.7 0 34.5 19.3 34.5 43S59.7 86 38.5 86 0 66.7 0 43 17.2 0 38.5 0Z" fill="hsl(var(--primary))"/>
    <path d="M80.1 3C101.7 3 72.1 20.7 72.1 42.5S101.7 82 80.1 82 41 64.3 41 42.5 58.5 3 80.1 3Z" fill="hsl(var(--primary))" opacity=".55"/>
    <path d="M102.6 16C117.3 16 97.2 27.9 97.2 42.5S117.3 69 102.6 69 76 57.1 76 42.5 87.9 16 102.6 16Z" fill="hsl(var(--primary))" opacity=".25"/>
  </svg>
)

type FooterLink = { label: string; href: string; external: boolean }
type FooterSection = { title: string; links: FooterLink[] }

const sections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "#", external: false },
      { label: "Deploy", href: "#", external: false },
      { label: "File Editor", href: "#", external: false },
      { label: "Environment Variables", href: "#", external: false },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "Getting Started", href: "https://github.com/joaojpn/docklys-hosting#-getting-started", external: true },
      { label: "Contributing", href: "https://github.com/joaojpn/docklys-hosting/blob/main/CONTRIBUTING.md", external: true },
      { label: "Security", href: "https://github.com/joaojpn/docklys-hosting/blob/main/SECURITY.md", external: true },
      { label: "Changelog", href: "https://github.com/joaojpn/docklys-hosting/blob/main/CHANGELOG.md", external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "https://discord.gg/ke5V4NeQ49", external: true },
      { label: "GitHub", href: "https://github.com/joaojpn/docklys-hosting", external: true },
      { label: "Report a Bug", href: "https://github.com/joaojpn/docklys-hosting/issues/new?template=bug_report.yml", external: true },
      { label: "Request a Feature", href: "https://github.com/joaojpn/docklys-hosting/issues/new?template=feature_request.yml", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#", external: false },
      { label: "Terms of Service", href: "#", external: false },
      { label: "License (MIT)", href: "https://github.com/joaojpn/docklys-hosting/blob/main/LICENSE", external: true },
    ],
  },
]

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      
        href={link.href}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <span>{link.label}</span>
        {link.external && <ExternalLink className="w-2.5 h-2.5 opacity-50" />}
      </a>
    </li>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/30 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <DocklysLogo />
              <span className="text-[14px] font-medium" style={{ fontFamily: "Geist, sans-serif" }}>Docklys</span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              The self-hosted platform for bot deployment.
            </p>
            <p className="text-[11px] text-muted-foreground/50 mt-3">Open source · MIT License</p>
          </div>

          {sections.map(section => (
            <div key={section.title}>
              <p className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-6 opacity-30" />

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground/50">
            © {new Date().getFullYear()} Docklys. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/50">
            Built with ❤️ by{" "}
            <a href="https://github.com/joaojpn" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              joaojpn
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
