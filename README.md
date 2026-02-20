# Invoice Generator Application

A complete, modern invoice generator application built with React, TypeScript, and Tailwind CSS. This application allows companies and organizations to create, manage, and track invoices with a beautiful, intuitive interface.

## Features

### Authentication System
- **Landing Page**: Professional landing page with call-to-action buttons
- **Sign Up**: New user registration with validation
- **Login**: Secure user authentication
- **Protected Routes**: Automatic redirect based on authentication status

### Dashboard
- Overview of key metrics (Total Revenue, Invoices Sent, Clients, Paid Invoices)
- Revenue chart visualization using Recharts
- Recent invoices section
- Welcome message for personalized experience

### Invoice Management
- **Create New Invoices**: Add multiple line items with descriptions, quantities, and prices
- **Invoice Summary**: Real-time calculation of subtotal, tax, and total
- **Date Management**: Issue date and due date selection
- **Client Selection**: Link invoices to clients
- **Organization Details**: Include company information on invoices

### Client Management
- View all clients in a clean table format
- Add, edit, and delete clients
- Search functionality for easy client lookup
- Display contact information (email, phone, location)

### Item List
- Manage products and services
- Track item names, descriptions, and prices
- Search and filter capabilities

### Invoice History
- View all past invoices
- Track invoice status (Paid, Pending, Overdue)
- Download and view invoice details

### Orders
- Track invoices ordered by other companies
- Empty state with helpful messaging

### Settings
- Update organization profile
- Configure company details that appear on invoices
- Set invoice sequence numbering

## Tech Stack

- **React 18.3.1**: Modern React with hooks
- **TypeScript**: Type-safe code
- **React Router DOM 7**: Client-side routing
- **Tailwind CSS 4**: Utility-first styling
- **Recharts**: Beautiful, responsive charts
- **Lucide React**: Clean, consistent icons
- **Radix UI**: Accessible component primitives
- **Sonner**: Beautiful toast notifications
- **Local Storage**: Client-side data persistence

## Application Flow

1. **First Visit**: Users land on the landing page
2. **New Users**: Sign up → Dashboard (can set up organization in Settings)
3. **Returning Users**: Login → Dashboard
4. **Dashboard Access**: All main features accessible via sidebar navigation
5. **Logout**: Returns to landing page

## Mock Authentication

The application uses localStorage for mock authentication:
- User accounts are stored in `invoice_users`
- Active session stored in `invoice_user`
- Passwords are stored in plain text (for demo purposes only)

**Note**: In a production environment, you would integrate a real backend with proper authentication, password hashing, and secure token management.

## Data Structure

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  organization?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxId: string;
  };
}
```

## Getting Started

1. Visit the landing page at `/`
2. Click "Get Started Free" or "Sign in"
3. Create a new account or log in
4. Set up your organization details in Settings
5. Start creating invoices!

## Color Scheme

- **Primary Orange**: `#FF6B2C` (rgb(249, 115, 22))
- Used for CTAs, active states, and brand elements
- Complemented by neutral grays and clean whites

## Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)
