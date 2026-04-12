import { useAuth } from '../contexts/AuthContext'
import { LogOut, ChevronDown, LayoutGrid, User, MessageCircle, BookOpen } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Props = {
  onLogoClick: () => void
  onProfileClick: () => void
  isProfileActive: boolean
  currentView: string
}

const DocklysLogo = () => (
  <svg width="20" height="16" viewBox="0 0 108 86" fill="none">
    <path d="M38.5 0C59.7 0 34.5 19.3 34.5 43S59.7 86 38.5 86 0 66.7 0 43 17.2 0 38.5 0Z" fill="hsl(var(--primary))"/>
    <path d="M80.1 3C101.7 3 72.1 20.7 72.1 42.5S101.7 82 80.1 82 41 64.3 41 42.5 58.5 3 80.1 3Z" fill="hsl(var(--primary))" opacity=".55"/>
    <path d="M102.6 16C117.3 16 97.2 27.9 97.2 42.5S117.3 69 102.6 69 76 57.1 76 42.5 87.9 16 102.6 16Z" fill="hsl(var(--primary))" opacity=".25"/>
  </svg>
)

export function Header({ onLogoClick, onProfileClick, currentView }: Props) {
  const { user, signOut } = useAuth()

  const navItems = [
    { label: 'Applications', view: 'list', icon: LayoutGrid },
    { label: 'My Account', view: 'profile', icon: User },
    { label: 'Support', href: 'https://discord.gg/ke5V4NeQ49', icon: MessageCircle },
    { label: 'Docs', href: 'https://github.com/joaojpn/docklys-hosting', icon: BookOpen },
  ]

  return (
    <header className="w-full border-b border-border/40 bg-background sticky top-0 z-40">
      {/* Top row */}
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-12">
        <button onClick={onLogoClick} className="flex items-center gap-2 cursor-pointer">
          <DocklysLogo />
          <span className="font-semibold text-[15px] tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
            Docklys
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-muted-foreground/50 bg-muted/30 border border-border/30 px-2 py-0.5 rounded-md uppercase tracking-wide">Free</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity border border-border/40 bg-muted/20 rounded-lg px-3 py-1.5">
                <div className="text-left">
                  <p className="text-[13px] font-medium leading-none">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground/50 leading-none mt-0.5">{user?.email}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
              <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer text-[13px]">
                My Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-[13px] text-destructive focus:text-destructive gap-2">
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom row — nav */}
      <div className="max-w-5xl mx-auto px-6 flex items-center border-t border-border/20">
        {navItems.map(item => {
          const isActive = item.view === currentView ||
            (item.view === 'list' && (currentView === 'details' || currentView === 'deploy'))
          const Icon = item.icon

          if (item.href) {
            return (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer border-b-2 border-transparent">
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </a>
            )
          }

          return (
            <button key={item.label}
              onClick={item.view === 'profile' ? onProfileClick : onLogoClick}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] transition-colors cursor-pointer border-b-2 ${
                isActive
                  ? 'text-foreground font-medium border-blue-500'
                  : 'text-muted-foreground/50 hover:text-foreground border-transparent'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
