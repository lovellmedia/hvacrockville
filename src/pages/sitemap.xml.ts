import type { APIRoute } from 'astro';

const domain = 'https://hvacrockville.com';
const routes = [
  "/",
  "/services/",
  "/about/",
  "/contact/",
  "/seo-landing/",
  "/blog/",
  "/blog/post/",
  "/glossary/",
  "/glossary/term/"
];

export const GET: APIRoute = () => new Response(
  '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    routes.map((route) => '<url><loc>' + domain + route + '</loc></url>').join('') +
    '</urlset>',
  { headers: { 'Content-Type': 'application/xml' } }
);
