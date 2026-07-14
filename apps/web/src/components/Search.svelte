<script lang="ts">
  import { onMount } from 'svelte';

  let allColors: any[] = [];
  let displayedColors: any[] = [];
  let query = '';
  let currentIndex = 0;
  const BATCH_SIZE = 50;

  let toastMessage = '';
  let showToast = false;
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const response = await fetch('/api/colors.json');
      if (!response.ok) {
        const errBody = await response.text();
        console.error('API error:', response.status, errBody);
        error = `Failed to load colors (${response.status})`;
        loading = false;
        return;
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected response:', data);
        error = data?.error || "Unexpected response format";
        loading = false;
        return;
      }
      allColors = data;
      displayedColors = allColors;
      loadMoreColors();
      
      window.addEventListener('scroll', handleScroll);
    } catch (err) {
      console.error(err);
      error = "Failed to load colors.";
    } finally {
      loading = false;
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  });

  function loadMoreColors() {
    if (currentIndex >= displayedColors.length) return;
    currentIndex = Math.min(currentIndex + BATCH_SIZE, displayedColors.length);
  }

  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreColors();
    }
  }

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    query = target.value.toLowerCase().trim();
    
    if (query === '') {
      displayedColors = allColors;
    } else {
      displayedColors = allColors.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.hex.toLowerCase().includes(query)
      );
    }
    currentIndex = 0;
    loadMoreColors();
  }

  function copyToClipboard(e: Event, hex: string) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(hex).then(() => {
      toastMessage = `Copied ${hex}!`;
      showToast = true;
      setTimeout(() => { showToast = false; }, 2000);
    });
  }
</script>

<div class="search-container">
  <input type="text" value={query} on:input={handleSearch} placeholder="Search for a color name or hex..." autocomplete="off">
</div>

{#if loading}
  <div class="loading">Fetching colors...</div>
{:else if error}
  <div class="loading">{error}</div>
{:else}
  <div class="color-grid">
    {#each displayedColors.slice(0, currentIndex) as color}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <a href={`/colors/${color.id}`} class="color-card">
        <div class="color-swatch" style="background-color: {color.hex};"></div>
        <div class="color-name">{color.name}</div>
        <div class="color-source">{color.source_name}</div>
        <div class="color-hex">{color.hex}</div>
        <button class="copy-btn" on:click={(e) => copyToClipboard(e, color.hex)}>Copy Hex</button>
      </a>
    {/each}
  </div>
  {#if displayedColors.length === 0}
    <div class="no-results">No colors found.</div>
  {/if}
{/if}

<div class="toast" class:show={showToast}>{toastMessage}</div>

<style>
  .search-container {
    margin: -5rem auto 4rem;
    text-align: center;
    position: relative;
    z-index: 10;
    padding: 0 1rem;
  }
  .search-container input {
    width: 100%;
    max-width: 800px;
    padding: 1.5rem 2rem;
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    background: #fff;
    border: var(--border-thick);
    border-radius: 0;
    box-shadow: var(--shadow-brutal);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    outline: none;
  }
  .search-container input:focus {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-brutal-hover);
    background: #f8f8f8;
  }
  .search-container input::placeholder {
    color: #999;
    font-weight: 400;
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 3rem;
  }
  .color-card {
    border: var(--border-thick);
    background-color: #fff;
    cursor: pointer;
    box-shadow: var(--shadow-brutal);
    transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
  }
  .color-card:hover {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-brutal-hover);
  }
  .color-card:active {
    transform: translate(2px, 2px);
    box-shadow: var(--shadow-brutal-active);
  }

  .color-swatch {
    height: 180px;
    border-bottom: var(--border-thick);
    transition: filter 0.2s;
  }
  .color-card:hover .color-swatch {
    filter: brightness(1.05) contrast(1.1);
  }

  .color-name {
    padding: 1.5rem 1.5rem 0.5rem;
    font-family: var(--font-heading);
    font-weight: 900;
    font-size: 1.5rem;
    line-height: 1.1;
    color: #000;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  .color-source {
    padding: 0 1.5rem 1rem;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #000;
    background: #DDF247;
    display: inline-block;
    align-self: flex-start;
    margin: 0 1.5rem 1rem;
    border: 2px solid #000;
    box-shadow: 2px 2px 0px #000;
  }

  .color-hex {
    padding: 0 1.5rem 1.5rem;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.2rem;
    color: #000;
    margin-top: auto;
  }

  .copy-btn {
    margin: 0;
    padding: 1rem;
    background: #000;
    color: #fff;
    border: none;
    border-top: var(--border-thick);
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
  }
  .color-card:hover .copy-btn {
    background: #DDF247;
    color: #000;
  }

  .toast {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #DDF247;
    color: #000;
    padding: 1.5rem 3rem;
    border: var(--border-thick);
    box-shadow: var(--shadow-brutal-hover);
    font-family: var(--font-mono);
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    transition: bottom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1000;
  }
  .toast.show {
    bottom: 40px;
  }

  .loading, .no-results {
    text-align: center;
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 2.5rem;
    margin-top: 4rem;
    text-transform: uppercase;
    letter-spacing: -0.05em;
  }
</style>
