import * as React from 'react'
import nuveeLogo from '../assets/Nuvee_typo_logo_white4x.png'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

const slides = [
  {
    id: 'welcome',
    title: 'Welcome to Nuvee',
    description: 'The self-hosted platform for deploying Discord, Telegram, and WhatsApp bots. No infrastructure knowledge required.',
    visual: (
      <img src={nuveeLogo} alt="Nuvee" className="h-10 object-contain" />
    ),
  },
  {
    id: 'deploy',
    title: 'Deploy in seconds',
    description: 'Zip your project and upload it. Nuvee automatically detects Python or Node.js, installs dependencies and starts your bot.',
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
      <div className="w-full max-w-xs bg-muted/20 rounded-xl border border-border/40 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live
          </span>
        </div>
        <div className="p-3 font-mono text-[11px] space-y-1.5">
          <p className="text-emerald-400">✓ Bot started successfully</p>
          <p className="text-muted-foreground/50">Listening for events...</p>
          <p className="text-blue-400">✓ Connected to gateway</p>
          <p className="text-muted-foreground/50">Ready to process commands</p>
          <p className="text-primary/70">→ Command received: /help</p>
        </div>
      </div>
    ),
  },
  {
    id: 'start',
    title: "You're ready to go!",
    description: 'Click "New Application" to deploy your first bot. Need help? Join our Discord community.',
    visual: (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Particles */}
          {[0,1,2,3,4,5,6,7].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#22c55e','#3b82f6','#a855f7','#f59e0b','#ec4899','#06b6d4','#22c55e','#3b82f6'][i],
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: [0, Math.cos((i * Math.PI * 2) / 8) * 40],
                y: [0, Math.sin((i * Math.PI * 2) / 8) * 40],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: "easeOut" }}
            />
          ))}
          {/* Circle + Check */}
          <div className="relative w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <motion.circle
                cx="32" cy="32" r="28"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                fill="rgba(34,197,94,0.1)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.polyline
                points="20,32 28,42 44,24"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
          </div>
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
