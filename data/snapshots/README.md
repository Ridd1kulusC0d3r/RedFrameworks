# Reproducible Catalog Snapshots

RedFrameworks v4 can generate deterministic snapshots of the catalog and relationship graph.

A snapshot contains:

- stable entry IDs;
- status, type and domains;
- relationship edges;
- source-data SHA-256;
- dataset update date;
- release version.

Generate one with:

~~~bash
python scripts/snapshot_catalog.py --version v4.0.0 --output data/snapshots/v4.0.0.json
~~~

Compare two snapshots:

~~~bash
python scripts/catalog_diff.py data/snapshots/v4.0.0.json data/snapshots/v4.1.0.json
~~~

Snapshots intentionally omit volatile web-health values so the same canonical YAML produces the same snapshot.
