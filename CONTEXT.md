# Susoncodes

Personal site for Josh Suson: a chat-shell “dumping ground” for builds and light writing, presented through the Josh Bot persona. Not a hiring funnel, not a live chatbot.

## Language

### Persona & shell

**Josh Bot**:
The site persona shown in the shell chrome — an openly fake assistant that routes visitors through Josh’s work.
_Avoid_: chatbot, AI assistant, agent (implies a live model)

**Chat Shell**:
The persistent product chrome (sidebar, mobile nav, message column) that frames every screen as a conversation.
_Avoid_: layout, theme, app frame

**Thread**:
A fixed, navigable conversation surface in the shell (Home, Building, Written, About). Threads are authored routes, not live chat sessions.
_Avoid_: chat, conversation, session, page (too generic)

**Faux Prompt**:
The Home empty-state control that offers suggested questions and routes the visitor into a Thread.
_Avoid_: search, input, command palette

**Show More**:
Pagination that appends another assistant bundle of cards into the current Thread’s message column.
_Avoid_: infinite scroll, load more (unless describing the control label)

### Content

**Project**:
A build Josh is working on, has shipped, or has parked — shown in the Building Thread.
_Avoid_: portfolio item, case study, app (unless the Project’s own name)

**Thought**:
A piece of light writing — shown in the Written Thread.
_Avoid_: Blog post, Post, Article (Blog is retired; redirect-only legacy)

**Building**:
The public Thread and URL space (`/building`) that lists Projects.
_Avoid_: Projects index (that name is reserved for the secondary archive)

**Written**:
The public Thread and URL space (`/written`) that lists Thoughts.
_Avoid_: Blog, Journal

**About**:
The public Thread (`/about`) that answers “Who is Josh?” in the shell voice.
_Avoid_: bio page (unless distinguishing a richer long-form bio later)

**Artifact**:
A Project or Thought shown as its own article surface inside the Chat Shell (sticky breadcrumb + prose), not as chat bubbles.
_Avoid_: post, detail page, entry (too generic)

**Archive**:
A secondary library list of all Projects (`/projects`) or Thoughts (`/thoughts`). Breadcrumb parent for Artifacts. Not a Thread.
_Avoid_: index, blog listing

### Publishing

**Build Status**:
Where a Project actually is in life: `active`, `shipped`, or `parked`.

## Settled decisions (grilling)

- **Parity bar**: Product clone of mysite — same shell, routes, copy model, and interaction feel; stack is Payload + Next. No staged “v1 vs later” product split — if it’s part of the mysite experience we care about, it’s in scope.
- **Cutover**: Payload is the next canonical app; Statamic stays until parity is real (no forced launch date).
- **Content types**: Projects + Thoughts, plus globals for shell and site extras. No Blog collection. No hierarchical Pages tree. No `/blog` redirects.
- **Public vocabulary & URLs**: Keep Building/Written/About Threads; Project/Thought Artifacts; Project/Thought Archives; Josh Bot persona.
- **About**: Chat Thread only — bot reply copy in shell global. Classic bio, Rules For Building, and related dead templates are not ported.
- **Surfaces**: Threads = chat theater; Artifacts = standalone articles in the shell; Archives = library lists and breadcrumb parents (`Projects / {title}`, `Thoughts / {title}`).
- **Project fields**: Full mysite shape — title, pitch, build status, external URL, image, what it is, thought process, learnings, slug, date, SEO trio.
- **Thought fields**: title, optional summary, body, slug, date, SEO trio. No tags/series.
- **Globals**: Two globals — `shell` (persona, profile photo, Home Faux Prompt copy, per-Thread labels/messages) and `site` (social links). Not four Statamic mirrors, not one mega-global.
- **Tinkering With**: Scrapped permanently — not ported.
- **Social links**: First-class on `site` even if UI barely surfaces them at first.
- **Long-form authoring**: Markdown for Thought body and Project long fields; not Lexical page-builder fields.
- **Publishing**: Draft status to hide WIP; `date` orders public lists; no versions/preview ceremony.
- **Navigation feel**: In-shell Thread navigation must feel like one mounted Chat Shell (no chrome-remount jank). Implementation open.
- **Show More**: Building/Written open with N cards (default 5) in one assistant bubble; Show More appends another assistant-only bundle.
- **SEO fallbacks**: metaTitle → title → site name; metaDescription → pitch/summary → shell greeting subtitle; metaImage → Project image → profile photo.
- **Payload stubs**: Remove `Posts` and `homePage`; replace with the real model.
- **Seed data**: Dummy Projects and Thoughts only (deletable fixtures). Do not import “Why I Choose To Write” or other retired Statamic writing. Do seed shell/site globals copy from mysite so the shell has real voice.
- **Thread footer chips**: Scrapped — no “Back to Home” / cross-thread chip rows under message columns. Sidebar (and mobile nav) are the wayfinding.
- **Archives**: Plain secondary library lists (not chat theater), real enough to be breadcrumb landings.
- **Seed volume**: ~8 dummy Projects (mixed build statuses) + ~8 dummy Thoughts; obvious fake delete-fodder. Shell/site globals seeded from live mysite copy.
- **Admin**: Solo admin user; public read-only; no multi-author RBAC.
- **In scope**: shell chrome, Home Faux Prompt, Building + Written Threads (list, Show More, Artifact detail), About Thread, Archives + breadcrumbs, SEO, admin usable without Statamic, dark shell visual match. Not in scope: footer chips, Blog, Tinkering With, classic bio/Rules For Building, `/blog` redirects.
