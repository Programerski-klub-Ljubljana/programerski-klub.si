from pathlib import Path

def init():
    routes = ''
    root = Path('src/routes')
    for name in root.rglob('+page.svelte'):
        name = Path(name).parent
        route = str(Path(name).relative_to(root))
        route = route.replace('.', '')

        print(name)

        routes += f"""
        <url>
            <loc>https://programerski-klub.si/{route}</loc>
        </url>
        """


    return f'''
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    {routes}
    </urlset>
    '''

    with open('static/sitemap.xml', 'w') as f:
        f.write(sitemap)

init()