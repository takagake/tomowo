/* TOMOWO — Tweaks app
   Three expressive controls that reshape the whole page's feel.
   Applies to CSS custom properties on <html>, so they layer on top of
   whichever Design direction (Setouchi / Deep / Index) is active. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "voice": "標準",
  "density": "標準",
  "accent": "#cf5a2c"
}/*EDITMODE-END*/;

function TomowoTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const el = document.documentElement;

    // ── Headline voice — swaps the display typeface personality ──
    if (t.voice === '明朝') {
      el.style.setProperty('--f-jp-display', '"Shippori Mincho B1", "Yu Mincho", serif');
      el.style.setProperty('--f-display', '"Newsreader", Georgia, serif');
    } else if (t.voice === 'ゴシック') {
      el.style.setProperty('--f-jp-display', '"Zen Kaku Gothic New", sans-serif');
      el.style.setProperty('--f-display', '"Schibsted Grotesk", sans-serif');
    } else {
      el.style.removeProperty('--f-jp-display');
      el.style.removeProperty('--f-display');
    }

    // ── Spacing rhythm — breathes the whole vertical cadence ──
    const mult = t.density === 'ゆったり' ? 1.32 : t.density === '凝縮' ? 0.66 : 1;
    el.style.setProperty('--space-mult', String(mult));

    // ── Accent — one brand colour across every direction ──
    // Leave each direction's native accent intact until the user picks one.
    if (t.accent && t.accent !== TWEAK_DEFAULTS.accent) {
      el.style.setProperty('--accent', t.accent);
    } else {
      el.style.removeProperty('--accent');
    }
  }, [t.voice, t.density, t.accent]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="文字の表情 / Type" />
      <TweakRadio label="見出しの書体" value={t.voice}
                  options={['明朝', '標準', 'ゴシック']}
                  onChange={(v) => setTweak('voice', v)} />
      <TweakSection label="リズム / Rhythm" />
      <TweakRadio label="余白の密度" value={t.density}
                  options={['ゆったり', '標準', '凝縮']}
                  onChange={(v) => setTweak('density', v)} />
      <TweakSection label="ムード / Mood" />
      <TweakColor label="アクセント" value={t.accent}
                  options={['#cf5a2c', '#e2892f', '#0e857f', '#3a5fa8']}
                  onChange={(v) => setTweak('accent', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TomowoTweaks />);
