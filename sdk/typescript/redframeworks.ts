export type RFItem = {
  id: string;
  name: string;
  status: string;
  type: string;
  domains: string[];
  provenance_score?: number;
};

export class RedFrameworksClient {
  constructor(public base = "https://ridd1kulusc0d3r.github.io/RedFrameworks/api/v4") {}

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.base}/${endpoint.replace(/^\//, "")}`);
    if (!response.ok) throw new Error(`RedFrameworks API HTTP ${response.status}`);
    return response.json() as Promise<T>;
  }

  catalog() { return this.get<RFItem[]>("catalog.json"); }
  resources() { return this.get("resources.json"); }
  learningPaths() { return this.get("learning-paths.json"); }
  verificationQueue() { return this.get("verification-queue.json"); }
  techniques() { return this.get("techniques.json"); }
  adversaries() { return this.get("adversaries.json"); }
  campaigns() { return this.get("campaigns.json"); }
  detections() { return this.get("detections.json"); }
  domainPacks() { return this.get("domain-packs.json"); }
  knowledgeGraph() { return this.get("knowledge-graph.json"); }
  verificationV2() { return this.get("verification-v2.json"); }
}
