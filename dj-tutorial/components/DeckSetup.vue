<script setup lang="ts">
import { useSlideContext } from "@slidev/client";
import { computed } from "vue";

withDefaults(
  defineProps<{
    mode?: "overview" | "preview" | "mix" | "transition";
    showBeats?: boolean;
  }>(),
  {
    mode: "overview",
    showBeats: false,
  },
);

const { $slidev, $page } = useSlideContext();
const isActive = computed(() => $slidev.nav.currentPage === $page.value);
</script>

<template>
  <div
    class="deck-setup"
    :class="[
      `deck-setup--${mode}`,
      {
        'deck-setup--active': isActive,
        'deck-setup--animating': mode === 'transition' && isActive,
      },
    ]"
    aria-label="Simplified two-deck DJ setup, not an exact software screenshot"
  >
    <div class="deck-card deck-card--a deck-card--audible">
      <div class="deck-heading">
        <span>DECK A</span>
        <span class="track-badge">
          <span class="deck-track--before">PLAYING</span>
          <span v-if="mode === 'transition'" class="deck-track--after"
            >UP NEXT</span
          >
        </span>
      </div>
      <div class="record"><span>A</span></div>
      <div class="deck-track">
        <span class="deck-track--before">NOW PLAYING</span>
        <span v-if="mode === 'transition'" class="deck-track--after"
          >FIND NEW TRACK</span
        >
      </div>
      <div class="waveform" aria-hidden="true"></div>
      <div class="deck-buttons"><span>▶ / Ⅱ</span></div>
    </div>
    <div class="mixer-card">
      <div class="mixer-label">MIXER</div>
      <div class="channel-levels" aria-hidden="true">
        <span></span><span></span>
      </div>
      <div class="mixer-small">Track volumes</div>
      <div class="crossfader"><span></span></div>
      <div class="crossfader-labels">
        <span>A</span><span>Crossfader</span>
        <span class="crossfader-b"
          >B
          <span
            v-if="mode === 'preview'"
            class="headphone-cue"
            aria-label="Deck B in headphones"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
              <path
                d="M3 14h4v7H5a2 2 0 0 1-2-2v-5Zm18 0h-4v7h2a2 2 0 0 0 2-2v-5Z"
              />
            </svg>
          </span>
        </span>
      </div>
    </div>
    <div
      class="deck-card deck-card--b"
      :class="{ 'deck-card--audible': mode === 'mix' }"
    >
      <div class="deck-heading">
        <span>DECK B</span>
        <span class="track-badge">
          <span class="deck-track--before">{{
            mode === "mix" ? "PLAYING" : "UP NEXT"
          }}</span>
          <span v-if="mode === 'transition'" class="deck-track--after"
            >PLAYING</span
          >
        </span>
      </div>
      <div class="record"><span>B</span></div>
      <div class="deck-track">
        <span class="deck-track--before">UP NEXT</span>
        <span v-if="mode === 'transition'" class="deck-track--after"
          >NOW PLAYING</span
        >
      </div>
      <div class="waveform" aria-hidden="true"></div>
      <div class="deck-buttons"><span>▶ / Ⅱ</span></div>
    </div>
    <div v-if="showBeats" class="deck-beats deck-beats--a" role="img" aria-label="Deck A: beats 1, 2, 3, 4 in time with Deck B">
      <span v-for="beat in 4" :key="beat" aria-hidden="true">{{ beat }}</span>
    </div>
    <div v-if="showBeats" class="deck-beats deck-beats--b" role="img" aria-label="Deck B: beats 1, 2, 3, 4 in time with Deck A">
      <span v-for="beat in 4" :key="beat" aria-hidden="true">{{ beat }}</span>
    </div>
    <div v-if="mode === 'preview'" class="headphone-route">
      HEADPHONES: Listen to B privately, find the TEMPO and the 1 using CUE
    </div>
  </div>
</template>

<style scoped>
.deck-beats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  grid-row: 2;
  margin-top: 4px;
}

.deck-beats--a { grid-column: 1; }
.deck-beats--b { grid-column: 3; }

.deck-beats span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 2px solid var(--workshop-cyan);
  border-radius: 50%;
  background: var(--workshop-panel);
  color: var(--workshop-cyan);
  font-size: 21px;
  font-weight: 700;
}

.deck-beats span:first-child {
  background: var(--workshop-cyan);
  color: var(--workshop-bg);
}

@media (prefers-reduced-motion: no-preference) {
  .deck-setup--active .deck-beats span {
    animation: count-beat 2s step-end infinite both;
  }

  .deck-setup--active .deck-beats span:nth-child(2) { animation-delay: -1.5s; }
  .deck-setup--active .deck-beats span:nth-child(3) { animation-delay: -1s; }
  .deck-setup--active .deck-beats span:nth-child(4) { animation-delay: -0.5s; }

  .deck-setup--active .waveform {
    animation:
      waveform-scroll 2s linear infinite,
      waveform-pulse 1s ease-in-out infinite alternate;
  }

  .deck-card--b .waveform {
    animation-delay: -0.7s, -0.4s;
  }
}

@keyframes count-beat {
  0%, 24.99% { background: var(--workshop-cyan); color: var(--workshop-bg); }
  25%, 100% { background: var(--workshop-panel); color: var(--workshop-cyan); }
}

@keyframes waveform-scroll {
  to {
    background-position: -28px 0;
  }
}

@keyframes waveform-pulse {
  from {
    transform: scaleY(0.8);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
