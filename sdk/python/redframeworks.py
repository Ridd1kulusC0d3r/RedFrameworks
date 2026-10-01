from __future__ import annotations

import json
from urllib.request import urlopen

class RedFrameworks:
    def __init__(self, base="https://ridd1kulusc0d3r.github.io/RedFrameworks/api/v4"):
        self.base = base.rstrip("/")

    def get(self, endpoint):
        with urlopen(f"{self.base}/{endpoint.lstrip('/')}", timeout=15) as response:
            return json.load(response)

    def catalog(self):
        return self.get("catalog.json")

    def resources(self):
        return self.get("resources.json")

    def learning_paths(self):
        return self.get("learning-paths.json")

    def verification_queue(self):
        return self.get("verification-queue.json")

    def techniques(self):
        return self.get("techniques.json")

    def adversaries(self):
        return self.get("adversaries.json")

    def campaigns(self):
        return self.get("campaigns.json")

    def detections(self):
        return self.get("detections.json")

    def domain_packs(self):
        return self.get("domain-packs.json")

    def knowledge_graph(self):
        return self.get("knowledge-graph.json")

    def verification_v2(self):
        return self.get("verification-v2.json")
