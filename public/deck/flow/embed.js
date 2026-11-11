(() => {
  const stage = document.getElementById("preview-stage");
  if (!stage) return;

  const DESIGN_WIDTH = 393;
  const DESIGN_HEIGHT = 852;

  function fitStage() {
    const scale = Math.min(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT
    );

    stage.style.transform = `scale(${scale})`;
    document.body.style.height = `${DESIGN_HEIGHT * scale}px`;
  }

  fitStage();
  window.addEventListener("resize", fitStage);
  window.addEventListener("orientationchange", fitStage);
})();
