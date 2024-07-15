import XRegExp from 'xregexp';
XRegExp.uninstall('namespacing'); // This is a workaround for a breaking change in XRegExp 5.0.0

/**
 * The rank for each possible chord. Rank is the distance in semitones from C.
 */
export const CHORD_RANKS: Map<string, number> = new Map([
  ['B#', 0],
  ['C', 0],
  ['C#', 1],
  ['Db', 1],
  ['D', 2],
  ['D#', 3],
  ['Eb', 3],
  ['E', 4],
  ['Fb', 4],
  ['E#', 5],
  ['F', 5],
  ['F#', 6],
  ['Gb', 6],
  ['G', 7],
  ['G#', 8],
  ['Ab', 8],
  ['A', 9],
  ['A#', 10],
  ['Bb', 10],
  ['Cb', 11],
  ['B', 11],
]);

// Regex for recognizing chords
const TRIAD_PATTERN = '(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-)';
const ADDED_TONE_PATTERN = '(([/\\.\\+]|add)?(\\d+[\\+-]?)?)';
const SUFFIX_PATTERN = `(?<suffix>(${TRIAD_PATTERN}?${ADDED_TONE_PATTERN})*)`;
const BASS_PATTERN = '(\\/(?<bass>[A-G](#|b)?))?';

export const ROOT_PATTERN = '(?<root>[A-G](#|b)?)';
export const MINOR_PATTERN = '(m|min|minor)+';

const CHORD_REGEX = XRegExp(`^${ROOT_PATTERN}${SUFFIX_PATTERN}${BASS_PATTERN}$`);
const MINOR_SUFFIX_REGEX = XRegExp(`^${MINOR_PATTERN}.*$`);

/**
 * Represents a musical chord. For example, Am7/C would have:
 *
 * root: A
 * suffix: m7
 * bass: C
 */
export class Chord {
  constructor(public root: string, public suffix?: string, public bass?: string) {}

  toString(): string {
    if (this.bass) {
      return this.root + this.suffix + '/' + this.bass;
    } else {
      return this.root + this.suffix;
    }
  }

  isMinor(): boolean {
    if (this.suffix) {
      return MINOR_SUFFIX_REGEX.test(this.suffix);
    }
    return false;
  }

  static parse(token: string): Chord {
    if (!isChord(token)) {
      throw new Error(`${token} is not a valid chord`);
    }
    const result = XRegExp.exec(token, CHORD_REGEX);
    if (result) {
      return new Chord(result.root, result.suffix, result.bass);
    } else {
      throw new Error('Invalid chord format');
    }
  }
}

export function isChord(token: string): boolean {
  return CHORD_REGEX.test(token);
}
