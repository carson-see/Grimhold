# GRIMHOLD — Design Bible Vol. 2
### Store System · Character Compendium · Secrets & Easter Eggs
*Internal Development Document — Act One Reference*

---

## SECTION 1: THE ECONOMY

### Currency Overview

Grimhold uses three currencies. Each feels earned differently and spends differently. Players should never feel like they're grinding — they should feel like they're discovering.

| Currency | How It Feels | Primary Source |
|---|---|---|
| **Coins** | Common, satisfying, yours to burn | Speed-based level completion |
| **Gems** | Scarce, meaningful, worth protecting | First clears, alternate recipes, secrets |
| **Grimhold Tokens** | Rare, strange, not sold anywhere | Hidden levels, Easter eggs, secret encounters only |

**The design rule:** Coins buy convenience. Gems buy access. Tokens buy mystery.
Tokens cannot be purchased with real money. This is a firm line. Players who find them feel like they discovered something. Players who didn't know they existed get curious when someone mentions them.

---

### How Coins Are Earned

Coins reward speed without punishing thought. Players are never shown the time threshold — they learn it by playing.

| Clear Speed | Coins Earned |
|---|---|
| Within target time (3-star) | 1,000 |
| Within 1.5× target time (2-star) | 600 |
| Any clear above 1.5× (1-star) | 200 |
| Chapter completion bonus | +500 flat |
| Alternate recipe path | +200 on top of base reward |
| Recruiting an ally | +150 one-time |
| Random encounter decision (any active choice) | +100 |

---

### How Gems Are Earned

Gems are never automatic. Every gem requires something deliberate.

| Action | Gems |
|---|---|
| First clear of any level | 1 |
| Alternate recipe completion (each path, each level) | 1 |
| Chapter completion | 5 |
| Black wisp produced | 1 (rare event marker) |
| Downward wisp produced | 1 (rare event marker) |
| Perfect joint recipe synchronization with Aldric | 1 |
| Hidden level completion | 3 |
| Finding an Easter egg | 1–2 depending on depth |
| Daily login bonus (escalating) | 1–3 |

---

## SECTION 2: THE STORE

The store in Grimhold is called **The Larder** — Mira's in-game framing for it. She keeps items she's accumulated in the corner of her cell, organized by type. The UI reflects this: small shelf-like inventory rather than a generic shop grid. Items sit on shelves. Rare items are in the back, slightly harder to see.

There are four tabs in The Larder: **Brewed** (craftable), **Traded** (coin-purchased), **Kept** (gem-purchased), and **Found** (cannot be bought — earned or discovered only).

---

### TAB 1: BREWED — Craftable Items

These are made from ingredients Mira collects. Bessie Tallow delivers some ingredients if recruited. Others are earned from specific level completions. Crafting costs a small coin fee (representing time and labor).

| Item | Description | Craft Cost | Craft Ingredients | Effect |
|---|---|---|---|---|
| **Transmutation Powder** | Converts one ingredient into a wildcard (fits any cauldron slot for one use) | 50 coins | 1× Silvermoss + 1× Darkspore | Use anytime during a level — wildcard lasts that level only |
| **Cooling Draught** | Prevents one cauldron from overheating for 5 additional moves | 30 coins | 2× Moonbloom + 1× Coldstone | Apply to specific cauldron before level starts |
| **Stabilizing Resin** | Freezes all volatile ingredients in place for 6 moves | 80 coins | 2× Greystone + 1× Hollowroot | Active immediately when used mid-level |
| **Clarity Oil** | Highlights the most move-efficient recipe path on the current board | 100 coins | 1× Emberpetal + 1× Ashroot + 1× Silvermoss | Shows optimal grouping for 10 seconds. Doesn't tell you which recipe path to use — just the most efficient sort for however you've arranged things. |
| **Residue Salve** | Applied to Mira between levels — slows the aging/drain effect for 3 levels | 120 coins | 2× Moonbloom + 2× Emberpetal | Visual health buffer. Cosmetically meaningful. |

*Bessie Tallow (if recruited) delivers 2 random craftable ingredients before Levels 5, 7, and 9. If not recruited, these ingredients must be purchased in the Traded tab.*

