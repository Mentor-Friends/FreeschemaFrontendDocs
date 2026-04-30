# Cache Control

Freeschema caches two types of data to speed up repeated reads:

- **Widget cache** — raw widget data fetched from `/api/get-widget`, `/api/get-latest-widget`, `/api/get-recent-widget`
- **Query cache** — results from `FreeschemaQueryApi` (POST `/api/freeschema-query`)

Both use an in-memory Map backed by IndexedDB so data survives page reloads. Both follow a **stale-while-revalidate** pattern: cached data is returned immediately while a background fetch updates the cache for next time.

By default, caching is **enabled**. You can disable it for the entire app at init time, toggle it at runtime, or disable it per individual query.

---

## Disable cache at initialization

Pass `enableCache: false` in the `parameters` object when calling `init()`. This prevents both managers from loading data from IndexedDB on startup and stops any writes to memory or IndexedDB for the lifetime of the app.

```js
await init(
    "https://api.example.com", "", "", "", false, "my-app",
    undefined, {},
    { enableCache: false }
)
```

When `enableCache` is `false`:
- Widget fetches always hit the backend — no stale data is ever returned
- `FreeschemaQueryApi` always hits the backend — the `QueryCacheManager` is fully bypassed
- Nothing is written to IndexedDB

---

## Toggle cache at runtime

`Environments.setValue` and `Environments.getValue` control the flag at any point after initialization. Changes take effect on the **next** cache read or write — no restart needed.

```js
import { Environments } from 'mftsccs-browser'

// Disable cache
Environments.setValue('enableCache', false)

// Re-enable cache
Environments.setValue('enableCache', true)

// Read current setting (second argument is the default if never set)
const cacheOn = Environments.getValue('enableCache', true)
```

### Flushing existing data when disabling at runtime

If cache was enabled at startup, the in-memory maps are already populated. After disabling the flag, `get*` methods return `null` immediately so no stale data is served — but the old data is still in memory. To fully clear it:

```js
import { Environments, QueryCacheManager, WidgetCacheManager } from 'mftsccs-browser'

Environments.setValue('enableCache', false)
QueryCacheManager.clearAll()   // clears in-memory map + IndexedDB queryCache store
WidgetCacheManager.clearAll()  // clears all three widget maps + IndexedDB stores
```

### Re-enabling after a disable

If cache was disabled at startup (so `init()` skipped loading from IndexedDB), re-enabling at runtime starts with empty maps. New fetches will begin populating the cache from that point — no problem, the stale-while-revalidate pattern still works for subsequent calls.

---

## Disable cache for a single query

`FreeschemaQueryApi` respects a per-query `cache` flag on the `FreeschemaQuery` object. This overrides the global setting for that one call only.

```js
import { FreeschemaQuery, FreeschemaQueryApi } from 'mftsccs-browser'

const query = new FreeschemaQuery()
query.type = "the_widget"
query.cache = false   // always hit the backend for this query, regardless of global setting

const results = await FreeschemaQueryApi(query)
```

> This only applies to `FreeschemaQueryApi`. Widget fetches (`BuildWidgetFromId` etc.) do not have a per-call cache flag — use `enableCache` globally or call `WidgetCacheManager.removeWidget(id)` to evict a specific entry before fetching.

---

## The `Environments` class

`Environments` is a simple static key-value store used throughout the package for runtime configuration. `enableCache` is one of its built-in keys but you can also store your own application values.

```js
import { Environments } from 'mftsccs-browser'

// Set any value
Environments.setValue('myFeatureFlag', true)

// Get a value — second argument is returned if the key has never been set
const flag = Environments.getValue('myFeatureFlag', false)

// Built-in keys
Environments.getValue('enableCache', true)   // cache on/off — default true
```

---

## Summary

| Scenario | How to do it |
|---|---|
| Disable cache for the whole app from the start | `init(..., { enableCache: false })` |
| Disable cache at runtime | `Environments.setValue('enableCache', false)` |
| Flush existing in-memory cache after disabling | `QueryCacheManager.clearAll()` + `WidgetCacheManager.clearAll()` |
| Disable cache for one FreeschemaQuery call | `query.cache = false` |
| Check current cache setting | `Environments.getValue('enableCache', true)` |

See also:
- [Installation & init()](001-installation.md) — full `init()` parameter reference
- [Query Transaction](014-QueryTransaction.md) — using `LocalTransaction` for batch operations
