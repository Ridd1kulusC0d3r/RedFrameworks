#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
METRICS = ["telemetry", "detection", "analyst_response", "containment", "evidence"]
EVIDENCE_VALUE = {"E0": 0, "E1": 25, "E2": 65, "E3": 100}

def load(path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)

def composite(doc):
    scores = doc.get("scores", {})
    weights = doc.get("weights", {})
    if not scores:
        return None
    total = 0.0
    weight_total = 0.0
    for metric in METRICS:
        if metric in scores:
            weight = float(weights.get(metric, 1.0))
            total += float(scores[metric]) * weight
            weight_total += weight
    return round(total / weight_total, 2) if weight_total else None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", default="generated-metrics")
    args = parser.parse_args()
    out = ROOT / args.output_dir
    out.mkdir(parents=True, exist_ok=True)

    records = []
    for path in sorted((ROOT / "examples/purple-team").glob("scorecard-*.yaml")):
        doc = load(path)
        scenario = doc.get("scenario", {})
        if "scores" not in doc:
            continue
        records.append({
            "scenario_id": scenario.get("id"),
            "name": scenario.get("name"),
            "date": scenario.get("execution_date"),
            "phase": scenario.get("phase"),
            "domain": scenario.get("domain", "unspecified"),
            "scores": doc.get("scores", {}),
            "composite": composite(doc),
            "evidence_level": doc.get("evidence_level", "E0"),
            "result": doc.get("result"),
            "source": str(path.relative_to(ROOT)),
        })

    records.sort(key=lambda item: (item["scenario_id"] or "", item["date"] or ""))

    regressions = []
    by_scenario = defaultdict(list)
    for record in records:
        by_scenario[record["scenario_id"]].append(record)

    for scenario_id, series in by_scenario.items():
        for previous, current in zip(series, series[1:]):
            for metric in METRICS:
                before = previous["scores"].get(metric)
                after = current["scores"].get(metric)
                if before is not None and after is not None and after < before:
                    regressions.append({
                        "scenario_id": scenario_id,
                        "metric": metric,
                        "from_date": previous["date"],
                        "to_date": current["date"],
                        "before": before,
                        "after": after,
                        "delta": after - before,
                    })

    domain_rollup = {}
    for record in records:
        domain = record["domain"]
        domain_rollup.setdefault(domain, {metric: [] for metric in METRICS})
        for metric in METRICS:
            if metric in record["scores"]:
                domain_rollup[domain][metric].append(float(record["scores"][metric]))

    heatmap = []
    for domain, metrics in sorted(domain_rollup.items()):
        heatmap.append({
            "domain": domain,
            "metrics": {
                metric: round(sum(values) / len(values), 2) if values else None
                for metric, values in metrics.items()
            },
        })

    scenario_summary = []
    for scenario_id, series in sorted(by_scenario.items()):
        latest = sorted(series, key=lambda item: item["date"] or "")[-1]
        scenario_summary.append({
            "scenario_id": scenario_id,
            "name": latest["name"],
            "domain": latest["domain"],
            "latest_date": latest["date"],
            "latest_phase": latest["phase"],
            "composite": latest["composite"],
            "scores": latest["scores"],
            "evidence_level": latest["evidence_level"],
            "result": latest["result"],
        })

    evidence_trend = [{
        "scenario_id": item["scenario_id"],
        "date": item["date"],
        "domain": item["domain"],
        "evidence_level": item["evidence_level"],
        "evidence_score": EVIDENCE_VALUE.get(item["evidence_level"], 0),
    } for item in records]

    (out / "coverage-series.json").write_text(json.dumps({"records": records}, indent=2) + "\n", encoding="utf-8")
    (out / "regressions.json").write_text(json.dumps({"regressions": regressions}, indent=2) + "\n", encoding="utf-8")
    (out / "evidence-trend.json").write_text(json.dumps({"records": evidence_trend}, indent=2) + "\n", encoding="utf-8")
    (out / "coverage-heatmap.json").write_text(json.dumps({"domains": heatmap}, indent=2) + "\n", encoding="utf-8")
    (out / "scenario-summary.json").write_text(json.dumps({"scenarios": scenario_summary}, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"records": len(records), "regressions": len(regressions), "domains": len(heatmap), "scenarios": len(scenario_summary)}))

if __name__ == "__main__":
    main()
