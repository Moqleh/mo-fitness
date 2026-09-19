from pathlib import Path
from html.parser import HTMLParser
import json, re, sys
import xml.etree.ElementTree as ET

ROOT = Path('mo-fitness')
errors = []
required = [
    'index.html','ai-chat.js','install-mobile.js','exercise-guide.js','exercise-en.js',
    'dbpress-images.js','sw.js','manifest.json','robots.txt','sitemap.xml',
    'privacy.html','disclaimer.html','icon.svg'
]
for name in required:
    if not (ROOT/name).is_file(): errors.append(f'missing required file: {name}')

if not errors:
    index = (ROOT/'index.html').read_text('utf-8')
    ai = (ROOT/'ai-chat.js').read_text('utf-8')
    sw = (ROOT/'sw.js').read_text('utf-8')
    robots = (ROOT/'robots.txt').read_text('utf-8')
    sitemap = (ROOT/'sitemap.xml').read_text('utf-8')

    try: json.loads((ROOT/'manifest.json').read_text('utf-8'))
    except Exception as e: errors.append(f'manifest.json invalid: {e}')
    try: ET.fromstring(sitemap)
    except Exception as e: errors.append(f'sitemap.xml invalid: {e}')

    bad = ['.hero h1{.modal','grid-template-columns:repe@media','<spanconst IMG','<<<<<<<','=======','>>>>>>>']
    for sig in bad:
        if sig in index: errors.append(f'known corruption signature found: {sig}')

    for tag in ('script','style'):
        op = len(re.findall(fr'<{tag}\b', index, re.I))
        cl = len(re.findall(fr'</{tag}\s*>', index, re.I))
        if op != cl: errors.append(f'unbalanced {tag} tags: {op} open / {cl} close')

    class IDs(HTMLParser):
        def __init__(self): super().__init__(); self.ids=[]
        def handle_starttag(self, tag, attrs):
            d=dict(attrs)
            if 'id' in d: self.ids.append(d['id'])
    p=IDs()
    try: p.feed(index)
    except Exception as e: errors.append(f'HTML parser error: {e}')
    dup=sorted({x for x in p.ids if p.ids.count(x)>1})
    if dup: errors.append('duplicate HTML ids: '+', '.join(dup))

    canonical='https://moqleh.github.io/mo-fitness/'
    if f'rel="canonical" href="{canonical}"' not in index:
        errors.append('canonical URL is missing or incorrect')
    if 'Sitemap: https://moqleh.github.io/mo-fitness/sitemap.xml' not in robots:
        errors.append('robots.txt sitemap URL is incorrect')
    for url in [canonical, canonical+'privacy.html', canonical+'disclaimer.html']:
        if url not in sitemap: errors.append(f'sitemap missing {url}')

    m_ai = re.search(r'ai-chat\.js\?v=(\d+)', index)
    m_swreg = re.search(r"register\('sw\.js\?v=(\d+)'", index)
    m_cache = re.search(r"mo-fitness-v(\d+)", sw)
    m_swai = re.search(r'ai-chat\.js\?v=(\d+)', sw)
    versions = [m.group(1) if m else None for m in (m_ai,m_swreg,m_cache,m_swai)]
    if None in versions or len(set(versions)) != 1:
        errors.append(f'AI/service-worker versions do not match: {versions}')

    required_ai = ['isExerciseOnlyQuestion(message)', "scope:'exercise-only'", 'AbortController', '#moAiBtn', 'برنامج رياضي', 'جدول رياضي']
    for token in required_ai:
        if token not in ai: errors.append(f'AI guard/reliability token missing: {token}')
    if "alert(tx('انتهى وقت الراحة'" in index:
        errors.append('blocking timer alert reintroduced')
    if 'deferredPrompt.prompt()' in index:
        errors.append('legacy install handler reintroduced')

    # querySelector ($) returns one element; calling forEach on it breaks all following UI handlers.
    bad_single_selector = re.findall(r"(?<!\$)\$\([^()\n;]*\)\.forEach\s*\(", index)
    if bad_single_selector:
        errors.append(f'single-element selector used with forEach: {len(bad_single_selector)} occurrence(s)')

    local_re=re.compile(r'(?:\./)?(?:assets/[^?#]+|[A-Za-z0-9._-]+\.(?:html|js|json|svg|xml|txt))$')
    for f in list(ROOT.glob('*.html')) + list(ROOT.glob('*.js')):
        text=f.read_text('utf-8')
        for raw in re.findall(r'["\']([^"\']+)["\']', text):
            ref=raw.split('?',1)[0].split('#',1)[0]
            if not local_re.fullmatch(ref):
                continue
            rel=ref[2:] if ref.startswith('./') else ref
            if not (ROOT/rel).exists(): errors.append(f'{f.name} references missing local file: {rel}')

if errors:
    print('MO Fitness validation FAILED:')
    for e in errors: print(' -', e)
    sys.exit(1)
print('MO Fitness validation PASSED')
