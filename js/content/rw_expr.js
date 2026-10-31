// SAT Reading & Writing — Expression of Ideas (HARD). Original content.
// t: 'trans' = Transitions, 'synth' = Rhetorical Synthesis.
const TQ = 'Which choice completes the text with the most logical transition?';
const TD = 'How does the sentence after the blank relate to what comes before it?';
const SQ = (goal) => 'The student wants to ' + goal + '. Which choice most effectively uses relevant information from the notes to accomplish this goal?';
const SD = 'What does the goal in the question require?';
const NOTES = 'While researching a topic, a student has taken the following notes:\n';

export const ITEMS = [
  // ===================== TRANSITIONS =====================
  {
    id: 'ei001', t: 'trans',
    p: 'Early European accounts of the Silk Road portrayed it as a single highway along which caravans carried goods all the way from China to the Mediterranean. Recent archaeological work in Central Asia, however, has revealed a shifting web of short regional routes, with most goods changing hands many times and few individual traders traveling more than a few hundred miles. ______ the image of one continuous east-west road persists in many textbooks, whose maps still trace a single bold line across the continent.',
    q: TQ,
    o: ['Indeed,', 'Still,', 'Accordingly,', 'Likewise,'],
    a: 1,
    tr: ['opposite', null, 'wrongrel', 'wrongrel'],
    e: [
      '"Indeed," intensifies the previous point, but textbooks keeping the old single-road image works against the new evidence rather than reinforcing it.',
      'Correct: despite the evidence for a web of short routes, the single-highway image persists — a "despite this" contrast that "Still," captures.',
      '"Accordingly," says the persistence follows from the new evidence, but the evidence points the opposite way.',
      '"Likewise," signals a parallel, yet textbooks clinging to the old image is not similar to archaeologists overturning it.'
    ],
    d: { q: TD, o: ['Contrast', 'Cause → effect', 'Addition (more of the same point)', 'Example'], a: 0, why: 'Textbooks keep an image that the new archaeological evidence contradicts, so the sentence pushes against what came before.' },
  },
  {
    id: 'ei002', t: 'trans',
    p: 'Urban planners have long championed "complete streets": roadways redesigned to serve cyclists, pedestrians, and transit riders as well as cars. Critics are right that such redesigns can slow automobile traffic at first and that the construction itself disrupts nearby businesses for months. ______ studies of redesigned corridors in several cities have found that retail sales along those streets typically recover within two years and often surpass their earlier levels.',
    q: TQ,
    o: ['Specifically,', 'Moreover,', 'Even so,', 'As a result,'],
    a: 2,
    tr: ['wrongrel', 'opposite', null, 'wrongrel'],
    e: [
      '"Specifically," would introduce a detail of the critics\' point, but recovering sales is not a detail of slowed traffic or disruption.',
      '"Moreover," would add to the critics\' case, but rebounding sales argues against it — the reverse of adding.',
      'Correct: after granting the critics\' points, the text pushes back with evidence that sales recover and even rise, which "Even so," signals.',
      '"As a result," claims the disruption caused the sales recovery, a causal link the text never makes.'
    ],
    d: { q: TD, o: ['Cause → effect', 'Contrast', 'Example', 'Addition (more of the same point)'], a: 1, why: 'The previous sentence grants the critics\' points; the new sentence offers evidence that cuts against them.' },
  },
  {
    id: 'ei003', t: 'trans',
    p: 'In the 1880s, engineers drained much of the tidal marshland around the Halverd estuary to create pasture. The marshes had been the main spring feeding ground for red knots, small shorebirds that must nearly double their body mass at such stopovers before continuing a nonstop flight to their Arctic breeding sites. Birds that fail to reach that weight rarely survive the journey. ______ records kept by local naturalists show the number of red knots passing through the estuary each May falling by more than half between 1885 and 1910.',
    q: TQ,
    o: ['Nevertheless,', 'Consequently,', 'Likewise,', 'Previously,'],
    a: 1,
    tr: ['opposite', null, 'wrongrel', 'wrongrel'],
    e: [
      '"Nevertheless," implies the decline is surprising given what came before, but the text has just explained exactly why it would happen.',
      'Correct: losing the feeding ground meant birds could not gain the weight needed to survive, so the population fell — a result, signaled by "Consequently,".',
      '"Likewise," signals a parallel case, but the decline is the outcome of the drainage, not a similar example of it.',
      '"Previously," points to an earlier time, but the 1885-1910 decline comes after the 1880s drainage.'
    ],
    d: { q: TD, o: ['Similarity', 'Restatement / clarification', 'Cause → effect', 'Contrast'], a: 2, why: 'The chain is drainage, then lost feeding ground, then birds unable to survive — and the new sentence reports the outcome.' },
  },
  {
    id: 'ei004', t: 'trans',
    p: 'Many abilities that seem to set humans apart from other animals turn out to have precursors in other primates, though often in forms so modest that they were long overlooked. ______ wild chimpanzees in West Africa use stones as hammers and anvils to crack open hard-shelled nuts, a skill that young chimpanzees need several years to master and that researchers did not document in detail until the 1970s.',
    q: TQ,
    o: ['For example,', 'By contrast,', 'Nonetheless,', 'In conclusion,'],
    a: 0,
    tr: [null, 'opposite', 'wrongrel', 'wrongrel'],
    e: [
      'Correct: nut-cracking with tools is a specific case of a human-like ability with a primate precursor that was long overlooked, so the sentence is an illustration.',
      '"By contrast," treats chimpanzee tool use as different from the claim, when it actually supports the claim that such precursors exist.',
      '"Nonetheless," signals a point that runs against the first sentence, but the chimpanzee case confirms it.',
      '"In conclusion," would introduce a summary, but the sentence presents a new specific case rather than summing up.'
    ],
    d: { q: TD, o: ['Example', 'Contrast', 'Sequence in time', 'Cause → effect'], a: 0, why: 'The first sentence makes a general claim; the second gives one specific case that fits it, including the "long overlooked" detail.' },
  },
  {
    id: 'ei005', t: 'trans',
    p: 'Mangrove forests store carbon at remarkable densities: per hectare, they can hold up to four times as much as many tropical rainforests, mostly in the waterlogged soils beneath their roots. ______ because those soils are low in oxygen, the organic matter in them decomposes extremely slowly, allowing an undisturbed mangrove forest to keep its stored carbon locked away for centuries.',
    q: TQ,
    o: ['Instead,', 'Even so,', 'For this reason,', 'Moreover,'],
    a: 3,
    tr: ['wrongrel', 'opposite', 'wrongrel', null],
    e: [
      '"Instead," signals a replacement, but nothing in the first sentence is being replaced; both sentences describe mangrove carbon storage.',
      '"Even so," signals something unexpected, but slow decomposition is another point in mangroves\' favor, not a reversal.',
      '"For this reason," treats slow decomposition as caused by high carbon density, which reverses the logic — the soils\' chemistry, not the density, is the cause.',
      'Correct: the first sentence covers how much carbon mangroves store; the second adds how long they keep it — another point in the same direction.'
    ],
    d: { q: TD, o: ['Contrast', 'Cause → effect', 'Example', 'Addition (more of the same point)'], a: 3, why: 'Sentence one is about how much carbon is stored; sentence two adds a separate strength — how long it stays stored.' },
  },
  {
    id: 'ei006', t: 'trans',
    p: 'In eighteenth-century Japan, woodblock printers produced subtle color gradations by wiping ink unevenly across a block before each impression, a technique known as bokashi. Because the wiping was done by hand every time, no two prints pulled from the same carved block were exactly alike. ______ European printers of the same era who worked with engraved copper plates re-inked and hand-wiped each plate before every impression, so that the prints in an edition varied subtly from one to the next.',
    q: TQ,
    o: ['Conversely,', 'As a result,', 'Similarly,', 'In other words,'],
    a: 2,
    tr: ['opposite', 'wrongrel', null, 'wrongrel'],
    e: [
      '"Conversely," signals an opposite case, but the European prints also varied because of hand-wiping — the same situation, not its reverse.',
      '"As a result," implies Japanese practice caused European practice, a link the text never suggests.',
      'Correct: a second printing tradition shows the same pattern — hand-wiping before each impression produced prints that varied — so "Similarly," fits.',
      '"In other words," would restate the Japanese point, but the sentence moves to a different tradition on another continent.'
    ],
    d: { q: TD, o: ['Similarity', 'Contrast', 'Restatement / clarification', 'Cause → effect'], a: 0, why: 'A different tradition (European copper plates) shows the same hand-wiping and the same print-to-print variation.' },
  },
  {
    id: 'ei007', t: 'trans',
    p: 'In 1951, the chemist Lucia Ferrante proposed that certain clays might have served as scaffolds on which the earliest self-copying molecules assembled. The idea attracted little attention at first, in part because no one had shown that a clay surface could link molecular building blocks into chains. ______ laboratory experiments demonstrated that a common clay, montmorillonite, could promote the formation of RNA chains dozens of units long, and interest in Ferrante\'s proposal revived.',
    q: TQ,
    o: ['Before then,', 'For instance,', 'Similarly,', 'Decades later,'],
    a: 3,
    tr: ['opposite', 'wrongrel', 'wrongrel', null],
    e: [
      '"Before then," places the experiments earlier, but the proposal could not "revive" before it had been made and ignored — the order is reversed.',
      '"For instance," would introduce an example of the idea being ignored, but the experiments are what ended that neglect.',
      '"Similarly," signals a parallel, but the experiments are not like the neglect described — they changed the situation.',
      'Correct: the proposal was ignored for lack of evidence, and the evidence arrived later, reviving interest — a time sequence.'
    ],
    d: { q: TD, o: ['Addition (more of the same point)', 'Sequence in time', 'Example', 'Similarity'], a: 1, why: 'The proposal came first, was neglected, and then later experiments supplied the missing evidence and revived it.' },
  },
  {
    id: 'ei008', t: 'trans',
    p: 'Economists call a good "rivalrous" when one person\'s use of it diminishes what is available to others: an apple eaten by one person cannot be eaten by anyone else. A good is "excludable" when its owner can prevent others from using it. Broadcast radio is neither. ______ any number of listeners can tune in without weakening the signal available to anyone else, and a broadcaster has no practical way to stop a person with a receiver from listening.',
    q: TQ,
    o: ['That is,', 'For example,', 'Nonetheless,', 'Subsequently,'],
    a: 0,
    tr: [null, 'wrongrel', 'opposite', 'wrongrel'],
    e: [
      'Correct: the sentence spells out what "neither" means for radio — non-rivalrous (more listeners do not weaken it) and non-excludable (no way to block listeners).',
      '"For example," would offer an instance of a general claim, but radio is already the specific case; the sentence explains it rather than illustrating it.',
      '"Nonetheless," signals a contrast, but the sentence confirms "Broadcast radio is neither" rather than pushing against it.',
      '"Subsequently," signals a later event, but the sentence describes how radio works, not what happened next.'
    ],
    d: { q: TD, o: ['Restatement / clarification', 'Example', 'Contrast', 'Sequence in time'], a: 0, why: 'The sentence unpacks the short claim "Broadcast radio is neither" using the two definitions just given.' },
  },
  {
    id: 'ei009', t: 'trans',
    p: 'The architect Ines Varga argued that a building\'s beauty should arise entirely from its structure, and her designs left beams and columns exposed rather than concealing them behind ornament. ______ some of Varga\'s late buildings do include purely decorative elements, such as the patterned brick screens of her 1974 library. But these exceptions are few and small, and they hardly undermine the consistency of her structural approach.',
    q: TQ,
    o: ['Therefore,', 'Admittedly,', 'Furthermore,', 'Similarly,'],
    a: 1,
    tr: ['wrongrel', null, 'opposite', 'wrongrel'],
    e: [
      '"Therefore," presents the decorative screens as following from her belief in pure structure, when they actually go against it.',
      'Correct: the sentence grants an exception to Varga\'s principle, and the next sentence ("But...") pushes back — the classic concession pattern.',
      '"Furthermore," treats decoration as more support for her structural purity, which reverses its role as an exception.',
      '"Similarly," signals a parallel, but ornament is the opposite of her exposed-structure approach, not like it.'
    ],
    d: { q: TD, o: ['Cause → effect', 'Addition (more of the same point)', 'Concession (grants a point, then pushes back)', 'Example'], a: 2, why: 'The sentence admits an exception to Varga\'s principle, and the following "But" sentence downplays it.' },
  },
  {
    id: 'ei010', t: 'trans',
    p: 'Farmers in the Andean highlands of Peru often plant dozens of potato varieties in a single field, a practice outside experts once dismissed as inefficient. Agronomists now regard it as a sophisticated hedge against risk: because the varieties differ in their tolerance of frost, drought, and disease, a bad season rarely ruins an entire harvest. ______ in a three-year field study, plots containing more than twenty varieties never lost more than a third of their yield, even in a year when a nearby single-variety plot failed completely.',
    q: TQ,
    o: ['Indeed,', 'Still,', 'Otherwise,', 'Instead,'],
    a: 0,
    tr: [null, 'opposite', 'wrongrel', 'wrongrel'],
    e: [
      'Correct: the field study confirms and strengthens the claim that mixed plantings keep a bad season from ruining the harvest.',
      '"Still," signals a point that cuts against what came before, but the study supports the agronomists\' view rather than qualifying it.',
      '"Otherwise," means "if not," setting up what happens without the practice, but the study describes plots that used it.',
      '"Instead," signals a replacement, but the study replaces nothing; it backs up the previous claim.'
    ],
    d: { q: TD, o: ['Addition (more of the same point)', 'Contrast', 'Concession (grants a point, then pushes back)', 'Sequence in time'], a: 0, why: 'The study adds evidence pointing the same way as the agronomists\' claim about reduced risk.' },
  },
  {
    id: 'ei011', t: 'trans',
    p: 'In most frog species, eggs laid in water hatch into free-swimming tadpoles that undergo metamorphosis weeks or months later. Coquí frogs of Puerto Rico, which lay their eggs on leaves far from any pond, skip this stage: tiny but fully formed froglets emerge directly from the eggs. Many salamanders that lay their eggs on land develop in the same direct way. ______ most salamanders that breed in streams produce aquatic larvae, much as pond-breeding frogs do.',
    q: TQ,
    o: ['Likewise,', 'In other words,', 'By contrast,', 'Accordingly,'],
    a: 2,
    tr: ['opposite', 'wrongrel', null, 'wrongrel'],
    e: [
      '"Likewise," latches onto "much as pond-breeding frogs do," but a transition links to the sentence right before it, about land-laying salamanders that skip the larval stage — the stream breeders differ from them.',
      '"In other words," would restate the previous sentence, but stream salamanders with larvae are a different group with the opposite pattern.',
      'Correct: land-laying salamanders develop directly, whereas stream-breeding salamanders have aquatic larvae — a contrast with the sentence just before.',
      '"Accordingly," implies that direct development in land-laying salamanders causes stream breeders to have larvae, which makes no sense.'
    ],
    d: { q: TD, o: ['Similarity', 'Contrast', 'Cause → effect', 'Example'], a: 1, why: 'Compare to the sentence just before the blank: land-laying salamanders skip the larval stage, but stream breeders keep it.' },
  },
  {
    id: 'ei012', t: 'trans',
    p: 'Hanna Lindqvist made her photographs of 1890s Stockholm with a cumbersome glass-plate camera that required exposures of several seconds, so her street scenes are full of blurred pedestrians and ghostly carriages. Lindqvist regarded these blurs as defects and spent years trying to eliminate them. ______ modern critics often single out the blurs as the most striking feature of her work, arguing that they convey the bustle of city life more vividly than a sharp image could.',
    q: TQ,
    o: ['Consequently,', 'For instance,', 'Moreover,', 'Nevertheless,'],
    a: 3,
    tr: ['wrongrel', 'wrongrel', 'opposite', null],
    e: [
      '"Consequently," claims Lindqvist\'s dislike of the blurs caused critics to praise them, which is illogical.',
      '"For instance," would introduce an example of her efforts to remove the blurs, but critics praising the blurs is not such an example.',
      '"Moreover," would add another point in the same direction as her rejection of the blurs, but the critics take the opposite view.',
      'Correct: although Lindqvist saw the blurs as defects, critics now prize them — a contrast "Nevertheless," marks.'
    ],
    d: { q: TD, o: ['Cause → effect', 'Contrast', 'Addition (more of the same point)', 'Restatement / clarification'], a: 1, why: 'Lindqvist judged the blurs as flaws; modern critics judge them as strengths.' },
  },
  {
    id: 'ei013', t: 'trans',
    p: 'Because ice is less dense than liquid water, lakes freeze from the top down rather than from the bottom up. The surface layer of ice then acts as insulation, slowing further heat loss from the water beneath it. ______ even in regions with long, harsh winters, most lakes deeper than a few meters never freeze solid, and the fish and other organisms living in them survive until spring.',
    q: TQ,
    o: ['Even so,', 'As a result,', 'Similarly,', 'For example,'],
    a: 1,
    tr: ['opposite', null, 'wrongrel', 'wrongrel'],
    e: [
      '"Even so," treats the lakes not freezing solid as surprising, but the insulating ice layer is exactly what explains it — the "even" inside the sentence is bait.',
      'Correct: ice on top insulates the water, so deep lakes do not freeze solid — the sentence states the effect of the process described.',
      '"Similarly," signals a parallel phenomenon, but the sentence describes the outcome of the same process, not a similar one.',
      '"For example," would introduce an instance of insulation, but the sentence gives a consequence that follows from it.'
    ],
    d: { q: TD, o: ['Contrast', 'Example', 'Cause → effect', 'Similarity'], a: 2, why: 'The insulating ice layer explains why deep lakes stay liquid underneath; the new sentence is the outcome.' },
  },
  {
    id: 'ei014', t: 'trans',
    p: 'For decades, biologists assumed that the brilliant colors of poison frogs served chiefly to warn predators of the frogs\' toxicity. A field study of one Panamanian species, however, found that birds avoided its brightly colored frogs no more readily than they avoided its duller ones. ______ the colors appear to matter most to the frogs themselves: females in the study consistently chose mates whose coloring matched their own.',
    q: TQ,
    o: ['Instead,', 'Likewise,', 'In addition,', 'Thus,'],
    a: 0,
    tr: [null, 'opposite', 'wrongrel', 'wrongrel'],
    e: [
      'Correct: having undercut the warning-to-predators explanation, the text offers a replacement — the colors matter for mate choice — which "Instead," signals.',
      '"Likewise," signals that mate choice parallels the predator finding, but it replaces the predator explanation rather than resembling it.',
      '"In addition," would add a second function alongside predator warning, but the study suggests warning is not the main function at all.',
      '"Thus," claims the bird finding proves the mate-choice role, but birds\' behavior says nothing about what females prefer.'
    ],
    d: { q: TD, o: ['Contrast', 'Addition (more of the same point)', 'Similarity', 'Sequence in time'], a: 0, why: 'The study knocked out the old explanation, and the new sentence puts a different one in its place.' },
  },
  {
    id: 'ei015', t: 'trans',
    p: 'The novelist Teodora Vance revised her manuscripts in a way her editors found baffling: rather than polishing the prose of a finished draft, she rewrote each book from memory, without consulting earlier versions. ______ after completing a draft, she would lock it in a drawer and begin again on a blank page, reconstructing the entire novel from what she could recall of its plot and characters.',
    q: TQ,
    o: ['Nevertheless,', 'Similarly,', 'Earlier,', 'Specifically,'],
    a: 3,
    tr: ['opposite', 'wrongrel', 'wrongrel', null],
    e: [
      '"Nevertheless," signals a contrast, but the sentence describes the very method just mentioned rather than going against it.',
      '"Similarly," would introduce a separate, parallel practice, but this is the same practice described in detail.',
      '"Earlier," places these actions before the first sentence\'s process, but they are that process — and they happen "after completing a draft."',
      'Correct: the sentence details exactly what "rewrote each book from memory" looked like in practice.'
    ],
    d: { q: TD, o: ['Contrast', 'Restatement / clarification', 'Sequence in time', 'Similarity'], a: 1, why: 'Locking the draft away and starting over is the "rewrote from memory" method spelled out step by step.' },
  },
  {
    id: 'ei016', t: 'trans',
    p: 'During the unusually hot summer of 1858, the stench rising from the sewage-choked River Thames grew so overpowering that members of Parliament considered moving their sessions out of London. Within weeks, lawmakers approved funding for a vast network of intercepting sewers designed by the engineer Joseph Bazalgette. ______ Bazalgette\'s crews spent much of the next two decades building more than 1,000 miles of street sewers and some 80 miles of large intercepting sewers beneath the city.',
    q: TQ,
    o: ['Previously,', 'Conversely,', 'Subsequently,', 'Meanwhile,'],
    a: 2,
    tr: ['opposite', 'wrongrel', null, 'wrongrel'],
    e: [
      '"Previously," puts the construction before the funding vote, reversing the order the text establishes.',
      '"Conversely," signals an opposite situation, but building the sewers carries out the funding decision rather than opposing it.',
      'Correct: funding came first, and the construction followed over the next two decades — a sequence "Subsequently," marks.',
      '"Meanwhile," says the building happened at the same time as the funding vote, but decades of work cannot overlap a vote made "within weeks."'
    ],
    d: { q: TD, o: ['Sequence in time', 'Contrast', 'Example', 'Concession (grants a point, then pushes back)'], a: 0, why: 'The stench led to funding, and the sentence after the blank describes the construction that came after.' },
  },
  {
    id: 'ei017', t: 'trans',
    p: 'Many historians have described the craft guilds of medieval Europe as conservative bodies that stifled innovation by restricting who could practice a trade and how. To be sure, guild rules often fixed prices and limited the number of apprentices a master could train. ______ recent studies of guild records from Flanders and northern Italy show that guilds also spread new techniques, requiring traveling journeymen to learn methods from masters in several cities before they could qualify as masters themselves.',
    q: TQ,
    o: ['Indeed,', 'Nonetheless,', 'Hence,', 'For example,'],
    a: 1,
    tr: ['opposite', null, 'wrongrel', 'wrongrel'],
    e: [
      '"Indeed," would reinforce the "To be sure" concession, but the sentence instead turns against the stifling-innovation view.',
      'Correct: after conceding that guilds were restrictive, the text pushes back with evidence that they also spread new techniques.',
      '"Hence," presents spreading techniques as a result of fixing prices and limiting apprentices, which does not follow.',
      '"For example," would illustrate the restrictive rules, but spreading new techniques is not an instance of restriction.'
    ],
    d: { q: TD, o: ['Addition (more of the same point)', 'Example', 'Contrast', 'Cause → effect'], a: 2, why: '"To be sure" grants the restrictive side; the new sentence shows guilds doing the opposite of stifling innovation.' },
  },
  {
    id: 'ei018', t: 'trans',
    p: 'Cane toads, an invasive species in northern Australia, are so toxic that many native predators die after a single attempt to eat one. In one experiment, however, researchers found that young northern quolls fed toad meat laced with a chemical causing temporary nausea afterward avoided live toads. ______ quolls that received this training before being released into toad-infested areas survived significantly longer than untrained quolls released alongside them.',
    q: TQ,
    o: ['Nevertheless,', 'In comparison,', 'Similarly,', 'Accordingly,'],
    a: 3,
    tr: ['opposite', 'recycled', 'wrongrel', null],
    e: [
      '"Nevertheless," treats the longer survival as unexpected, but it is just what learning to avoid toads would produce.',
      '"In comparison," echoes the trained-versus-untrained comparison inside the sentence, but the sentence\'s link to what came before is causal, not a comparison.',
      '"Similarly," signals a parallel finding, but longer survival is the payoff of the avoidance learning, not a similar result.',
      'Correct: because trained quolls learned to avoid toads, they survived longer — a consequence "Accordingly," marks.'
    ],
    d: { q: TD, o: ['Contrast', 'Cause → effect', 'Similarity', 'Restatement / clarification'], a: 1, why: 'Learning to avoid toads is the reason the trained quolls lived longer.' },
  },

  // ===================== RHETORICAL SYNTHESIS =====================
  {
    id: 'ei019', t: 'synth',
    p: NOTES +
      '• The theremin, invented by Leon Theremin in 1920, is played without being touched; the performer moves both hands near two metal antennas.\n' +
      '• The ondes Martenot, invented by Maurice Martenot in 1928, is played with a keyboard and a ring worn on the finger that slides along a wire.\n' +
      '• Both instruments produce sound electronically, using oscillators.\n' +
      '• Both instruments let performers glide continuously from one pitch to another.\n' +
      '• The theremin was featured in many science-fiction film scores of the 1950s.\n' +
      '• The ondes Martenot is prominent in Olivier Messiaen\'s Turangalîla-Symphonie (1949).',
    q: SQ('emphasize a similarity between the theremin and the ondes Martenot'),
    o: [
      'Though played very differently, the theremin and the ondes Martenot both produce sound electronically and let performers glide continuously between pitches.',
      'The theremin is played by moving the hands near two antennas, whereas the ondes Martenot is played with a keyboard and a sliding finger ring.',
      'The ondes Martenot, invented by Maurice Martenot in 1928, produces sound electronically and is prominent in Messiaen\'s Turangalîla-Symphonie.',
      'The theremin was featured in many 1950s science-fiction film scores, while the ondes Martenot is prominent in a 1949 symphony by Messiaen.'
    ],
    a: 0,
    tr: [null, 'goalmiss', 'half', 'goalmiss'],
    e: [
      'Correct: it names two shared features — electronic sound and continuous gliding between pitches — and frames them as common to both instruments.',
      'Accurate, but it emphasizes how the two instruments differ in playing technique, the opposite of the goal.',
      'Mentions electronic sound, but only for the ondes Martenot; with no comparison to the theremin, no similarity is emphasized.',
      'Accurate, but "while" sets up a contrast between their different uses rather than a shared trait.'
    ],
    d: { q: SD, o: ['State a trait the two instruments share', 'Explain how each instrument is played', 'Name famous works featuring each instrument'], a: 0, why: 'A similarity means a trait true of both, presented as shared.' },
  },
  {
    id: 'ei020', t: 'synth',
    p: NOTES +
      '• The saguaro cactus and the creosote bush are both native to the Sonoran Desert.\n' +
      '• The saguaro stores water in its pleated stem, which expands as it fills.\n' +
      '• After a single heavy rain, a large saguaro can absorb about 200 gallons of water.\n' +
      '• The creosote bush does not store large amounts of water.\n' +
      '• Instead, the creosote bush survives drought by tolerating extreme dehydration; its leaves can lose much of their water without dying.',
    q: SQ('emphasize a difference in how the two plants survive drought'),
    o: [
      'The saguaro cactus, which stores water in its pleated stem, and the creosote bush are both plants native to the Sonoran Desert.',
      'After a single heavy rain, a large saguaro can absorb about 200 gallons of water, storing it in its expandable pleated stem.',
      'Whereas the saguaro survives dry periods by storing water in its expandable stem, the creosote bush stores little water and instead tolerates extreme dehydration.',
      'The creosote bush, a Sonoran Desert native, survives drought by tolerating extreme dehydration; its leaves can lose much of their water without dying.'
    ],
    a: 2,
    tr: ['goalmiss', 'goalmiss', null, 'half'],
    e: [
      'Accurate, but its main claim is something the plants share; it never says how the creosote bush survives, so no difference is shown.',
      'Describes only the saguaro\'s strategy, so there is no difference between the two plants.',
      'Correct: it sets the saguaro\'s storage strategy directly against the creosote bush\'s dehydration-tolerance strategy.',
      'Gives the creosote bush\'s strategy but never mentions the saguaro, so the contrast is only half there.'
    ],
    d: { q: SD, o: ['Show what the two plants have in common', 'Contrast the two plants\' drought strategies', 'Describe one plant\'s water capacity in detail'], a: 1, why: 'The goal asks for a difference, and specifically a difference in drought survival.' },
  },
  {
    id: 'ei021', t: 'synth',
    p: NOTES +
      '• Kintsugi is a Japanese technique for repairing broken pottery.\n' +
      '• The cracks are joined with lacquer mixed with powdered gold or silver.\n' +
      '• The repairs are left visible rather than hidden.\n' +
      '• The practice is often traced to the late fifteenth century.\n' +
      '• A 2019 exhibition at the Hollis Museum displayed forty bowls repaired with kintsugi.',
    q: SQ('introduce kintsugi to an audience unfamiliar with it'),
    o: [
      'A 2019 exhibition at the Hollis Museum displayed forty bowls that had been repaired using the technique of kintsugi.',
      'Kintsugi, which is often traced to the late fifteenth century, leaves its repairs visible rather than hiding them.',
      'Japanese artisans repair broken pottery by joining the cracks with lacquer mixed with gold or silver, leaving the repairs visible.',
      'Kintsugi, a Japanese technique for repairing broken pottery, joins cracks with lacquer mixed with powdered gold or silver.'
    ],
    a: 3,
    tr: ['goalmiss', 'half', 'goalmiss', null],
    e: [
      'Assumes the reader already knows what kintsugi is; it reports an exhibition instead of explaining the technique.',
      'Names kintsugi but never says it repairs pottery or what materials it uses, so an unfamiliar reader still does not know what it is.',
      'Describes the technique well but never names it, so the reader is not introduced to "kintsugi" at all.',
      'Correct: it names kintsugi and explains what it is (a Japanese pottery-repair technique) and how it works.'
    ],
    d: { q: SD, o: ['Report a recent event involving kintsugi', 'Name kintsugi and explain what it is', 'Give the history of Japanese pottery'], a: 1, why: 'A reader who has never heard of kintsugi needs both the name and a basic definition.' },
  },
  {
    id: 'ei022', t: 'synth',
    p: NOTES +
      '• Ecologist Amara Osei studied red foxes living in the city of Leeford.\n' +
      '• She wanted to know whether foxes in densely built neighborhoods were bolder toward unfamiliar objects than foxes in the city\'s parks.\n' +
      '• At 40 locations, she placed an unfamiliar object, such as a plastic bucket, near a site where foxes fed.\n' +
      '• Foxes in dense neighborhoods approached the objects sooner, on average, than foxes in parks did.\n' +
      '• Osei suggested that such boldness may help urban foxes exploit human food sources.',
    q: SQ('present the aim of Osei\'s study'),
    o: [
      'Osei found that, on average, foxes in Leeford\'s dense neighborhoods approached unfamiliar objects sooner than foxes in the city\'s parks did.',
      'Osei set out to learn whether foxes in Leeford\'s dense neighborhoods were bolder toward unfamiliar objects than foxes in its parks.',
      'At 40 locations in Leeford, Osei placed an unfamiliar object, such as a plastic bucket, near a site where foxes fed.',
      'Osei suggested that boldness toward unfamiliar objects may help urban foxes exploit human food sources.'
    ],
    a: 1,
    tr: ['truenot', null, 'goalmiss', 'goalmiss'],
    e: [
      'Accurate, but this is the study\'s result, not what it set out to investigate — the most tempting near-miss.',
      'Correct: it states the question Osei was trying to answer before any results came in.',
      'Accurate, but this describes the method, not the aim.',
      'Accurate, but this is Osei\'s interpretation of the results, not the purpose of the study.'
    ],
    d: { q: SD, o: ['State what the study found', 'State what the study set out to find out', 'Describe how the study was carried out', 'Explain why the results matter'], a: 1, why: '"Aim" means the question the researcher wanted to answer, not the method, finding, or interpretation.' },
  },
  {
    id: 'ei023', t: 'synth',
    p: NOTES +
      '• Cross-laminated timber (CLT) consists of layers of lumber glued together at right angles.\n' +
      '• CLT panels are manufactured off-site and assembled at the building site.\n' +
      '• Assembling prefabricated CLT panels can shorten construction time compared with pouring concrete on site.\n' +
      '• Producing CLT generally emits less carbon dioxide than producing an equivalent amount of steel or concrete.\n' +
      '• Some building codes limit the height of CLT buildings because of fire-safety concerns.',
    q: SQ('explain an environmental advantage of CLT over conventional building materials'),
    o: [
      'Because CLT panels are manufactured off-site, assembling them can shorten construction time compared with pouring concrete on site.',
      'Cross-laminated timber, which is manufactured off-site, consists of layers of lumber glued together at right angles.',
      'Producing cross-laminated timber generally emits less carbon dioxide than producing an equivalent amount of steel or concrete.',
      'Although some codes limit the height of CLT buildings because of fire-safety concerns, CLT panels can be assembled quickly.'
    ],
    a: 2,
    tr: ['goalmiss', 'goalmiss', null, 'truenot'],
    e: [
      'An advantage over concrete, but a time advantage, not an environmental one — the trap that matches "advantage" and ignores "environmental."',
      'Accurate description of what CLT is, but it states no advantage of any kind.',
      'Correct: lower carbon dioxide emissions than steel or concrete is an environmental advantage over conventional materials.',
      'Mentions a drawback and a speed benefit; neither is an environmental advantage.'
    ],
    d: { q: SD, o: ['Show CLT is faster to build with', 'Show CLT is better for the environment than steel or concrete', 'Explain how CLT is made'], a: 1, why: 'Both qualifiers matter: the advantage must be environmental and must be relative to conventional materials.' },
  },
  {
    id: 'ei024', t: 'synth',
    p: NOTES +
      '• Bioluminescence is light produced by a chemical reaction within a living organism.\n' +
      '• Many deep-sea animals are bioluminescent.\n' +
      '• Marine organisms use bioluminescence for purposes that include attracting prey, deterring predators, and finding mates.\n' +
      '• Deep-sea anglerfish dangle a glowing lure to attract prey.\n' +
      '• Some shrimp release a glowing cloud to startle predators.\n' +
      '• Ostracods, tiny crustaceans, produce patterns of light to attract mates.',
    q: SQ('make a generalization about the functions of bioluminescence in marine organisms'),
    o: [
      'Marine organisms use bioluminescence for a range of purposes, including attracting prey, deterring predators, and finding mates.',
      'Bioluminescence, which many deep-sea animals display, is light produced by a chemical reaction within a living organism.',
      'Deep-sea anglerfish use bioluminescence to attract prey, dangling a glowing lure in front of their mouths.',
      'Some shrimp release a glowing cloud to startle predators, while ostracods produce patterns of light to attract mates.'
    ],
    a: 0,
    tr: [null, 'half', 'goalmiss', 'goalmiss'],
    e: [
      'Correct: it makes a broad statement about what marine organisms in general use bioluminescence for.',
      'A generalization, but about what bioluminescence is, not about its functions.',
      'About functions, but only one species — a specific case, not a generalization.',
      'Gives two specific examples of functions without stating a general claim about marine organisms.'
    ],
    d: { q: SD, o: ['A broad statement about what bioluminescence is used for', 'A definition of bioluminescence', 'One vivid example of a glowing animal'], a: 0, why: 'A generalization covers marine organisms broadly, and the topic must be functions.' },
  },
  {
    id: 'ei025', t: 'synth',
    p: NOTES +
      '• Botanist Lars Henning studied pollination of the arctic marsh orchid.\n' +
      '• Bumblebees are the most common pollinators in the orchid\'s habitat.\n' +
      '• Henning expected bumblebees to be the orchid\'s main pollinators.\n' +
      '• Using motion-triggered cameras, he recorded visitors to 120 flowers over two summers.\n' +
      '• Nearly all pollen transfer was carried out by small flies.\n' +
      '• Bumblebees visited the flowers but rarely contacted the pollen.',
    q: SQ('emphasize how Henning\'s results differed from his expectations'),
    o: [
      'Henning used motion-triggered cameras to record the visitors to 120 arctic marsh orchid flowers over two summers.',
      'Henning found that nearly all pollen transfer was carried out by small flies and that bumblebees rarely contacted the pollen.',
      'Bumblebees are the most common pollinators in the arctic marsh orchid\'s habitat, so Henning expected them to be its main pollinators.',
      'Henning expected bumblebees to be the orchid\'s main pollinators, but nearly all of its pollen transfer was carried out by small flies.'
    ],
    a: 3,
    tr: ['goalmiss', 'half', 'half', null],
    e: [
      'Accurate description of the method; it says nothing about expectations or results.',
      'Gives the results only; without the expectation, the reader cannot see that they were surprising.',
      'Gives the expectation (and its basis) only; the results that overturned it are missing.',
      'Correct: it pairs the expectation (bumblebees) with the contrary result (flies), using "but" to stress the gap.'
    ],
    d: { q: SD, o: ['Describe the study\'s method', 'Set the expected result against the actual result', 'List all the orchid\'s visitors'], a: 1, why: '"Differed from expectations" needs both the expectation and the result, shown in contrast.' },
  },
  {
    id: 'ei026', t: 'synth',
    p: NOTES +
      '• Fog collectors are large mesh nets set up in places where fog is frequent.\n' +
      '• As fog blows through the mesh, tiny water droplets collect on the fibers.\n' +
      '• The droplets merge into larger drops that run down into a trough.\n' +
      '• The trough channels the water into storage tanks.\n' +
      '• Communities in several dry coastal regions use fog collectors to supplement their water supplies.\n' +
      '• On a foggy day, a single large collector can yield hundreds of liters of water.',
    q: SQ('explain how a fog collector produces usable water'),
    o: [
      'Fog collectors, large mesh nets set up where fog is frequent, help communities in several dry coastal regions supplement their water.',
      'As fog passes through the mesh, droplets collect on the fibers and merge into larger drops, which run into a trough that feeds storage tanks.',
      'On a foggy day, a single large fog collector—a mesh net set up where fog is frequent—can yield hundreds of liters of water.',
      'When fog blows through a fog collector\'s mesh net, tiny droplets of water collect on the net\'s fibers.'
    ],
    a: 1,
    tr: ['goalmiss', null, 'goalmiss', 'half'],
    e: [
      'Says what fog collectors are and who uses them, not how they work.',
      'Correct: it walks through the whole process from fog to droplets to drops to trough to storage, ending with usable water.',
      'Gives how much water a collector produces, not how it produces it.',
      'Describes only the first step; it never explains how the droplets become stored, usable water.'
    ],
    d: { q: SD, o: ['Describe the process step by step', 'Say where fog collectors are used', 'Give the amount of water collected'], a: 0, why: '"How" a collector produces water is a process, and it must reach "usable" water.' },
  },
  {
    id: 'ei027', t: 'synth',
    p: NOTES +
      '• The Amazon River flows through Peru, Colombia, and Brazil.\n' +
      '• It discharges more water into the ocean than any other river.\n' +
      '• Its average discharge is about 209,000 cubic meters per second.\n' +
      '• That is more than the discharge of the next seven largest rivers combined.\n' +
      '• The river\'s fresh water can lower the salinity of the Atlantic Ocean hundreds of kilometers from its mouth.\n' +
      '• Geographers debate whether the Amazon or the Nile is the world\'s longest river.',
    q: SQ('emphasize the size of the Amazon\'s discharge relative to that of other rivers'),
    o: [
      'The Amazon, which flows through Peru, Colombia, and Brazil, discharges an average of about 209,000 cubic meters of water per second.',
      'Geographers debate whether the Amazon or the Nile is the longest river in the world, a question that remains unsettled.',
      'The Amazon\'s average discharge, about 209,000 cubic meters per second, is greater than that of the next seven largest rivers combined.',
      'The fresh water the Amazon discharges can lower the salinity of the Atlantic Ocean hundreds of kilometers from the river\'s mouth.'
    ],
    a: 2,
    tr: ['half', 'goalmiss', null, 'goalmiss'],
    e: [
      'Gives the discharge figure but no comparison to other rivers, so nothing is "relative."',
      'Compares the Amazon with another river, but on length, not discharge — a comparison on the wrong measure.',
      'Correct: it gives the discharge and measures it against the next seven largest rivers combined.',
      'Shows an effect of the discharge, not how it compares with other rivers.'
    ],
    d: { q: SD, o: ['Compare the Amazon\'s discharge with other rivers\'', 'Give the Amazon\'s discharge as a single number', 'Compare the Amazon\'s length with the Nile\'s'], a: 0, why: '"Relative to other rivers" means the discharge must be compared, not just stated.' },
  },
  {
    id: 'ei028', t: 'synth',
    p: NOTES +
      '• Many cities have replaced sodium-vapor streetlights with LED streetlights.\n' +
      '• LED streetlights use roughly half as much electricity as sodium-vapor lights.\n' +
      '• LED streetlights last much longer, which reduces maintenance costs.\n' +
      '• Many LED streetlights emit more blue light than sodium-vapor lights do.\n' +
      '• Blue-rich light at night can disrupt the behavior of nocturnal insects and migrating birds.\n' +
      '• Some cities now install "warm" LEDs that emit less blue light.',
    q: SQ('present an environmental drawback of LED streetlights'),
    o: [
      'Many LED streetlights emit more blue light than sodium-vapor lights do, and blue-rich light at night can disrupt nocturnal insects and migrating birds.',
      'LED streetlights use roughly half as much electricity as sodium-vapor lights, and they last much longer, which reduces maintenance costs.',
      'Some cities that have replaced sodium-vapor streetlights with LEDs now install "warm" LEDs, which emit less blue light.',
      'Many cities have replaced sodium-vapor streetlights with LED streetlights, which last much longer and use less electricity.'
    ],
    a: 0,
    tr: [null, 'opposite', 'half', 'goalmiss'],
    e: [
      'Correct: it links LEDs\' greater blue-light output to disruption of insects and birds — an environmental drawback.',
      'Accurate, but it presents advantages of LEDs, the reverse of a drawback.',
      'Describes a remedy for the problem without ever stating the problem itself.',
      'Accurate background plus advantages; no drawback is presented.'
    ],
    d: { q: SD, o: ['Name a benefit of LED lights', 'Name a harm LED lights can do to the environment', 'Describe what cities are doing about LED lights'], a: 1, why: 'A drawback is a negative, and it must be environmental.' },
  },
  {
    id: 'ei029', t: 'synth',
    p: NOTES +
      '• Marisol Ibarra (1921–1988) wrote poetry in Spanish; Henrik Aalto (1930–2001) wrote poetry in Finnish.\n' +
      '• Ibarra\'s collection Salt Ledger (1962) consists entirely of poems shaped as lists and inventories.\n' +
      '• Aalto\'s collection Census of Birches (1971) is likewise built from lists, catalogues, and counts of objects.\n' +
      '• Ibarra\'s poems mostly concern the fishing villages of her childhood.\n' +
      '• Aalto\'s poems mostly concern forestry work in eastern Finland.\n' +
      '• Ibarra won a national poetry prize in 1965; Aalto never won a major award.',
    q: SQ('emphasize a similarity between Salt Ledger and Census of Birches'),
    o: [
      'Ibarra\'s Salt Ledger mostly concerns fishing villages, whereas Aalto\'s Census of Birches mostly concerns forestry work in eastern Finland.',
      'Ibarra, who wrote Salt Ledger in Spanish, won a national poetry prize in 1965, while Aalto, who wrote in Finnish, never won a major award.',
      'Published in 1962, Ibarra\'s collection Salt Ledger consists entirely of poems shaped as lists and inventories.',
      'Like Ibarra\'s Salt Ledger, which consists of poems shaped as lists, Aalto\'s Census of Birches is built from lists and catalogues.'
    ],
    a: 3,
    tr: ['goalmiss', 'goalmiss', 'half', null],
    e: [
      'Accurate, but "whereas" emphasizes a difference in subject matter.',
      'Accurate, but it contrasts the poets\' languages and awards — a difference, and about the poets rather than the collections.',
      'Describes the list form of only one collection, so no similarity between the two is shown.',
      'Correct: "Like" explicitly presents the list-based form as shared by both collections.'
    ],
    d: { q: SD, o: ['Show how the two collections\' subjects differ', 'Show a feature both collections share', 'Compare the two poets\' careers'], a: 1, why: 'A similarity between the collections must be a feature true of both books.' },
  },
  {
    id: 'ei030', t: 'synth',
    p: NOTES +
      '• In 2018, archaeologists led by Rosa Quispe excavated the site of Huaca Ventana in coastal Peru.\n' +
      '• They uncovered an adobe wall decorated with painted fish.\n' +
      '• The paint was made from crushed minerals mixed with plant resin.\n' +
      '• Radiocarbon dating of the plant resin indicated that the wall was painted around 1000 BCE.\n' +
      '• The team believes the wall was part of a temple.',
    q: SQ('explain how the researchers determined when the wall was painted'),
    o: [
      'In 2018, archaeologists led by Rosa Quispe uncovered a painted adobe wall at Huaca Ventana, a site in coastal Peru.',
      'By radiocarbon dating the plant resin in the wall\'s paint, Quispe\'s team determined that it was painted around 1000 BCE.',
      'The paint on the wall at Huaca Ventana, which dates to around 1000 BCE, was made from crushed minerals mixed with plant resin.',
      'Quispe\'s team believes that the adobe wall at Huaca Ventana, which is decorated with painted fish, was part of a temple.'
    ],
    a: 1,
    tr: ['goalmiss', null, 'half', 'goalmiss'],
    e: [
      'Tells when the wall was found, not how its painting was dated — a "when" trap.',
      'Correct: it names the method (radiocarbon dating of the resin) and the date it produced.',
      'Gives the date and mentions the resin but never says how the date was determined.',
      'Gives the team\'s interpretation of the wall\'s purpose, not its dating method.'
    ],
    d: { q: SD, o: ['Say when the wall was discovered', 'Name the method used to date the painting', 'Describe what the wall looks like'], a: 1, why: 'The goal asks how the date was determined, so the method is required.' },
  },
  {
    id: 'ei031', t: 'synth',
    p: NOTES +
      '• In 1900, about 40 percent of US workers were employed in agriculture.\n' +
      '• By 2000, that share had fallen to below 2 percent.\n' +
      '• Total US farm output rose substantially over the same period.\n' +
      '• Mechanization, including tractors and combines, allowed fewer workers to farm more land.\n' +
      '• Many people who left farm work moved to cities for manufacturing jobs.',
    q: SQ('emphasize how much the share of US workers employed in agriculture changed during the twentieth century'),
    o: [
      'Mechanization, including the use of tractors and combines, allowed fewer US agricultural workers to farm more land.',
      'About 40 percent of US workers were employed in agriculture in 1900, at the start of the twentieth century.',
      'The share of US workers employed in agriculture fell from about 40 percent in 1900 to below 2 percent by 2000.',
      'Total US farm output rose substantially between 1900 and 2000, even as many people left farm work for jobs in cities.'
    ],
    a: 2,
    tr: ['goalmiss', 'half', null, 'goalmiss'],
    e: [
      'Explains a cause of the change without showing its size.',
      'Gives only the starting share, so the extent of the change cannot be seen.',
      'Correct: the before-and-after figures (about 40 percent to below 2 percent) show the scale of the change directly.',
      'About farm output and migration, not the change in agriculture\'s share of workers.'
    ],
    d: { q: SD, o: ['Explain why farm work declined', 'Show the start and end values of the share', 'Describe what happened to farm output'], a: 1, why: '"How much it changed" needs both endpoints so the size of the drop is visible.' },
  },
  {
    id: 'ei032', t: 'synth',
    p: NOTES +
      '• Scientists have traditionally surveyed river fish by electrofishing: briefly stunning fish with an electric current and then counting them.\n' +
      '• Electrofishing requires a trained crew and can injure some fish.\n' +
      '• Environmental DNA (eDNA) sampling detects species from traces of DNA they shed into the water.\n' +
      '• An eDNA survey requires only water samples, which volunteers can collect after brief training.\n' +
      '• eDNA sampling cannot reliably indicate how many individuals of a species are present.\n' +
      '• Laboratories identify species in eDNA samples by matching DNA fragments to reference sequences.',
    q: SQ('emphasize an advantage of eDNA sampling over electrofishing'),
    o: [
      'Unlike electrofishing, which needs a trained crew and can injure fish, eDNA sampling requires only water samples that volunteers can collect.',
      'eDNA sampling detects fish species from DNA they shed into the water, though it cannot reliably indicate how many fish are present.',
      'Electrofishing, the traditional method of surveying river fish, involves briefly stunning fish with an electric current and counting them.',
      'In eDNA sampling, laboratories identify the species present by matching DNA fragments in the water to reference sequences.'
    ],
    a: 0,
    tr: [null, 'opposite', 'goalmiss', 'goalmiss'],
    e: [
      'Correct: it sets eDNA\'s easy, harmless sampling directly against electrofishing\'s crew requirement and risk of injury.',
      'Ends on a limitation of eDNA — a point where electrofishing, which counts fish, has the edge, the reverse of the goal.',
      'Describes only the traditional method; no advantage of eDNA is mentioned.',
      'Explains how eDNA samples are analyzed but never compares eDNA with electrofishing.'
    ],
    d: { q: SD, o: ['Explain how eDNA works', 'Show a way eDNA beats electrofishing', 'Describe a weakness of eDNA'], a: 1, why: 'The sentence must make eDNA look better than electrofishing on some point.' },
  },
  {
    id: 'ei033', t: 'synth',
    p: NOTES +
      '• Ama Boateng (born 1968) is a Ghanaian-born textile artist.\n' +
      '• Her 2015 work Harbor Index is a 30-foot-long tapestry.\n' +
      '• It is woven from strips of discarded fishing nets collected on beaches near Accra.\n' +
      '• Its design maps the stretch of coastline where the nets were found.\n' +
      '• Harbor Index was acquired by the Lachance Museum in Montreal in 2019.',
    q: SQ('introduce Harbor Index to an audience unfamiliar with Boateng'),
    o: [
      'Boateng\'s Harbor Index, which is woven from discarded fishing nets, was acquired by the Lachance Museum in Montreal in 2019.',
      'Born in Ghana in 1968, Ama Boateng is a textile artist whose work includes a tapestry thirty feet long.',
      'Harbor Index (2015), by Ghanaian-born textile artist Ama Boateng, is a tapestry woven from discarded fishing nets.',
      'Woven from discarded fishing nets found near Accra, the 30-foot-long Harbor Index maps the coastline where they were found.'
    ],
    a: 2,
    tr: ['half', 'goalmiss', null, 'goalmiss'],
    e: [
      'Describes the work but refers to "Boateng" as if the reader already knows who she is.',
      'Introduces the artist and alludes to a tapestry, but never names or describes Harbor Index, the work the goal is about.',
      'Correct: it presents the work and identifies the artist with the context an unfamiliar reader needs.',
      'Describes the tapestry vividly but never names the artist, which an audience unfamiliar with her needs.'
    ],
    d: { q: SD, o: ['Describe the work and identify who made it', 'Give a short biography of Boateng', 'Report where the work is displayed'], a: 0, why: 'The focus is the work, but readers do not know Boateng, so she must be identified, not just named.' },
  },
  {
    id: 'ei034', t: 'synth',
    p: NOTES +
      '• Botanist Keiko Arai compared leaves from sugar maples grown in full sun with leaves from sugar maples grown in deep shade.\n' +
      '• The sun-grown and shade-grown trees were the same age.\n' +
      '• Both groups of trees grew in the same type of soil.\n' +
      '• Sun leaves were, on average, 40 percent thicker than shade leaves.\n' +
      '• Shade leaves had about 30 percent more surface area than sun leaves.\n' +
      '• Shade leaves contained more chlorophyll per gram of tissue than sun leaves.',
    q: SQ('emphasize a similarity between the two groups of trees in Arai\'s study'),
    o: [
      'In Arai\'s study, leaves from sugar maples grown in full sun were, on average, 40 percent thicker than leaves from trees grown in shade.',
      'Shade leaves in Arai\'s study had about 30 percent more surface area than sun leaves, as well as more chlorophyll per gram.',
      'Botanist Keiko Arai compared leaves from sugar maples grown in full sun with leaves from sugar maples grown in deep shade.',
      'The sun-grown and shade-grown sugar maples in Arai\'s study were the same age and grew in the same type of soil.'
    ],
    a: 3,
    tr: ['goalmiss', 'goalmiss', 'truenot', null],
    e: [
      'A difference between the groups (leaf thickness), not a similarity.',
      'Two more differences (surface area and chlorophyll), not a similarity.',
      'Describes the study\'s setup without stating anything the groups had in common.',
      'Correct: age and soil type are traits the two groups shared.'
    ],
    d: { q: SD, o: ['Show how sun and shade leaves differ', 'Show what the two groups of trees had in common', 'Describe what Arai measured'], a: 1, why: 'Most notes are differences; the goal asks for the few things both groups shared.' },
  },
  {
    id: 'ei035', t: 'synth',
    p: NOTES +
      '• Loanwords are words adopted from one language into another.\n' +
      '• Borrowed words often change meaning after they are adopted.\n' +
      '• Japanese "manshon," from English "mansion," refers to an ordinary apartment building, not a large house.\n' +
      '• Some loanwords keep their original meaning, such as English "tsunami," from Japanese.\n' +
      '• English contains many loanwords from French, Latin, and Old Norse.',
    q: SQ('use an example to illustrate the claim that borrowed words often change meaning'),
    o: [
      'Some loanwords keep their original meaning: English "tsunami," for example, was borrowed from Japanese without changing meaning.',
      'Borrowed words often shift in meaning: Japanese "manshon," from English "mansion," refers to an ordinary apartment building.',
      'English contains many loanwords, words adopted from one language into another, from French, Latin, and Old Norse.',
      'Loanwords, which are words adopted from one language into another, often change meaning after they are adopted.'
    ],
    a: 1,
    tr: ['opposite', null, 'goalmiss', 'half'],
    e: [
      'Uses an example, but one that illustrates the reverse of the claim — a loanword that kept its meaning.',
      'Correct: it states the claim and supports it with a specific word whose meaning changed.',
      'Mentions loanwords in English but neither states the claim nor gives a word that changed meaning.',
      'States the claim but gives no example, so it does not illustrate it.'
    ],
    d: { q: SD, o: ['State the claim with no example', 'Pair the claim with a word whose meaning changed', 'Give any example of a loanword'], a: 1, why: 'The goal needs both the claim and an example that actually fits it.' },
  },
  {
    id: 'ei036', t: 'synth',
    p: NOTES +
      '• The hoatzin is a bird found in swamps and river forests of the Amazon and Orinoco basins.\n' +
      '• It feeds almost entirely on leaves.\n' +
      '• It is the only bird known to digest food mainly through bacterial fermentation in an enlarged crop, much as cows do in their rumens.\n' +
      '• Hoatzin chicks have two claws on each wing, which they use to climb.\n' +
      '• Adult hoatzins lose these wing claws.\n' +
      '• Hoatzins build their nests in branches that hang over water.',
    q: SQ('emphasize a trait that distinguishes the hoatzin from all other known birds'),
    o: [
      'The hoatzin is the only bird known to digest its food mainly through bacterial fermentation in an enlarged crop.',
      'The hoatzin, which feeds almost entirely on leaves, lives in swamps and river forests of the Amazon and Orinoco basins.',
      'Hoatzin chicks have two claws on each wing that they use for climbing, though adult hoatzins lose these claws.',
      'Hoatzins, which feed almost entirely on leaves, build their nests in branches that hang over the water.'
    ],
    a: 0,
    tr: [null, 'goalmiss', 'unsupported', 'goalmiss'],
    e: [
      'Correct: "the only bird known" is exactly what sets the hoatzin apart from all other known birds.',
      'Habitat and diet, but nothing in the notes says these are unique among birds.',
      'Striking, but the notes never say wing claws are unique to the hoatzin, so presenting it as the distinguishing trait is unsupported.',
      'Diet and nesting habits that the notes never present as unique to the hoatzin.'
    ],
    d: { q: SD, o: ['Describe where the hoatzin lives', 'Name something only the hoatzin does among birds', 'Describe an unusual trait of hoatzin chicks'], a: 1, why: '"Distinguishes from all other known birds" requires a trait the notes say is unique to it.' },
  },
];
