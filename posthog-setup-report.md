<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the START Munich Next.js 15.3
App Router project. PostHog is initialized via `instrumentation-client.ts` (the recommended approach
for Next.js 15.3+), with a reverse proxy configured in `next.config.js` to route all PostHog
ingestion through `/ingest` on the same domain for improved ad-blocker resistance and performance.
Environment variables are stored in `.env.local`. Eight client-side events have been instrumented
across six files, covering the full application funnel, navigation CTAs, startup browsing, and
partner contact actions.

| Event                                    | Description                                                                    | File                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `application_started`                    | User clicks 'Start Application' (hero card or bottom CTA)                      | `app/join-start/2026/JoinStartClient.tsx`                                     |
| `application_event_registration_clicked` | User clicks 'Register now' on an event tile on the apply page                  | `app/join-start/2026/JoinStartClient.tsx`                                     |
| `nav_apply_clicked`                      | User clicks 'Apply Now' in the navigation bar (desktop or mobile)              | `components/Navigation.tsx`                                                   |
| `nav_jobs_clicked`                       | User clicks 'Jobs' in the navigation bar (desktop or mobile)                   | `components/Navigation.tsx`                                                   |
| `event_card_clicked`                     | User clicks a flagship event card or the featured event CTA on the Events page | `app/events/EventsContent.tsx`                                                |
| `startup_card_clicked`                   | User clicks a startup card to view startup details                             | `app/startups/StartupCard.tsx`                                                |
| `startup_website_clicked`                | User clicks 'Visit Website' on a startup details page                          | `app/startup-details/[id]/StartupDetailsContent.tsx`                          |
| `partner_contact_clicked`                | User clicks 'Get in Touch' on the For Partners page                            | `app/for-partners/PartnerCTAButton.tsx` (used in `app/for-partners/page.tsx`) |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the
events we just instrumented:

- **Dashboard – Analytics basics**: https://eu.posthog.com/project/161880/dashboard/629768
- **Application Started – Over Time**: https://eu.posthog.com/project/161880/insights/aWOIQLM9
- **Application Conversion Funnel**: https://eu.posthog.com/project/161880/insights/kfWT1hzu
- **Startup Engagement – Card Clicks & Website Visits**:
  https://eu.posthog.com/project/161880/insights/PNRCKu5n
- **Navigation CTAs – Apply Now vs Jobs**: https://eu.posthog.com/project/161880/insights/H6apMo6g
- **Partner Contact & Event Card Engagement**:
  https://eu.posthog.com/project/161880/insights/AiveyHEP

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent
development when using Claude Code. This will help ensure the model provides the most up-to-date
approaches for integrating PostHog.

</wizard-report>
