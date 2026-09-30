from __future__ import annotations

import json
from urllib.request import urlopen

class RedFrameworks:
    def __init__(self, base="https://ridd1kulusc0d3r.github.io/RedFrameworks/api/v3"):
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
