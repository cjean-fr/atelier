import { jsxEscape, jsxTemplate } from "@cjean-fr/jsx-string/jsx-runtime";
import { renderToString } from "@cjean-fr/jsx-string";
//#region \0@oxc-project+runtime@0.132.0/helpers/taggedTemplateLiteral.js
function _taggedTemplateLiteral(e, t) {
	return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
//#endregion
//#region src/realworld/precompile-src.tsx
/** @jsxImportSource @cjean-fr/jsx-string */
var _templateObject;
function Purchase({ name, price, quantity }) {
	return jsxTemplate`<div class="purchase purchase-card"><div class="purchase-name">${jsxEscape(name)}</div><div class="purchase-price">${jsxEscape(price)}</div><div class="purchase-quantity">${jsxEscape(quantity)}</div></div>`;
}
function Layout({ children, head }) {
	return jsxTemplate`<html lang="en">${jsxEscape(head)}<body>${jsxEscape(children)}</body></html>`;
}
function Head({ title }) {
	return jsxTemplate(_templateObject || (_templateObject = _taggedTemplateLiteral(["<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>", "</title><meta name=\"description\" content=\"A description\"><meta name=\"keywords\" content=\"some, keywords\"><meta name=\"author\" content=\"Some Author\"><meta name=\"twitter:card\" content=\"summary\"><meta name=\"twitter:site\" content=\"@site\"><meta name=\"twitter:title\" content=\"Title\"><meta name=\"twitter:description\" content=\"A description\"><meta name=\"twitter:creator\" content=\"@creator\"><meta name=\"twitter:image\" content=\"image.jpg\"><meta content=\"Title\"><meta content=\"website\"><link rel=\"stylesheet\" href=\"styles.css\"><script src=\"script.js\"><\/script><script src=\"https://cdn.jsdelivr.net/npm/axios-cache-interceptor@1/dev/index.bundle.js\"><\/script><script src=\"https://cdn.jsdelivr.net/npm/axios-cache-interceptor@1/dist/index.bundle.js\"><\/script></head>"])), jsxEscape(title));
}
function Header({ name }) {
	return jsxTemplate`<header class="header"><h1 class="header-title">Hello ${jsxEscape(name)}</h1><nav class="header-nav"><ul class="header-ul"><li class="header-item"><a href="/">Home</a></li><li><a href="/about">About</a></li></ul></nav></header>`;
}
function Footer({ name }) {
	return jsxTemplate`<footer class="footer"><p class="footer-year">© ${jsxEscape(name)}</p><p class="footer"><a href="/terms">Terms</a><a href="/privacy">Privacy</a></p></footer>`;
}
function Main({ children, name }) {
	const header = Header({ name });
	const footer = Footer({ name });
	return jsxTemplate`<div>${jsxEscape(header)}<main class="main-content">${jsxEscape(children)}</main>${jsxEscape(footer)}</div>`;
}
function UserProfile({ name }) {
	return jsxTemplate`<section class="user-profile"><h2 class="user-profile title">User Profile</h2><p class="user-profile name">Name: ${jsxEscape(name)}</p><p class="user-profile info">Email: example@example.com</p><p class="user-profile info">Address: 123 Main St, City, Country</p><p class="user-profile info">Phone: 123-456-7890</p></section>`;
}
function Sidebar({ purchases }) {
	return jsxTemplate`<aside class="sidebar"><h2 class="purchase title">Recent Purchases</h2><ul class="purchase list">${purchases.slice(0, 3).map((p) => jsxTemplate`<li class="purchase-preview">${jsxEscape(p.name)} - $${jsxEscape(p.price.toFixed(2))}</li>`)}</ul></aside>`;
}
function PageContent() {
	return jsxTemplate`<div class="page-content"><h2 class="title h2 mb-4">Welcome to our store</h2><p class="p text mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis magna id dolor ultricies, eget pretium ligula sodales. Cras sit amet turpis nec lacus blandit placerat. Sed vestibulum est sit amet enim ultrices rutrum. Vivamus in nulla vel nunc interdum vehicula.</p><p class="p text mb-0">Pellentesque efficitur tellus id velit vehicula laoreet. Proin et neque ac dolor hendrerit elementum. Fusce auctor metus non ligula tincidunt, id gravida odio sollicitudin.</p></div>`;
}
function RealWorldPage(name, purchases) {
	const head = Head({ title: "Real World Example" });
	return Layout({
		children: Main({
			children: [
				jsxTemplate`<h2>Purchases</h2>`,
				jsxTemplate`<div class="purchases">${jsxEscape(purchases.map((p) => Purchase({
					name: p.name,
					price: p.price,
					quantity: p.quantity
				})))}</div>`,
				UserProfile({ name }),
				Sidebar({ purchases }),
				PageContent()
			],
			name
		}),
		head
	});
}
var render = async (name, purchases) => renderToString(RealWorldPage(name, purchases));
//#endregion
export { render };
