# FreeSchema Query — Developer & User Reference

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoint](#2-api-endpoint)
3. [Query Structure](#3-query-structure)
4. [Sub-Queries (freeschemaQueries)](#4-sub-queries-freeschemaqueries)
5. [Filters](#5-filters)
6. [Filter Logic](#6-filter-logic)
7. [Pagination & Ordering](#7-pagination--ordering)
8. [Selectors](#8-selectors)
9. [Pipeline Query](#9-pipeline-query)
10. [Query Strategies with Examples](#10-query-strategies-with-examples)
11. [Performance Guide](#11-performance-guide)
12. [Field Reference](#12-field-reference)

---

## 1. Overview

A FreeSchema query traverses a graph of **concepts** linked by **connections**. Every query starts at a root level (identified by a `type` string or explicit `conceptIds`) and expands outward through nested sub-queries, each describing one hop across a connection type.

At each level you can:
- Paginate results (`limit`, `inpage`, `page`)
- Filter by concept field values (`filters`, `filterlogic`)
- Reverse the direction of traversal (`reverse`)
- Attach extra data via selectors

The same recursive structure is used at every depth — a sub-query looks identical to its parent.

---

## 2. API Endpoint

```
POST /api/freeschema-query
Authorization: Bearer <token>
Content-Type: application/json
```

**Returns** a JSON object containing resolved concept IDs, connections, and formatted node data.

**Limits & protections:**
- Timeout: 180 seconds
- Heavy queries (depth > 4, large conceptId expansion, broad type scan) are throttled to 1 concurrent execution; others queue for up to 30 seconds before returning 503.

---

## 3. Query Structure

The top-level body is a `FreeschemaQuery` object. Every nested sub-query is also a `FreeschemaQuery`.

```jsonc
{
  // --- Root identity ---
  "type": "the_entity",        // Type name to scan (mutually exclusive with conceptIds at root)
  "conceptIds": [],            // Specific concept IDs to start from (overrides type scan)

  // --- Connection traversal ---
  "typeConnection": "",        // Connection type name linking parent → child (set on sub-queries)
  "reverse": false,            // Traverse the connection backwards (child → parent direction)

  // --- Pagination ---
  "limit": false,              // Enable pagination for this level
  "inpage": 10,                // Items per page (only used when limit: true)
  "page": 1,                   // Page number, 1-based (only used when limit: true)
  "order": "DESC",             // "ASC" or "DESC" — sorts by entry timestamp

  // --- Filters ---
  "filters": [],               // Array of FilterSearch objects
  "filterlogic": "",           // Infix boolean expression referencing filter names
  "includeInFilter": false,    // Whether this node participates in filter evaluation
  "filterAncestor": "",        // Used with EXAND — name of the ancestor node to compare against

  // --- Selectors ---
  "selectors": [],             // Extra data to attach (e.g. ["self"])

  // --- Sub-queries ---
  "freeschemaQueries": [],     // Nested FreeschemaQuery objects — one per connection hop

  // --- Options ---
  "usePipelineQuery": false,   // Use optimized pipeline execution (recommended for filtered queries)
  "outputFormat": 0,           // 0 = normal, 1 = flat
  "name": "query",             // Unique name for this query node (required for filter operateOn)
  "isSelected": false,         // Mark this node as a selected output node
  "serverCache": false         // Enable server-side result cache
}
```

---

## 4. Sub-Queries (freeschemaQueries)

Sub-queries define connection hops outward from the parent. Each entry in `freeschemaQueries` describes:

- **Which connection type** to follow (`typeConnection`)
- **Which direction** (`reverse: false` = forward, `true` = backward)
- **What to load** at the next level (further nested `freeschemaQueries`, filters, selectors)

Sub-queries are evaluated in parallel per root concept.

### Example — entity with email and phone

```json
{
  "type": "the_entity",
  "limit": true,
  "inpage": 20,
  "page": 1,
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "reverse": false,
      "limit": true,
      "inpage": 5,
      "page": 1,
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "reverse": false,
          "limit": true,
          "inpage": 1,
          "page": 1
        }
      ]
    },
    {
      "name": "phone",
      "typeConnection": "the_entity_phone",
      "reverse": false,
      "limit": true,
      "inpage": 3,
      "page": 1
    }
  ]
}
```

---

## 5. Filters

> **Always set `"usePipelineQuery": true` on the root query when using filters.**
> Without it the server scans every concept of the type before applying filters. With it, equality and like filters reverse-traverse from the filter value to the root, so only matching candidates are processed. The difference on large datasets is the gap between milliseconds and minutes.

Filters are declared in the `filters` array and referenced by name in `filterlogic`. All filters are applied at the root query level — nested-level filters are not supported.

### FilterSearch fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier referenced in `filterlogic` |
| `operateOn` | string | The `name` of the sub-query node this filter evaluates |
| `type` | string | Concept type to match against (e.g. `"the_email"`) or a special field name |
| `search` | string | The value to compare |
| `logicoperator` | string | Comparison operator: `=`, `like`, `>`, `<`, `exists` |

### Special `type` values

| Value | Matches |
|-------|---------|
| `"id"` | Concept numeric ID |
| `"entry_timestamp"` | Creation timestamp |
| `"user_id"` | Owner user ID |
| `"type_concept"` | The type name of the concept itself |

### Operators

| Operator | Behaviour |
|----------|-----------|
| `=` | Exact match (case-insensitive) |
| `like` | Substring match. Pass the pattern with `%` wildcards — they are stripped before comparison, leaving a `contains` check. E.g. `"niscal%"` matches `"niscalbhandari12@gmail.com"` |
| `>` | Greater than (lexicographic, or chronological for timestamps) |
| `<` | Less than |
| `exists` | The connection of this sub-query type exists, regardless of value |

### Example — filter entities by exact email

```json
{
  "type": "the_entity",
  "usePipelineQuery": true,
  "filters": [
    {
      "name": "emailFilter",
      "operateOn": "emailvalue",
      "type": "the_email",
      "search": "niscalbhandari12@gmail.com",
      "logicoperator": "="
    }
  ],
  "filterlogic": "emailFilter",
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "includeInFilter": true,
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "includeInFilter": true
        }
      ]
    }
  ]
}
```

### Example — filter by like (partial email search)

```json
{
  "type": "the_entity",
  "usePipelineQuery": true,
  "filters": [
    {
      "name": "emailFilter",
      "operateOn": "emailvalue",
      "type": "the_email",
      "search": "niscal%",
      "logicoperator": "like"
    }
  ],
  "filterlogic": "emailFilter",
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "includeInFilter": true,
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "includeInFilter": true
        }
      ]
    }
  ]
}
```

---

## 6. Filter Logic

`filterlogic` is an **infix boolean expression** that combines named filters. The system converts it to postfix internally using the Shunting Yard algorithm.

### Supported operators (uppercase required)

| Operator | Description |
|----------|-------------|
| `AND` | Both filters must pass |
| `OR` | Either filter must pass |
| `NOT` | Negates the following filter (marks it as non-constraining in the index pipeline) |
| `EXAND` | Exclusive AND — both filters must pass AND they must share the same `filterAncestor` node |

### Operator precedence (highest first)

`EXAND` > `NOT` > `AND` > `OR`

### Examples

```
"filterlogic": "emailFilter"
"filterlogic": "emailFilter AND firstnameFilter"
"filterlogic": "emailFilter OR usernameFilter"
"filterlogic": "(emailFilter AND firstnameFilter) OR usernameFilter"
"filterlogic": "emailFilter EXAND phoneFilter"
```

### Rules

- Each token in `filterlogic` must exactly match a `name` in the `filters` array.
- Tokens are separated by single spaces.
- Parentheses are supported for grouping.
- Filters not referenced in `filterlogic` are ignored.

---

## 7. Pagination & Ordering

### Without `limit`

All matching results are loaded into memory and returned. Avoid this for large datasets.

### With `limit: true`

When `limit: true` is set on a sub-query:

- **No filters**: The DB is queried directly with `LIMIT`/`OFFSET` — only the requested page is loaded into memory. Most efficient.
- **With filters**: All candidates are loaded, filters are applied in memory, then the page slice is taken from the passing results.

### Fields

| Field | Default | Description |
|-------|---------|-------------|
| `limit` | `false` | Enable pagination |
| `inpage` | `10` | Number of results per page |
| `page` | `1` | Page number (1-based) |
| `order` | `"DESC"` | Sort order by entry timestamp (`"ASC"` or `"DESC"`) |

### Total count

When `limit: true` and no filters are set, the response includes the total connection count from a `COUNT(*)` DB query so the client can calculate total pages.

### Example — paginated emails, page 2

```json
{
  "name": "email",
  "typeConnection": "the_entity_email",
  "limit": true,
  "inpage": 10,
  "page": 2,
  "order": "DESC"
}
```

---

## 8. Selectors

Selectors attach additional concept data to query results. They are specified as strings in the `selectors` array.

```json
{
  "selectors": ["self"]
}
```

`"self"` is the most common value — it includes the concept's own data in the output.

---

## 9. Pipeline Query

Set `"usePipelineQuery": true` on the root query to use the optimized pipeline execution path. This is **strongly recommended** whenever filters are present.

### What the pipeline does differently

| Feature | Standard query | Pipeline query |
|---------|---------------|----------------|
| Filter evaluation | After full tree build | Per-batch, with early stopping |
| Equality filter index | Not used | Reverse-traverses from filter value to root (bottom-up candidate narrowing) |
| `like` filter index | Not used | Fetches up to 10 matching leaf concepts, traverses back to root |
| Memory usage for large types | Loads all | Stops as soon as enough passing results are found |
| `limit: true` + no filter | Cache path | Direct DB LIMIT/OFFSET — bypasses cache entirely |
| Search value not in DB | Scans full type, returns 0 | Returns empty immediately — no tree scan |
| AND across sibling branches | Works (root-level tree) | Works — `SearchAdvance` called on root entity, sees all branches |

### When to use pipeline

- Any query with `filters`
- Any query scanning a large type (thousands of concepts) with `limit: true`
- Queries where you have equality filters on nested fields — the pipeline narrows candidates before building the tree

### When the standard path is used automatically

- `usePipelineQuery: false` (default)
- Pipeline falls back to standard only when the index returns `null` (filter type has no index — `exists`, `>`, `<`) and no `conceptIds` are provided
- If the index returns **empty** (searched value genuinely does not exist in the database), the pipeline returns empty immediately — it does **not** fall back to a full scan

---

## 10. Query Strategies with Examples

### Strategy 1 — Browse a type with pagination

The simplest query: list all concepts of a type, paginated.

```json
{
  "type": "the_entity",
  "limit": true,
  "inpage": 20,
  "page": 1,
  "order": "DESC",
  "selectors": ["self"]
}
```

### Strategy 2 — Fetch by known ID

When you already know the concept IDs, skip the type scan entirely.

```json
{
  "conceptIds": [105711380, 105711381],
  "selectors": ["self"],
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "limit": true,
      "inpage": 5,
      "page": 1
    }
  ]
}
```

### Strategy 3 — Exact equality filter (most efficient filtered search)

Use `usePipelineQuery: true` with a `=` filter. The pipeline traverses from the filter value backward to root, so only matching concepts are processed — not the entire type.

```json
{
  "type": "the_entity",
  "usePipelineQuery": true,
  "filters": [
    {
      "name": "f1",
      "operateOn": "emailvalue",
      "type": "the_email",
      "search": "user@example.com",
      "logicoperator": "="
    }
  ],
  "filterlogic": "f1",
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "includeInFilter": true,
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "includeInFilter": true
        }
      ]
    }
  ]
}
```

### Strategy 4 — Like / partial search

Use `like` with a `%` wildcard pattern when you want fuzzy matching. The pipeline fetches up to 10 matching leaf concepts and traverses each back to root.

```json
{
  "type": "the_entity",
  "usePipelineQuery": true,
  "filters": [
    {
      "name": "f1",
      "operateOn": "emailvalue",
      "type": "the_email",
      "search": "niscal%",
      "logicoperator": "like"
    }
  ],
  "filterlogic": "f1",
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "includeInFilter": true,
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "includeInFilter": true
        }
      ]
    }
  ]
}
```

### Strategy 5 — Combined AND filter

Find entities that have a specific email AND a specific first name.

```json
{
  "type": "the_entity",
  "usePipelineQuery": true,
  "filters": [
    {
      "name": "emailFilter",
      "operateOn": "emailvalue",
      "type": "the_email",
      "search": "user@example.com",
      "logicoperator": "="
    },
    {
      "name": "nameFilter",
      "operateOn": "firstnamevalue",
      "type": "the_firstname",
      "search": "John",
      "logicoperator": "="
    }
  ],
  "filterlogic": "emailFilter AND nameFilter",
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "includeInFilter": true,
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "includeInFilter": true
        }
      ]
    },
    {
      "name": "firstname",
      "typeConnection": "the_entity_firstname",
      "includeInFilter": true,
      "freeschemaQueries": [
        {
          "name": "firstnamevalue",
          "typeConnection": "the_firstname_firstname",
          "includeInFilter": true
        }
      ]
    }
  ]
}
```

### Strategy 6 — Exists filter

Find entities that have at least one phone number, without caring about its value.

```json
{
  "type": "the_entity",
  "usePipelineQuery": true,
  "filters": [
    {
      "name": "hasPhone",
      "operateOn": "phone",
      "type": "the_phone",
      "search": "",
      "logicoperator": "exists"
    }
  ],
  "filterlogic": "hasPhone",
  "freeschemaQueries": [
    {
      "name": "phone",
      "typeConnection": "the_entity_phone",
      "includeInFilter": true
    }
  ]
}
```

### Strategy 7 — OR filter

Find entities matching either of two email addresses.

```json
{
  "type": "the_entity",
  "usePipelineQuery": true,
  "filters": [
    {
      "name": "email1",
      "operateOn": "emailvalue",
      "type": "the_email",
      "search": "alice@example.com",
      "logicoperator": "="
    },
    {
      "name": "email2",
      "operateOn": "emailvalue",
      "type": "the_email",
      "search": "bob@example.com",
      "logicoperator": "="
    }
  ],
  "filterlogic": "email1 OR email2",
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "includeInFilter": true,
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "includeInFilter": true
        }
      ]
    }
  ]
}
```

### Strategy 8 — Reverse traversal

Traverse a connection backwards — from child to parent.

```json
{
  "conceptIds": [998877],
  "freeschemaQueries": [
    {
      "name": "owner",
      "typeConnection": "the_entity_email",
      "reverse": true
    }
  ]
}
```

### Strategy 9 — Paginated sub-query with filter

Load paginated emails for a set of entities, limiting memory with `limit: true`. Note that when a sub-query has both `limit: true` and a filter, all candidates are still loaded to evaluate the filter — the page slice is applied after.

```json
{
  "conceptIds": [105711380],
  "freeschemaQueries": [
    {
      "name": "email",
      "typeConnection": "the_entity_email",
      "limit": true,
      "inpage": 10,
      "page": 1,
      "filters": [
        {
          "name": "f1",
          "operateOn": "emailvalue",
          "type": "the_email",
          "search": "gmail%",
          "logicoperator": "like"
        }
      ],
      "filterlogic": "f1",
      "freeschemaQueries": [
        {
          "name": "emailvalue",
          "typeConnection": "the_email_email",
          "includeInFilter": true
        }
      ]
    }
  ]
}
```

---

## 11. Performance Guide

### Do

- Use `usePipelineQuery: true` whenever the query has any filters.
- Use `"="` filters instead of `"like"` when you have the exact value — the pipeline's reverse traversal narrows candidates to O(1) DB lookups instead of a full type scan.
- Use `limit: true` with `inpage` on sub-queries that can return many connections per parent (e.g., emails, tags).
- Set `conceptIds` directly when you already know which roots to query — skips the type scan entirely.
- Keep query depth ≤ 4. Deeper queries are throttled and compete for a single execution slot.

### Avoid

- Top-level `type` scan with no filters and no `limit` on a large type. This loads all concepts and all their connections into memory.
- `like` filters on very common prefixes (e.g., `"a%"`) — the index pipeline fetches up to 10 leaf matches but a very common prefix may match unrelated entities.
- Depth > 4 in production — the server flags these as heavy and serialises them.
- Omitting `name` on sub-queries that are referenced in a filter's `operateOn` — the filter will not find its target node and will be silently ignored.

### Memory model

| Scenario | Memory behaviour |
|----------|-----------------|
| `limit: true`, no filter | Only requested page loaded from DB (LIMIT/OFFSET) |
| `limit: true`, with filter | All candidates loaded, filtered in memory, page sliced |
| No `limit`, no filter | All connections for this level loaded |
| `=` filter with pipeline | Only reverse-traversed candidates loaded |
| `like` filter with pipeline | Up to 10 leaf matches × traversal depth |

---

## 12. Field Reference

### FreeschemaQuery

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | string | `""` | Type name to scan at root level |
| `conceptIds` | int[] | `[]` | Explicit concept IDs to start from |
| `typeConnection` | string | `""` | Connection type name (set on sub-queries) |
| `reverse` | bool | `false` | Traverse connection in reverse direction |
| `limit` | bool | `false` | Enable pagination |
| `inpage` | int | `10` | Items per page |
| `page` | int | `1` | Current page (1-based) |
| `order` | string | `"DESC"` | Sort by timestamp: `"ASC"` or `"DESC"` |
| `filters` | FilterSearch[] | `[]` | Filter conditions |
| `filterlogic` | string | `""` | Infix boolean expression over filter names |
| `includeInFilter` | bool | `false` | Marks this node as part of a filter path |
| `filterAncestor` | string | `""` | Ancestor node name used with EXAND |
| `selectors` | string[] | `[]` | Additional data to include |
| `freeschemaQueries` | FreeschemaQuery[] | `[]` | Nested connection hops |
| `name` | string | `"query"` | Unique name; required when referenced in `operateOn` |
| `usePipelineQuery` | bool | `false` | Use optimised pipeline execution |
| `outputFormat` | int | `0` | Output shape: `0` = normal, `1` = flat |
| `isSelected` | bool | `false` | Mark node as a selected output node |
| `serverCache` | bool | `false` | Enable server-side result caching |

### FilterSearch

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | `""` | Unique name referenced in `filterlogic` |
| `operateOn` | string | `""` | The sub-query `name` this filter targets |
| `type` | string | `""` | Concept type name, or `"id"` / `"entry_timestamp"` / `"user_id"` / `"type_concept"` |
| `search` | string | `""` | Value to compare. For `like`, include `%` wildcards |
| `logicoperator` | string | `"="` | `=`, `like`, `>`, `<`, `exists` |
