import os
from flask import Blueprint, jsonify, request, make_response
from playwright.sync_api import sync_playwright
from extensions import limiter

resume_blueprint = Blueprint('resume', __name__, url_prefix='/api/resume')

@resume_blueprint.route('/build_pdf', methods=['POST'])
@limiter.limit("10 per minute")
def build_pdf():
    data = request.get_json(silent=True) or {}
    html = data.get("html")
    if not html or not isinstance(html, str):
        return {"message": "Missing html"}, 400

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html, wait_until="networkidle")

        pdf_bytes = page.pdf(
            format="A4",
            print_background=True,
            margin={"top": "16mm", "right": "12mm", "bottom": "16mm", "left": "12mm"},
        )
        browser.close()

    resp = make_response(pdf_bytes)
    resp.headers["Content-Type"] = "application/pdf"
    resp.headers["Content-Disposition"] = 'attachment; filename="download.pdf"'
    return resp
