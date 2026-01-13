const cspMetas = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
cspMetas.forEach(meta => meta.remove());

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeName === 'META' &&
          node.getAttribute('http-equiv')?.toLowerCase() === 'content-security-policy') {
        node.remove();
      }
    });
  });
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
