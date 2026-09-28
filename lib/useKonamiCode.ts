'use client';

import { useEffect } from 'react';

/**
 * The classic Konami code: ↑ ↑ ↓ ↓ ← → ← → B A.
 */
const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

/** Give up on a partial sequence after this long without a keypress. */
const RESET_AFTER_MS = 2_000;

const EDITABLE_TAGS = /^(input|textarea|select)$/i;

/**
 * Calls `onUnlock` when the Konami code is entered anywhere on the page.
 *
 * Deliberately loose: any keypress inside a form field or a modifier combo is
 * ignored, but otherwise the sequence can be typed from anywhere. Keys pressed
 * within `RESET_AFTER_MS` of each other count as one continuous attempt.
 *
 * @param onUnlock - Invoked once per completed sequence.
 * @param enabled - Set to `false` to detach the listener entirely.
 */
export function useKonamiCode(onUnlock: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let progress = 0;
    // Browser-only code, so the DOM `number` timer id is the right one.
    let resetTimer: number;

    const onKeyDown = (event: KeyboardEvent) => {
      // Never hijack a chord the user is composing (⌘R, ⌘C, ⌥Tab, …).
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // Holding a direction key auto-repeats and would cheat the sequence.
      if (event.repeat) return;

      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || EDITABLE_TAGS.test(target.tagName))) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      progress =
        key === KONAMI_SEQUENCE[progress] ? progress + 1 : Number(key === KONAMI_SEQUENCE[0]);

      if (progress === KONAMI_SEQUENCE.length) {
        progress = 0;
        window.clearTimeout(resetTimer);
        onUnlock();
      } else {
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          progress = 0;
        }, RESET_AFTER_MS);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(resetTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled, onUnlock]);
}
