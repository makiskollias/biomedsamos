import os
import smtplib
from email.mime.text import MIMEText

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


# ---------------------------------------------------------------------------
# Legacy URL redirects (301 Permanent)
# Add old_path → new_path entries here as more legacy URLs are discovered.
# Unknown URLs are NOT redirected; they return a real HTTP 404.
# ---------------------------------------------------------------------------
LEGACY_REDIRECTS = {
    "/el": "/",
    "/el/": "/",
}


def _register_legacy_redirects() -> None:
    for old_path, new_path in LEGACY_REDIRECTS.items():
        async def _redirect(target: str = new_path) -> RedirectResponse:
            return RedirectResponse(url=target, status_code=301)

        _redirect.__name__ = "legacy_redirect_" + (old_path.strip("/").replace("/", "_") or "root")
        app.add_api_route(
            old_path,
            _redirect,
            methods=["GET"],
            include_in_schema=False,
        )


_register_legacy_redirects()


@app.get("/", response_class=HTMLResponse)
async def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})


@app.head("/")
async def landing_head():
    return HTMLResponse(content="")

@app.post("/contact")
async def contact(
    name: str = Form(...),
    phone: str = Form(""),
    email: str = Form(...),
    message: str = Form(...),
    website: str = Form(""),
):
    if website:
        return RedirectResponse(url="/", status_code=303)

    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    contact_to = os.getenv("CONTACT_TO", "info@biomedsamos.gr")

    if not smtp_user or not smtp_password:
        return RedirectResponse(url="/?contact_error=1#contact", status_code=303)

    body = f"""
Νέο μήνυμα από το biomedsamos.gr

Ονοματεπώνυμο: {name}
Τηλέφωνο: {phone or "Δεν δηλώθηκε"}
Email: {email}

Μήνυμα:
{message}
""".strip()

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = "Νέο μήνυμα από το biomedsamos.gr"
    msg["From"] = smtp_user
    msg["To"] = contact_to

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception:
        return RedirectResponse(url="/?contact_error=1#contact", status_code=303)

    return RedirectResponse(url="/?contact_success=1#contact", status_code=303)

@app.get("/sitemap.xml")
async def sitemap():
    return FileResponse("static/sitemap.xml")


@app.get("/robots.txt")
async def robots():
    return FileResponse("static/robots.txt")


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return templates.TemplateResponse("404.html", {"request": request}, status_code=404)