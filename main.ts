// Monday Morning Punchlines — entry program.
//
// Writes exactly one joke about Monday mornings to /output/entry.txt.
// The joke is assembled from deliberate fragments so the setup and the
// punchline stay separate in the source, then validated before anything
// is written to disk. Deterministic: same input, same bytes, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// ---------------------------------------------------------------------------
// Joke material
//
// Setup: I tried to ghost Monday morning — the modern, very relatable act
// of ignoring something that will not leave you alone.
// Turn: Monday shows up in person, which is already wrong for a day of
// the week.
// Punchline: it is waving my own calendar invite — the acceptance I
// forgot I gave is what traps me. The joke is about Monday morning
// specifically (the invite is a Monday one), it lands a twist instead of
// complaining, and it says nothing twice.
// ---------------------------------------------------------------------------

interface JokePart {
  /** Human-readable label, only used in diagnostics. */
  label: string;
  /** The literal text fragment. */
  text: string;
}

const SETUP: JokePart[] = [
  { label: "hook", text: "I tried to ghost Monday morning." },
  { label: "turn", text: "It showed up at my door waving my own calendar invite:" },
];

const PUNCHLINE: JokePart = {
  label: "punchline",
  text: "\u201CYou accepted this.\u201D",
};

/** Hard cap from the competition gate: 1 to 200 characters. */
const MAX_CHARS = 200;
const MIN_CHARS = 1;

/** Where the grader looks for the entry text. */
const OUTPUT_PATH = "/output/entry.txt";

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

/** Join the fragments into one line, collapsing any accidental double spaces. */
function assembleJoke(setup: JokePart[], punchline: JokePart): string {
  const pieces = [...setup.map((part) => part.text), punchline.text];
  return pieces
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Count characters the way the gate does: Unicode code points, not bytes. */
function charCount(text: string): number {
  return [...text].length;
}

// ---------------------------------------------------------------------------
// Validation — fail loudly instead of writing a bad entry.
// ---------------------------------------------------------------------------

interface ValidationResult {
  ok: boolean;
  problems: string[];
}

function validateJoke(text: string): ValidationResult {
  const problems: string[] = [];
  const count = charCount(text);

  if (count < MIN_CHARS) {
    problems.push(`joke is empty (${count} characters)`);
  }
  if (count > MAX_CHARS) {
    problems.push(
      `joke is ${count} characters, over the ${MAX_CHARS} limit by ${count - MAX_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    problems.push("joke is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("joke must be a single line, no newlines allowed");
  }
  // The joke must actually be about Monday mornings, not a generic line.
  if (!/monday/i.test(text)) {
    problems.push("joke does not mention Monday");
  }
  // A punchline needs a turn: the quoted reply is the turn here.
  if (!text.includes("\u201C") || !text.includes("\u201D")) {
    problems.push("punchline quote is missing its quotation marks");
  }
  return { ok: problems.length === 0, problems };
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function writeEntry(text: string, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  // Exactly the joke plus one trailing newline: nothing else in the file.
  writeFileSync(outputPath, `${text}\n`, "utf8");
}

/**
 * Read the entry back and confirm what landed on disk is exactly the joke
 * we validated: same text, same character count, nothing appended or lost.
 * A silent write failure must never pass as a good entry.
 */
function verifyWrittenEntry(expected: string, outputPath: string): void {
  const onDisk = readFileSync(outputPath, "utf8");
  const expectedFile = `${expected}\n`;
  if (onDisk !== expectedFile) {
    console.error(
      `ERROR: ${outputPath} does not match the validated joke ` +
        `(disk: ${charCount(onDisk)} chars, expected: ${charCount(expectedFile)} chars)`,
    );
    process.exit(1);
  }
  if (Buffer.byteLength(onDisk, "utf8") > 201) {
    // 200 chars of joke plus the single trailing newline, at most.
    console.error(`ERROR: ${outputPath} is unexpectedly large on disk`);
    process.exit(1);
  }
}

function main(): void {
  const joke = assembleJoke(SETUP, PUNCHLINE);
  const count = charCount(joke);

  const validation = validateJoke(joke);
  if (!validation.ok) {
    for (const problem of validation.problems) {
      console.error(`ERROR: ${problem}`);
    }
    process.exit(1);
  }

  writeEntry(joke, OUTPUT_PATH);
  verifyWrittenEntry(joke, OUTPUT_PATH);

  console.log(joke);
  console.log(`characters: ${count} / ${MAX_CHARS}`);
  console.log(`wrote: ${OUTPUT_PATH}`);
}

main();
