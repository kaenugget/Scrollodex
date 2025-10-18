# Product Requirement Document: Scrollodex Home Page

## 1. Overview

- **Product:** Scrollodex
- **Feature:** Home Page / Contact List View
- **Status:** Live
- **Goal:** To provide users with an engaging and intuitive way to browse their collection of contacts, inspired by the classic Pokémon Pokédex interface. The page should display a grid of all contacts, encouraging exploration and interaction.

## 2. User Stories

- **As a user,** I want to see all my contacts displayed in a visually appealing grid so that I can get a quick overview of everyone.
- **As a user,** I want each contact's card to show key information (name, ID, picture, type) so I can quickly identify them.
- **As a user,** I want to be able to click on a contact's card to view their detailed profile.
- **As a user,** I want the interface to be responsive so I can browse my contacts on any device (desktop, tablet, or mobile).

## 3. Functional Requirements

### 3.1. Contact Grid Display
- The page must display a grid of all available contacts from the data source.
- The grid must be responsive, adjusting the number of columns based on the screen width to ensure optimal viewing on all devices.
  - **Large Screens (lg):** 4 columns
  - **Medium Screens (md):** 3 columns
  - **Small Screens (sm):** 2 columns
  - **Extra-Small Screens:** 1 column

### 3.2. Contact Card Component
- Each contact in the grid will be represented by a `ContactCard`.
- The card must display:
  - **Profile Picture:** A circular, high-quality image of the contact.
  - **Contact Name:** The full name of the contact.
  - **Type:** The contact's assigned "type" ('Personal' or 'Professional') displayed as a colored badge.
- The card should have a subtle hover effect (e.g., lift via shadow and transform) to provide visual feedback and indicate interactivity.
- The bottom border color of the card should correspond to the contact's type color, adding a thematic touch.

### 3.3. Navigation
- Clicking anywhere on a `ContactCard` must transition the view to the "Contact Profile Page" for that specific contact.

## 4. Non-Functional Requirements

- **Performance:** The page should load quickly. Images should be appropriately sized to avoid long load times.
- **Accessibility:**
  - Contact cards must be focusable using keyboard navigation.
  - Profile images must have appropriate `alt` text (`alt={contact.name}`).
  - Color contrast for text and badges should meet WCAG AA standards.
- **UI/UX:**
  - The design should be clean, modern, and fun, with a clear aesthetic reference to the Pokémon Pokédex.
  - The page must include a main header with the application title ("Scrollodex") and a descriptive tagline.
  - A simple footer with attribution should be present at the bottom of the page.

## 5. Technical Specifications

- **Framework:** React
- **Styling:** Tailwind CSS
- **Components:** `ScrollodexList.tsx`, which contains the `ContactCard` component.
- **Data Source:** A static array of `Contact` objects located in `constants.ts`.

## 6. Out of Scope for this Feature

- Searching or filtering the contact list.
- Sorting contacts by ID, name, or type.
- Adding, editing, or deleting contacts from the list.
- User authentication or personalized contact lists.