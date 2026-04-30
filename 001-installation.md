## Installation

Installation of Freeschema Frontend.



Freeschema is a multi layered system but can be developed with a single package called Freeschema Frontend. This is available in github as https://github.com/Mentor-Friends/Freeschema-Frontend.

The Freeschema has different layers like permanent store, data layer, distribution layer then frontend layer.

This Frontend layer is designed so that we can create an Single page application using our knowledge of javascript. With just javascript and the knowledge of freeschema we can create a complex website. That is the strength of freeschema.



To start using freeschema

```
git clone https://github.com/Mentor-Friends/Freeschema-Frontend 

// then afterwards install all the packages using npm install
npm install 

// now you can run freeschema
npm run dev
```



Currently this framework is not installed by any script and installed by git. Since any person developing in this framework will not have access to the main Freeschema-Frontend git repository. You need to delete the .git folder inside of this project and create your own git repository.

To do this just go to the folder inside Freeschema-Frontend and delete the .git folder present there.

You can initialize your own repository after that.


To change the origin, In environment.dev.ts if there is link to theta.boomconcole.com change the https://theta.boomconcole.com to https://boomconsole.com in all three instances of baseURL, baseNodeUrl and boomURL.This will change your origin server. If you do not change it you will have to signup again (if you have your humanizing data / boomconsole login).

---

## Initializing the system

Before using any Freeschema functionality, call `init()` once at application startup. This sets up the backend connection, loads local data from IndexedDB, and configures all subsystems.

```js
import { init } from 'mftsccs-browser'

await init(
    "https://api.example.com",   // url        — backend API base URL (required)
    "",                           // aiurl      — AI service URL, empty if not used
    "",                           // accessToken — JWT token, set later via updateAccessToken()
    "",                           // nodeUrl    — Node.js server URL
    false,                        // enableAi   — set true to preload AI data
    "my-app",                     // applicationName — unique name, used for IndexedDB isolation
)
```

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `url` | `string` | `""` | Backend API base URL. Required for all concept and connection operations. |
| `aiurl` | `string` | `""` | AI service URL. Pass empty string if not using AI features. |
| `accessToken` | `string` | `""` | JWT bearer token. Can be set later with `updateAccessToken()` after login. |
| `nodeUrl` | `string` | `""` | Node.js server URL for business logic features. |
| `enableAi` | `boolean` | `true` | Enable AI data preloading to IndexedDB. Set `false` if not using AI. |
| `applicationName` | `string` | `""` | Unique app identifier. Creates separate IndexedDB instances per app name. |
| `enableSW` | `object` | `undefined` | Service worker config: `{ activate: boolean, scope?: string, pathToSW?: string }` |
| `flags` | `object` | `{}` | Feature flags: `logApplication`, `logPackage`, `accessTracker`, `isTest` |
| `parameters` | `object` | `{}` | Extra config: `logserver`, `isPwa`, `enableCache` — see below |

### The `parameters` object

```js
await init(
    "https://api.example.com", "", "", "", false, "my-app",
    undefined,
    {},
    {
        logserver:   "https://logs.example.com", // custom log server URL
        isPwa:       true,                        // enable PWA / offline persistence
        enableCache: false,                       // disable widget and query caching
    }
)
```

### Full example with service worker

```js
await init(
    "https://api.example.com",
    "https://ai.example.com",
    "",
    "https://node.example.com",
    true,
    "my-app-v2",
    { activate: true, scope: "/", pathToSW: "/service-worker.js" },
    { logApplication: true, accessTracker: true },
    { logserver: "https://logs.example.com", enableCache: true }
)
```

### Updating the access token after login

```js
import { updateAccessToken, LoginToBackend } from 'mftsccs-browser'

const result = await LoginToBackend("user@example.com", "password")
updateAccessToken(result.data.token)
```

See [Cache Control](024-CacheControl.md) for details on the `enableCache` option and runtime cache toggling.






