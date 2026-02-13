(() => {
  const stickers = [...document.querySelectorAll(".sticker")];
  if (!stickers.length) return;

  let topZ = 30;

  function bringToFront(el){
    el.style.zIndex = String(topZ++);
  }

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  stickers.forEach((el) => {
    bringToFront(el);

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const start = (e) => {
      dragging = true;
      bringToFront(el);

      const pX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const pY = e.clientY ?? (e.touches && e.touches[0].clientY);

      const rect = el.getBoundingClientRect();
      offsetX = pX - rect.left;
      offsetY = pY - rect.top;

      el.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    };

    const move = (e) => {
      if (!dragging) return;

      const pX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const pY = e.clientY ?? (e.touches && e.touches[0].clientY);

      const w = el.offsetWidth;
      const h = el.offsetHeight;

      const x = clamp(pX - offsetX, 0, window.innerWidth - w);
      const y = clamp(pY - offsetY, 0, window.innerHeight - h);

      el.style.left = `${x}px`;
      el.style.top  = `${y}px`;
    };

    const end = () => { dragging = false; };

    // Pointer (best)
    el.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);

    // Fallback touch
    el.addEventListener("touchstart", start, { passive:false });
    window.addEventListener("touchmove", move, { passive:false });
    window.addEventListener("touchend", end);
  });
})();