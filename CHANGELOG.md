## [0.7.0] - 2026-04-15

### Added
- Anti-replay protection for 2FA codes using lastUsedOtpAt timestamp
- Audit logging for all critical events (LOGIN, REGISTER, DEPLOY, DELETE, STOP, RESTART, 2FA events)
- Advanced IP throttling — 10 attempts per 15 minutes per IP on auth routes
- 2FA verification integrated into login flow with tempToken
- "Remember this device for 30 days" via HttpOnly cookie
- TrustedDevice table for managing trusted devices per user
- New endpoint POST /auth/2fa/verify for OTP verification during login

### Changed
- Login now returns requires2FA flag when 2FA is enabled
- Auth routes have strict rate limiting separate from global limit

## [0.6.0] - 2026-04-14

### Added
- Two-Factor Authentication (2FA) with TOTP support
- QR code generation for authenticator apps (Google Authenticator, Authy, etc.)
- 10 single-use recovery codes with bcrypt hashing
- Step-by-step 2FA setup page with progress indicator
- Account lockout after 5 failed OTP attempts (15 minutes)
- AES-256-GCM encryption for TOTP secrets stored in database
- Disable 2FA with token confirmation

## [0.5.3] - 2026-04-12

### Added
- Filter dropdown on dashboard with status filter, sort and order options

### Changed
- Bot list redesigned with card layout showing RAM, uptime and memory usage
- Bot details redesigned with new header, stats row and tab navigation
- Navbar redesigned with two-row layout and navigation icons
- Branding updated from Docklys to Nuvee throughout the app
- Onboarding improved with animated check circle on last slide

## [0.5.2] - 2026-04-12

### Added
- Onboarding dialog with 4-slide carousel shown on first login
- Early Access banner on dashboard with Discord feedback link

### Changed
- Profile page redesigned with cleaner field-based layout
- Sidebar with avatar and member since date

## [0.5.1] - 2026-04-11

### Changed
- Login page redesigned with animated glow blobs and grid background

## [0.5.0] - 2026-04-11

### Added
- File editor with Monaco Editor for viewing and editing bot files directly in the dashboard
- Directory navigation in the file tree
- Syntax highlighting for Python, JavaScript, TypeScript, JSON, YAML and more
- Files tab in bot details page

### Changed
- Dashboard layout polished inspired by Linear
- Deploy page redesigned with consistent identity
- Success modal redesigned matching Square Cloud reference
- Blue accent color applied consistently across all buttons
- Workspace section more compact with Free badge

## [0.4.0] - 2026-04-10

### Added
- Complete UI redesign using shadcn/ui components
- New navbar with navigation links, Docs and Discord
- User dropdown menu with profile and sign out
- Search bar to filter applications by name
- Workspace section showing user name and account ID
- Footer with online/offline application count
- Bot details page with Console, Overview and Environment tabs
- Live logs visible by default in bot details
- RAM usage chart (beta) in Overview tab
- Official Python and Node.js language icons
- Profile page redesigned with sidebar navigation
- Login page redesigned with GitHub OAuth and email/password

### Changed
- Dashboard layout restructured inspired by SquareCloud
- Bot details stat row without card borders for cleaner look
- Application status badges with animated pulse for running bots

## [0.3.0] - 2026-04-05

### Added
- One-command install script for Ubuntu/Debian servers (`install.sh`)
- Production Docker Compose file (`docker-compose.production.yml`)
- Nginx configuration example with SSL and SSE support (`docs/nginx.conf.example`)

### Fixed
- Navbar name not updating after profile edit

## [0.2.0] - 2026-04-05

### Added
- Profile page with name editor and member since date
- Change password for email/password accounts  
- GitHub connection status on profile page
- Delete account with confirmation modal
  
## [0.1.0] - 2026-03-29

### Added
- Email and password authentication
- GitHub OAuth login
- Deploy bots via zip upload with drag and drop
- Automatic language detection (Python and Node.js)
- Isolated Docker container per application
- Stop, restart and delete applications
- Real-time logs via SSE
- Bot details page with CPU, RAM and uptime metrics
- Auto-refresh dashboard every 10 seconds
