import logging
from app.engines.normalizers.base import discover_normalizers, normalizer_registry

logger = logging.getLogger(__name__)

class NormalizationEngine:
    def __init__(self):
        discover_normalizers()

    def __getattr__(self, name):
        if name.startswith("normalize_"):
            service = name.replace("normalize_", "")
            if service in normalizer_registry:
                return normalizer_registry[service].normalize
            else:
                logger.error(f"No normalizer registered for {service}")
                raise AttributeError(f"No normalizer registered for {service}")
        raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'")

normalizer = NormalizationEngine()
