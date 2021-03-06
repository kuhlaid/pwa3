/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
    workbox.precaching.precacheAndRoute([
  {
    "url": "style/main.css",
    "revision": "8d64242ac6b9f933343c72d77cdb7b2c"
  },
  {
    "url": "index.html",
    "revision": "ff1cf66340f23123181f524775c07c49"
  },
  {
    "url": "js/idb-promised.js",
    "revision": "59df18a7433f090282337136440403f7"
  },
  {
    "url": "js/main.js",
    "revision": "b6b1c0fe09684035464f7e03806a5081"
  },
  {
    "url": "images/profile/cat.jpg",
    "revision": "69936d25849a358d314f2f82e9fa4578"
  },
  {
    "url": "images/touch/icon-128x128.png",
    "revision": "c2c8e1400d6126ea32eaac29009733a9"
  },
  {
    "url": "images/touch/icon-192x192.png",
    "revision": "571f134f59f14a6d298ddd66c015b293"
  },
  {
    "url": "images/touch/icon-256x256.png",
    "revision": "848055c2f5d42b0c405cff37739261e9"
  },
  {
    "url": "images/touch/icon-384X384.png",
    "revision": "a1be08eac51e8ff734a337b90ddc1c16"
  },
  {
    "url": "images/touch/icon-512x512.png",
    "revision": "b3d7c4eaefdd3d30e348a56d8048bf68"
  },
  {
    "url": "manifest.json",
    "revision": "5f4aa3bba528cf6e8f69ba0d627ec0d4"
  }
]);

    const showNotification = () => {
        self.registration.showNotification('Background sync success!', {
          body: '🎉`🎉`🎉`'
        });
      };
      
    const bgSyncPlugin = new workbox.backgroundSync.Plugin(
    'dashboardr-queue',
    {
        callbacks: {
        queueDidReplay: showNotification
        // other types of callbacks could go here
        }
    }
    );

    const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
    });

    workbox.routing.registerRoute(
    /\/api\/add/,
    networkWithBackgroundSync,
    'POST'
    );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}