"""Small provider boundary for proposed Boolean interpretations.

The provider may suggest an expression, but it never compiles or verifies an
artifact. The deterministic core remains the only authority for parsing,
truth tables, compilation, and encoded bytes.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
import os
import re
from typing import Any, Mapping, Protocol
from urllib import error, request

from gatesmith_core import ParseError, parse


class AIInterpretationError(ValueError):
    """The provider response cannot be used as a proposed interpretation."""


class SchemaError(AIInterpretationError):
    """The provider response does not satisfy the public proposal schema."""


class ProviderUnavailable(RuntimeError):
    """No configured provider can answer the optional AI request."""


class AIProvider(Protocol):
    def interpret(self, user_text: str) -> Mapping[str, Any]:
        """Return an untrusted structured proposal."""


OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"


SYSTEM_PROMPT = """You propose simple Boolean rules for GateSmith.
Return JSON only with this shape:
{
  "inputs": [{"name": "A", "meaning": "..."}],
  "expression": "(A AND B) OR C",
  "explanation": "...",
  "ambiguity": "" or "...",
  "warnings": ["..."]
}
Use at most A, B, C, D. Use only AND, OR, NOT, parentheses, and variables.
Never return NAND, netlist bytes, truth tables, hashes, transactions, or claims
that anything is verified. If the request is ambiguous or unsupported, say so
in ambiguity/warnings rather than inventing a meaning."""


PROPOSAL_JSON_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "inputs": {
            "type": "array",
            "minItems": 1,
            "maxItems": 4,
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "name": {"type": "string", "enum": ["A", "B", "C", "D"]},
                    "meaning": {"type": "string", "minLength": 1},
                },
                "required": ["name", "meaning"],
            },
        },
        "expression": {"type": "string", "minLength": 1},
        "explanation": {"type": "string"},
        "ambiguity": {"type": "string"},
        "warnings": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["inputs", "expression", "explanation", "ambiguity", "warnings"],
}


def _string(value: Any, field: str) -> str:
    if not isinstance(value, str):
        raise SchemaError(f"{field} must be a string")
    return value.strip()


def validate_proposal(raw: Mapping[str, Any]) -> dict[str, Any]:
    """Validate shape and grammar, without producing authoritative metadata."""
    if not isinstance(raw, Mapping):
        raise SchemaError("AI response must be an object")
    forbidden = {"truth_table", "netlist", "netlist_bytes", "hash", "netlist_sha256", "transaction", "signature"}
    supplied_forbidden = forbidden.intersection(raw.keys())
    if supplied_forbidden:
        raise SchemaError(f"AI response attempted to provide authoritative fields: {sorted(supplied_forbidden)}")
    expression = _string(raw.get("expression"), "expression")
    explanation = _string(raw.get("explanation", ""), "explanation")
    ambiguity = _string(raw.get("ambiguity", ""), "ambiguity")
    warnings_raw = raw.get("warnings", [])
    if not isinstance(warnings_raw, list) or not all(isinstance(item, str) for item in warnings_raw):
        raise SchemaError("warnings must be a list of strings")
    inputs_raw = raw.get("inputs")
    if not isinstance(inputs_raw, list) or not inputs_raw:
        raise SchemaError("inputs must be a non-empty list")
    inputs: list[dict[str, str]] = []
    names: set[str] = set()
    for item in inputs_raw:
        if not isinstance(item, Mapping):
            raise SchemaError("each input must be an object")
        name = _string(item.get("name"), "input.name")
        meaning = _string(item.get("meaning"), "input.meaning")
        if name not in {"A", "B", "C", "D"}:
            raise SchemaError(f"unsupported variable {name}")
        if name in names:
            raise SchemaError(f"duplicate variable {name}")
        if not meaning:
            raise SchemaError(f"input {name} needs a meaning")
        names.add(name)
        inputs.append({"name": name, "meaning": meaning})
    if len(inputs) > 4:
        raise SchemaError("more than 4 variables are not supported")
    try:
        parse(expression)
    except ParseError as exc:
        raise SchemaError(f"proposed expression rejected by deterministic parser: {exc}") from exc
    expression_names = set(re.findall(r"\b[A-D]\b", expression))
    if expression_names != names:
        raise SchemaError("inputs must exactly match variables used by expression")
    return {
        "inputs": inputs,
        "expression": expression,
        "explanation": explanation,
        "ambiguity": ambiguity,
        "warnings": [item.strip() for item in warnings_raw if item.strip()],
        "verified": False,
        "authority": "ai_proposal_only",
    }


@dataclass
class JsonHttpProvider:
    """OpenRouter Chat Completions boundary; credentials stay server-side."""

    endpoint: str
    api_key: str
    model: str = ""

    def interpret(self, user_text: str) -> Mapping[str, Any]:
        body = json.dumps({
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text},
            ],
            "temperature": 0,
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "gatesmith_interpretation",
                    "strict": True,
                    "schema": PROPOSAL_JSON_SCHEMA,
                },
            },
            "provider": {"require_parameters": True},
        }).encode("utf-8")
        req = request.Request(
            self.endpoint,
            data=body,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {self.api_key}"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=15) as response:
                payload = json.loads(response.read())
        except (error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise ProviderUnavailable("AI provider request failed") from exc
        try:
            content = payload["choices"][0]["message"]["content"]
            proposal = json.loads(content) if isinstance(content, str) else content
        except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
            raise SchemaError("OpenRouter response did not contain JSON proposal content") from exc
        if not isinstance(proposal, Mapping):
            raise SchemaError("OpenRouter response content was not a proposal object")
        return proposal


class NoProvider:
    def interpret(self, user_text: str) -> Mapping[str, Any]:
        raise ProviderUnavailable("AI is not configured; use the deterministic expression workflow")


def provider_from_environment() -> AIProvider:
    endpoint = os.environ.get("GATESMITH_AI_ENDPOINT", OPENROUTER_ENDPOINT).strip()
    api_key = os.environ.get("GATESMITH_AI_API_KEY", "").strip()
    model = os.environ.get("GATESMITH_AI_MODEL", "openai/gpt-4o-mini").strip()
    if not api_key:
        return NoProvider()
    if endpoint != OPENROUTER_ENDPOINT:
        raise ProviderUnavailable("GATESMITH_AI_ENDPOINT must be the official OpenRouter endpoint")
    if not model:
        raise ProviderUnavailable("GATESMITH_AI_MODEL is empty")
    return JsonHttpProvider(endpoint=endpoint, api_key=api_key, model=model)


def interpret_rule(user_text: str, provider: AIProvider | None = None) -> dict[str, Any]:
    if not isinstance(user_text, str) or not user_text.strip():
        raise SchemaError("rule description is empty")
    if len(user_text) > 2000:
        raise SchemaError("rule description is too long")
    selected = provider or provider_from_environment()
    raw = selected.interpret(user_text.strip())
    return validate_proposal(raw)
