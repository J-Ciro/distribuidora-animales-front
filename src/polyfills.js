// Polyfill for require() in browser
if (typeof global === 'undefined') {
  window.global = window;
}

if (typeof require === 'undefined') {
  window.require = function() {
    return {};
  };
}