---

### TAB 2: TRADED — Coin Purchases

Standard consumables. Available anytime. Not shameful to use. The move tokens especially are casual-player lifelines.

| Item | Description | Cost | Notes |
|---|---|---|---|
| **Extra Move Token** | +3 moves added to current level | 150 coins | Most frequently purchased item in the game. Stack up to 3× per level. |
| **Hourglass Shard** | Extends a time-sensitive cauldron's window by 4 moves | 300 coins | Single-use per level. Good for players who panic on the overheat mechanic. |
| **Rush Ward** | Removes the time-sensitive overheat risk from one cauldron entirely for one level | 500 coins | Nuclear option for one timed element. Use it when you're out of Hourglass Shards and frustrated. |
| **Life Elixir** | Restores 1 life immediately | 450 coins | Also available for 2 gems. Players choose based on what they have more of. |
| **Ingredient Bag** | Adds 2 random standard ingredients to the next level | 200 coins | Useful for players who want more flexibility in recipe pathing. |
| **Bessie's Staples** | Specific ingredient bundle (2× Coldstone, 2× Silvermoss) | 350 coins | Replaces Bessie's ally delivery for players who didn't recruit her. Same items, no flavor. |

---

### TAB 3: KEPT — Gem Purchases

Premium items. Should feel like a treat, not a requirement. Nothing in this tab is necessary to complete any level. Everything in it is either quality-of-life or cosmetic.

| Item | Description | Cost | Notes |
|---|---|---|---|
| **Second Wind** | Refills all moves to starting amount once per level | 3 gems | The time-saver item. Players who hit a wall deep in a hard level reach for this. Strong purchase driver — design levels to have satisfying near-miss moments. |
| **Full Restoration** | Restores all 5 lives immediately | 5 gems | One-time use. Also unlockable by completing a secret level. |
| **Duplicate Flask** | Creates one additional copy of any single ingredient on the board | 2 gems | Rare merchant encounter can also give this (see Character Compendium). Tactical and satisfying to use. |
| **Mira's Satchel** | Increases inventory capacity for craftable items | 2 gems | Permanent upgrade. One-time purchase. QoL for players deep into the game. |
| **Smudge's Ribbon** | Small red ribbon on Smudge. Purely cosmetic. | 1 gem | Also findable as Easter egg (see Secrets). Players who found it for free feel smug. Players who bought it feel cute. Both are valid. |
| **The Lantern Shade** | Changes the ambient dungeon color palette — from blue-fungal to warm amber | 2 gems | Cosmetic. Let players make Grimhold feel like their Grimhold. |
| **Mira's Second Dress** | Alternate costume — dark blue, slightly torn at the hem, one gold button | 3 gems | Also earns automatically at 2-star average across Levels 1–10. Players who earned it feel great. |
| **The Scholar's Map** | Shows the layout of the current floor (sub-ward structure). Cosmetic/lore item. | 2 gems | Reveals that Sub-Ward One has 6 cells — four are occupied. Two are not. Players start asking questions. |

---

### TAB 4: FOUND — Non-Purchasable Items

These cannot be bought. They exist only to be discovered. The Larder always shows the silhouettes of Found items the player hasn't unlocked yet — greyed out, unnamed. This drives exploration behavior without explicit instruction.

