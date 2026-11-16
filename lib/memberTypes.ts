/**
 * The shapes `/members` renders, as produced by `lib/members.ts`.
 *
 * Kept apart from that module because it is `server-only`: `BoardsSection` is a client island and
 * needs these types without pulling the server-only guard into the client bundle (the same split
 * as `lib/eventTypes.ts`).
 */

/** One person as the members platform publishes them. */
export interface MemberProfile {
  /** The platform's stable member id. */
  id: string;
  name: string;
  /** Absent when the member has not uploaded a portrait; the card shows initials instead. */
  imageUrl?: string;
  /** Only set when the member made their LinkedIn public on the platform. */
  linkedinUrl?: string;
}

export interface MemberBatch {
  /** URL segment, e.g. `ws26` → `/members/ws26`. */
  slug: string;
  /** Display name, e.g. `Winter 2026`. */
  name: string;
  groupImageUrl: string;
  /** Portraits first, then alphabetical. */
  members: MemberProfile[];
}

export interface BoardSeat extends MemberProfile {
  /** Role title from the platform, e.g. `President` or `MD Marketing`. */
  role: string;
}

export interface Board {
  /** e.g. `26-27`. */
  id: string;
  /** e.g. `Board 26-27`. */
  name: string;
  /** e.g. `2026-2027`. */
  years: string;
  /** True for the board currently in office (no term end yet). */
  current: boolean;
  imageUrl: string;
  /** In the platform's org-chart order: President → VP → CFO → the rest. */
  executiveBoard: BoardSeat[];
  /** In the platform's department order. */
  departmentBoard: BoardSeat[];
}
