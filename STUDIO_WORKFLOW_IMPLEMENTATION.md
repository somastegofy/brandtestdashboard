# Studio Three-Step Workflow Implementation

## Overview
This document describes the implementation of the three-step workflow for the Studio page builder, including database integration, undo/redo history, and comprehensive QR & Link management.

## Architecture

### Database Schema (Supabase)
The following tables have been created to support the workflow:

1. **folders** - Organize links into folders
   - id, name, parent_id, created_at, updated_at

2. **studio_links** - Manage page URLs and slugs
   - id, slug (unique, 5-32 chars), is_locked, base_url, full_url
   - campaign_name, folder_id, utm_source, utm_medium, utm_campaign
   - created_at, locked_at

3. **studio_qr_codes** - Store QR code data
   - id, studio_link_id, image_png, image_svg, qr_type
   - created_at

4. **studio_page_links** - Associate pages with links and QR codes
   - id, page_id, studio_link_id, studio_qr_code_id
   - created_at, updated_at

5. **studio_pages** - Main page data (already existed)
6. **qr_codes** - QR code library (already existed)

All tables have RLS enabled with policies for authenticated users.

## Components Created

### 1. useHistory Hook (`src/hooks/useHistory.ts`)
- Manages undo/redo state with immutable history stacks
- Persists to localStorage with configurable keys
- Supports up to 50 history entries (configurable)
- Methods: `setState`, `undo`, `redo`, `clearHistory`
- Properties: `canUndo`, `canRedo`, `state`

### 2. useKeyboardShortcuts Hook (`src/hooks/useKeyboardShortcuts.ts`)
- Global keyboard shortcut management
- Supports Ctrl/Cmd + Z for undo
- Supports Shift + Cmd + Z (Mac) or Ctrl + Y (Windows) for redo
- Configurable enable/disable state

### 3. StudioStepper Component (`src/components/studio/StudioStepper.tsx`)
- Horizontal stepper with 3 steps: Content, Design/Settings, QR & Link
- Visual states: completed (green checkmark), active (blue), upcoming, blocked (gray)
- Validation gates prevent navigation to next step until current is valid
- Keyboard accessible with ARIA labels and focus management
- Click to navigate backward to completed steps
- Screen reader announcements for step changes

### 4. DesignSettingsPanel Component (`src/components/studio/DesignSettingsPanel.tsx`)
Features:
- **Background Controls**: Color picker with WCAG AA contrast badge (≥4.5:1)
- **Background Image**: URL input, display mode (cover/contain), overlay scrim (0-80%)
- **Gradient**: Type (linear/radial/none), angle for linear, two color stops
- **Typography Tokens**: Font families and sizes for Heading, Body, Label
- **Card Style**: Border radius (XS-XL), elevation (none/raised/overlay), surface color
- **Page Loader**: Type (none/spinner/bar/logo-pulse), accent color
- **Global Colors**: Link colors (default/hover/active), CTA colors (default/hover/active)
- **Contrast Validation**: Real-time WCAG AA checking with inline warnings

### 5. QRLinkPanel Component (`src/components/studio/QRLinkPanel.tsx`)
Features:
- **URL Management**:
  - Read-only base domain display
  - Slug input with real-time validation (5-32 chars, a-z, 0-9, hyphen)
  - 300ms debounced availability check with visual feedback
  - Save & Lock Slug button with confirmation modal (irreversible action)
  - Locked state with lock icon and disabled input

- **Campaign Details**:
  - Required campaign name field
  - Optional folder selection dropdown

- **QR Options**:
  - Radio buttons: "Reuse existing QR" or "Create new QR"
  - Dropdown for selecting existing QR codes when reusing
  - Generate button for creating new QR codes
  - Confirmation modal for new QR creation

- **QR Preview Card**:
  - Visual preview of QR code image
  - Copy URL button with success feedback
  - Download PNG button
  - Download SVG button
  - Test Scan button (opens URL in new tab)

- **UTM Builder (Collapsible)**:
  - Source, Medium, Campaign inputs
  - Live preview of final URL with UTM parameters
  - URL encoding handled automatically

## Workflow Steps

### Step 1: Content
- Uses existing Component tab functionality
- Users build page content with drag-and-drop components
- Validation: At least one component must be added
- All existing features preserved (component library, editing, styling)

### Step 2: Design / Settings
- Opens Settings tab automatically when step activated
- Shows all existing Settings fields at the top (non-destructive)
- Appends new design customization sections below
- All controls update CSS custom properties instantly
- Each change pushes one entry to undo history
- Validation: All text must pass WCAG AA contrast (≥4.5:1)
- Blocks navigation to Step 3 until contrast requirements met

### Step 3: QR & Link
- Right sidebar converts to resizable side-sheet (480-640px)
- Can expand/collapse, overlays ≤20% of canvas on desktop
- Collapsible sections with sticky footer
- Every change pushes one undo entry (except slug edits after locking)
- Validation: Required fields (slug, campaign name) must be filled

## Undo/Redo System

### Implementation
- Uses `useHistory` hook with localStorage persistence
- History key: `studio_history_${pageId}` for per-page histories
- Actions tracked:
  - Component additions/deletions
  - Component property updates
  - Component style changes
  - Design customization changes
  - QR & Link data changes (except locked slug)

