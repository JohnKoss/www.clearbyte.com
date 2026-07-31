# ClearByte Website Redesign — Plan

**Date:** 2026-07-31
**Repo:** `D:\GoRepo\Clearbyte\www.clearbyte.com`
**Related:** `C:\Users\kossj\zenzoom` (lab platform)

## Positioning

Clearbyte (one capital, not "ClearByte") is a tool for **schools** to easily create AWS lab activities — not corporate training. The defining idea is **byte-size steps**: a lab is broken into more, smaller steps, each one small enough that a student can tell whether it worked before moving on. Copy across the site should reflect that, and the mark (cloud above three ascending blocks) encodes it.

`/opt-in` stays in the **primary navigation**. Carriers require the SMS opt-in page to be publicly reachable and visible to a reviewer during A2P 10DLC registration; burying it in the footer risks rejection.

## Decisions taken

| Question | Decision |
|---|---|
| Redesign scope | **Restyle in place.** Keep SvelteKit 2 + Svelte 5 (runes) + Tailwind 4 + daisyUI + `adapter-static` + the S3/CloudFront deploy. Rewrite markup and content; no stack change. |
| Prospective-student lab | **Real sandbox AWS lab**, reusing the existing zenzoom pipeline (account pool → launch → credentials → ws → grader → nuke). |
| Access gating | **Instructor-requested only.** No self-serve. Instructor requests a demo; seats are provisioned; students redeem single-use invite links. |

Consequence of the gating decision: the public site does **not** launch labs. It sells the product and captures instructor demo requests. The lab itself is entered through a redeem URL that lives on the API side, not in the static site.

---

## Phase 0 — Fix what's broken before restyling

These are live defects found while reading the current site. They are prerequisites: restyling on top of them just makes broken pages prettier.

**0.1 — Clean URLs 403 on direct load.** *(Verified: `https://www.clearbyte.com/` returns 200, `https://www.clearbyte.com/about` returns HTTP 403.)*
`adapter-static` emits `dist/about.html`, but the nav links to `/about`. Client-side navigation works; a direct hit, refresh, or shared link fails. Every non-home page is currently unreachable by URL.
- Fix: extend `lambdas/cloudfront/redirect.js` (already wired as a viewer-request function) to rewrite extensionless paths to `<path>.html`, keeping the existing apex→www 301.
- Also uncomment/replace the `custom_error_response` block in [main.tf:174](main.tf) to serve a real 404 page.
- Verify: `curl -I` returns 200 for `/about`, `/labs`, `/contact`, `/privacy`, `/terms`, `/opt-in`; an unknown path returns the styled 404.

