<script setup lang="ts">
import { useNav } from '@slidev/client'

const { next, prev, hasNext, hasPrev } = useNav()
</script>

<template>
  <nav class="deck-navigation" aria-label="Slide navigation">
    <button aria-label="Previous slide" title="Previous (←)" :disabled="!hasPrev" @click="prev">
      &lt;
    </button>
    <button aria-label="Next slide" title="Next (→)" :disabled="!hasNext" @click="next">
      &gt;
    </button>
  </nav>
</template>

<style scoped>
.deck-navigation {
  position: absolute;
  right: 12px;
  bottom: 8px;
  display: flex;
  gap: 4px;
}

button {
  width: 44px;
  height: 44px;
  border: 1px solid currentColor;
  background: var(--color-surface);
  color: var(--color-ink);
  font: inherit;
  font-size: 24px;
  cursor: pointer;
}

button:hover:not(:disabled),
button:focus-visible {
  color: var(--color-highlight);
}

button:focus-visible {
  outline: 2px solid var(--color-highlight);
  outline-offset: 2px;
}

button:disabled {
  color: var(--workshop-muted);
  cursor: default;
}

@media print {
  .deck-navigation {
    display: none;
  }
}
</style>