| Item | How Found | Effect | Story Function |
|---|---|---|---|
| **The Black Flask** | Produce 3 black wisps across any levels | Stores one black wisp for use mid-level — using it creates a puzzle variant where the Architect's recipe is wrong and the player's improvisation is correct | First piece of active resistance against the Architect. Unlocks a new conversation with Aldric. |
| **Wren's Ledger Page** | Secret room behind Smudge's wall (Level 5) | Reveals wisp color meanings in the lore log | First external confirmation of what Grimhold is doing. Aldric recognizes it if shown. |
| **Grimhold Token (×1)** | Various hidden locations (see Secrets) | Access The Hidden Corridor — a level series not accessible any other way | Cannot be purchased. Cannot be gifted. The question "what does the token unlock?" drives the Reddit discovery loop. |
| **Edgar's Feather** | Tap Smudge 10 times rapidly at the start of Level 1 before touching ingredients | Purely cosmetic — Smudge's soot color shifts slightly toward a warmer grey for the rest of that session | Hidden name reference. Pays off in Act Two when Petra's letter mentions a raven named Edgar. Players who found this before Act Two will post about it. |
| **The Architect's Blueprint** | Complete Levels 1–10 with at least 5 levels at 3-star average AND discover the Level 5 secret room | Adds a new tab to the lore log: "Grimhold Construction Notes." Three pages of technical detail about what the dungeon was designed to do, written in the Architect's cramped handwriting. | The closest thing to a villain backstory in Act One. Players who find it post screenshots. |
| **The Compass** | In The Hidden Corridor — final room | Shows direction: "Deeper" or "Home" depending on character path choices so far. Purely cosmetic/lore. | Acts as a quiet moral tracker. More interesting than a visible morality meter. |

---

## SECTION 3: CHARACTER COMPENDIUM

### Main Prisoners (Already Documented in Level Bible)

*Mira Ashveil, Aldric Vane, Cael Driftmore, Petra Voss — see Level Document for full backstories.*

