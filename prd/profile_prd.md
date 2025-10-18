# Product Requirement Document: Scrollodex Profile Page

## 1. Overview

- **Product:** Scrollodex
- **Feature:** Profile Page / Contact Detail View
- **Status:** Live
- **Goal:** To present a comprehensive and visually rich profile for a selected contact, functioning as a personal CRM entry. The page blends a fun, Pokédex-inspired aesthetic with practical contact management information.

## 2. User Stories

- **As a user,** after selecting a contact, I want to see their detailed profile page so I can get a full picture of our relationship.
- **As a user,** I want to see an AI-generated summary of our relationship so I can get a quick, dynamic insight that updates over time.
- **As a user,** I want to see relevant CRM information like their role, company, and when we last talked.
- **As a user,** I want to see a clear "Relationship Score" and detailed stats to quickly gauge the health and nature of our connection.
- **As a user,** I want to easily find their contact details, like email and social media links.
- **As a user,** I want a clear and simple way to navigate back to the main list of contacts.

## 3. Functional Requirements

### 3.1. Page Layout and Theming
- The page must display the complete profile of a single contact.
- The layout must be responsive:
  - **Desktop:** A two-column layout, with the image/stats on the left and info on the right.
  - **Mobile:** A single-column layout, with content sections stacked vertically.
- The page header's background color should be themed based on the contact's type ('Personal' or 'Professional').

### 3.2. Navigation
- A "Back to List" button, accompanied by an arrow icon, must be prominently displayed at the top of the page.
- Clicking this button must return the user to the Home Page (Contact List View).

### 3.3. Profile Content Sections

- **Image & Stats Column (Left):**
  - **Profile Image:** A large, circular profile picture displayed within a styled container.
  - **Relationship Score:**
    - A prominently displayed overall score (0-100) that provides a quick-glance measure of the relationship's strength.
    - The score is the average of the four core Relationship Stats.
  - **Relationship Stats:**
    - A section titled "Relationship Stats".
    - Each of the four stats (Connection, Reliability, Communication, Energy) must be displayed with its label, numerical value, and a horizontal `StatBar`.
    - The `StatBar`'s fill percentage must be proportional to the stat's value.
    - Each stat bar should have a distinct, thematic color for easy differentiation.

- **Information Column (Right):**
  - **Header:** The contact's name in a large font size and their location in a smaller, secondary style.
  - **Summary (AI-Generated):**
    - An AI-generated, two-sentence summary of the relationship.
    - This summary is dynamically created based on the contact's personality and the current relationship stats.
    - A loading indicator must be displayed while the summary is being generated.
    - If the API call fails, the view should fall back to displaying the contact's static description.
  - **General Info Section:**
    - A visually distinct, themed box containing key CRM data.
    - Must include: Role, Company, Last Contacted, and Birthday.
  - **Type Section:**
    - Displays the contact's single type ('Personal' or 'Professional') as a large, colored, and easy-to-read badge.
  - **Contact Info Section:**
    - A section displaying the contact's detailed contact information.
    - Must include: Email, Phone, Social Media (as a hyperlink), and Preferred Contact Method.

### 3.4. Relationship Stats Definitions

The four core relationship stats provide a comprehensive view of the relationship's health and dynamics:

- **Connection (0-100):** Represents the depth of the emotional bond and mutual understanding. This is the core "health" of the friendship, indicating closeness and empathy.
- **Reliability (0-100):** Measures the level of trust and dependability. A high Reliability score means this is a friend you can count on to be there for you and keep their promises.
- **Communication (0-100):** Reflects the quality and consistency of interaction. It measures how well you both keep in touch and engage in meaningful conversation.
- **Energy (0-100):** Indicates the overall vibe and dynamic of the friendship. A high Energy stat signifies a fun, positive, and uplifting presence.

### 3.5. Stat Measurement Strategies

The relationship stats can be measured through a combination of automated data analysis and manual user input:

#### Automated Measurement (Data-Driven)

- **Connection:** Analyze sentiment of notes/moments, length of relationship, shared experiences count, frequency of deep conversations
- **Reliability:** Track response rate to messages, follow-through on actions/todos, consistency of check-ins, meeting attendance
- **Communication:** Measure frequency of interactions, message length/depth, response time, variety of communication channels used
- **Energy:** Analyze positive sentiment in interactions, shared activities, emoji usage, exclamation marks in messages, meeting duration vs. planned

#### Manual Input Options

- **Connection:** User can manually adjust based on gut feeling, significant life events shared, level of vulnerability in conversations
- **Reliability:** User can rate after specific interactions (kept/missed commitments, was there in crisis, etc.)
- **Communication:** User can note quality beyond quantity (meaningful vs. surface-level chats)
- **Energy:** User can rate the "vibe" after interactions (energized, neutral, drained)

#### Hybrid Approach (Recommended)

- Start with baseline automated scores
- Allow manual overrides/adjustments via simple UI controls (slider or +/- buttons)
- AI-suggested adjustments based on notes/moments content analysis
- Periodic "check-in" prompts asking user to confirm or adjust stats

## 4. Non-Functional Requirements

- **Performance:** The page should render instantly. A loading indicator must be shown for the AI-generated summary, which may have a slight delay.
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
- **API:** Google Gemini API (`@google/genai`) for generating the dynamic summary.
- **Components:** `ScrollodexDetail.tsx`, `StatBar.tsx`.
- **Data:** The `ScrollodexDetail` component receives a single `contact` object as a prop from the main `App` component.

## 6. Out of Scope for this Feature

- "Previous" and "Next" contact navigation buttons on the detail page.
- Comparing stats between two or more contacts.
- Editing or updating contact information from the UI.