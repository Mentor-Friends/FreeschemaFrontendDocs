# Query Transaction

The `LocalTransaction` class enables batch operations — creating concepts and connections, or deleting connections — within a single transaction. All changes are committed together or fully reverted on failure.

---

## Creating in a Transaction

Use `MakeTheInstanceConceptLocal`, `CreateConnectionBetweenTwoConceptsLocal`, and related methods to build up data locally. Nothing reaches the backend until `commitTransaction()` is called.

```js
const transaction = new LocalTransaction()
try {
    // Initialize the transaction
    await transaction.initialize()

    // Create concepts
    const widgetConcept = await transaction.MakeTheInstanceConceptLocal(
        "the_widget",
        '',
        false,
        999,
        4,
        999
    )
    const nameConcept = await transaction.MakeTheInstanceConceptLocal(
        "the_widget_name",
        'login',
        false,
        999,
        4,
        999
    )

    // Create a connection between them
    await transaction.CreateConnectionBetweenTwoConceptsLocal(
        widgetConcept,
        nameConcept,
        "the_widget_login",
        true
    )

    // Sync everything to the backend
    await transaction.commitTransaction()

} catch (err) {
    // Revert all local changes — nothing is sent to the backend
    transaction.rollbackTransaction()
}
```

---

## Deleting in a Transaction

Connections can also be deleted within a transaction. The key difference from creates is that `DeleteConnectionsBetween` queries the backend immediately to resolve connection IDs, but the actual deletion is **deferred** until `commitTransaction()` is called as a single bulk request. If anything fails, `rollbackTransaction()` discards the queue and no deletions happen.

### Single query

```js
const transaction = new LocalTransaction()
try {
    await transaction.initialize()

    // Queue all connections of type "the_project_s_page" from concept 103927382 for deletion.
    // The IDs are resolved from the backend now, but nothing is deleted yet.
    await transaction.DeleteConnectionsBetween({
        ofTheConceptId: 103927382,
        type: "the_project_s_page"
    })

    // Deletion fires here as a single bulk request
    await transaction.commitTransaction()

} catch (err) {
    // Queue is discarded — no deletions happen
    transaction.rollbackTransaction()
}
```

### Multiple queries in one request

When you need to delete connections of several different types or between several pairs of concepts, use `DeleteConnectionsBetweenBulk`. All queries are resolved in **one** HTTP request instead of one per call.

```js
const transaction = new LocalTransaction()
try {
    await transaction.initialize()

    await transaction.DeleteConnectionsBetweenBulk([
        // Delete connections of one type between two specific concepts
        { ofTheConceptId: 103927382, toTheConceptId: 103927389, type: "the_project_s_page" },
        // Delete all connections of another type from a concept
        { ofTheConceptId: 103927382, type: "the_project_s_tag" },
        // Delete all internal connections of a composition
        { typeId: 101490186, isComposition: true },
    ])

    await transaction.commitTransaction()

} catch (err) {
    transaction.rollbackTransaction()
}
```

### Query permutations

| Fields provided | What gets deleted |
|---|---|
| `ofTheConceptId` + `toTheConceptId` + `type` | Connections between two specific concepts of that type |
| `ofTheConceptId` + `type` | All connections FROM a concept of that type |
| `toTheConceptId` + `type` | All connections TO a concept of that type |
| `typeId` + `isComposition: true` | All internal connections of a composition |

---

## Combining creates and deletes in one transaction

Creates and deletes can be mixed in the same transaction. Commits syncs creates first, then executes the bulk delete.

```js
const transaction = new LocalTransaction()
try {
    await transaction.initialize()

    // Queue deletion of old connections
    await transaction.DeleteConnectionsBetween({
        ofTheConceptId: 103927382,
        type: "the_project_s_page"
    })

    // Create replacement concepts and connections
    const newConcept = await transaction.MakeTheInstanceConceptLocal(
        "the_project_page", '', false, 999, 4, 999
    )
    await transaction.CreateConnectionBetweenTwoConceptsLocal(
        existingProjectConcept,
        newConcept,
        "the_project_s_page"
    )

    // Creates sync first, then the queued deletions fire as a bulk request
    await transaction.commitTransaction()

} catch (err) {
    transaction.rollbackTransaction()
}
```

> For reading/querying data use the general methods outside of a transaction. See [GetConnectionsBetweenApi](023-TransactionalDelete.md) for querying connections directly.