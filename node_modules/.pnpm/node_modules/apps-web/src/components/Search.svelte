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
      allColors = await response.json();
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
    margin-bottom: 2rem;
    text-align: center;
  }
  .search-container input {
    width: 100%;
    max-width: 600px;
    padding: 1rem;
    font-size: 1.2rem;
    border: 3px solid #000;
    border-radius: 0;
    box-shadow: 4px 4px 0px #000;
  }
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
  }
  .color-card {
    border: 3px solid #000;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 5px 5px 0px #000;
    transition: transform 0.1s, box-shadow 0.1s;
    display: flex;
    flex-direction: column;
  }
  .color-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0px #000;
  }
  .color-card:active {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0px #000;
  }
  .color-swatch {
    height: 150px;
    border-bottom: 3px solid #000;
  }
  .color-name {
    padding: 1rem 1rem 0.2rem;
    font-weight: bold;
    font-size: 1.2rem;
    color: #000;
  }
  .color-source {
    padding: 0 1rem 0.5rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #666;
  }
  .color-hex {
    padding: 0 1rem 1rem;
    color: #333;
    font-family: monospace;
  }
  .toast {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 0;
    transition: bottom 0.3s ease;
    z-index: 1000;
    font-weight: bold;
    border: 2px solid #000;
    box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
  }
  .toast.show {
    bottom: 20px;
  }
  .loading, .no-results {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 3rem;
  }
  .copy-btn {
    margin: 0 1rem 1rem;
    padding: 0.5rem;
    background: #000;
    color: #fff;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }
  .copy-btn:hover {
    background: #333;
  }
</style>
