// Initializes serviceWorker

if (navigator.onLine && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (reg) {
      console.log("SW :)");
    })
    .catch(function (err) {
      console.log("SW :(  ", err);
    });
}