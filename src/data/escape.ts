// L11 "The Door That Wasn't Locked" — non-cauldron escape sequence.
// A short choice-tree that introduces the multi-step decision flow the
// game will use more heavily as it evolves toward the multiplayer card
// product. Each step presents 2-4 choices; choices consume "carried"
// items (collected from earlier choices or persistent inventory) and
// route to a next step. Reaching an `outcome` step ends the level and
// records which Chapter Two opener the player has unlocked.
//
// Design contract:
//   * No "wrong" choices — every path leads to an outcome, but outcomes
//     differ in flavour, in what Mira loses, and in what she carries.
//   * A choice can be *gated* by an item: if `requires` is set and the
//     player doesn't have it, the choice renders disabled (with a
//     tooltip-style explanation of what's missing).
//   * Choices can `grant` items into the carried bag. Items are not
//     persistent — they exist for the duration of L11 only and are
//     converted into Chapter Two starting flags at the outcome step.

export type EscapeStepId = 'start' | 'gather' | 'gather2' | 'door';

export type EscapeItemId =
  // From L10 carry-over (read from store.inventory at L11 start)
  | 'bessie-key'
  | 'wall-note'
  | 'wren-crest-memory'
  // Earned during L11
  | 'smudge-feather'    // a feather Smudge dropped — opens the cracked grate
  | 'kitchen-rag'       // smells of kitchen — masks her own scent
  | 'iron-pin'          // pried from the cot — picks the wrong lock loudly
  | 'silver-thread'     // pulled from her hem — quiet but slow
  | 'prologue-tonic';   // the suppressed-memory tonic she was about to publish

export type EscapeOutcomeId =
  | 'through-grate'        // climbs up via the grate (Smudge's path)
  | 'through-kitchen'      // through Bessie's kitchen (warm path)
  | 'down-the-floor'       // uses the seam from L10 (the doc's promise)
  | 'caught';              // lingers, is found by Wren — voluntary capture

export type EscapeChoice = {
  id: string;
  label: string;
  blurb: string;
  /** Required carried items — ALL must be present (AND). */
  requires?: EscapeItemId[];
  /** Required carried items — at least ONE must be present (OR). */
  requiresAny?: EscapeItemId[];
  /** Items added to the bag if this choice is taken. */
  grants?: EscapeItemId[];
  /** Items consumed/removed from the bag if this choice is taken. */
  consumes?: EscapeItemId[];
  /** Either next step id, or terminal outcome. */
  next: EscapeStepId | { outcome: EscapeOutcomeId };
};

export type EscapeStep = {
  /** Heading shown above the prose. */
  heading: string;
  /** The situation, 2-4 short paragraphs. Uses {name} for the player's name. */
  prose: string[];
  choices: EscapeChoice[];
};

