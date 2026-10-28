---
theme: default
title: Your First DJ Mix
info: |
  A ten-minute introduction to DJing for ages 8–16.
  Eleven slides, live demonstrations, and a first-transition challenge.
author: DJ Workshop
class: workshop-slide wordmark-slide
transition: fade
colorSchema: dark
fonts:
  provider: none
  sans: Iosevka
  mono: Iosevka
drawings:
  persist: false
---

<img class="wordmark" src="/afw-wordmark.svg" alt="A Friendly Wave" />

<nav class="title-toc" aria-label="Table of contents">
  <Link to="2">Tutorial</Link>
  <Link to="9">Software</Link>
  <Link to="10">Where to find Music</Link>
</nav>

<!--
TIME: 1 minute. Total elapsed: 1:00.

Before the session:
- Prepare two clean, age-appropriate tracks with clear, steady beats, similar tempos, and compatible musical sections. Check the actual lyrics and versions; do not rely only on a clean label.
- Use local, tested files or a tested supported source. Do not depend on a streaming login or internet access during the workshop.
- Rehearse the transition in djay with the controller you will use. The DDJ-400 is an example, not an assumption about every learner's setup.
- Verify djay/controller support, audio routing, headphone cueing, and crossfader assignment in advance. Controller integration and features can depend on the device, app version, and subscription.
- Set a comfortable speaker and headphone level before anyone presses Play. Everyone can ask for quieter sound or choose to watch.
- Have the demonstration loaded and ready; avoid spending the talk browsing the library.

SAY: “A DJ chooses recorded music and decides what comes next. Mixing is one way to connect those choices. You don't have to make your own songs to be a DJ.”

PLAY: A rehearsed 15–20-second example of a transition. Ask what changed; take one or two quick answers. No right vocabulary required.

MUSIC PLACEHOLDERS — replace before teaching:
Track A: [title / artist / source / chosen section]
Track B: [title / artist / source / chosen section]

Aim for curiosity rather than a polished-performance standard. Nobody has to dance or perform alone.
-->

---
class: workshop-slide photo-slide
title: Pioneer DJ DDJ-400 controller
---

<img src="/dj-controller.jpg" alt="Pioneer DJ DDJ-400 controller with two decks and a central mixer" />

---
class: workshop-slide
title: Meet your decks.
---

<div class="eyebrow">01 · TWO TRACKS, TWO DECKS</div>

# 2 Decks and a Mixer.

<DeckSetup />


<div class="slide-footer"><span>First Glimpse</span>
  <span>03 / 11</span></div>

<!--
TIME: 2 minutes. Total elapsed: 3:00.

SHOW: Point to the two on-screen decks in djay, then their matching controller sides. Each deck holds one track. The centre controls how the tracks reach the audience.

Use the actual screen/controller as the reference; the slide is deliberately a simplified diagram, not a screenshot or an exact DDJ-400 control map.

POINT OUT, without explaining every button:
1. Load/select a track. Do not load over a playing deck.
2. Play/Pause.
3. Each track's volume fader, then the master volume for the speakers.
4. Crossfader: left favours A, right favours B, middle blends both when correctly assigned.
5. Sync: helps match tempo and, depending on mode/settings, beat alignment.

For this workshop, prepare both track volume faders at a suitable level, both decks assigned to opposite crossfader sides, EQ neutral, effects off, and speaker volume comfortable. Do not imply the crossfader is the master volume.

SAY: “Sync is a helper, not a cheat. It can make the speeds match, but it can't choose a good song or listen for you.” Beat detection can be wrong; use rehearsed tracks with correct beat grids.

SCREENSHOT PLACEHOLDER: If useful, replace this diagram with a labelled screenshot of your actual djay layout. Capture it on the teaching device, omit account details, and label only the controls above.
-->

---
class: workshop-slide
title: Crossfade without beat matching.
---

<div class="eyebrow">02 · USING THE CROSSFADER</div>

# Crossfade from A to B.

<DeckSetup mode="transition" />

<div class="slide-footer"><span>NO BEAT MATCHING NEEDED</span><span>04 / 11</span></div>

<!--
DEMO: After introducing the decks, show a simple crossfade before explaining tempo. Play A to the room with the crossfader at A. Start B at a prepared, beat-light intro while A reaches a sparse outro, then move the crossfader toward B. Keep any overlap short so the beats do not clash. Do not use Sync or try to align the beats in this demonstration.

