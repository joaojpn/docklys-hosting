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
