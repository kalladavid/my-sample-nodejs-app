# PRD -- Local Service Booking App

## 1. Product Vision

A mobile marketplace that enables customers to discover, compare, and
book trusted local service professionals in under one minute, while
helping service providers manage bookings and grow their businesses.

## 2. Target Users

-   Customers: homeowners, renters, families, students, professionals.
-   Service providers: plumbers, electricians, cleaners, AC technicians,
    beauticians, appliance repair, tutors, and similar professionals.

## 3. Core Value

**Book a trusted local service provider quickly and confidently.**

------------------------------------------------------------------------

# 4. Technology Stack

  Layer                Technology
  -------------------- -------------------------------
  Mobile App           React Native + Expo
  Backend API          Supabase
  Database             Supabase PostgreSQL
  Authentication       Supabase Auth (OTP, OAuth)
  Storage              Supabase Storage
  Realtime             Supabase Realtime
  Maps                 Google Maps SDK
  Payments             Razorpay
  Push Notifications   Expo Notifications / FCM
  Analytics            Firebase Analytics or PostHog
  Admin                React

------------------------------------------------------------------------

# 5. Design Style Guide

## Brand Personality

Modern, trustworthy, friendly, fast.

## Colour Palette

-   Primary: #2563EB
-   Secondary: #14B8A6
-   Accent: #F59E0B
-   Success: #22C55E
-   Error: #EF4444
-   Background: #F8FAFC
-   Surface: #FFFFFF
-   Text: #111827
-   Secondary Text: #6B7280

## Typography Feel

-   Modern sans-serif (Inter or SF Pro)
-   Rounded cards
-   Soft shadows
-   Large touch targets
-   Minimalist interface
-   Accessible contrast

------------------------------------------------------------------------

# 6. Phased Roadmap

## Phase 1 (MVP)

### Features

-   OTP login
-   User profile
-   Saved addresses
-   Browse/search services
-   Provider profiles
-   Date/time selection
-   Booking
-   Cancel booking
-   Payments (UPI/Card/Cash)
-   Booking history
-   Ratings & reviews
-   Provider booking management
-   Admin dashboard
-   Notifications

## Phase 2

-   Favorites
-   Repeat booking
-   Coupons
-   Reschedule
-   Chat
-   Call provider
-   Earnings dashboard
-   Availability calendar
-   Emergency booking
-   Digital invoices

## Phase 3

-   Live GPS tracking
-   ETA
-   AI recommendations
-   AI cost estimation
-   Voice search
-   Photo-based issue detection
-   Portfolio gallery
-   Certifications

## Phase 4

-   Referral program
-   Loyalty
-   Membership
-   Gift cards
-   Marketing dashboard
-   Revenue analytics
-   Commission management

## Phase 5

-   Multi-city
-   Corporate accounts
-   Franchise support
-   Team scheduling
-   Multi-language
-   Regional pricing
-   Tax support

## Phase 6

-   AI assistant
-   Voice booking
-   Predictive demand
-   Dynamic pricing
-   Fraud detection
-   Automatic provider matching

## Phase 7

-   Home maintenance subscriptions
-   Warranty management
-   Insurance integration
-   CRM
-   Inventory
-   Payroll
-   Spare-parts marketplace

------------------------------------------------------------------------

# 7. Screen Inventory

## Phase 1 (MVP)

  Screen                    MVP   Description
  ------------------------- ----- ---------------------------
  Splash                    ✓     App launch
  Onboarding                ✓     Introduce app
  Login / OTP               ✓     Authentication
  Home                      ✓     Categories & search
  Categories                ✓     Browse services
  Search Results            ✓     Matching services
  Provider List             ✓     Nearby providers
  Provider Profile          ✓     Details, pricing, reviews
  Booking Details           ✓     Service summary
  Date & Time Picker        ✓     Schedule
  Payment                   ✓     Complete payment
  Booking Confirmation      ✓     Success
  Booking History           ✓     Past & upcoming bookings
  User Profile              ✓     Personal settings
  Notifications             ✓     Booking alerts
  Provider Login            ✓     Provider authentication
  Provider Dashboard        ✓     Overview
  Booking Requests          ✓     Accept/reject jobs
  Provider Booking Detail   ✓     Manage job
  Provider Profile          ✓     Edit business info
  Admin Dashboard           ✓     System overview
  Manage Users              ✓     Customer management
  Manage Providers          ✓     Verification
  Manage Bookings           ✓     Booking administration

## Phase 2

Favorites, Chat, Offers, Coupons, Availability Calendar, Earnings,
Invoice, Emergency Booking.

## Phase 3

Live Tracking, AI Assistant, Voice Search, Image Diagnosis, Portfolio,
Certificates.

## Phase 4

Rewards, Membership, Referral, Marketing, Revenue Dashboard.

## Phase 5

City Management, Corporate Portal, Franchise Dashboard, Localization.

## Phase 6

AI Operations Dashboard, Dynamic Pricing, Demand Forecasting.

## Phase 7

Subscription Plans, Warranty Wallet, Inventory, CRM, Payroll,
Marketplace.

------------------------------------------------------------------------

# 8. Recommended First Functional Flow

**Customer Booking Flow**

Splash → Login → Home → Select Category → Provider List → Provider
Profile → Choose Date & Time → Payment → Booking Confirmation

This validates the app's core value with the least complexity.

------------------------------------------------------------------------

# 9. Success Metrics

-   Booking completion rate
-   Time to complete booking
-   Repeat bookings
-   Provider acceptance rate
-   Customer ratings
-   Monthly active users
-   Revenue
