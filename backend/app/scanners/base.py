import abc
import pkgutil
import importlib
import logging

logger = logging.getLogger(__name__)

scanner_registry = {
    "regional": {},
    "global": {}
}

def scanner(service: str, scope: str = "regional", priority: int = 100):
    """
    Decorator to register a scanner.
    scope: 'regional' or 'global'
    priority: lower number runs first (e.g. VPC/Subnet should run before EC2)
    """
    def decorator(cls):
        if scope not in scanner_registry:
            raise ValueError(f"Invalid scope '{scope}' for scanner {cls.__name__}")
        scanner_registry[scope][service] = {
            "class": cls,
            "priority": priority,
            "instance": cls() # Instantiate it once
        }
        logger.info(f"[Scanners] Registered {scope} scanner for {service} with priority {priority}")
        return cls
    return decorator

class BaseScanner(abc.ABC):
    @abc.abstractmethod
    def scan(self, credentials: dict, region: str, aws_account_id: str, subnet_map: dict = None, **kwargs) -> dict:
        """
        Base scan method.
        Should return a dict with 'nodes' and 'edges'.
        """
        pass

def discover_scanners(package_name="app.scanners"):
    """
    Dynamically discover and import all scanner modules.
    This triggers the @scanner decorator.
    """
    import app.scanners
    for _, module_name, _ in pkgutil.iter_modules(app.scanners.__path__):
        if module_name != "base":
            try:
                importlib.import_module(f"{package_name}.{module_name}")
            except Exception as e:
                logger.error(f"Failed to load scanner module {module_name}: {e}")

def get_scanners(scope: str = "regional"):
    """
    Return sorted list of (service_name, scanner_instance) based on priority.
    """
    scanners = scanner_registry.get(scope, {})
    sorted_scanners = sorted(scanners.items(), key=lambda item: item[1]["priority"])
    return [(service, data["instance"]) for service, data in sorted_scanners]
