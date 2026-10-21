/**
 * GROQ queries for the content that used to live in NocoDB.
 *
 * Every query projects only what the page renders, uses `coalesce()` so a
 * partially-filled document still renders, and filters on indexed attributes
 * (`_type`, `isVisible`) so the query stays cheap.
 *
 * These are the read-side counterparts of the schema types in the
 * `website-cms` repo; the two must be changed together.
 */
import { defineQuery } from 'next-sanity';

/**
 * Projection body for a Sanity `image` field — interpolates to `logo { ... }`.
 *
 * `asset->{ url }` dereferences the asset document so the frontend gets a
 * plain `cdn.sanity.io` URL it can append `?w=` to. `crop` and `hotspot` come
 * along so the Studio image editor keeps working on documents edited later.
 *
 * The braces are part of the fragment on purpose: without them the
 * interpolation yields `logo asset->{...}, crop, hotspot`, which is not valid
 * GROQ and fails to parse.
 */
export const imageUrlFragment = /* groq */ `{
  "asset": asset->{
    _id,
    url,
    "lqip": metadata.lqip,
    "dimensions": metadata.dimensions
  },
  crop,
  hotspot
}`;

/** All visible partners, for /partners and /for-partners. */
export const PARTNERS_QUERY = defineQuery(/* groq */ `
  *[_type == "partner" && isVisible == true] | order(name asc) {
    _id,
    name,
    "category": coalesce(category, "Other"),
    "logoUrl": logo ${imageUrlFragment},
    "logoNoBackgroundUrl": logoNoBackground ${imageUrlFragment},
    isFeatured
  }
`);

/** Featured partners only — the home page partner strip. */
export const FEATURED_PARTNERS_QUERY = defineQuery(/* groq */ `
  *[_type == "partner" && isVisible == true && isFeatured == true] | order(name asc) {
    _id,
    name,
    "category": coalesce(category, "Other"),
    "logoUrl": logo ${imageUrlFragment},
    "logoNoBackgroundUrl": logoNoBackground ${imageUrlFragment}
  }
`);

/** All startups, for the /startups directory. */
export const STARTUPS_QUERY = defineQuery(/* groq */ `
  *[_type == "startup"] | order(name asc) {
    _id,
    "id": legacyId,
    name,
    "website": coalesce(website, ""),
    "summary": coalesce(summary, "No description available"),
    "description": coalesce(description, summary, "No description available"),
    "logoUrl": logo ${imageUrlFragment},
    foundingYear,
    "category": coalesce(categories, []),
    isSpotlight,
    isYCombinatorAlumni,
    isMTZ,
    isEWOR,
    companyLinkedin,
    milestones,
    supportingPrograms,
    founders[] {
      name,
      role,
      batch,
      "imageUrl": image ${imageUrlFragment},
      linkedin
    }
  }
`);

/** Spotlight + YC + EWOR startups for the home page marquee, and the total. */
export const FEATURED_STARTUPS_QUERY = defineQuery(/* groq */ `
  {
    "total": count(*[_type == "startup"]),
    "startups": *[_type == "startup" && (isSpotlight == true || isYCombinatorAlumni == true || isEWOR == true)]
      | order(name asc) {
        _id,
        "id": legacyId,
        name,
        "logoUrl": logo ${imageUrlFragment},
        isSpotlight,
        isYCombinatorAlumni,
        isEWOR
      }
  }
`);

/** A single startup, resolved by the legacy NocoDB id used in the URL. */
export const STARTUP_BY_LEGACY_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "startup" && legacyId == $id][0] {
    _id,
    "id": legacyId,
    name,
    "website": coalesce(website, ""),
    "summary": coalesce(summary, "No description available"),
    "description": coalesce(description, summary, "No description available"),
    "logoUrl": logo ${imageUrlFragment},
    foundingYear,
    "category": coalesce(categories, []),
    isSpotlight,
    isYCombinatorAlumni,
    isMTZ,
    isEWOR,
    companyLinkedin,
    milestones,
    supportingPrograms,
    founders[] {
      name,
      role,
      batch,
      "imageUrl": image ${imageUrlFragment},
      linkedin
    }
  }
`);

/** Global network member companies for the /member-network marquee. */
export const NETWORK_COMPANIES_QUERY = defineQuery(/* groq */ `
  *[_type == "networkCompany"] | order(name asc) {
    _id,
    name,
    "type": coalesce(type, "Other"),
    "logoUrl": logo ${imageUrlFragment}
  }
`);

/** Home page news carousel, in the curated order from the old NocoDB table. */
export const NEWS_ITEMS_QUERY = defineQuery(/* groq */ `
  *[_type == "newsItem" && isVisible == true] | order(order asc, title asc) {
    _id,
    title,
    "description": coalesce(description, ""),
    "url": coalesce(url, ""),
    "imageUrl": image ${imageUrlFragment}
  }
`);