SAY: “You can move from one song to another without matching their beats. Listen for a good moment to make the switch.” This is a short demonstration within the deck-introduction time, not an extra timed section.
-->

---
class: workshop-slide
title: Find the beat.
---

<div class="eyebrow">03 · FINDING TEMPO</div>

# Find the beat and the '1'.

<p class="lead">The beat is the steady pulse you can tap along to.</p>

<div class="beat-row" aria-label="Count four steady beats: one, two, three, four">
  <div><strong>1</strong><span>TAP</span></div>
  <div><strong>2</strong><span>TAP</span></div>
  <div><strong>3</strong><span>TAP</span></div>
  <div><strong>4</strong><span>TAP</span></div>
</div>

<div class="concept-pair">
  <div><span class="tag">TEMPO / BPM</span><p>How fast the beat goes. (Beats Per Minute)</p></div>
  <!-- <div><span class="tag tag--pink">VOLUME</span><p>How loud the sound is.</p></div> -->
</div>

<div class="slide-footer"><span>TRY IT: TAP, NOD, OR COUNT ALONG</span><span>05 / 11</span></div>

<!--
TIME: 1 minute. Total elapsed: 4:00.

PLAY: A short section of Track A with a clear beat. Count “1, 2, 3, 4” twice and invite everyone to tap, nod, count silently, or simply listen.

SAY: “BPM means beats per minute. More beats in a minute means a faster tempo. Turning the volume up doesn't make the beat faster.”

Demonstrate a slow clap and a faster clap at roughly the same loudness. Keep it brief.

Counting four is a helpful starting pattern for the selected tracks, not a claim that every kind of music is counted in fours. Do not introduce time signatures, bars, or phrase matching in the core talk.
-->

---
class: workshop-slide
title: Listen before everyone else.
---

<div class="eyebrow">04 · USING YOUR HEADPHONES</div>

# Listen to next track.


<DeckSetup mode="preview" />

<div class="listen-callout"><span class="tag">HEADPHONE CUE</span> Check the next track before you mix it in.</div>

<div class="slide-footer"><span></span><span>06 / 11</span></div>

<!--
TIME: 1 minute. Total elapsed: 5:00.

DEMO:
- Keep A playing to the speakers and the crossfader fully toward A.
- Select B with the mixer headphone-CUE control. Set the headphone cue/master mix so B is audible in the headphones.
- At a low headphone level, briefly play B to check it while the room still hears only A. Pause and return B to the prepared starting point afterward.

SAY: “Headphones let you check what's next before everyone else hears it.”

Important distinction: headphone CUE selects what you hear privately. A deck's CUE button or a hot cue sets/returns to a track position; it is not the headphone routing control. Point to the correct control on your actual setup.

With one controller, the room won't hear B during this demonstration. Invite one volunteer to listen if practical, or narrate what you hear. Don't pretend the slide itself produces audio or routes headphones.
-->

---
class: workshop-slide
title: Crossfade from A to B.
---

<div class="eyebrow">05 · USING THE CROSSFADER</div>

# Crossfade from A to B.

<DeckSetup mode="transition" show-beats />

<div class="slide-footer"><span></span><span>07 / 11</span></div>

---
class: workshop-slide
title: Make your first transition.
---

<div class="eyebrow">06 · LET’S MIX TWO SONGS</div>

# Make your first transition.

<div class="transition-grid">
  <div class="step"><span class="step-number">1</span><div><h3>Choose Track B</h3><p>Track A is playing to the crowd.</p></div></div>
  <div class="step"><span class="step-number">2</span><div><h3>Preview Tempo + Find a '1'</h3><p>Listen to 'B' in headphones.</p></div></div>
  <div class="step"><span class="step-number">3</span><div><h3>Start on a 1</h3><p>Stop B, find '1', Play on A’s '1'.</p></div></div>
  <div class="step"><span class="step-number">4</span><div><h3>Blend across</h3><p>Move the crossfader slowly from A to B.</p></div></div>
</div>

<div class="listen-callout"><span class="tag">USE YOUR EARS</span> Does the change sound smooth? Adjust and try again.</div>

<div class="slide-footer"><span></span><span>08 / 11</span></div>

<!--
TIME: 4 minutes. Total elapsed: 9:00.

Use two preselected compatible tracks with obvious beats. Choose sections with enough space to blend, ideally without competing vocals. The first attempt need not be a long overlap. If the blend sounds messy, shorten it; do not add EQ lessons now.