// Steps. Linear-ish but chosen items unlock different paths through the
// middle. Tested to make sure every initial choice eventually reaches an
// outcome, and that no item-gated choice is reachable without first
// having a way to acquire that item.
export const ESCAPE_STEPS: Record<EscapeStepId, EscapeStep> = {
  start: {
    heading: 'A note. An ingredient. A door that should be locked.',
    prose: [
      "{name} woke to a sound like a paper sliding. There was a folded note inside the cell. Smaller hand than the wall recipe. Familiar.",
      'Beside it: a single grey-silver shard. The Unknown, again. Or another like it.',
      "The note read: \"The door isn't locked. It hasn't been since Bessie. Pick three things. Decide which way the wisps go.\"",
      'Smudge was on the floor, watching her, head tilted the way he tilts when something is about to be true.',
    ],
    choices: [
      {
        id: 'feather',
        label: 'Take the feather Smudge dropped under the cot.',
        blurb: 'Black, slightly oversized. He nudges it toward you with his beak.',
        grants: ['smudge-feather'],
        next: 'gather',
      },
      {
        id: 'rag',
        label: 'Take the kitchen rag balled in the cot corner.',
        blurb: 'It smells of stew and smoke. Bessie left it on purpose.',
        grants: ['kitchen-rag'],
        next: 'gather',
      },
      {
        id: 'pin',
        label: 'Pry the iron pin loose from the cot frame.',
        blurb: 'Bent. Useful for a lock you do not have the key to.',
        grants: ['iron-pin'],
        next: 'gather',
      },
    ],
  },
  gather: {
    heading: 'Two more things, then the door.',
    prose: [
      'You stand. The cell looks smaller than it ever has, or you have grown.',
      'Three things on offer. You can take two. Smudge has not moved.',
    ],
    choices: [
      {
        id: 'thread',
        label: 'Pull a silver thread from your dress hem.',
        blurb: 'Quiet. Slow to use. Reaches farther than you expect.',
        grants: ['silver-thread'],
        next: 'gather2',
      },
      {
        id: 'tonic',
        label: 'Take the small vial Bessie left under the cot.',
        blurb: 'It is the suppressed-memory tonic. The one you were going to publish proof against.',
        grants: ['prologue-tonic'],
        next: 'gather2',
      },
      {
        id: 'feather2',
        label: "Take Smudge's feather. He is asking.",
        blurb: 'You did not see it before. He has been waiting for you to look.',
        grants: ['smudge-feather'],
        next: 'gather2',
      },
    ],
  },
  gather2: {
    heading: 'One more.',
    prose: [
      'You feel the weight of two things in your hand and the weight of the door against the silence.',
      'One last decision before you stand at the door.',
    ],
    choices: [
      {
        id: 'thread2',
        label: 'A silver thread from your hem.',
        blurb: 'You pull. It does not break.',
        grants: ['silver-thread'],
        next: 'door',
      },
      {
        id: 'tonic2',
        label: "Bessie's vial.",
        blurb: 'You will use it. You will not drink it.',
        grants: ['prologue-tonic'],
        next: 'door',
      },
      {
        id: 'rag2',
        label: 'The kitchen rag.',
        blurb: 'You wrap it around your wrist. It steadies your hand.',
        grants: ['kitchen-rag'],
        next: 'door',
      },
    ],
  },
  door: {
    heading: 'The door. It opens inward, on hinges that were oiled.',
    prose: [
      "It is true. The door is not locked. It has not been for some time.",
      'Beyond it: a corridor that branches three ways. Up — toward the grate. Forward — toward the kitchen. Down — toward the seam in the floor that rose a centimetre and settled.',
      'You take a breath. You decide.',
    ],
    choices: [
      {
        id: 'up',
        label: 'Up — through the grate, the way the wisps went.',
        blurb: "Requires a feather. The grate's edge is too high for your hand alone.",
        requires: ['smudge-feather'],
        consumes: ['smudge-feather'],
        next: { outcome: 'through-grate' },
      },
      {
        id: 'kitchen',
        label: "Forward — through Bessie's kitchen, the warm way.",
        blurb: 'Requires the rag. The cooks know the smell; they will not look up.',
        requires: ['kitchen-rag'],
        consumes: ['kitchen-rag'],
        next: { outcome: 'through-kitchen' },
      },
      {
        id: 'down',
        label: 'Down — through the seam in the floor.',
        blurb:
          "Bessie's key opens the first lock cleanly; the iron pin picks it loudly. Either works.",
        requiresAny: ['bessie-key', 'iron-pin'],
        // Pin is consumed if present in the bag; key is persistent across
        // chapters and untouched (handled in canPick consume logic).
        consumes: ['iron-pin'],
        next: { outcome: 'down-the-floor' },
      },
      {
        id: 'wait',
        label: "Don't go. Sit on the cot. Wait for whoever comes.",
        blurb:
          'A choice as much as the others. The dungeon was never going to forget you.',
        next: { outcome: 'caught' },
      },
    ],
  },
};

export type EscapeOutcomeData = {
  title: string;
  prose: string[];
  /** Coin / gem reward for the escape itself. */
  coins: number;
  gems: number;
  /** A short narrative hook into Chapter Two. */
  ch2Hook: string;
};

export const ESCAPE_OUTCOMES: Record<EscapeOutcomeId, EscapeOutcomeData> = {
  'through-grate': {
    title: 'Up.',
    prose: [
      'You climb. Smudge goes first, through the gap his feather widened. You follow on hands and knees, then on your back, then on your fingertips.',
      'You come out in a passage that smells of laundry and old salt. The wisps go this way, every cycle, since whenever cycles started.',
      'At the end of the passage: a window with no glass. Below it: roofs. Above it: stars you have not seen in months.',
    ],
    coins: 1500,
    gems: 4,
    ch2Hook:
      'Chapter Two opens above the dungeon. You are on the roof of a kitchen wing, and Cael — whoever Cael is — is already there.',
  },
  'through-kitchen': {
    title: 'Forward.',
    prose: [
      "You walk through Bessie's kitchen with a rag tied around your wrist and your shoulders down. Three cooks look at you. Two look away. One — not Bessie — nods.",
      "You pass the long oven. You pass the bread board. You pass the door that goes outside.",
      "It does, in fact, go outside.",
    ],
    coins: 1800,
    gems: 3,
    ch2Hook:
      "Chapter Two opens with you in the kitchen yard at dawn. Petra is buying eggs from a man who does not know he is being stolen from.",
  },
  'down-the-floor': {
    title: 'Down.',
    prose: [
      'You take the seam.',
      'It opens onto a stair that goes farther than it should. The walls pulse the way the cell walls did, but slower. The bioluminescent fungus is darker here — almost violet.',
      "Aldric is at the bottom. He was waiting. He doesn't look surprised.",
    ],
    coins: 1200,
    gems: 6,
    ch2Hook:
      "Chapter Two opens in the Second Ward. Aldric is here. He brought what he could.",
  },
  caught: {
    title: 'You stayed.',
    prose: [
      'You sat on the cot. Smudge sat with you. The cell did not get smaller and it did not get larger.',
      "You heard the door open. You did not look up. You knew which voice it would be.",
      "It was not the voice you expected.",
    ],
    coins: 800,
    gems: 5,
    ch2Hook:
      "Chapter Two opens with the Architect speaking to you directly. They are not what you thought they would be.",
  },
};
