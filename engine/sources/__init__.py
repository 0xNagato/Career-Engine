"""Registry of job sources. Each module has NAME, PREFIXES, MIN_HOURS, fetch() -> bytes and parse(bytes) -> jobs."""
from sources import boards, himalayas, hn_hiring, jobicy, larajobs, remoteok, remotive, weworkremotely, workingnomads

SOURCES = {m.NAME: m for m in (himalayas, remotive, remoteok, weworkremotely, jobicy, workingnomads, larajobs, hn_hiring, boards)}
