# Luma Import Module

## Summary

In order to seed the database with users, we want to take the attendees who are attending this Luma event and try to come up with profiles for all of them. 

The event page: https://lu.ma/cursor-hack-sg?tk=sauWpn

This module will handle scraping attendee data from the Luma event (Cursor Hackathon Singapore, with ~583 attendees), enriching it with additional details where possible, generating or finding profile images, and importing it into the database as Scrolladex profiles. The process prioritizes ethical data handling: Obtain necessary permissions (e.g., from event organizers), and respect privacy by only using accessible info. Since the attendee list is behind a login wall, access requires authentication as an organizer or attendee with viewing permissions. Output: A CSV file with raw data, which is then transformed into Pokémon-inspired profiles (e.g., name, ID, stats, bio entries, abilities, location).

Key assumptions:
- Team has login credentials for a Luma account with access to the event's attendee list (e.g., organizer or registered attendee if list is visible post-login).
- Event ID/slug: "cursor-hack-sg" (extracted from URL).
- Scale: Handle up to 600 records; process in batches to avoid rate limits.
- Limitations: The public page does not show attendee details (only "583 Going" count), so login is required for scraping.

## Scrape in CSV

This section outlines the process to scrape attendee data from Luma and save it as a CSV file. Use web scraping as the primary method to handle login and dynamic content. Run this as a one-time process during hackathon setup. If access is unavailable, fallback to requesting a manual CSV export from organizers.

### Steps to Scrape/Export:
1. **Web Scraping with Login (Primary Method)**:
   - Access the event page and perform login.
   - Navigate to the attendee section.
   - Load the full list, handling any pagination or dynamic loading.
   - Extract the data for each attendee.
   - Export the extracted data to a CSV file.
   - Ethical note: Ensure compliance with Luma's terms; use only for this hackathon prototype.

2. **Manual Export Fallback (If Scraping Fails)**:
   - Log in to Luma admin dashboard for the event (requires organizer access).
   - Navigate to attendee list and use built-in export feature to download CSV directly.

### Information That Should be Collected 
For each attendee, collect the following fields (based on typical Luma data post-login; enrich in next section if missing):
- Name (full name, required)
- Username/Handle (if available, e.g., LinkedIn or X handle)
- Profile URL (Luma profile link or linked socials)
- Image URL (profile picture from Luma, if available)
- Bio/Description (short bio or tagline, if provided during registration)
- Location (city/country, if shared)
- Email (only if visible and consented; otherwise skip for privacy)
- Registration Date (timestamp from Luma)
- Other: Job title, company (if in bio)

CSV Structure Example:
| Name          | Username | Profile URL                  | Image URL                  | Bio                          | Location   | Email          |
|---------------|----------|------------------------------|----------------------------|------------------------------|------------|----------------|
| John Doe     | @johndoe| https://lu.ma/u/johndoe     | https://img.lu.ma/...       | AI Engineer at Startup      | Singapore | (optional)    |

Error Handling: Log failures (e.g., missing elements); fallback to partial data.

## Collect Information

Enrich the raw CSV with additional data to build robust Scrolladex profiles. This step runs post-scrape, using web searches or integrations to fill gaps (e.g., no bio? Search public profiles). Focus on public sources; automate where possible.

### Enrichment Process:
1. **For Each Attendee**:
   - **Name Normalization**: Split into first/last; dedupe if duplicates exist.
   - **Social Profiles**: Search for LinkedIn/X via web search (e.g., "John Doe Cursor Hackathon Singapore LinkedIn").
   - **Bio/Job Info**: Obtain from LinkedIn profile summary (if public) or X bio.
   - **Location**: Infer from event (Singapore) or search (e.g., "John Doe location").
   - **Relationship/Context**: Add event-specific note (e.g., "Met at Cursor Hack SG").

2. **Automation**:
   - Read the CSV and enrich each row.
   - Process in batches to manage volume.
   - Output: Updated CSV with enriched fields.

3. **Gamification Tie-In**: Assign initial "Dex ID" (sequential, e.g., #0005 for new imports). Pre-set basic stats (e.g., HP=50 default, boost via event attendance).

Privacy: Only enrich with public data; flag sensitive fields.

## Find and Create Images

For each attendee, source or generate a Pokémon-style profile picture. Prioritize real images if available from scrape; generate if not (to fit theme). Store as URLs in CSV.

### Process:
1. **Find Existing Images**:
   - From Luma Scrape: If CSV has image URL, use it.
   - Web Search: Query "John Doe profile picture Cursor Hackathon" or "John Doe LinkedIn photo".
   - Validate: Ensure it's the correct person (manual review for hackathon).

2. **Create/Generate If Missing**:
   - Generate using AI image generation.
   - Prompt example: "Cartoon Pokémon-style avatar of a [profession] person named [name], vibrant colors, friendly expression."
   - Fallback: Use placeholder images.
   - Upload generated images to storage and get URL.

3. **Automation**:
   - Loop through CSV, check for image URL; if null, generate.
   - Output: Update CSV with `image_url` column.

Quality: Ensure images are SFW, diverse, and thematic. Batch generate to save time.

## Import CSV and Build Profiles

Final step: Import enriched CSV into the database, transforming data into Scrolladex schema (Pokédex-style profiles). This seeds the app with event attendees as starting "friends."

### Import Process:
1. **Schema Mapping**:
   - Map CSV fields:
     - `name` → Name + ID (auto-generate #XXXX)
     - `bio` → Entries/Descriptions (split into fun Pokémon-like snippets)
     - `location` → Additional Data
     - Default Stats: HP (relationship health = 70 default), Attack (energy = random 50-90), etc.
     - `image_url` → Profile Pic
     - Abilities: Auto-generate based on bio (e.g., "AI Boost: Excels in hackathons" via simple template).

2. **Import**:
   - Read CSV and insert records in batches.
   - Handle Duplicates: Use name fuzzy match to merge.
   - Local-First Sync: After import, enable offline access.

3. **Post-Import**:
   - Test: Verify count (~583).
   - Gamification: Initialize cards/collections tied to event (e.g., "Cursor Hack Badge" card for all).
   - Demo Flow: In app, show imported attendees in Pokédex scroll, with "Imported from Cursor Hack SG" tag.

Error Handling: Validate CSV schema; retry failed inserts.