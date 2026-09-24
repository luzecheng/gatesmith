"""Optional, non-authoritative natural-language interpretation boundary."""

from .adapter import (
    AIInterpretationError,
    AIProvider,
    ProviderUnavailable,
    SchemaError,
    interpret_rule,
    provider_from_environment,
)

__all__ = [
    "AIInterpretationError",
    "AIProvider",
    "ProviderUnavailable",
    "SchemaError",
    "interpret_rule",
    "provider_from_environment",
]
