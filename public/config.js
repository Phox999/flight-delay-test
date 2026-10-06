(function () {
  const flowUrl = location.protocol === "file:"
    ? new URL("./flow/index.html", location.href).href
    : new URL("/flow/", location.origin).href;

  window.APP_CONFIG = { FLOW_URL: flowUrl };
})();
