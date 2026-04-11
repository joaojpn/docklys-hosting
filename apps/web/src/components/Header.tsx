import { motion } from 'framer-motion'
import { LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-6 flex h-14 items-center gap-4">

        <motion.button
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer mr-4"
          whileTap={{ scale: 0.97 }}
        >
          <DocklysLogo />
          <span className="font-medium text-[15px] tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
            Docklys
          </span>
        </motion.button>

        <nav className="flex items-center gap-1 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogoClick}
            className={`h-8 px-3 text-[13px] cursor-pointer ${currentView === 'list' || currentView === 'details' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            Applications
          </Button>
          <a href="https://github.com/joaojpn/docklys-hosting" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] text-muted-foreground hover:text-foreground cursor-pointer gap-1.5">
              Docs
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
          <a href="https://discord.gg/ke5V4NeQ49" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] text-muted-foreground hover:text-foreground cursor-pointer gap-1.5">
              Discord
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 cursor-pointer">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-[13px]">{user?.name?.split(' ')[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-medium">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer text-[13px]">
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-[13px] text-destructive focus:text-destructive">
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
