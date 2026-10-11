"""The only XML parser used on fetched data."""
import xml.etree.ElementTree as ET
from xml.parsers import expat


def xml_root(raw):
    """Parse XML bytes as UTF-8 with the parser itself refusing any DTD, so no encoding trick can hide one."""
    def refuse(*_):  # a feed needs no DTD; refusing one blocks entity-expansion attacks
        raise ValueError('feed contains a DTD, refusing to parse it')

    def name(tag):  # expat gives "uri}local"; ElementTree wants "{uri}local"
        return '{' + tag if '}' in tag else tag

    builder = ET.TreeBuilder()
    parser = expat.ParserCreate(encoding='utf-8', namespace_separator='}')
    parser.StartDoctypeDeclHandler = parser.EntityDeclHandler = refuse
    parser.StartElementHandler = lambda tag, attrs: builder.start(name(tag), {name(k): v for k, v in attrs.items()})
    parser.EndElementHandler = lambda tag: builder.end(name(tag))
    parser.CharacterDataHandler = builder.data
    try:
        parser.Parse(raw, True)
    except expat.ExpatError as e:
        raise ValueError(f'feed is not well-formed UTF-8 XML: {e}')
    return builder.close()
