
# Product Requirement Document: Friendex Profile Page

## 1. Overview

- **Product:** Friendex
- **Feature:** Profile Page / Friend Detail View
- **Status:** Live
- **Goal:** To present a comprehensive and visually rich profile for a selected friend, mimicking the detailed stats and information layout of a Pokémon's Pokédex entry.

## 2. User Stories

- **As a user,** after selecting a friend, I want to see their detailed profile page so I can learn more about them.
- **As a user,** I want to see a large version of their picture, their full description, and their "Pokédex data" (e.g., height, weight, category).
- **As a user,** I want to view their base stats (HP, Attack, etc.) in a clear, graphical format like progress bars.
- **As a user,** I want to easily identify their "types" and "weaknesses" through colored badges.
- **As a user,** I want a clear and simple way to navigate back to the main list of friends.

## 3. Functional Requirements

### 3.1. Page Layout and Theming
- The page must display the complete profile of a single friend.
- The layout must be responsive:
  - **Desktop:** A two-column layout, with the image/stats on the left and info on the right.
  - **Mobile:** A single-column layout, with content sections stacked vertically.
- The page header's background color should be themed based on the friend's primary type, creating a cohesive and immersive experience.

### 3.2. Navigation
- A "Back to List" button, accompanied by an arrow icon, must be prominently displayed at the top of the page.
- Clicking this button must return the user to the Home Page (Friend List View).

### 3.3. Profile Content Sections

- **Image & Stats Column:**
  - **Profile Image:** A large, circular profile picture displayed within a styled container.
  - **Base Stats:**
    - A section titled "Base Stats".
    - Each of the six stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) must be displayed with its label, numerical value, and a horizontal `StatBar`.
    - The `StatBar`'s fill percentage must be proportional to the stat's value (relative to a max value of 200).
    - Each stat bar should have a distinct color for easy differentiation.

- **Information Column:**
  - **Header:** The friend's name in a large font size and their ID number in a smaller, secondary style.
  - **Description:** The friend's full description text, displayed within a styled, inset block to set it apart.
  - **Profile Data Box:**
    - A visually distinct, themed box containing key "Pokédex-style" data.
    - Must include: Height, Weight, Category, and Gender.
  - **Types Section:**
    - Displays the friend's types as large, colored, and easy-to-read badges.
  - **Weaknesses Section:**
    - Displays the friend's weaknesses as large, colored, and easy-to-read badges.

## 4. Non-Functional Requirements

- **Performance:** The page should render instantly upon selection from the list view with no noticeable delay.
- **Accessibility:**
  - The "Back" button must be keyboard-focusable and have a clear, descriptive label.
  - All text must have sufficient color contrast against its background.
  - Headings (`h1`, `h2`, `h3`) must be used semantically to structure the page content.
- **UI/UX:**
  - The layout should feel balanced, clean, and easy to parse.
  - A subtle fade-in animation should be used on page load to create a smooth transition from the list view.
  - Upon navigating to the page, the window should automatically scroll to the top.

## 5. Technical Specifications

- **Framework:** React
- **Styling:** Tailwind CSS
- **Components:** `FriendexDetail.tsx`, `StatBar.tsx`.
- **Data:** The `FriendexDetail` component receives a single `friend` object as a prop from the main `App` component.

## 6. Out of Scope for this Feature

- "Previous" and "Next" friend navigation buttons on the detail page.
- Comparing stats between two or more friends.
- Editing or updating friend information from the UI.
