# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This LMS (Learning Management System) project is designed to integrate with KLASSCI school management system. It consists of documentation and API specifications for building a modern LMS with Laravel backend APIs and Angular frontend capabilities.

## Project Structure

```
LMS/
├── docs/                           # Comprehensive documentation
│   ├── LMS_API_README.md          # API overview and quick start
│   ├── LMS_API_TECHNICAL_REFERENCE.md # Detailed technical documentation
│   ├── LMS_ARCHITECTURE_GUIDE.md  # Enterprise architecture guide
│   ├── LMS_DEVELOPER_HANDOVER.md  # Developer handover guide
│   ├── LMS_INTEGRATION_GUIDE.md   # Integration instructions
│   └── LIQUID_GLASS_COMPONENTS.md # UI component specifications
└── CLAUDE.md                      # This file
```

## Related KLASSCI Backend (ESBTP-yAKROv2Pascal)

The main Laravel application that powers the KLASSCI system is located at `../ESBTP-yAKROv2Pascal/`:

### Key Backend Components:
- **Laravel 9/10** with **Sanctum authentication**
- **API Controllers**: Located in `app/Http/Controllers/API/`
  - `AuthController.php` - Authentication endpoints
  - `BaseApiController.php` - Common API functionality
  - `LMSDataController.php` - Data reading endpoints
  - `LMSWriteController.php` - Data writing endpoints

### Common Development Commands:

```bash
# Navigate to the KLASSCI backend
cd ../ESBTP-yAKROv2Pascal

# Install dependencies
composer install

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start development server
php artisan serve

# Check API routes
php artisan route:list --path=api/lms

# Clear and cache configuration
php artisan config:cache
php artisan route:cache

# View logs
tail -f storage/logs/laravel.log

# Run tinker console for testing
php artisan tinker

# Run database seeders
php artisan db:seed
```

## Key APIs Available

The system provides REST APIs under `/api/lms/` prefix:

### Authentication
- `POST /api/lms/auth/login` - Login with email/password
- `GET /api/lms/auth/me` - Get current user profile
- `POST /api/lms/auth/logout` - Logout

### Data Reading (LMS ← KLASSCI)
- `GET /api/lms/structure` - Get organizational structure (filières, niveaux)
- `GET /api/lms/matieres` - Get accessible subjects
- `GET /api/lms/classes` - Get current year's classes
- `GET /api/lms/classes/{id}/etudiants` - Get students in a class
- `GET /api/lms/emploi-temps` - Get course schedules
- `GET /api/lms/evaluations` - Get scheduled evaluations

### Data Writing (LMS → KLASSCI)
- `POST /api/lms/evaluations/{id}/notes` - Save evaluation grades
- `POST /api/lms/cours/{id}/presences` - Record course attendance
- `PUT /api/lms/cours/{id}/statut` - Update course status

## Architecture Insights

### Authentication Strategy
- Uses **Laravel Sanctum** with Bearer tokens
- Role-based access control (enseignant, coordinateur, étudiant)
- Automatic filtering by academic year and user permissions

### Data Relationships
- **Temporal relationships**: Teachers are assigned to subjects per academic year
- **Classes**: Permanent entities, students filtered by current enrollment
- **Academic year**: Determined by `is_current = 1` flag

### Important Database Tables (KLASSCI)
- `esbtp_enseignant_matiere` - Teacher-subject assignments by year
- `esbtp_cours` - Course schedule entries
- `esbtp_classes` - Class definitions
- `esbtp_inscriptions` - Student enrollments by year
- `esbtp_annee_universitaires` - Academic years

## Development Guidelines

1. **Always use existing APIs** rather than direct database access
2. **Test authentication first** - get a valid Bearer token
3. **Respect role-based filtering** - APIs automatically filter data by user role
4. **Handle temporal data properly** - understand year-based filtering
5. **Follow Laravel conventions** - use Eloquent models and relationships
6. **Validate permissions** - check user role before data operations

## Testing API Endpoints

```bash
# Test authentication
curl -X POST "http://localhost:8000/api/lms/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"enseignant@school.com","password":"password123"}'

# Test data retrieval with token
curl -X GET "http://localhost:8000/api/lms/matieres" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test data writing
curl -X POST "http://localhost:8000/api/lms/evaluations/1/notes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":[{"etudiant_id":123,"note":16.5,"is_absent":false}]}'
```

## Documentation Strategy

- **Read `docs/LMS_DEVELOPER_HANDOVER.md`** first for complete development context
- **Use `docs/LMS_API_TECHNICAL_REFERENCE.md`** for detailed API specifications
- **Reference `docs/LMS_ARCHITECTURE_GUIDE.md`** for enterprise architecture patterns
- **Check `docs/LMS_INTEGRATION_GUIDE.md`** for integration workflows

## Error Handling

APIs return standardized JSON responses:
- **Success**: `{"success": true, "data": {...}, "meta": {...}}`
- **Error**: `{"success": false, "message": "...", "errors": {...}}`

Common HTTP status codes:
- `200` - Success
- `401` - Unauthenticated (check token)
- `403` - Access denied (check permissions)
- `404` - Resource not found
- `422` - Validation errors
- `500` - Server error

## Frontend Integration Notes

The architecture supports:
- **Angular 17+** with micro-frontend architecture
- **Module Federation** for scalable frontend development
- **PWA capabilities** with service workers
- **Real-time features** via WebSocket integration

## LMS Frontend Application

### Quick Start Commands

Navigate to the frontend application:
```bash
cd lms-klassci-frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:prod

# Run tests
npm test

# Lint code
npm run lint
```

### Frontend Architecture

The LMS frontend is built with:
- **Angular 17+** with standalone components and signals
- **Liquid Glass Design System** with glassmorphism effects
- **KLASSCI API Integration** with Sanctum authentication
- **Performance optimizations** for 60fps animations
- **Accessibility compliance** WCAG 2.1 AAA

### Key Components

- **LiquidGlassBackgroundComponent** - Adaptive background with liquid effects
- **LiquidGlassCardComponent** - Interactive cards with backdrop-filter
- **KlassciApiService** - Complete API integration with error handling
- **AuthGuard/RoleGuard** - Route protection based on user roles

### Environment Configuration

Update API endpoints in `src/environments/`:
```typescript
export const environment = {
  klassciApiUrl: 'http://localhost:8000/api',
  klassciBaseUrl: 'http://localhost:8000',
  // ...
};
```

### Routes Structure

- `/auth/login` - Liquid glass login page
- `/dashboard` - Adaptive dashboard by user role
- `/courses` - Course management
- `/evaluations` - Teacher evaluation tools
- `/admin` - Administrative functions (role-protected)