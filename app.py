import os
from datetime import date

from flask import Flask, Response, render_template, request, url_for

app = Flask(__name__)

# Set SITE_URL (e.g. https://just-click.example.com) in production so canonical
# links and the sitemap point at the public domain instead of the request host.
SITE_URL = os.environ.get('SITE_URL', '').rstrip('/')


def site_url():
    return SITE_URL or request.url_root.rstrip('/')


@app.context_processor
def inject_site_url():
    return {'site_url': site_url()}


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/robots.txt')
def robots():
    body = f"User-agent: *\nAllow: /\n\nSitemap: {site_url()}{url_for('sitemap')}\n"
    return Response(body, mimetype='text/plain')


@app.route('/sitemap.xml')
def sitemap():
    body = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'  <url><loc>{site_url()}/</loc><lastmod>{date.today().isoformat()}</lastmod></url>\n'
        '</urlset>\n'
    )
    return Response(body, mimetype='application/xml')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=os.environ.get('FLASK_DEBUG') == '1')
