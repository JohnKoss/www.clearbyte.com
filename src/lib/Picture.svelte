<script lang="ts">
  // Renders a responsive <picture> with AVIF and WebP ahead of the original
  // format, at 1x and 2x.
  //
  // Expects derivatives named "<base>-<width>.<ext>" in static/, e.g. for
  // base="/hero" width={1088}:
  //   hero-1088.avif  hero-2176.avif
  //   hero-1088.webp  hero-2176.webp
  //   hero-1088.jpg   hero-2176.jpg
  //
  // width/height are the 1x intrinsic size and are always emitted, so the
  // browser reserves the correct box and the image cannot shift the layout.
  let {
    base,
    alt,
    width,
    height,
    fallback = 'jpg',
    loading = 'lazy',
    priority = false,
    retina = true,
    class: klass = '',
  }: {
    /** Path without size suffix or extension, e.g. '/hero'. */
    base: string;
    alt: string;
    width: number;
    height: number;
    fallback?: 'jpg' | 'png';
    loading?: 'lazy' | 'eager';
    /** Set on the LCP image: skips lazy loading and raises fetch priority. */
    priority?: boolean;
    /** Off when the source has no 2x to give - never point srcset at a file that isn't there. */
    retina?: boolean;
    class?: string;
  } = $props();

  const w2 = $derived(width * 2);
  const set = (ext: string) =>
    retina
      ? `${base}-${width}.${ext} 1x, ${base}-${w2}.${ext} 2x`
      : `${base}-${width}.${ext}`;
</script>

<picture>
  <source type="image/avif" srcset={set('avif')} />
  <source type="image/webp" srcset={set('webp')} />
  <img
    src="{base}-{width}.{fallback}"
    srcset={retina ? `${base}-${w2}.${fallback} 2x` : undefined}
    {alt}
    {width}
    {height}
    loading={priority ? 'eager' : loading}
    fetchpriority={priority ? 'high' : 'auto'}
    decoding={priority ? 'sync' : 'async'}
    class={klass}
  />
</picture>
