"""
Extraction step (Standardisation Engine, layer 3).

Vercel deploys any file under /api as a serverless function. This endpoint
turns a raw evidence payload (interview transcript, document text, or event
log) into candidate steps using the controlled vocabulary, then returns them
for the SME validation checkpoint. It never auto-commits — a human confirms.

POST /api/extract
  body: { "process_id": "...", "source": "people|documents|system", "text": "..." }
  -> { "candidate_steps": [ ... ] }
"""

import json
import re
from http.server import BaseHTTPRequestHandler

# Controlled vocabularies — mirror src/lib/types.ts and the DB enums.
ACTIONS = ["create", "review", "approve", "reject", "update", "notify", "reconcile"]
SYSTEMS = ["sap", "salesforce", "servicenow", "excel", "email"]

VALID_SOURCES = {"people", "documents", "system"}


def extract_candidate_steps(process_id: str, source: str, text: str):
    """Naive, deterministic first-pass extraction.

    Split the input into sentence-like units and map detected verbs/systems
    onto the controlled vocabulary. Real deployments swap this for an LLM or
    NLP model, but the contract (controlled fields out, stage='candidate') and
    the downstream human checkpoint stay identical.
    """
    units = [u.strip() for u in re.split(r"[.\n;]+", text or "") if u.strip()]
    steps = []
    for i, unit in enumerate(units, start=1):
        low = unit.lower()
        action = next((a for a in ACTIONS if a in low), None)
        system = next((s for s in SYSTEMS if s in low), None)
        steps.append({
            "process_id": process_id,
            "source": source,
            "seq": i,
            "step_name": unit[:120],
            "action": action.capitalize() if action else None,
            "system": system.upper() if system else None,
            "step_kind": "decision" if "if" in low or "approve" in low else "task",
            "stage": "candidate",        # never 'committed' — SME must validate
        })
    return steps


def build_response(payload: dict):
    process_id = payload.get("process_id")
    source = payload.get("source")
    text = payload.get("text", "")

    if not process_id:
        return 400, {"error": "process_id is required"}
    if source not in VALID_SOURCES:
        return 400, {"error": f"source must be one of {sorted(VALID_SOURCES)}"}

    steps = extract_candidate_steps(process_id, source, text)
    return 200, {"process_id": process_id, "source": source, "candidate_steps": steps}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw or b"{}")
        except (ValueError, json.JSONDecodeError):
            status, body = 400, {"error": "invalid JSON body"}
        else:
            status, body = build_response(payload)

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(body).encode("utf-8"))

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok", "endpoint": "extract"}).encode())
