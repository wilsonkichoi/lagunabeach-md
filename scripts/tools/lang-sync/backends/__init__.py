"""
backends/ — Translation backend abstraction layer.

Design goal (2026-05-12): maximum modularity, abstraction, swappability so the system
operates independently of specific models and service providers.

Public interface:

    from backends import build_cascade, get_backend

    # Hand-roll a cascade (Tier 1.5 first → fallback chain):
    cascade = TranslationCascade([
        CodexBackend(),
        OpenRouterBackend(model="openrouter/owl-alpha"),
        OpenRouterBackend(model="openai/gpt-oss-120b:free"),
        GeminiBackend(),
        OllamaBackend(model="qwen3.6:35b-a3b-coding-nvfp4"),
    ])
    output, used = cascade.translate(system, user)

    # Or load default cascade from config:
    cascade = build_cascade()
"""
from ._base import (
    BackendBadOutput,
    BackendCapabilities,
    BackendError,
    BackendRateLimited,
    BackendRefusal,
    BackendStats,
    BackendTimeout,
    BackendUnavailable,
    TranslationBackend,
)
from ._prompt import build_translation_prompt, extract_zh_frontmatter_fields, LANG_NAMES
from .codex import CodexBackend
from .gemini import GeminiBackend
from .ollama import OllamaBackend
from .openrouter import OpenRouterBackend

__all__ = [
    # base
    "TranslationBackend",
    "BackendCapabilities",
    "BackendStats",
    # errors
    "BackendError",
    "BackendBadOutput",
    "BackendRateLimited",
    "BackendRefusal",
    "BackendTimeout",
    "BackendUnavailable",
    # concrete
    "CodexBackend",
    "GeminiBackend",
    "OllamaBackend",
    "OpenRouterBackend",
    # prompt builder
    "build_translation_prompt",
    "extract_zh_frontmatter_fields",
    "LANG_NAMES",
]