**0.2 — Contact and SMS forms report success on failure.**
[contact/+page.svelte:16](src/routes/contact/+page.svelte#L16) and [opt-in/+page.svelte:27](src/routes/opt-in/+page.svelte#L27) both call the fetch helper and then set `submitted = true` synchronously. A network or 500 error shows the green success alert *and* an error `alert()`.
- Fix: make the handler `async`, await the response, set `submitted` only on success, render failure inline instead of `alert()`.
- Verify: with the API blocked in devtools, the form shows an inline error and no success state.

**0.3 — Dead config.** [svelte.config.js:28](svelte.config.js#L28) sets `base: "/myapp/"` at the top level of the config object. It belongs under `kit.paths.base` and is silently ignored. Remove it — it will bite whoever trusts it later.

**0.4 — Wrong anchor.** The testimonials section on the homepage carries `id="labs"` ([+page.svelte:16](src/routes/+page.svelte#L16)). Any `#labs` link lands on testimonials.

**0.5 — Both form backends are stubs that discard the submission.** *(Found while verifying 0.2.)*
[lambdas/contact/context/main.go](lambdas/contact/context/main.go) and [lambdas/sms_opt_in/context/main.go](lambdas/sms_opt_in/context/main.go) are byte-identical: they reject non-POST with 405, then return `200 "success"` without reading, storing, or forwarding the body. The payload is only visible in the lambda's debug log line.

So every contact message and every SMS opt-in ever submitted was silently dropped. Fixing 0.2 made the UI *honest about the HTTP call* — it did not make the message arrive.

**Resolved:** both lambdas now send via SES to `kossjohn@gmail.com`, from `noreply@clearbyte.com` on the already-verified `clearbyte.com` domain identity. They follow the existing `sfn/end` SES idiom (env vars + `ses.SendEmail`, HTML and text parts). IAM is a least-privilege inline `ses:SendEmail` scoped to that one identity — not `AmazonSESFullAccess`.

- Contact mail sets `Reply-To` to the visitor's address so replying works directly.
- The opt-in mail records phone, UTC timestamp, source IP, user agent, and the exact consent text shown — it is the consent record, so it needs to show what was agreed to and when.
- Both reject with a non-2xx when SES fails, which the corrected forms now surface honestly.
- **Still worth doing later:** email is a notification, not a durable record. For A2P consent evidence, opt-ins should also persist to DynamoDB. Deferred, not forgotten.
- This handler shape is what the `demo_request` lambda in Phase 5 should reuse.

**0.6 — Testimonials look fabricated.** Three stock-photo portraits (`person1a.jpg`–`person3a.jpg`) with first-name-only quotes. Presenting invented quotes as customer testimonials is a legal and trust exposure, and it's the single least modern thing on the site.
**Resolved:** cut. The section, `src/lib/Testimonial.svelte`, and the three stock portraits are removed — nothing else referenced them. Reinstate a testimonials block in Phase 2 only when real, attributed quotes exist (name, role, institution, with permission).

Note for deployment: `aws s3 sync` without `--delete` leaves the removed JPGs live in the bucket at their old URLs.

---

## Phase 1 — Design system

The current look reads dated because it's stock daisyUI `corporate` with default spacing and no type scale. Modern is mostly: one confident typeface, a restrained palette, generous and *consistent* spacing, and real depth instead of `shadow-xl` on everything.

**1.1 — Tokens.** *(Done.)* [src/style.css](src/style.css) is now a token layer. Brand colours were sampled from the logo pixels — `#07518F` navy wordmark, `#EE9107` orange cloud — converted to OKLCH, and every foreground/background pair was contrast-checked before being written down. Two `clearbyte` themes (light default, dark via `prefersdark`), all 35 daisyUI built-ins disabled via `themes: false`. Font is the system UI stack: no webfont request, no layout shift, no new dependency.

Original plan for reference:
- Custom daisyUI theme (`clearbyte`) replacing `corporate` in [app.html:2](src/app.html#L2) — brand primary, a neutral ramp, semantic surface/border tokens.
- Type scale: fluid `clamp()` sizes for display/h1–h3/body/small. Self-hosted variable font (no Google Fonts request — CloudFront serves it, and it keeps the site fast and dependency-free).
- Spacing scale, radius scale, two elevation levels. Not five.
- Dark mode via daisyUI's `--prefersdark`, actually tested rather than assumed.

**1.2 — Dependencies.** *(Done.)* Whole JS toolchain moved to latest: daisyUI `5.0.0-beta.6` → `5.7.9` stable, Vite 6 → 8 (now Rolldown-backed), `vite-plugin-svelte` 5 → 7, SvelteKit 2.16 → 2.70, Svelte 5.19 → 5.56, Tailwind 4.0 → 4.3, TypeScript 5.7 → 6.0.3.

TypeScript is deliberately held at 6.0.3 rather than the latest 7.0.2: both `@sveltejs/kit` and `svelte-check` peer-depend on `^5 || ^6`. Revisit once they support 7.

**1.3 — Layout primitives.** *(Done.)* `Section`, `Container` and `Prose` added in `src/lib/`. Phase 2 consumes them when rebuilding pages — the `p-48` and the repeated `container mx-auto px-4` go away then.

Original plan for reference: a `Section`, `Container`, and `Prose` component so page padding is defined once. This kills the `p-48` in [about/+page.svelte:4](src/routes/about/+page.svelte#L4) (12rem of padding — unusable under ~1400px) and the ad-hoc `container mx-auto px-4` repeated on every page.

Verify: a tokens page renders every scale step in light and dark; no page-level padding values outside the primitives.

---

## Phase 2 — Rebuild the pages *(Done)*

All routes rebuilt on the token layer and primitives. `/labs` and `/labs/[slug]` are driven by `src/lib/labs.ts`, seeded from real lab names found in zenzoom with only title-supported copy — see the header comment in that file for what still needs enriching, and note the Week 16 "Magic 8 Ball" lab was left out because its title doesn't say what it covers. `/demo` was pulled forward from Phase 5 and posts to `/api/contact` until the dedicated lambda lands.

**Outstanding from this phase:** `terms.html` §9 still reads "the laws of [Your Jurisdiction]" — an unfilled template placeholder that is live on the site. Left exactly as found; it needs a lawyer or at least a decision, not a guess.

Original plan for reference:


Rewrite markup page by page against the new system. Content is the real work here — the current copy is three sentences total.

- **`/` Home** — Hero with a specific claim (what the labs are, who they're for, how they're delivered), a "how it works" strip (Canvas launch → real AWS account → auto-graded → account destroyed), a lab catalog preview, and a single primary CTA: *Request an instructor demo*.
- **`/labs`** — Real catalog. The three placeholder cards currently have `<button>Learn More</button>` with no handler ([labs/+page.svelte:19](src/routes/labs/+page.svelte#L19)). Replace with data-driven cards from a `src/lib/labs.ts` manifest, each linking to a detail page.
- **`/labs/[slug]`** — Per-lab detail: objectives, AWS services used, duration, what the grader checks, screenshots of the actual lab runtime. Prerendered from the manifest. This is the page that sells the demo.
- **`/about`** — Real positioning: who runs ClearByte, why community colleges, the LTI 1.3 / Canvas story.
- **`/demo`** *(new)* — Instructor demo request form. See Phase 5.
- **`/contact`** — Restyled, fixed per 0.2.
- **`/opt-in`** — Keep the URL stable (it exists for A2P 10DLC carrier registration), restyle, but **move it out of the primary nav** into the footer. A bright yellow "SMS Opt-in" button next to Labs/About/Contact ([+layout.svelte:17](src/routes/+layout.svelte#L17)) is compliance plumbing occupying prime navigation.
- **`/privacy`, `/terms`** — Restyle only; do not touch the legal text.
- **`/404`** *(new)* — Styled, with links back into the funnel.
- **Nav & footer** — Real responsive nav with a mobile menu (there is none today; the horizontal menu just squeezes), multi-column footer.

Verify: every route renders correctly at 375 / 768 / 1280 / 1920 px, in light and dark, with no horizontal overflow.

---

## Phase 3 — Assets and performance *(Mostly done)*

Done: per-page canonical/Open Graph/Twitter tags via `src/lib/Seo.svelte` (canonical derived from the route so it can't drift), a generated `static/og.png`, `sitemap.xml` as a prerendered endpoint driven by the labs manifest, `robots.txt`, and corrected image dimensions.

**Still outstanding — needs a decision from you:**

1. **AVIF/WebP conversion.** No encoder is installed on this machine (no ImageMagick, `cwebp`, `avifenc`, or `sharp`), so the one remaining photo is still a JPEG. Options: install tooling, add `sharp` as a devDependency for a one-off conversion, or skip it — there is exactly one photo left and it is stock imagery due for replacement anyway.
2. **Real product imagery.** `about_img_small.jpg` is the last stock photo. Screenshots of the actual lab runtime would be more persuasive, but they have to come from a real lab session — I can't produce them.
3. **Lighthouse.** Needs a browser run against the dev or production build; I verified the static properties instead (declared dimensions, lazy loading, meta tags, sitemap/robots correctness).

Original plan for reference:


- Replace the stock imagery. `home_small.jpg` (52 KB) and `about_img_small.jpg` (66 KB) are generic; product screenshots of the actual lab UI are more persuasive and more modern.
- Emit AVIF/WebP with JPEG fallback, correct `width`/`height` on every `<img>` (missing on the hero, causing layout shift), `loading="lazy"` below the fold, responsive `srcset`.
- Per-page `<title>` and `<meta name="description">` — currently every page shares "Clearbyte Website" and one description from [app.html](src/app.html). Add Open Graph tags and an OG image.
- Add `sitemap.xml` and `robots.txt` to `static/`.

Verify: Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO for `/`, `/labs`, `/demo`. CLS < 0.05.

---

## Phase 4 — Ship

The pipeline is unchanged: `npm run build` → `dist/` → `aws s3 sync ../dist s3://www.clearbyte.com` via [deploy/main.go](deploy/main.go), fronted by the CloudFront distribution in [main.tf:135](main.tf).

- `npm run check` must be clean (`svelte-check`).
- Preview the built output locally before syncing.
- **You run the AWS/Terraform commands** — the CloudFront function change in 0.1 requires a `terraform apply`.
- `deploy/` was rewritten. It is now a real CLI (`go run . create`), not a test suite: the previous version exposed `Execute` only through `go test`, and because `TestWebsiteDestroy` ran `aws s3 rm --recursive` unguarded, a bare `go test` in that directory deployed the site and then emptied the production bucket. It now also passes `--delete` on the sync and invalidates CloudFront, both of which were missing.

Verify: live site serves new HTML immediately post-deploy; all Phase 0 fixes confirmed against production URLs.

---

## Phase 5 — Instructor demo request (site side)

This is the funnel endpoint the whole redesign points at, and it ships with the redesign.

**5.1 — `/demo` page.** Form: instructor name, institution, work email, course/term, expected seat count, preferred window, notes.

**5.2 — `demo_request` lambda.** Clone the existing pattern in `lambdas/contact/` (Go, containerized, wired as a Terraform module at [main.tf:375](main.tf) alongside `contact` and `sms_opt_in`). It writes the request to DynamoDB and notifies you.
- Reuses the existing `/api/*` CloudFront behavior and API Gateway — no new infrastructure shape.

**5.3 — Anti-abuse.** Honeypot field plus API Gateway throttling. No CAPTCHA.

Verify: a submitted request lands in the table and produces a notification; a failed submit shows an inline error (per 0.2).

---

## Phase 6 — The zenzoom trial lab (design now, build after launch)

**Goal:** an instructor requests a demo; you approve; N prospective students each get a single-use link that drops them into a *real* sandbox AWS lab.

The important finding: **the lab runtime needs no changes.** The student lab page (`lti/student/src/`) is a Go-templated HTML page — htmx + Alpine + Pico, connecting to `wss://ws.clearbyte.io` — whose entire authority comes from a JWT injected into the template at render time. The Canvas/LTI 1.3 flow's only job is to authenticate the student and produce that JWT. A demo flow that produces an equivalent JWT gets the full lab for free: `launch` → account pool, `credentials`, `signinurl`, `eula`, `attempts`, `question`, `score`/grader, ws notifications, and teardown all work unmodified.

**Flow**

1. Instructor demo request arrives (Phase 5) and you approve it manually.
2. Admin action provisions a demo class (`api/admin/class`), attaches a demo lab (`api/admin/labs`), creates N student records with `attempts = 1` (`api/admin/students`), and mints N single-use invite tokens.
3. Instructor distributes `https://zenzoom.com/try/<token>` links. *(`zenzoom.com` and `*.zenzoom.com` are already aliases on the existing CloudFront distribution — [main.tf:146](main.tf) — and Route53 records exist. No new domain or certificate work.)*
4. New `api/student/invite` lambda: validate token → mark consumed → bind to the student record → render the same templated lab page with a JWT. This is the only genuinely new code path.
5. Everything downstream is the existing pipeline.

**Where the redeem page lives.** Not in the static site. A dynamic `/try/[token]` route can't be prerendered by `adapter-static`, and a token shouldn't sit in a prerendered asset. Serve it from API Gateway via a `/try/*` CloudFront behavior mirroring the existing `/api/*` one. The marketing site's only involvement is linking to it.

**Blast radius on zenzoom:** additive only — one new lambda, one new admin mint action, one token table (or GSI). No changes to `ws/`, `sfn/`, `grader/`, or the lab runtime.

**Risks to resolve before building**

- **Account pool starvation.** Demo seats draw from the same pool as paying classes. Needs either a separate demo pool or a reserved quota with a hard cap.
- **Cost per seat.** Each demo seat is a real AWS sandbox account for the lab window. Cap concurrent demo seats and enforce the existing lab timer aggressively.
- **Token hygiene.** Single-use, short TTL, bound to exactly one attempt, revocable per-request in case an instructor forwards a link publicly.
- **Teardown proof.** Demo accounts must go through the same `nuke`/`reset` path. Verify explicitly — an orphaned demo account is a recurring bill.
- **Geo.** The CloudFront distribution whitelists US/CA only ([main.tf:155](main.tf)). Fine for demos; be aware it will silently block an out-of-region evaluator.

**Verify:** a minted token redeems exactly once into a working lab with real credentials, the grader scores it, the account is destroyed on completion, and a second use of the same token is rejected.

---

## Sequencing

```
Phase 0  Fix live defects            → verify: all routes 200 on direct load, forms fail correctly
Phase 1  Design system               → verify: token page renders, light + dark
Phase 2  Rebuild pages               → verify: 375/768/1280/1920, no overflow
Phase 3  Assets + SEO                → verify: Lighthouse ≥ 95, CLS < 0.05
Phase 4  Deploy                      → verify: production confirms Phase 0 fixes
Phase 5  /demo + demo_request lambda → verify: request lands, notification fires
──────── launch ────────
Phase 6  Trial lab                   → verify: token redeems once, lab runs, account destroyed
```

Phases 0–5 are the redesign. Phase 6 is a separate project that the redesign makes possible.

## Open questions

1. **Brand** — is there a defined ClearByte palette/logo beyond `400dpiLogo128x256.png` and the cloud SVG in `Hero.svelte`, or should the design system establish one?
2. **Lab catalog** — how many labs are real and publishable today? The `/labs` page needs actual content, and `zenzoom` has lab definitions (e.g. `Week_06_Lab_Activity_ECS_Scaling`) that could seed it.
3. **Analytics** — the funnel ends at a demo request with no measurement. Worth adding a lightweight, cookieless analytic before Phase 4, or intentionally skip?
