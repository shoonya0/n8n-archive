# n8n projects that can make real money

Research date: **3 Nov 2026**. Prices, platform policies and laws change, so check the
linked sources before you spend money. This is research, not financial or legal advice.

---

## Bottom line

- **A workflow only earns money when someone pays for what it produces**, such as more booked
  jobs, faster payments, recovered sales or staff hours saved. n8n delivers the work. The
  business model is selling that result.
- **The best evidence for ROI above your investment is for done-for-you automations sold
  to small service businesses**, priced as a setup fee plus a monthly retainer. Tools cost
  tens of dollars a month, so the first paying client usually covers the startup spend.
  The hard part is finding clients, not building the workflows.
- **The most-hyped "passive income" ideas have the weakest evidence.** Selling templates,
  faceless AI YouTube channels and mass-produced AI blogs either show tiny reported earnings
  or run into platform policies. They are listed under [Avoid / low ROI](#avoid--low-roi).
- **Most income figures online are self-reported by people selling courses or templates.**
  Every project below has an evidence grade so you can tell data from marketing.

**Evidence grades**

| Grade | Meaning |
|---|---|
| **A** | Academic study or large primary dataset |
| **B** | Named-customer case studies, or benchmarks that several independent sources agree on |
| **C** | Vendor marketing or self-reported claims only |

**ROI as used here:** `(revenue − running costs) ÷ initial investment`, where the initial
investment is your cash outlay **plus your build time at an hourly value**.

---

## Ranked shortlist

| # | Project | Who pays | What the market charges | Your main running costs | Evidence | Main risk |
|---|---|---|---|---|---|---|
| 1 | [Missed-call text-back + instant lead reply](#1-missed-call-text-back--instant-lead-reply) | Local service businesses | $1,500–3,500 setup + $300–500/mo | SMS ≈ $0.012/msg, VPS | B (problem) / C (price) | SMS registration and consent |
| 2 | [Review-request automation](#2-review-request-automation) | Same clients as #1 | Upsell inside the retainer | Almost none | A (direction) | Review-gating rules |
| 3 | [Invoice and payment follow-up](#3-invoice-and-payment-follow-up-accounts-receivable) | B2B service firms | $2,000–5,000 build + retainer | Almost none | C | Reminding customers who already paid |
| 4 | [AI receptionist / booking back office](#4-ai-receptionist--booking-back-office) | Clinics, trades, salons | Build + retainer + usage | Voice ≈ $0.07–0.31/min | C | Cheap SaaS competition, AI errors |
| 5 | [E-commerce revenue flows](#5-e-commerce-revenue-flows) | Online stores | Build + retainer | Email/SMS usage | B | Store may already use Klaviyo |
| 6 | [Lead-generation engine](#6-lead-generation-engine) | You (client acquisition) or B2B firms | Pay per booked meeting, or internal use | Data ≈ $2–4 per 1k places, mailboxes | B (reply rates) | Deliverability, scraping terms |
| 7 | [Content repurposing pipeline](#7-content-repurposing-pipeline) | Coaches, founders, podcasters | $300–3,000+/mo | Transcription + LLM | C | Generic AI output |
| 8 | [Database reactivation](#8-database-reactivation) | Businesses with old leads | $75–150 per booked appointment | SMS/email + LLM | C | **TCPA consent (highest legal risk)** |
| 9 | [Freelance n8n builds](#9-freelance-n8n-builds-upwork-contra) | Upwork/Contra clients | ≈ $39/hr average | Bidding credits | B | Falling n8n job volume |
| 10 | [Micro-SaaS with n8n as backend](#10-micro-saas-with-n8n-as-a-hidden-backend) | End users | Subscription / per use | Hosting + LLM, grows with volume | none | Unproven demand |
| 11 | [n8n affiliate + tutorials](#11-n8n-affiliate--tutorial-content) | n8n (commission) | 30% of net for 12 months | Your time | none on income | Slow to build |

**Suggested order:** start with #1 and use #6 to find clients. Then upsell #2 and #3 to
the same clients and add #4 for clients with heavy call volume. See the
[starting plan](#recommended-starting-plan-fits-this-repo).

---

## Shared costs (your initial investment)

| Item | Price found | Notes |
|---|---|---|
| n8n self-hosted | VPS ≈ **$5–20/mo** for a basic 4 GB instance (Hetzner ≈ €4–9) | This repo already runs n8n in Docker. Clients' webhooks need a public HTTPS host. Queue mode (Postgres + Redis + workers, ≈ 8 GB RAM) costs ≈ $27–50/mo |
| n8n Cloud Starter | **€24/mo** monthly or €20/mo annual, 2,500 executions | Pro is €60/€50 for 10,000 executions. One source says workflows pause when you hit the limit |
| Twilio SMS (US) | ≈ **$0.0083/segment** + carrier fee ≈ $0.003–0.005 | A2P 10DLC registration: brand $4.50 or $46 one-time, campaign $15 vetting + $2 or $10/mo |
| Voice AI (Vapi / Retell) | all-in ≈ **$0.07–0.31/min** | Vapi charges $0.05/min platform fee plus providers. A Retell example totals $0.115/min |
| Google Maps business data (Apify) | ≈ **$2.10–4 per 1,000 places** | Community actors charge $1–5 per 1,000 |
| LLM calls | Varies a lot by model | Retell's LLM line alone ranges from $0.003 to $0.08 per minute |

**Rough month-one cash budget:** about **$60–170**, covering a VPS, Twilio and 10DLC
registration, Apify, LLM usage and email-sending domains. After that, about **$30–80/mo**
before any client usage. This is my estimate from the price points above; your build time
is the bigger investment.

---

## n8n licence: what you can charge for

n8n uses the **Sustainable Use License**, and its official FAQ is clear on the main points.

**Allowed**
- "Charge your customers for workflow creation, setup, and maintenance services."
- Build and maintain client workflows on your instance, as long as the clients cannot
  access the n8n interface or create or edit workflows.
- "Use n8n behind the scenes in your own product," as long as "only your backend
  communicates with n8n."

**Not allowed**
- "Host n8n as a service and allow your clients to build workflows."
- Letting end users build or configure their own workflows through your product. A custom
  UI layer on top does not change this.
- White-labelling or reselling access to n8n.

**Grey area:** running one shared instance that holds many clients' credentials. Some
guides say this needs a paid licence. The safest setups are to install n8n on the
**client's own** server or account and charge for building it, or to keep clients
completely off the UI. If you are unsure, ask `license@n8n.io`.

---

## Proof that automation creates value

These figures show that automation saves real money. They don't show what *you* will earn.

- **Delivery Hero** saved **200 hours/month** with a single IT-ops workflow (n8n case study). **B**
- **Koralplay** automated **70% of payment support tickets** (n8n case study). **B**
- **TMNZ** reports **400 hours/month** of productivity gains (n8n case study). **B**
- **arXiv 2602.01311 (Feb 2026)** studied a small business's lead-processing workflow. Execution time fell from **185.35 s to
  1.23 s** and the error rate from **5% to 0%**. The sample was small: 20 manual vs 25 automated runs. **A** (small sample)

---

## Project details

### 1. Missed-call text-back + instant lead reply

**What it does.** When a call goes unanswered or a web-form or ad lead arrives, the
customer gets a text within seconds, such as "Sorry we missed you, what do you need help
with? Book here: …". The owner gets an alert, the lead goes into a sheet or CRM, and a
follow-up goes out if there's no reply.

**Who buys.** Owner-run service businesses where one job is worth hundreds of dollars:
plumbing, HVAC, roofing, electrical, dental, med-spa, legal and real estate.

**Why it sells (data)**
- **44%** of business calls go unanswered, per a 2026 Invoca compilation of about 70M calls.
  A UK study of 142 small businesses found that **47%** missed the first call. The widely
  repeated "62%" comes from a 2016 study of only 85 businesses, so don't use it.
- In the *HBR* study "The Short Life of Online Sales Leads" (2011), firms that contacted a web
  lead **within an hour** were nearly **7× as likely to qualify it** as firms that waited
  longer. **23%** of the audited firms never responded. The data is old but the direction is clear.
- **Clients already pay for these leads.** Shared Angi leads cost about $15–85+, with
  roofing often above $100. Google Local Services Ads cost about $51–76 per HVAC lead in a
  Q1 2026 dataset. A paid-for lead that nobody answers is wasted money, which makes the
  pitch easy.

**n8n workflow**
1. `Webhook` receives a Twilio call-status callback (`no-answer` / `busy`) or a form submission
2. `IF` checks whether this number was already contacted in the last 24 h, to avoid duplicates
3. `Twilio` texts the caller a booking link
4. `Telegram` / `Slack` / `Twilio` alerts the owner
5. `Google Sheets` / `Airtable` / CRM (HubSpot, GoHighLevel) records the lead
6. `Wait` 15 min, then `IF` there's no reply, send a second text. An `AI Agent` can
   qualify replies by job type, address and urgency
7. `Respond to Webhook` returns TwiML or a 200 response

**Your costs.** A share of the VPS, a Twilio number, SMS at about $0.012–0.013 per segment
including carrier fees, 10DLC registration ($4.50–46 brand + $15 campaign vetting, one-time)
and the campaign fee ($2–10/mo).

**What to charge.** Agency blogs put missed-call text-back builds at **$1,500–3,500
setup** and simple-automation retainers at **$300–500/mo** (C). Pass SMS usage through at
cost plus a margin.

**ROI math (illustrative; swap in real numbers)**
- *Client:* break-even = retainer ÷ gross profit per job. At a $400/mo retainer and $200
  profit per job, **2 recovered jobs a month** pays for it.
- *You:* about 30 h of build time plus about $100 in tools and registration. One client at
  $1,500 setup + $400/mo returns that in month one. Each new client reuses the same
  workflow with mostly configuration changes, so your margin grows with every client.
- A self-reported example: a roofing contractor runs a similar setup for **$47/mo** and
  estimates **+$4K/mo**. A pest-control firm reports **+13 jobs/month**. The author sells
  these workflows. (C)

**Risks**
- US business texting requires A2P 10DLC registration.
- Texting back someone who just called is the lowest-risk SMS use. Marketing follow-ups
  need consent (see [#8](#8-database-reactivation)).
- Some clients' phone systems or CRMs (for example GoHighLevel) already include basic
  text-back. Sell the integration, follow-up logic and reporting, not just the single text.

**Fits this repo.** Add `workflows/missed-call-textback.json` and an integration test that
posts a fake Twilio `no-answer` callback and asserts the response. Point the Twilio base
URL at a mock through `$env` for tests.

---

### 2. Review-request automation

**What it does.** When a job is marked complete (invoice paid or appointment checked out),
n8n waits a few hours and sends a personal SMS or email asking for a Google review, with a
direct link. It sends one reminder, logs every request and alerts the owner to any unhappy
reply so they can fix the problem.

**Why it sells.** A Harvard Business School study by Michael Luca found that a **one-star
increase on Yelp** is associated with a **5–9% revenue increase** for independent
restaurants. Chains saw little effect. The study used Seattle data from 2003–2009 and a
regression-discontinuity method. **A** for the direction; the numbers are old.

**n8n workflow:** CRM or accounting trigger, or a `Schedule Trigger` that polls → `Wait` →
`Twilio` / `Gmail` → `Wait` 3 days → `IF` not reviewed → one reminder → `IF` the reply is
negative → alert the owner.

**Costs and pricing.** Running cost is close to zero. Sell it as an upsell inside a #1 or
#4 retainer rather than on its own.

**Compliance (important)**
- The **FTC Consumer Review Rule** took effect on 21 Oct 2024. It bans fake reviews,
  incentives conditioned on positive sentiment, and review suppression. The FTC's earlier
  **$4.2M Fashion Nova** settlement was over hiding negative reviews.
- **Review gating**, meaning only asking happy customers, is risky under FTC enforcement
  and reportedly against Google's policy.
- **Send the same request to every customer**, and never tie incentives to what the
  review says.

---

### 3. Invoice and payment follow-up (accounts receivable)

**What it does.** A daily `Schedule Trigger` reads unpaid invoices from QuickBooks, Xero,
Stripe or Zoho. It sends polite reminders before the due date, on it, and +3, +7 and +14
days after, each with a payment link, then escalates to the owner. When an invoice is paid,
it sends a thank-you and updates the CRM. The owner gets a weekly cash report.

**Who buys.** B2B service firms, agencies, contractors and wholesalers that send many
invoices.

**Data**
- Xero's small-business data shows US late payments averaged **7.8 days** late in the
  Dec 2025 quarter.
- A collections vendor estimates that systematic automated reminders cut days sales
  outstanding (DSO) by **10–20%**. This is a vendor claim (C).
- Xero also advises keeping personal contact for large accounts.

**ROI math (illustrative).** Take a client invoicing $50,000/month with a DSO of 45 days.
Each day of DSO cut frees about $1,667 of cash ($50k ÷ 30). A 10% cut (4.5 days) frees
about **$7,500 of working capital**, on top of the admin hours saved.

**What to charge.** Agency blogs put a simple build at **$2,000–5,000**, plus a retainer
of about 5–25% of the setup fee per month (C).

**Risks.** Reminding a customer who already paid damages the client's relationships. Treat
the accounting system as the only source of truth, re-check payment status right before
each send, and make the workflow idempotent. Keep the tone to reminders, not debt
collection.

---

### 4. AI receptionist / booking back office

**What it does.** A voice agent (Vapi or Retell) answers calls 24/7, answers FAQs and books
appointments. n8n is the back office. The voice agent calls n8n webhooks as "tools" to check
availability, create the booking, write a CRM record, send a confirmation SMS and email the
owner a call summary.

**Who buys.** The same niches as #1, plus clinics and salons where calls turn directly into
bookings.

**Market reality**
- Off-the-shelf AI receptionists sell for about **$25–300/mo**. Examples: Beside $29.99,
  Rosie $49, My AI Front Desk $99, Slang.ai $399.
- Human virtual receptionists cost about **$129–1,400/mo**.
- Generic call answering is therefore already cheap. Your advantage is **custom
  integration**: the client's booking system, pricing rules, service area, job-management
  software and escalation paths.

**Costs.** Voice runs about $0.07–0.31/min all-in. For example, 300 min/month at $0.15 is
$45/month, plus the phone number and n8n.

**What to charge.** A build fee in the **$2,000–5,000** range, a retainer and usage passed
through. Sell it against the cost of a human service, not against $29 SaaS tools.

**Risks**
- AI that gives wrong answers. Limit it to bookings and FAQs, and hand off to a human for
  anything else.
- Call-recording consent laws (some US states require all parties to consent) and AI
  disclosure rules.
- Latency on phone calls.

**Evidence:** C for pricing, B for the missed-call problem it solves.

---

### 5. E-commerce revenue flows

**What it does.** For Shopify or WooCommerce stores: abandoned-checkout recovery by email,
WhatsApp or SMS; post-purchase cross-sells; win-back campaigns; low-stock alerts; order
sync to suppliers and fulfilment; and review requests.

**Data (B)**
- Average cart abandonment is about **70%**, per Baymard's aggregate of about 50 studies.
- Klaviyo's analysis of 143,000+ abandoned-cart flows (2023 data) found a **50.5% open
  rate, 6.25% click rate, 3.33% placed-order rate and $3.65 revenue per recipient**.

**ROI math (illustrative).** A store that can reach 2,000 abandoned checkouts a month, at
Klaviyo's average of $3.65 per recipient, gets about **$7,300/month** of attributed
revenue. Your results will differ.

**Caveat.** Many stores already have this through Shopify or Klaviyo. n8n's advantage is in
the gaps: WooCommerce or headless stores, WhatsApp, B2B ordering, and operations tied to
suppliers or an ERP.

---

### 6. Lead-generation engine

**What it does**
1. Pulls local businesses by niche and city from Google Maps, through Apify or the official
   Google Places API.
2. Filters for good prospects for #1–#3, such as businesses with no online booking, few
   reviews or a slow website.
3. Finds email addresses, and an `AI Agent` writes a personal first line from each
   business's site or reviews.
4. Pushes the contacts to a sending tool (Instantly, Smartlead, etc.).
5. Routes replies to you and books calls through Cal.com.

**Two ways to make money.** (a) Feed your own agency; this is the most useful. (b) Sell
booked meetings or lists to other B2B companies.

**Costs.** About $2.10–4 per 1,000 places from Apify, plus sending infrastructure
(separate domains, mailboxes and a sending tool) and LLM tokens at cents per prospect.

**Data (B).** Instantly's 2026 benchmark, based on 2025 data, puts the average reply rate
at **3.43%**, the top quartile at **5.5%+** and the top 10% at **10.7%+**. **58%** of
replies come from the first email.

**Funnel math (illustrative; the conversion steps are my assumptions)**

| Step | Count |
|---|---|
| Places scraped | 1,000 |
| With a usable email (assumed ~50%) | ~500 |
| Replies at 3.43% | ~17 |
| Calls booked (assumed 1 in 5 replies) | ~3 |
| Clients closed | ~1, at $1,500 setup + $400/mo |

Data and LLM cost for this run is under $100, plus the sending infrastructure.

**Rules**
- Gmail's bulk-sender rules require SPF, DKIM and DMARC. Sending about 5,000+ messages a
  day to Gmail makes you a bulk sender, which also requires one-click unsubscribe and a low
  spam-complaint rate.
- Keep volume per mailbox low, warm up new domains and honour every opt-out.
- US: CAN-SPAM. EU/UK: GDPR and PECR restrict cold email to individuals.
- Check Google's and Apify's terms; the Places API is the official route.

---

### 7. Content repurposing pipeline

**What it does.** A new YouTube video or podcast episode (RSS or YouTube trigger) is
transcribed, then AI drafts a blog post, LinkedIn/X posts, a newsletter, show notes and
clip timestamps. Drafts go to Notion or Google Docs for **human review**, then get
scheduled for publishing.

**Who buys.** Coaches, consultants, B2B founders and podcasters who have content but no
time to repurpose it.

**Pricing (C, single-source estimates).** Retainers of **$300–3,000+/mo**, or **$35–50**
per video for standard work and **$100–200** for premium.

**Competition.** SaaS tools cost about $19–79/mo (OpusClip, Vidyo.ai, ContentFries,
Repurpose.io). Sell done-for-you work with brand voice, editing and publishing, not raw AI
output.

**Risks.** Generic AI text loses clients, so keep the human review step. Publishing large
volumes of low-value pages runs into Google's scaled-content policy (see
[Avoid](#avoid--low-roi)).

---

### 8. Database reactivation

**What it does.** You load a client's past customers and old leads. n8n sends each a
personal offer by email or SMS, an `AI Agent` handles replies and qualifies them, books
appointments, and hands hot leads to staff.

**Pricing.** Agencies advertise **$75–150 per qualified booked appointment**, sometimes
with a guarantee, or a flat-fee 30-day project. Typical agency retainers are $2K–5K/mo.

**Evidence: C.** Vendors claim around a 26% response rate and 3–7 booked calls per 100
texts. No audited benchmark exists, so measure it on your own pilot.

**Compliance: the highest legal risk in this list**
- **TCPA.** The FCC rule requiring **prior express written consent** for marketing texts
  is still in force wherever courts haven't overturned it. The Fifth Circuit's *Bradford*
  decision said oral consent is enough, so the courts are split.
- An "established business relationship" is **not** a basis for sending texts.
- Treat every old lead as having **no consent** unless there is a documented opt-in for
  marketing from this business. Email is the safer channel (CAN-SPAM is opt-out based).
  EU/UK contacts fall under GDPR and PECR.
- Make the client warrant consent in your contract, and have a TCPA lawyer review the
  campaign before any SMS reactivation.

---

### 9. Freelance n8n builds (Upwork, Contra)

**Data (B).** An independent analysis of 53,786 Upwork automation job posts from May 2025 to
April 2026 (its methodology is not fully clear) found:
- n8n posts rose from **1,319** (May 2025) to a **2,155** peak (Aug 2025), then fell to
  **1,252** (Apr 2026). Demand is cooling.
- The average automation rate was **$39.46/hr** in April 2026, after a $43.27 peak in
  February. Complex AI-agent work is quoted at $100–300/hr.
- The most-requested tools were GoHighLevel (687 jobs in April), Google Sheets (532),
  Airtable (447) and HubSpot (378). Building across n8n, Make and Zapier reportedly earns a
  30–40% rate premium.

**ROI.** Almost no cash investment beyond bidding credits; your time is the investment.
This is good for a first portfolio and testimonials, but income stops when you stop
working.

---

### 10. Micro-SaaS with n8n as a hidden backend

**What it does.** A narrow paid tool where n8n does the processing behind your own
frontend. Examples: "upload an invoice PDF and get a structured sheet", "AI reply drafts
for Google reviews", "property listing to description". Users pay through Stripe.

**Licence.** This is allowed as long as only your backend calls n8n and users never build
or configure workflows.

**Costs.** Hosting grows with volume: queue mode needs about 8 GB RAM, Postgres and Redis
(≈ $27–50/mo), plus LLM cost per request.

**Evidence.** None specific; this has the widest range of outcomes. Build it only after
several clients ask for the same thing, so you are packaging a proven service as a
product.

---

### 11. n8n affiliate + tutorial content

**Terms (from n8n.io/affiliates)**
- **30%** of net revenue for **12 months** on n8n Cloud referrals.
- Paid monthly through PayPal once your balance reaches €100.
- **No paid-ad campaigns** with affiliate links.
- You can add your affiliate ref to template URLs.

**Use.** Pair it with tutorials, blog posts or YouTube videos about the workflows you build
for clients. That content also brings inbound leads for #1–#4. I found no income evidence,
so treat any earnings as a bonus.

---

## Avoid / low ROI

| Idea | Why |
|---|---|
| **Selling n8n templates** (Gumroad, Creator Hub, marketplaces) | n8n's docs say its creator program and marketplace are still being developed. A community poster says the Creator Hub requires you to publish free workflows before you can sell, and calls the marketplace quiet. The best reported earnings are tiny: **$174 in one month**, and **about $836 in total from ~15 templates**. Gumroad takes about 10%; Neura Market lets sellers keep 90%. **Publish free templates as lead magnets instead.** |
| **Fully automated faceless YouTube channels** | YouTube renamed "repetitious content" to **"inauthentic content"** in its Partner Program policy on **15 July 2025**. Mass-produced, repetitive videos can't be monetised. In **Jan 2026**, YouTube reportedly terminated 16 channels with a combined 35M subscribers under this policy. AI-assisted content with real human input is still fine. |
| **Mass AI SEO or affiliate sites** | Google's **"scaled content abuse"** policy (March 2024) targets pages generated mainly to rank, whether written by AI or people. It is enforced both by algorithm and by manual action, and is reported to apply to AI Overviews and AI Mode as well. |
| **Hosting or white-labelling n8n for clients to use** | This breaks the Sustainable Use License ([see above](#n8n-licence-what-you-can-charge-for)). |

---

## Recommended starting plan (fits this repo)

1. **Pick one niche and one city or region**, for example HVAC or dental. One niche means
   one sales script, one demo and one reusable workflow.
2. **Build #1 here using test-driven development.** Write the webhook integration test,
   build `workflows/missed-call-textback.json`, run `npm run n8n:deploy`, then record a
   2-minute demo.
3. **Build #6 for your own prospecting.** Send small volumes from warmed-up domains.
4. **Run 2–3 pilots:** 30 days at a reduced setup fee, with success measured by leads
   recovered. The n8n execution logs are your proof.
5. **Upsell #2 and #3** to the same clients, then **#4** to those with high call volume.
6. **Raise prices once pilots give you before-and-after numbers.** Your own case studies
   are worth more than any claim in this document.

**Before going live with a client:** the local Docker n8n is fine for building. A client's
webhooks need a public HTTPS host (a VPS or n8n Cloud). Keep client keys in n8n
credentials or `$env`, never in workflow JSON.

---

## Sources

**n8n platform, pricing, licence**
- [n8n Sustainable Use License FAQ](https://docs.n8n.io/n8n-community-license/community-license/license-faq)
- [n8n affiliate program](https://n8n.io/affiliates)
- [n8n pricing 2026 (Sliplane)](https://sliplane.io/blog/n8n-pricing) ·
  [Toolradar](https://toolradar.com/blog/n8n-pricing-2026). Verify at [n8n.io/pricing](https://n8n.io/pricing)
- [Self-hosted vs Cloud costs (Findstack)](https://findstack.com/resources/n8n-self-hosted-vs-cloud-cost) ·
  [Self-hosting requirements (Wotai)](https://wotai.co/blog/n8n-self-hosting-requirements)
- [n8n templates docs](https://docs.n8n.io/workflows/templates/)

**Proof points**
- [Delivery Hero: 200 h/month saved](https://www.casestudies.com/company/n8n/case-study/delivery-hero-saved-200-hoursmonth-with-a-single-it-ops-workflow)
- [Koralplay case study](https://n8n.io/case-studies/koralplay/) · [TMNZ case study](https://n8n.io/case-studies/tmnz)
- [arXiv 2602.01311: n8n small-business case study](https://arxiv.org/abs/2602.01311)
- [Self-reported n8n client case studies (DEV)](https://dev.to/pirateprentice/stop-wasting-time-on-n8n-tutorials-real-case-studies-that-made-money-4hgo)

**Agency pricing benchmarks (C)**
- [AI automation rate card 2026 (BetOnAI)](https://betonai.net/ai-automation-rate-card-2026-what-to-charge-for-n8n-make-and-zapier-builds-real-rates-from-54-operators/) ·
  [Retainers 2026](https://betonai.net/ai-automation-retainers-2026/)
- [What AI automation services cost (DEV)](https://dev.to/jahanzaibai/what-do-ai-automation-services-actually-cost-the-2026-pricing-reality-595k)
- [What to charge for AI automation (Ciela)](https://ciela.ai/blogs/what-to-charge-for-ai-automation-services)
- [AI automation agency pricing 2026](https://aiadoptionagency.com/ai-automation-services-pricing)

**Missed calls and speed to lead**
- [Missed-call statistics (SchedulingKit)](https://schedulingkit.com/statistics/missed-call-statistics) ·
  [Carly](https://www.usecarly.com/blog/missed-call-statistics/) ·
  [UK small-business study (Softomate)](https://www.softomatesolutions.com/blog/missed-calls-cost-uk-small-business/)
- [HBR: The Short Life of Online Sales Leads](https://hbr.org/2011/03/the-short-life-of-online-sales-leads) ·
  [summary (Venture Harbour)](https://ventureharbour.com/how-fast-do-marketing-leads-turn-cold-and-how-to-stop-it-happening/)
- [LSA cost per lead by industry (99calls)](https://blog.99calls.com/2026/05/07/lsa-cost-per-lead-by-industry-for-service-contractors/) ·
  [Angi lead guide](https://wwwleadtruffleco.pages.dev/blog/complete-guide-angi-leads-home-service-contractors-2026)

**SMS, voice and data costs**
- [Twilio SMS pricing](https://www.twilio.com/en-us/sms/pricing) ·
  [Twilio A2P 10DLC fees](https://support.twilio.com/hc/en-us/articles/1260803965530)
- [Voice AI cost per minute (Ainora)](https://ainora.lt/blog/ai-voice-agent-cost-per-minute-2026) ·
  [Vapi vs Retell (Fora Soft)](https://www.forasoft.com/blog/article/vapi-vs-retell-vs-custom)
- [AI receptionist cost (Hyperleap)](https://hyperleap.ai/blog/ai-receptionist-cost) ·
  [Best AI receptionists 2026 (Beside)](https://beside.com/blog/best-ai-receptionist-for-small-business-2026)
- [Apify Google Maps pay-per-event pricing](https://help.apify.com/en/articles/10774732-google-maps-scraper-is-going-to-pay-per-event-pricing) ·
  [Apify scraper comparison](https://blog.apify.com/best-google-maps-scrapers/)

**Reviews**
- [Luca: Yelp reviews and revenue (Harvard Magazine)](https://www.harvardmagazine.com/2011/10/hbs-study-finds-positive-yelp-reviews-lead-to-increased-business) ·
  [HBS working paper](https://econpapers.repec.org/RePEc:hbs:wpaper:12-016)
- [FTC fake-reviews rule (Fenwick)](https://www.fenwick.com/insights/publications/the-ftc-cracks-down-on-fake-reviews-with-new-rule) ·
  [FTC $4.2M fine and review gating (Near Media)](https://nearmedia.co/ftc-drops-a-4-2-review-abuse-fine/)

**Invoices and e-commerce**
- [Xero: reducing payment delays](https://www.xero.com/us/guides/how-to-reduce-payment-delays/) ·
  [Peakflo: reducing DSO](https://peakflo.co/blog/reduce-dso-25-percent-ai-automation-psg-grant-singapore)
- [Baymard cart abandonment](https://baymard.com/lists/cart-abandonment-rate) ·
  [Klaviyo abandoned-cart benchmarks (Attribuly)](https://attribuly.com/blogs/abandoned-cart-recovery-rate-klaviyo/)

**Lead gen, email and SMS rules**
- [Instantly email sequence benchmarks 2026](https://instantly.ai/blog/email-sequence-benchmarks-2026-whats-a-good-open-rate-reply-rate-and-cost-per-meeting/) ·
  [Cold email response rates (Prospeo)](https://prospeo.io/s/cold-email-response-rate)
- [Google email sender guidelines](https://support.google.com/a/answer/81126) ·
  [Bulk sender requirements (Red Sift)](https://redsift.com/guides/bulk-email-sender-requirements)
- [Fifth Circuit on TCPA written consent (JD Supra)](https://www.jdsupra.com/legalnews/fifth-circuit-rejects-fcc-s-tcpa-7516901/) ·
  [Hogan Lovells](https://hlc.com/en/publications/fifth-circuit-rejects-fccs-tcpa-writtenconsent-rule-for-marketing-calls) ·
  [TCPA checklist (ActiveProspect)](https://activeprospect.com/blog/tcpa-compliance-checklist-2/)
- [Database reactivation offer (Ciela)](https://ciela.ai/blogs/database-reactivation-ai-offer-for-agencies) ·
  [Xpand Digital](https://xpanddigital.io/ai-database-reactivation)

**Content, freelancing, templates**
- [Content repurposing pricing](https://earning-ideas-hub.pages.dev/subcategories/content-creation/content-repurposing) ·
  [Repurpose.io pricing](https://www.creatorstackclub.com/software/repurpose-io/pricing)
- [Upwork automation market analysis May 2025–Apr 2026](https://ascendautomationagency.github.io/upwork-analysis/upwork-analysis.html) ·
  [Upwork hourly rates](https://www.upwork.com/resources/upwork-hourly-rates)
- [n8n forum: where to sell workflows](https://community.n8n.io/t/where-can-i-sell-my-n8n-workflow-i-am-looking-for-marketplaces-not-the-creator-hub/212963) ·
  [Gumroad revenue report, July 2025](https://peerlist.io/aristides/articles/july-2025-gumroad-revenue) ·
  [Template sales summary (Lilys, Korean)](https://lilys.ai/ko/notes/n8n-automation-20251216/n8n-templates-no-code-automation) ·
  [Neura Market](https://neura.market/sell-n8n-workflows)

**Platform policies**
- [YouTube inauthentic-content update (Gulf News)](https://gulfnews.com/technology/youtube-updates-monetisation-policies-ai-and-repetitive-content-ban-begins-july-15-1.500192660) ·
  [Digiday](https://digiday.com/media/youtubes-ai-slop-crackdown-has-creators-concerned-marketers-cheering) ·
  [The Next Web](https://thenextweb.com/news/youtube-ai-slop-crackdown-faceless-creators-collateral-damage)
- [Google: March 2024 core update and spam policies](https://developers.google.com/search/blog/2024/03/core-update-spam-policies)