*Note on Cael, Petra, and Aldric appearing in Act One: Aldric is heard through the wall beginning Level 7 and throughout. Cael and Petra are referenced (the slid recipe in Level 2 is from Petra; the memory in Level 4 is Cael's) but not named or met face-to-face until Act Two, Chapter One.*

---

### BESSIE TALLOW — Dungeon Cook
**Role:** Recurring ally / minor antagonist depending on player choices.
**First appearance:** Level 3.
**Physical description:** Broad-shouldered, mid-fifties, flour-dusted hair she keeps in a bun that's always slightly coming undone on the left side. Hands permanently red from hot water. Moves fast for her size — twenty years of narrow dungeon corridors have made her efficient. Wears a grey apron with a small blue embroidered hen on the pocket, done by her daughter years ago and faded to near-invisibility. She has never replaced it.
**Voice:** Low, flat, midland accent. Economy of words. When she says "fine" she means at least four different things depending on context.

**Backstory:** Bessie grew up in the lower city of Lumara, the daughter of a slaughterhouse worker. She came to Grimhold at thirty-two because it paid, and because she had two children to feed and the other available work was worse. She has spent twenty years telling herself that she cooks for the staff, not for the workshop, and that what happens in the brewing chambers is not her concern. She is not stupid. She has known what Grimhold is for at least twelve years. She began bringing small offerings — extra ingredients, dropped "accidentally" near cell doors — about eight years ago as a form of private penance that she has never named out loud.

**The daughter:** Mentioned once (Level 7, if Bessie is recruited and the player listens carefully). Her name is Nell. She is fourteen now and lives with Bessie's sister outside the city. Bessie hasn't seen her in three years. This is the one thing that could make Bessie act — not principle, but the fear that Nell will someday find out what her mother did and did not do.

**Moral complexity:** Bessie is not good or bad. She is an ordinary person inside a profoundly wrong institution who has been choosing the smaller betrayal over and over for two decades. The key she delivers in Level 10 is the first time she chose something bigger. She is terrified. She does it anyway.

**If never recruited:** Bessie remains present in the background — visible in corridors, occasionally audible. She never helps. At the end of Act One, she is briefly shown in Wren's report to the Architect as "staff member of note — possible liability." She doesn't know about the report. The player does.

---

### WREN — Luminar Court Observer
**Role:** Antagonist (ambient, non-confrontational). The Architect's eyes in the palace.
**First appearance:** Level 7 (random encounter).
**Physical description:** Forty, lean, very still in the way of someone who was trained out of fidgeting as a child. Always dressed in muted court colors — soft greys, deep blues, nothing that catches the eye. The crest on his ring is a closed eye with a horizontal line through it. His shoes are always clean, which is notable in a dungeon. He notices that you notice this.
**Voice:** Not heard directly. Speaks to guards in quick, low sentences. Notes things.

**Backstory:** Wren's family has served the Luminar court for three generations as what the court calls "record-keepers" and what everyone else calls informants. He genuinely believes in systems. He genuinely believes that Grimhold — while admittedly unusual — serves a function that keeps the kingdom stable. He has convinced himself that the civic potions are a necessary tool rather than a crime, because without them the lower city would erupt in the kind of grief-driven unrest that destabilized three prior kingdoms. He has read the history. He finds Mira troubling specifically because she is right about the potions, and being right does not make her right to act on it.

**Wren and the Architect:** He does not like the Architect. He finds them unpredictable and emotionally unstable in a way that concerns him professionally. He reports to them because the arrangement predates his involvement and cannot currently be renegotiated. He is quietly looking for a reason to end the arrangement on his own terms. This becomes important in Act Two.

**The ring:** The closed-eye crest is old. It was the symbol of an organization that was officially dissolved two hundred years ago — a judicial order that held the right to disappear citizens without trial. The crest's continued existence on Wren's ring is either a historical inheritance he hasn't thought about or a statement he is making very quietly. The game does not tell you which.

---

### THE GUARD CAPTAIN — CORVUS PALE
**Role:** Primary physical antagonist in Act One. The face of Grimhold's enforcement.
**First appearance:** Heard (footsteps, commands) from Level 4 onward. Seen in Level 7 behind Wren. Named in overheard conversation in Level 8.
**Physical description:** Tall, early forties, the kind of lean that comes from discipline rather than deprivation. Short grey hair that was once black — it went grey in his mid-thirties and he didn't seem bothered. A scar from left cheekbone to jawline that he never explains and that looks older than it should. Always in Grimhold grey. No ornamentation. Moves through the dungeon like he owns it because for most purposes he does.
**Voice:** Low, unhurried. Gives orders once. Does not repeat.

**Backstory:** Corvus Pale started as a city guard in lower Lumara and was recruited to Grimhold fifteen years ago by the Architect personally. He was selected because of a specific incident: he had arrested a young man for writing seditious graffiti on a city wall, and when the man explained that the graffiti was true, Corvus had replied that the truth of it was irrelevant to the law. The Architect found this response philosophically precise. Corvus has never questioned the purposes of Grimhold. He manages the Sub-Ward, oversees the guards, and maintains the systems that keep the brewing chambers running. He is not cruel. He is exact.

**The thing nobody knows about Corvus:** He keeps a personal log. It is not a work log — the work log is official. This one is in a small journal in his quarters. He has been writing, without apparent purpose, observations about the prisoners: what they do with their hands when they think no one is watching, what they say in their sleep, what they ask for that they never receive. He is not collecting this for the Architect. He doesn't know why he's collecting it. He has been doing it for six years.

**His opinion of Mira:** He reviewed her file before she arrived. Eleven-year-old. Alchemist. He considered having her moved to the juvenile sub-ward in Level Three. He did not, because the Architect's requisition specified Cell 4. He noted this deviation from protocol in his official log and in his private one. In the private one, he added: "Child. Doesn't seem frightened. Should be."

---

### THE MERCHANT — NAME UNKNOWN
**Role:** Optional rare encounter. Appears once per Act, location unknown until found.
**First appearance:** Random — triggers in one level between 5 and 9, randomly determined per playthrough. Some players find him in Level 5. Some never find him in Act One at all.
**Physical description:** Short, wrapped in a long coat that seems to have more pockets than the coat physically has room for. Face mostly hidden by a hood that's slightly too large. Hands visible — they are unremarkable hands. Moves like he is always just passing through, which is how he presents himself. "Just passing through," he says, in a dungeon, without explaining how or why.
**Voice:** Cheerful in the way of someone who has made peace with all outcomes.

**Backstory:** Nobody knows his name. He calls himself a redistributor of goods and opportunities, which is not a profession that is recognized by the Luminar and which he seems to find amusing. He has been in dungeons before — you can tell by the way he is not alarmed by them. He knows Grimhold specifically. He knows about the wisps. He does not say how. He offers the Duplicate Flask for 2 gems and occasionally other items that are not in the standard store inventory. If asked about the Architect, he becomes briefly serious: "Some doors you don't knock on. This one I'd say you knock loud enough to be heard from outside."

**Function:** He is a lore breadcrumb more than a gameplay element. Players who find him will post about it. Players who don't will wonder if they missed something. He reappears in Act Two with different stock and slightly more answers.

---

### THE OTHER PRISONERS — SUB-WARD ONE, CELLS 1–3 AND 5–6

Sub-Ward One has six cells. Four are occupied (Mira in Cell 4, Aldric in Cell 5, and two others the player learns about slowly). Cells 1–3 are occupied by unnamed prisoners who appear only as sound and shadow — a cough through a wall at night, a humming that stops when Corvus walks past. They are never named in Act One. They are present because a dungeon needs a population and because their absence of names is intentional: they are the people the Architect has already depleted. By Act Two, one of the unnamed cells is empty.

---

### THE LUMINAR HEIR — LADY RESSA LUMINAR
**Role:** Background presence in Act One. Becomes relevant in Act Two.
**First appearance:** Not seen directly. Referenced in Wren's notes (visible in Wren's Ledger Page if found). The Scholar's Map shows her apartments are directly above Sub-Ward One.
**Description:** Second-born child of the current Luminar, twenty-three years old, in a political position she did not want and cannot leave. She is known for three things publicly: her interest in civic alchemy, her uncomfortable habit of asking accurate questions at formal occasions, and the fact that her older brother (the Heir Apparent) has been ill for two years in a way that court physicians cannot explain.