### Keyboard Shortcuts
- **Undo**: Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
- **Redo**: Ctrl+Y (Windows/Linux) or Shift+Cmd+Z (Mac)
- Active only when in builder mode
- Visual feedback in header (enabled/disabled state)

## Accessibility Features

1. **ARIA Labels**: All interactive elements have descriptive labels
2. **Focus Management**: Focus moves to step heading on step change
3. **Keyboard Navigation**: Logical tab order throughout all steps
4. **Screen Reader Support**:
   - `aria-current="step"` on active step
   - Live region announces step changes
   - Status messages for validation errors
5. **Color Contrast**: WCAG AA compliance enforced
6. **Semantic HTML**: Proper heading hierarchy and landmarks

## API Integration (Stubs Created)

The following API endpoints are stubbed for future backend integration:

```
GET  /api/links/check?slug=...       → Check slug availability
POST /api/links                      → Create new link
POST /api/qrcodes                    → Generate QR code
PATCH /api/pages/:id/link            → Associate link/QR with page
```

All data currently uses Supabase direct queries. Replace with API calls when backend is ready.

## LocalStorage Persistence

The following items are persisted:
- `studio_history_${pageId}` - Undo/redo history (last 50 entries)
- `studio_step_${pageId}` - Current active step
- `studio_sidebar_width_${pageId}` - Right sidebar panel width
- `studio_page_content_${pageId}` - Draft page content
- `studio_customization_${pageId}` - Design customization settings

## CSS Custom Properties

Design customizations apply these CSS variables to the canvas:

```css
--bg-color: backgroundColor
--bg-image: backgroundImage
--bg-mode: backgroundMode
--bg-overlay: backgroundOverlay
--gradient-type: gradientType
--gradient-angle: gradientAngle
--gradient-start: gradientColorStart
--gradient-end: gradientColorEnd
--font-heading: fontFamilyHeading
--font-body: fontFamilyBody
--font-label: fontFamilyLabel
--font-size-heading: fontSizeHeading
--font-size-body: fontSizeBody
--font-size-label: fontSizeLabel
--card-radius: cardBorderRadius
--card-elevation: cardElevation
--card-surface: cardSurfaceColor
--loader-type: loaderType
--loader-accent: loaderAccentColor
--link-default: linkColorDefault
--link-hover: linkColorHover
--link-active: linkColorActive
--cta-default: ctaColorDefault
--cta-hover: ctaColorHover
--cta-active: ctaColorActive
```

## Non-Destructive Integration

### Preserved Features
- All existing Settings fields (page name, linked product, SEO, etc.)
- All three existing tabs (Settings, Component, Integrations)
- Left sidebar component library (unchanged)
- Middle canvas rendering (unchanged)
- Component interaction and editing (unchanged)
- Product selection and data population (unchanged)
- Draft save and publish workflows (unchanged)

### New Features (Additive)
- Three-step workflow navigation
- Design customization controls (appended to Settings)
- QR & Link management panel (fourth state for right sidebar)
- Undo/redo history with keyboard shortcuts
- WCAG contrast validation
- Slug management with locking
- UTM parameter builder
- QR code generation and management

## Testing Checklist

- [ ] Step navigation validates before allowing progress
- [ ] Undo/Redo works for all trackable actions
- [ ] Keyboard shortcuts function correctly
- [ ] Contrast validation blocks Step 3 when failing
- [ ] Slug validation and debouncing work as expected
- [ ] Slug lock confirmation shows and works correctly
- [ ] QR code generation confirmation shows and works correctly
- [ ] UTM builder constructs correct URLs
- [ ] Copy URL button successfully copies to clipboard
- [ ] Download QR buttons trigger file downloads
- [ ] Test Scan button opens correct URL
- [ ] LocalStorage persistence works across page reloads
- [ ] Screen reader announces step changes
- [ ] Focus management works on step navigation
- [ ] All existing Studio features still work
- [ ] Responsive design works on all breakpoints

## Future Enhancements

1. **Real-time Collaboration**: Multiple users editing same page
2. **Version History**: Browse and restore previous versions
3. **A/B Testing**: Create variants and compare performance
4. **Analytics Dashboard**: Track QR scans, page views, engagement
5. **Custom Domains**: Allow users to use own domains
6. **QR Customization**: Add logos, colors, patterns to QR codes
7. **Bulk Operations**: Create multiple pages/links/QR codes at once
8. **Templates Library**: Save and reuse common designs
9. **Export/Import**: Share page configurations
10. **Advanced UTM**: Save UTM presets, bulk apply to campaigns

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- History limited to 50 entries to prevent memory issues
- LocalStorage checks size before saving
- Debounced slug checking reduces API calls
- Component rendering optimized with React.memo where appropriate
- Large lists use virtualization for performance

## Security Considerations

- All database operations use RLS policies
- Slug validation prevents injection attacks
- UTM parameters are properly encoded
- User inputs sanitized before storage
- CSRF protection on all API endpoints (when implemented)
- Rate limiting on slug availability checks (when implemented)
