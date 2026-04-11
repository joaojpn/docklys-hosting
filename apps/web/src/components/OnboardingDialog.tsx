import * as React from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

const slides = [
  {
    id: 'welcome',
    title: 'Welcome to Docklys',
    description: 'The self-hosted platform for deploying Discord, Telegram, and WhatsApp bots. No infrastructure knowledge required.',
    visual: (
      <svg width="80" height="62" viewBox="0 0 108 86" fill="none">
        <path d="M38.5 0C59.7 0 34.5 19.3 34.5 43S59.7 86 38.5 86 0 66.7 0 43 17.2 0 38.5 0Z" fill="hsl(var(--primary))"/>
        <path d="M80.1 3C101.7 3 72.1 20.7 72.1 42.5S101.7 82 80.1 82 41 64.3 41 42.5 58.5 3 80.1 3Z" fill="hsl(var(--primary))" opacity=".55"/>
        <path d="M102.6 16C117.3 16 97.2 27.9 97.2 42.5S117.3 69 102.6 69 76 57.1 76 42.5 87.9 16 102.6 16Z" fill="hsl(var(--primary))" opacity=".25"/>
      </svg>
    ),
  },
  {
    id: 'deploy',
    title: 'Deploy in seconds',
    description: 'Zip your project and upload it. Docklys automatically detects Python or Node.js, installs dependencies and starts your bot.',
    visual: (
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-[#3776AB]/10 border border-[#3776AB]/20 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ob1" x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%">
                <stop offset="0%" stopColor="#387EB8"/>
                <stop offset="100%" stopColor="#366994"/>
              </linearGradient>
              <linearGradient id="ob2" x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%">
                <stop offset="0%" stopColor="#FFE052"/>
                <stop offset="100%" stopColor="#FFC331"/>
              </linearGradient>
            </defs>
            <path fill="url(#ob1)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"/>
            <path fill="url(#ob2)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"/>
          </svg>
        </div>
        <div className="text-muted-foreground/30 text-2xl font-light">+</div>
        <div className="w-16 h-16 rounded-xl bg-[#339933]/10 border border-[#339933]/20 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 256 289" xmlns="http://www.w3.org/2000/svg">
            <path d="M128 288.464c-3.975 0-7.685-1.06-11.13-2.915l-35.247-20.936c-5.3-2.98-2.645-3.975-1.06-4.64 7.42-2.58 8.81-3.18 16.495-7.685.795-.53 1.855-.265 2.65.265l27.032 16.096c1.06.53 2.52.53 3.44 0l105.74-61.2c1.06-.53 1.59-1.59 1.59-2.78V83.192c0-1.19-.53-2.25-1.59-2.78L128.928 19.353c-1.06-.53-2.385-.53-3.44 0L19.884 80.411c-1.06.53-1.59 1.72-1.59 2.78v122.256c0 1.06.53 2.25 1.59 2.78l28.887 16.76c15.7 7.86 25.44-1.325 25.44-10.64V94.453c0-1.59 1.325-2.915 2.915-2.915h12.59c1.59 0 2.915 1.325 2.915 2.915V214.347c0 20.8-11.395 32.726-31.136 32.726-6.095 0-10.9 0-24.38-6.625L9.574 223.918C3.745 220.673 0 214.613 0 208.022V85.632c0-6.59 3.745-12.65 9.574-15.895L119.133 8.08c5.7-3.18 13.25-3.18 18.88 0l109.56 61.657c5.83 3.31 9.57 9.37 9.57 15.895v122.39c0 6.59-3.74 12.58-9.57 15.89L147.013 285.35c-3.18 1.59-6.89 2.915-11.13 2.915h-7.883z" fill="#539E43"/>
            <path d="M160.264 206.828c-46.233 0-55.898-21.2-55.898-39.016 0-1.59 1.325-2.915 2.915-2.915h12.854c1.46 0 2.65 1.06 2.915 2.52 1.986 13.385 7.95 20.14 37.347 20.14 22.924 0 32.726-5.17 32.726-17.36 0-7.02-2.78-12.19-38.276-15.7-29.663-2.916-48.02-9.44-48.02-33.09 0-21.8 18.35-34.783 49.08-34.783 34.517 0 51.61 11.926 53.73 37.745.13.795-.13 1.59-.66 2.25-.53.53-1.325.928-2.12.928h-12.985c-1.325 0-2.52-.928-2.78-2.253-3.31-14.84-11.396-19.61-35.185-19.61-25.97 0-28.95 9.04-28.95 15.83 0 8.215 3.58 10.64 37.082 15.3 33.36 4.64 49.22 11.13 49.22 33.36-.133 23.72-19.743 37.612-54.993 37.612z" fill="#539E43"/>
          </svg>
        </div>
      </div>
    ),
  },
  {
    id: 'monitor',
    title: 'Monitor in real time',
    description: 'View live logs, CPU and RAM usage, uptime and edit your bot files directly in the dashboard.',
    visual: (
      <div className="w-full max-w-xs bg-black/30 rounded-xl border border-border/40 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
          <span className="text-[11px] text-muted-foreground font-mono">console</span>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live
          </span>
        </div>
        <div className="p-3 font-mono text-[11px] space-y-1">
          <p className="text-emerald-400">Bot started successfully</p>
          <p className="text-muted-foreground/60">Listening for events...</p>
          <p className="text-blue-400">Connected to Discord gateway</p>
          <p className="text-muted-foreground/60">Ready to process commands</p>
        </div>
      </div>
    ),
  },
  {
    id: 'start',
    title: "You're ready to go!",
    description: 'Click "New Application" to deploy your first bot. Need help? Join our Discord community.',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://discord.gg/ke5V4NeQ49" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Discord
          </a>
          <a href="https://github.com/joaojpn/docklys-hosting" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
            GitHub
          </a>
        </div>
      </div>
    ),
  },
] as const

type Props = {
  onClose: () => void
}

export function OnboardingDialog({ onClose }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  const isFirstSlide = activeIndex === 0
  const isLastSlide = activeIndex === slides.length - 1

  const handleNext = () => {
    if (isLastSlide) { onClose(); return }
    emblaApi?.scrollNext()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-md mx-4 rounded-2xl bg-card border border-border/50 shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {slides.map((slide) => (
                <div key={slide.id} className="flex-[0_0_100%] min-w-0">
                  <div className="flex flex-col items-center text-center py-4 px-2">
                    <div className="mb-6 flex items-center justify-center h-20">
                      {slide.visual}
                    </div>
                    <h2 className="text-[20px] font-semibold mb-3" style={{ fontFamily: 'Geist, sans-serif' }}>
                      {slide.title}
                    </h2>
                    <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs">
                      {slide.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-6">
            {slides.map((slide, index) => (
              <motion.button
                key={slide.id}
                onClick={() => emblaApi?.scrollTo(index)}
                animate={{ width: index === activeIndex ? 24 : 8, opacity: index === activeIndex ? 1 : 0.3 }}
                initial={false}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={cn('h-1.5 rounded-full cursor-pointer', index === activeIndex ? 'bg-primary' : 'bg-muted-foreground')}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              {!isFirstSlide ? (
                <button onClick={() => emblaApi?.scrollPrev()} className="px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                  Back
                </button>
              ) : (
                <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                  Skip
                </button>
              )}
            </div>
            <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors cursor-pointer">
              {isLastSlide ? "Let's go!" : 'Next'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
