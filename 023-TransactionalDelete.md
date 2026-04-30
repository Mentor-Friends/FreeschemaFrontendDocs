# Transactional Delete & GetConnectionsBetweenApi

This page covers two related pieces of functionality:

1. **`GetConnectionsBetweenApi`** — query which connections exist between concepts (read-only, can be used anywhere)
2. **`DeleteConnectionsBetween` / `DeleteConnectionsBetweenBulk`** — delete those connections atomically inside a `LocalTransaction`

---

## GetConnectionsBetweenApi

`GetConnectionsBetweenApi` calls `POST /api/get-connection-between` and returns the connection IDs that match your query. It accepts an **array** of queries, so multiple lookups always go in a single HTTP request.

```js
import { GetConnectionsBetweenApi, buildFetchConnection } from 'mftsccs-browser'

const results = await GetConnectionsBetweenApi([
    buildFetchConnection({ ofTheConceptId: 103927382, toTheConceptId: 103927389, type: "the_project_s_page" })
])

// results[0].connectionIds → [18161211]
// results[0].typeId        → resolved type concept ID
```

### Parameters — FetchConnection

Use `buildFetchConnection` to construct each query item. Only supply the fields relevant to your permutation — everything else defaults to 0 or empty.

| Field | Type | Description |
|---|---|---|
| `ofTheConceptId` | `number` | Source concept ID. 0 = not specified. |
| `toTheConceptId` | `number` | Target concept ID. 0 = not specified. |
| `typeId` | `number` | Type concept ID. Leave 0 and use `type` string instead when unknown. |
| `type` | `string` | Human-readable type string e.g. `"the_project_s_page"`. Backend resolves `typeId` from this when `typeId` is 0. |
| `oldType` | `string` | Legacy: resolves type relative to the source concept's type. Leave empty unless required. |
| `reverse` | `boolean` | Search in the reverse direction (target → source). Default `false`. |
| `isComposition` | `boolean` | When `true`, treats `typeId` as a composition ID and returns its internal connections. |

### Query permutations

| Fields supplied | What is returned |
|---|---|
| `ofTheConceptId` + `toTheConceptId` + `type` | Connections between two specific concepts of that type |
| `ofTheConceptId` + `type` | All connections FROM a concept of that type |
| `toTheConceptId` + `type` | All connections TO a concept of that type |
| `typeId` + `isComposition: true` | All internal connections of a composition |

### Multiple queries in one request

```js
const results = await GetConnectionsBetweenApi([
    buildFetchConnection({ ofTheConceptId: 103927382, type: "the_project_s_page" }),
    buildFetchConnection({ ofTheConceptId: 103927382, type: "the_project_s_tag" }),
    buildFetchConnection({ typeId: 101490186, isComposition: true }),
])

// Each item in results has its own connectionIds list
for (const result of results) {
    console.log(result.type, result.connectionIds)
}
```

---

## Deleting connections inside a transaction

`DeleteConnectionsBetween` and `DeleteConnectionsBetweenBulk` are methods on `LocalTransaction`. They work in two stages:

1. **Queue stage** — the method calls the backend to resolve which connection IDs match your query, then stores those IDs in memory. Nothing is deleted yet.
2. **Commit stage** — when `commitTransaction()` is called, all queued IDs are sent in a single bulk delete request. Either all deletions succeed or none do.

If `rollbackTransaction()` is called instead, the queue is discarded and no deletions happen.

### DeleteConnectionsBetween — single query

```js
const transaction = new LocalTransaction()
try {
    await transaction.initialize()

    // Queue deletion — resolves IDs now, deletes later
    const queuedIds = await transaction.DeleteConnectionsBetween({
        ofTheConceptId: 103927382,
        type: "the_project_s_page"
    })
    console.log("Will delete:", queuedIds) // [18161211, ...]

    // Single bulk delete fires here
    await transaction.commitTransaction()

} catch (err) {
    transaction.rollbackTransaction() // nothing deleted
}
```

### DeleteConnectionsBetweenBulk — multiple queries, one request

Use this when you have several queries to resolve. All queries are sent to the backend together, and all returned IDs are merged into the same deletion queue.

```js
const transaction = new LocalTransaction()
try {
    await transaction.initialize()

    // One HTTP request resolves all three queries at once
    await transaction.DeleteConnectionsBetweenBulk([
        { ofTheConceptId: 103927382, toTheConceptId: 103927389, type: "the_project_s_page" },
        { ofTheConceptId: 103927382, type: "the_project_s_tag" },
        { typeId: 101490186, isComposition: true },
    ])

    // One bulk delete fires for all queued IDs
    await transaction.commitTransaction()

} catch (err) {
    transaction.rollbackTransaction()
}
```

> **Prefer `DeleteConnectionsBetweenBulk` over looping `DeleteConnectionsBetween`.**  
> Looping fires one HTTP request per call. The bulk version sends all queries in one round trip regardless of how many you have.

---

## Combining creates and deletes in one transaction

Creates and deletes can be mixed freely. On commit, creates are synced first, then the bulk delete fires. Both succeed or the whole transaction is rolled back.

```js
const transaction = new LocalTransaction()
try {
    await transaction.initialize()

    // Queue old connections for deletion
    await transaction.DeleteConnectionsBetween({
        ofTheConceptId: 103927382,
        type: "the_project_s_page"
    })

    // Create replacement data
    const newPage = await transaction.MakeTheInstanceConceptLocal(
        "the_project_page", "New Page", false, 999, 4, 999
    )
    await transaction.CreateConnectionBetweenTwoConceptsLocal(
        existingProjectConcept,
        newPage,
        "the_project_s_page"
    )

    // 1. Syncs creates to backend
    // 2. Bulk deletes all queued connection IDs
    await transaction.commitTransaction()

} catch (err) {
    transaction.rollbackTransaction()
}
```

---

## Summary

| Method | When to use |
|---|---|
| `GetConnectionsBetweenApi(queries[])` | Read-only lookup of connection IDs outside a transaction |
| `transaction.DeleteConnectionsBetween(query)` | Delete connections matching one query, atomically |
| `transaction.DeleteConnectionsBetweenBulk(queries[])` | Delete connections matching multiple queries in one HTTP request, atomically |

See also:
- [Query Transaction](014-QueryTransaction.md) — full `LocalTransaction` reference
- [Connection](Connection.md) — connection creation and standard delete methods