**Backstory:** Lady Ressa has been drinking the civic potions like everyone else. Unlike almost everyone else, she kept a journal for fifteen years before she started noticing that her older memories — the ones from childhood — had gaps. She investigated privately, carefully, and arrived at an unacceptable conclusion about three months before Mira was arrested. She has done nothing with this conclusion. She is twenty-three years old and lives in a palace her family owns and the people who could help her are in a dungeon below her feet. She knows Grimhold exists. She does not know what it does. She is the most dangerous person in Lumara because she is the one person with both power and motive who hasn't yet decided what to do.

**The brother:** His illness is not natural. This is left open in Act One. Wren's Ledger Page contains one line about him: "Heir Apparent declining per schedule."

---

## SECTION 4: SECRETS, HIDDEN LEVELS & EASTER EGGS

### Design Philosophy

Secrets in Grimhold work on three levels:

1. **Discoverable by accident** — the player taps something, something happens, they feel clever.
2. **Discoverable by obsession** — the player reads every note, examines every wall, and finds the thing that rewards attention.
3. **Discoverable by community** — the thing that only makes sense once a player who found Secret A shares it with a player who found Secret B, and together they realize they're pieces of the same puzzle.

The goal is Reddit threads. The goal is "I can't believe they hid that." Design backwards from the sharing moment.

---

### SECRET 1: EDGAR'S WALL
**Location:** Level 1, before first move.
**Trigger:** Tap Smudge 10 times rapidly within 5 seconds of level start, before touching any ingredients.
**What happens:** Smudge makes a sound unlike any of his normal sounds — lower, older. The level title flashes "Edgar" for exactly one frame before reverting to "The First Recipe." Nothing else. Smudge's feather color shifts slightly warmer for the rest of the session. The in-game item "Edgar's Feather" is added to the Found tab, greyed out, unnamed, as a silhouette.
**Payoff:** In Act Two, Petra's letter (which the player finally reads in full) contains the line: "You used to have a raven named Edgar. I always thought that was the most honest thing about you." Players who tapped Smudge in Level 1 will understand this reference before anyone who didn't. The Reddit post writes itself.

---

