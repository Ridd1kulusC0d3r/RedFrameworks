type CatalogItem = {
  id: string;
  name: string;
  type: string;
  domains: string[];
  status: string;
  provenance_score?: number;
};

const base = "https://ridd1kulusc0d3r.github.io/RedFrameworks/api/v2";
const response = await fetch(`${base}/catalog.json`);
if (!response.ok) throw new Error(`HTTP ${response.status}`);

const catalog = (await response.json()) as CatalogItem[];
const notVerified = catalog.filter((item) => item.status === "not-verified");

console.log(`entries: ${catalog.length}`);
console.log(`NOT VERIFIED: ${notVerified.length}`);
