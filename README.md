# Unicorn Haven Edge Hotel — website

Next.js 15 (App Router, TypeScript) + Tailwind. Built from `unicorn-haven-edge-blueprint.md`.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in keys as they become available
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Media

Raw client files live in `/pictures` and `/videos` (git-ignored). `npm run media` converts them into
`/public/media` (JPGs, compressed 720p/1080p MP4s, stills from the videos), writes blur placeholders to
`src/lib/media-manifest.json`, traces the unicorn from the badge logo into `src/lib/unicorn-path.ts`,
and builds the share image `public/og/default.jpg`. Re-run after adding media.

## Content

All content is in `src/lib/content.ts`, shaped like the Sanity schemas in `sanity/schemaTypes.ts`.
Search the codebase for `TODO(content)` and `TODO(client)` for everything the hotel still needs to confirm:
phone and WhatsApp numbers, room names, rates, sizes and bed types, check-in/out times, the menu,
restaurant hours, reviews, drive times, the deposit %, and the cancellation policy.
Sections with no data (reviews, offers, landmarks, menu items) hide or fall back gracefully.

## Bookings (Phase 1)

`/book` is a 4-step request flow. Prices are always recomputed on the server.

- **Pay at hotel / rate on request:** emails go to the guest and `RESERVATIONS_EMAIL`, and the guest sees a signed confirmation link.
- **Paystack:** set `PAYSTACK_SECRET_KEY`. The transaction is initialised server-side; the confirmation page verifies it with Paystack.
  Set the webhook URL in the Paystack dashboard to `https://<domain>/api/paystack/webhook`. Booking emails for paid bookings are sent from the webhook.
- Emails use Resend (`RESEND_API_KEY`); without a key they are logged to the console.

Phase 2 (live availability, admin) needs a database. See blueprint §7.
