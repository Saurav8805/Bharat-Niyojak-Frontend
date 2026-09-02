# Changelog

All notable changes to Bharat Niyojak Frontend will be documented in this file.

## [Unreleased] - 2026-09-02

### Fixed
- **Logo Visibility:** Improved logo display in Navbar and Footer
  - Changed from cropped icon to full logo with text
  - Navbar: Increased height to `h-16` with `object-contain`
  - Footer: Increased height to `h-14` with `object-contain`
  - Removed hardcoded `object-cover object-left` that was cutting off the logo
- **Footer Branding:** Removed duplicate "Bharat Niyojak" and "भारत नियोजक" text
  - Logo now displays cleanly without redundant text
  - More professional and cleaner footer appearance

### Changed
- Logo now uses `w-auto` to maintain aspect ratio
- Logo uses `object-contain` to show full image without cropping

---

## [1.0.0] - 2026-09-02

### Added
- Initial release of Bharat Niyojak Frontend
- Next.js 14 with TypeScript
- Responsive design for all device sizes (320px to 4K)
- WebGL Galaxy background with OGL library (half-speed animation)
- Professional UI with modern gradient designs
- Complete page structure:
  - Home, About Us, How It Works, Features, Contact
  - Login, Register
  - Privacy Policy, Terms & Conditions, Disclaimer
- Mobile-first responsive components:
  - Navbar with hamburger menu
  - Footer with responsive grid
  - Touch-optimized buttons (44x44px minimum)
- AI-Powered Civic Issue Reporting System
- Supabase integration for backend
- Authentication system (JWT-based)
- India-themed color palette with flag design elements
- Social media integration
- Comprehensive documentation

### Technical Details
- **Framework:** Next.js 14.0.0
- **Styling:** Tailwind CSS with custom configuration
- **3D Graphics:** OGL 1.0.11 for WebGL rendering
- **Icons:** Lucide React
- **Database:** Supabase
- **Authentication:** JWT with bcryptjs

### Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px (md:)
- Laptop: 1025px - 1280px (lg:)
- Desktop: 1281px+ (xl:)

### Git Structure
- **Main branch:** Production-ready code
- **Dev branch:** Development and testing
- Both branches pushed to GitHub
- Proper .gitignore for Node.js and Next.js

---

## Repository Information

- **GitHub:** https://github.com/Saurav8805/Bharat-Niyojak-Frontend
- **Current Branch:** dev
- **Status:** Active Development ✅

---

## Commit Message Convention

We follow these types:
- **Add:** New feature
- **Fix:** Bug fix
- **Update:** Update existing functionality
- **Remove:** Remove code/feature
- **Refactor:** Code restructuring
- **Docs:** Documentation changes
- **Style:** Code style changes
- **Test:** Adding/updating tests
- **Chore:** Maintenance tasks

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.*
