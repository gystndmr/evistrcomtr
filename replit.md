# Turkey E-Visa Application System

## Overview
This is a full-stack web application for processing Turkey e-visa applications, providing a platform for users to apply for e-visas, check application status, and purchase travel insurance. It aims to be a comprehensive, production-ready system featuring email notifications, GPay payment integration, and robust admin panel management. The business vision is to offer a seamless and trustworthy e-visa application experience for Turkey.

## User Preferences
Preferred communication style: Simple, everyday language in Turkish.
- Professional government-style appearance required
- Turkish flag and heritage imagery prominently featured
- Security badges and payment icons for trust
- Direct insurance redirection for non-eligible countries
- Simple list-based insurance pricing (no complex cards)
- Country flags displayed in country selector
- Updated Turkey landmark images (Pamukkale, Hagia Sophia, Cappadocia)
- Accurate Turkey e-visa eligibility based on official government sources
- 7 specific insurance options with exact pricing (7 days: $114, 14 days: $131, 30 days: $154, 60 days: $191, 90 days: $214, 180 days: $275, 1 year: $315)

## System Architecture

### Current System Status (August 12, 2025)
**✅ FULLY OPERATIONAL - ALL SYSTEMS WORKING**
- Database: 206 unique countries, 336 visa applications, 940 insurance applications, 204 chat messages
- Admin Panel: Complete access to all data with authentication (password: admin123)
- Chat System: Live support with 82 unique customer sessions, admin reply functionality
- Payment Integration: GloDiPay system with mobile redirect support
- API Endpoints: All backend routes functional and returning proper JSON responses

### UI/UX Decisions
The application prioritizes a professional, government-style appearance with prominent Turkish flag and heritage imagery. Trust is built through visible security badges and payment icons. The design features a responsive layout suitable for both mobile and desktop. Recent updates include a clean blue/gray minimalist design with modern cards and professional white backgrounds, replacing the previous styling while maintaining options for a transparent design. Images are optimized for fast loading with preloading systems and smooth transitions. All UI elements are fully translatable, supporting English, Turkish, French, German, Spanish, and Arabic, with automatic browser language detection.

### Technical Implementation
The system is built using a React 18 frontend with TypeScript, Wouter for routing, TanStack Query for state management, Tailwind CSS for styling, Radix UI and shadcn/ui for components, and React Hook Form with Zod for form handling. Vite is used for building. The backend uses Node.js with Express.js and TypeScript, connected to a PostgreSQL database via Drizzle ORM. RESTful APIs handle JSON responses, and Express sessions manage user states.

### Feature Specifications
- **Application Flow**: Includes country selection, eligibility checks, multi-step application forms, document upload, payment processing (GloDiPay integration), and status tracking.
- **Core Features**: Multi-language support, responsive design, real-time form validation, drag-and-drop file upload, application status tracking, and a travel insurance marketplace.
- **Admin Panel**: Comprehensive dashboard with authentication, statistics tracking, application viewing (visa and insurance), search functionality, email notification triggers, and a live chat system for customer support. It supports pagination and server-side filtering for performance.
- **Chat System**: Live customer support with real-time messaging, admin reply functionality, session management (82 active sessions), and unread message tracking. Fully integrated with admin panel.
- **Data Collection**: Extensive customer data fields are captured for both visa and insurance applications, including personal, travel, and supporting document information, with age verification for insurance.
- **Payment System**: Integrated with GloDiPay (GPay), supporting RSA signature-based authentication, automatic redirection to hosted payment pages, and callback handling. The system includes retry mechanisms and handles mobile payment redirects.
- **Email Notifications**: Automated email system using SendGrid for application confirmations and approval notifications, with professional templates and attachment support.
- **Legacy Data Management**: System to classify and update historical visa and residence permit applications with country-based intelligent document type suggestions.
- **Database Optimization**: Implemented Map-based filtering for country duplicates, reducing 340 entries to 206 unique countries with proper backend field mapping.

### System Design Choices
- **Database Schema**: Utilizes `countries`, `applications`, `insurance_products`, `insurance_applications`, and `chat_messages` tables.
- **API Architecture**: RESTful backend with proper JSON responses. Key endpoints: `/api/applications`, `/api/insurance-applications`, `/api/chat/messages`, `/api/chat/reply`, `/api/chat/mark-read/:sessionId`
- **Data Flow**: Separated processes for visa applications (eligibility, form submission, payment, status tracking) and insurance applications (product browsing, application submission).
- **Admin Authentication**: Password-protected admin panel (admin123) with comprehensive data access and management capabilities.
- **Modularity**: Frontend and backend are separated, allowing for independent development and deployment.
- **Environment Configuration**: Uses environment variables for sensitive data like database connections and API keys.
- **Site Mode Switching**: Supports quick switching between the e-visa application site and a consulting/advertising site.
- **Date Input**: Uses manual dropdowns for date selections for improved user control.

### Recent Fixes (August 12, 2025)
- **Country Database**: Resolved duplicate entries through Map-based backend filtering, prioritizing longer country codes (USA > US, GBR > UK)
- **Chat API**: Added missing backend endpoints for chat functionality in routes.ts and storage.ts
- **Admin Data Loading**: Fixed API endpoints to return proper JSON instead of HTML for admin panel data visualization
- **Field Mapping**: Corrected `eligibleForEvisa` field mapping in countries API for proper frontend integration
- **Email System Update**: Completely replaced all info@getvisa.tr addresses with info@euramedglobal.com across all client and server files
- **Corporate Branding**: Added EURAMED LTD company information to all email templates (visa applications, insurance applications, approval/rejection emails) with proper footer branding and contact information

## External Dependencies

### Frontend Dependencies
- `@radix-ui/react-*`
- `@tanstack/react-query`
- `@hookform/resolvers`
- `react-hook-form`
- `zod`
- `tailwindcss`
- `lucide-react`
- `date-fns`

### Backend Dependencies
- `express`
- `drizzle-orm`
- `@neondatabase/serverless` (PostgreSQL driver)
- `drizzle-zod`
- `connect-pg-simple`
- `tsx`
- `dotenv`
- `SendGrid` (for email services)
- `GloDiPay` (payment gateway)

### Development Dependencies
- `vite`
- `typescript`
- `drizzle-kit`