### SECRET 2: THE ROOM BEHIND THE WALL
**Location:** Level 5 — the wall Smudge passed through.
**Trigger:** Tap the wall Smudge emerged from exactly 7 times within 30 seconds, in the narrow window after Smudge returns but before the level's next ingredient prompt.
**What happens:** A crack appears. It widens into a gap just large enough to see a small space behind the wall. Inside: a shelf. On the shelf: Wren's Ledger Page + Smudge's Ribbon + a hand-written note on a torn piece of paper.
**The note reads:** "You found it. Good. The grate goes up. The floor goes down. The wall goes sideways. You only need two of those. — S.O.T."
**S.O.T.** is never explained in Act One. In Act Two, a character uses those initials as a signature. Players who found this note will know something before that character introduces themselves.
**Rewards:** Wren's Ledger Page (lore unlock), Smudge's Ribbon (cosmetic), S.O.T. initials (community speculation fodder).

---

### SECRET 3: THE WRONG RECIPE THAT'S RIGHT
**Location:** Level 6.
**Trigger:** Brew the exact inverse of the wall recipe — every ingredient placed in the "wrong" cauldron, with no correct placements at all.
**What happens:** A voice speaks through the wall. Not the Architect. Not Aldric. A voice that has not been heard before — calm, older, female. She says one sentence: *"There are five of us. Tell the others when you find them."*
**Then the level clears normally.** No extra reward. No explanation.
**The mystery:** There are four prisoners. Everyone knows four. Five is a number that doesn't fit. Players will argue about this for months. The fifth prisoner does not appear in Act One. The fifth prisoner appears in a post-Act-Two DLC. Building the mystery now costs nothing and creates community engagement that cannot be manufactured any other way.

---

### SECRET 4: THE ARCHITECT SPEAKS (DIRECTLY)
**Location:** Level 7.
**Trigger:** In a single level, produce a violet wisp, then an amber-threaded wisp, then a grey-silver downward wisp — all three in the same level. This requires having a saved Unknown Ingredient and using two separate recipe paths in consecutive cauldrons and the Unknown ingredient in the Left Cauldron. It is mechanically possible but extremely unlikely to happen by accident.
**What happens:** The three wisps do not rise separately. They converge in the air into a single large wisp — the color of the sky just before a storm. It holds for three seconds. Then a voice — not through the wall, but from within the room itself, the first time this has happened — speaks directly to Mira. The Architect's voice, but fractionally different from the overheard fragments. More present. "That was not supposed to be possible." A pause. "You are more interesting than your file indicated."
**Then silence.** The level ends normally. No extra reward except 2 gems marked as rare event.
**Why this matters:** It's the first direct acknowledgment from the Architect that Mira exists as a person rather than an asset. It plants a seed: the Architect is paying attention to Cell 4 specifically. It changes how players read the escalating recipe difficulty — it's not systemic, it's personal. The Architect is not experimenting. They are watching.

---

### SECRET 5: BESSIE'S SHADOW
**Location:** Levels 4 through 7 — only if Bessie was recruited.
**Trigger:** Tap Bessie's door (visible in the background of each level's environment) once per level across Levels 4, 5, 6, and 7. Consecutively. Miss one level, the sequence resets.
**What happens in Level 8:** When Bessie appears at the window during Level 8, there is a second silhouette behind her. Visible for 1.5 seconds. Smaller. Child-sized. Looking at Mira.
**Nothing is said.** The level continues. Bessie's face carries something extra — not just guilt, but something protective. The shadow does not reappear. If the player does not tap consecutively, the shadow is never there and Bessie's Level 8 appearance is as written in the Level Document.
**What this means:** Bessie's daughter Nell has come to Grimhold. Bessie brought her — or Nell came on her own, or Bessie couldn't stop her. This is never explained in Act One. In Act Two, Nell becomes a minor character. Players who triggered this secret will recognize her immediately. Players who didn't will meet her fresh.

---

