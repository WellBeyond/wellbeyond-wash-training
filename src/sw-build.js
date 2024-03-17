const workboxBuild = require("workbox-build");
// const { precacheAndRoute } = require("workbox-precaching");

// precacheAndRoute = precacheAndRoute()

const buildSW = () => {
  // The build is expected to fail if the
  // sw install rules couldn't be generated.
  // Add a catch block to handle this scenario.
  // self.__WB_MANIFEST && precacheAndRoute(self.__WB_MANIFEST);
  return workboxBuild
    .injectManifest({
      swSrc: "src/sw-custom.js", // custom sw rule

      swDest: "build/sw.js", // sw output file (auto-generated

      globDirectory: "build",

      globPatterns: ["**/*.{js,css,html,png,svg}"],

      globIgnores: ["firebase-messaging-sw-js"],

      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

      injectionPoint: 'self.__WB_MANIFEST && self.__WB_MANIFEST;'
    })
    .then(({ count, size, warnings }) => {
      warnings.forEach(console.warn);
      console.info(`${count} files will be precached,
                  totaling ${size / (1024 * 1024)} MBs.`);
    });
};

buildSW();