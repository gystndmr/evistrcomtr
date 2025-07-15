# Turkey E-Visa Application System

## Overview

This is a full-stack web application for processing Turkey e-visa applications. The system provides a comprehensive platform for users to apply for Turkish e-visas, check application status, and purchase travel insurance. Built with modern web technologies, it features a React frontend, Express.js backend, and PostgreSQL database with Drizzle ORM.

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

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL store

### Database Schema
The application uses four main tables:
- **countries**: Stores country information, visa eligibility, and requirements
- **applications**: Stores visa application data and status
- **insurance_products**: Stores available travel insurance products
- **insurance_applications**: Stores insurance application data

## Key Components

### Application Flow
1. **Country Selection**: Users select their country and document type
2. **Eligibility Check**: System validates if user's country is eligible for e-visa
3. **Application Form**: Multi-step form collecting personal and travel information
4. **Document Upload**: Supporting documents upload for required countries
5. **Payment Processing**: Fee calculation and payment handling
6. **Status Tracking**: Application status monitoring and e-visa download

### Core Features
- Multi-language support (English, Turkish, French, German, Spanish, Arabic)
- Responsive design for mobile and desktop
- Real-time form validation
- File upload with drag-and-drop support
- Application status tracking
- Travel insurance marketplace
- Email notifications (configured but not implemented)

### UI Components
- Custom form components with validation
- Country selector with eligibility status
- Document upload interface
- Status tracking dashboard
- Insurance product comparison
- Responsive header and footer

## Data Flow

### Application Process
1. User selects country and document type
2. System checks eligibility from countries table
3. User fills out application form
4. Form data is validated client-side and server-side
5. Application is stored in database with unique application number
6. User can track status and download e-visa when approved

### Insurance Process
1. User browses available insurance products
2. System fetches products from insurance_products table
3. User selects product and fills application
4. Insurance application is stored separately from visa application

## External Dependencies

### Frontend Dependencies
- **@radix-ui/react-***: UI primitive components
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: Type-safe ORM
- **@neondatabase/serverless**: PostgreSQL driver
- **drizzle-zod**: Zod integration for database schemas
- **connect-pg-simple**: PostgreSQL session store
- **tsx**: TypeScript execution

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tailwindcss**: CSS framework
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Development Setup
- Uses Vite dev server for frontend with HMR
- Express server with middleware for API routes
- Environment variables for database connection
- Replit-specific configurations for development

### Production Build
- Frontend builds to static files in `dist/public`
- Backend builds to ES modules in `dist`
- Database migrations managed with Drizzle Kit
- Single server deployment serving both API and static files

### Database Management
- Schema defined in shared TypeScript files
- Migrations generated and applied with Drizzle Kit
- Database seeding for initial country and insurance data
- Connection pooling with Neon serverless PostgreSQL

### Environment Configuration
- Database URL configuration required
- Production/development environment detection
- Replit-specific development features
- CORS and security middleware configured

The application is designed for easy deployment on platforms like Replit, Vercel, or traditional hosting providers, with clear separation between frontend and backend concerns while maintaining type safety throughout the stack.

## Recent Changes (July 2025)

✓ Updated country eligibility data based on official Turkish government sources
✓ Afghanistan and other previously marked ineligible countries now correctly marked as e-visa eligible
✓ Added country flags to country selector dropdown
✓ Updated Turkey landmark images with real photos (Hagia Sophia, Cappadocia, Pamukkale, Ephesus, Bosphorus, Antalya)
✓ Removed manual navigation controls (arrows, dots) for automatic slideshow only
✓ Simplified insurance options to exact 7 pricing tiers as requested (7 days: $114, 14 days: $131, 30 days: $154, 60 days: $191, 90 days: $214, 180 days: $275, 1 year: $315)
✓ Removed excessive UI elements from insurance page including repetitive descriptions
✓ Cleaned up database duplicates for insurance products
✓ Updated non-eligible country messaging to indicate visa-free travel
✓ Database updated with new insurance products and corrected country eligibility