### SECRET 6: THE ARCHITECT'S HANDWRITING
**Location:** Level 1 wall recipe / Level 8 note.
**Trigger:** Not an active trigger. A passive observation secret. If the player zooms into the wall recipe in Level 1 (available via pinch zoom on mobile) and also zooms into the Level 8 note (Smudge's find), the handwriting is identical. The game never draws attention to this. There is no reward. There is no pop-up.
**What this means:** The recipe scratched into Mira's wall on her first day was written by the Architect. The "orientation recipe" is not standard dungeon intake procedure. The Architect wrote her first recipe personally. This means the Architect has been in her cell. This means they have been in the cell of a sleeping eleven-year-old and written on her wall. The implications are left to the player.
**Why this is a great secret:** It requires no special interaction. It rewards players who zoom in. It will be discovered by someone on a forum who posts a side-by-side screenshot, and that post will fundamentally change how players read Level 1.

---

### SECRET 7: THE FIVE-MINUTE DOOR
**Location:** Level 10 — Bessie's key, received mid-level.
**Trigger:** Use Bessie's key during the level itself rather than waiting until the level ends. The key interaction normally appears after Level 10 completion. But if the player taps the floor seam that shifts at the end of the level *before* completing the final joint recipe with Aldric, and they have the key in inventory, a door interaction appears: not the floor, not the grate. A section of wall to the left of the main cauldron.
**What happens:** The wall opens into The Hidden Corridor — one additional level, accessible only this way, that is not part of the standard Act One progression. The level is narrow, minimal: five ingredients, all unknown types, one cauldron, no recipe on the wall, no move limit shown (it exists but is hidden from the player). The dungeon is older here. The fungal light is dimmer. There are marks on the walls that suggest previous occupants going back years.
**Hidden Corridor rewards:** 3 Grimhold Tokens, 1 Duplicate Flask, and a lore fragment scratched into the far wall: *"There was a fifth prisoner. They were released. Ask yourself what 'released' means in a place like this."*

---

### SECRET 8: THE COMPASS
**Location:** Hidden Corridor — only accessible via Secret 7.
**Trigger:** Complete the Hidden Corridor level.
**What it is:** A small item added to the Found tab — the Compass. When viewed in inventory, it shows a needle. The needle points either toward "Deeper" or "Home" depending on a silent moral tracking system running since Level 1. Every choice across the first ten levels — which recipe to follow, how to handle encounters, whether to produce black wisps, whether to use the key early — has been weighting a scale. The Compass shows the result. No judgment. No explanation. Just a direction.
**Players who see "Deeper" are the ones who will finish the game and feel it meant something. Players who see "Home" will replay the game to see what's different. Both are the right experience.**

---

### EASTER EGG APPENDIX — Quick Reference

| Easter Egg | Location | Trigger | Reward | Reddit Potential |
|---|---|---|---|---|
| Edgar's Feather | Level 1 | Tap Smudge 10× rapidly before first move | Silhouette in Found tab, name unlocked in Act Two | Very high — Petra's letter payoff |
| Room Behind the Wall | Level 5 | Tap Smudge's exit wall 7× in 30 seconds | Wren's Ledger Page + Smudge's Ribbon + S.O.T. note | Extremely high — S.O.T. is a long-burn mystery |
| The Fifth Prisoner | Level 6 | Brew exact inverse of wall recipe | Voice line only — no item | Extremely high — "there are five of us" is a community discussion driver |
| Storm Wisp | Level 7 | Produce all three wisp types in one level | 2 gems + direct Architect voice | High — first direct Architect interaction |
| Bessie's Shadow | Levels 4–7 | Tap Bessie's door once per level, consecutively | Shadow visible in Level 8 | High — Nell payoff in Act Two |
| Handwriting Match | Levels 1 + 8 | Pinch zoom and compare | No item — purely observational | Extremely high — horror implication |
| Hidden Corridor | Level 10 | Use key on wall during level before final joint recipe | 3 Tokens + lore fragment + Compass | Extremely high — Token + fifth prisoner connection |
| Compass | Hidden Corridor | Complete hidden level | Moral direction tracker item | High — encourages replay |

---

## SECTION 5: PRODUCTION NOTE ON DOCUMENTS

For working documents (internal, development phase), use markdown format — the file you're reading now. Faster to write, fully downloadable, version-controllable, can be converted to formatted Word/PDF at any time using Pandoc in one command.

Use the coded docx build only for:
- External deliverables (publisher decks, investor materials)
- Final-version documents leaving the studio
- Anything that requires specific formatting fidelity

During development: markdown. Always.

---

*End of Design Bible Vol. 2 — Act One*
*Next document: Act Two Overview + Cael and Petra introductions*
