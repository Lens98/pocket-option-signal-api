(function () {
  'use strict';

  const injectTime = performance.now();
  (async () => {
    try {
      if ("")
        await import(
          /* @vite-ignore */
          ""
        );
      await import(
        /* @vite-ignore */
        "../vendor/vite-client.js"
      );
    } catch (error) {
      console.warn("[crx] MAIN world HMR client failed to load", error);
    }
    const { onExecute } = await import(
      /* @vite-ignore */
      "./injected.js.js"
    );
    onExecute?.({
      perf: { injectTime, loadTime: performance.now() - injectTime }
    });
  })().catch(console.error);

})();