DEMO 1 — narrate slowly, about 90 seconds:
1. With A playing and the crossfader at A, load B without interrupting A.
2. Set A as the tempo leader/master where required by your djay mode. Sync B to A. Preview B using headphone cue and check that the beats sound aligned.
3. Pause B after previewing and return it to a rehearsed starting point. Count with A, then start B on a beat (preferably the first beat of your four-count). Keep the crossfader at A until ready to blend.
4. Move the crossfader steadily toward B over a short musical section, listening as you go. Once fully at B and A is no longer audible, pause A.

DEMO 2 — audience calls the steps, about 90 seconds:
Reset to the starting state. Have the group tell you what comes next. Let them hear the transition again with less narration.

Last minute: ask “What did you listen for?” Take a couple of answers or retry a short section. Say “It doesn't have to be perfect. Listening and adjusting is the skill.”

Do not promise that Sync makes all tracks fit. Genre, rhythm, vocals, musical key, beat grids, and song structure can affect a mix. Save those details for future lessons.
-->

---
class: workshop-slide software-slide
title: DJ software options
---

# DJ software

<div class="software-choices">
  <section class="software-category software-category--free" aria-label="Free DJ software">
    <h2>Free</h2>
    <div class="software-logos">
      <a class="software-logo software-logo--byo software-link" href="https://mixxx.org/" target="_blank" rel="noopener noreferrer"><img src="/logos/mixxx.svg" alt="Mixxx logo" /><span class="software-caption">Mixxx</span><span class="software-controller-tag">BYO controller</span></a>
    </div>
  </section>
  <section class="software-category" aria-label="Paid DJ software">
    <h2>Paid</h2>
    <div class="software-logos">
      <a class="software-logo software-logo--byo software-link" href="https://www.algoriddim.com/djay-pro" target="_blank" rel="noopener noreferrer"><img src="/logos/djay.svg" alt="Algoriddim djay logo" /><span class="software-caption">Algoriddim djay</span><span class="software-controller-tag">BYO controller</span></a>
      <a class="software-logo software-link" href="https://serato.com/dj" target="_blank" rel="noopener noreferrer"><img src="/logos/serato.svg" alt="Serato logo" /></a>
      <a class="software-logo software-link" href="https://rekordbox.com/" target="_blank" rel="noopener noreferrer"><img src="/logos/rekordbox.svg" alt="rekordbox logo" /></a>
      <a class="software-logo software-link" href="https://www.native-instruments.com/en/products/traktor/dj-software/traktor-pro-4/" target="_blank" rel="noopener noreferrer"><img src="/logos/traktor.svg" alt="Traktor logo" /></a>
    </div>
  </section>
</div>

<div class="slide-footer"><span></span><span>09 / 11</span></div>

---
class: workshop-slide software-slide music-slide
title: Where to find music
---

# Where to find music

<div class="software-choices music-choices">
  <section class="software-category" aria-label="Free Music Archive">
    <h2>Free music</h2>
    <div class="software-logos">
      <a class="software-logo music-link music-link--free" href="https://freemusicarchive.org/genre/House/" target="_blank" rel="noopener noreferrer">
        <img src="/logos/fma.svg" alt="Free Music Archive logo" />
      </a>
    </div>
  </section>
  <section class="software-category" aria-label="Bandcamp">
    <h2>Discover artists</h2>
    <div class="software-logos">
      <a class="software-logo music-link" href="https://bandcamp.com/" target="_blank" rel="noopener noreferrer">
        <img src="/logos/bandcamp.svg" alt="Bandcamp logo" />
      </a>
    </div>
  </section>
</div>

<div class="slide-footer"><span>Check each track’s licence before sharing a mix</span><span>10 / 11</span></div>

---
class: workshop-slide photo-pair-slide gif-pair-slide
title: DJ workshop outro
---

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWZ3M3dyNTF2dGp4ZmhpcDEzbTBzZDZvbzd6bDYwdXBzeWNkNTNldCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mDGL3G97HPIh3X7OXe/giphy.gif" alt="Animated GIF on the left" />
<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWQzem9nc2MzZTVya2pvYnN0bjB3eWUxeGJyZ2FrOWNuZ2EydzZqZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f0AsTRFUf4L1I0NPrw/giphy.gif" alt="Animated GIF on the right" />
