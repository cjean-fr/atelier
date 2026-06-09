/** @jsxImportSource @cjean-fr/jsx-string */
import { renderToString } from "@cjean-fr/jsx-string";
import type { Purchase } from "./data.js";

function Purchase({ name, price, quantity }: Purchase) {
  return (
    <div class="purchase purchase-card">
      <div class="purchase-name">{name}</div>
      <div class="purchase-price">{price}</div>
      <div class="purchase-quantity">{quantity}</div>
    </div>
  );
}

function Layout({ children, head }: any) {
  return (
    <html lang="en">
      {head}
      <body>{children}</body>
    </html>
  );
}

function Head({ title }: { title: string }) {
  return (
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <meta name="description" content="A description" />
      <meta name="keywords" content="some, keywords" />
      <meta name="author" content="Some Author" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@site" />
      <meta name="twitter:title" content="Title" />
      <meta name="twitter:description" content="A description" />
      <meta name="twitter:creator" content="@creator" />
      <meta name="twitter:image" content="image.jpg" />
      <meta content="Title" />
      <meta content="website" />
      <link rel="stylesheet" href="styles.css" />
      <script src="script.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/axios-cache-interceptor@1/dev/index.bundle.js" />
      <script src="https://cdn.jsdelivr.net/npm/axios-cache-interceptor@1/dist/index.bundle.js" />
    </head>
  );
}

function Header({ name }: { name: string }) {
  return (
    <header class="header">
      <h1 class="header-title">Hello {name}</h1>
      <nav class="header-nav">
        <ul class="header-ul">
          <li class="header-item">
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Footer({ name }: { name: string }) {
  return (
    <footer class="footer">
      <p class="footer-year">© {name}</p>
      <p class="footer">
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
      </p>
    </footer>
  );
}

function Main({ children, name }: any) {
  const header = Header({ name });
  const footer = Footer({ name });
  return (
    <div>
      {header}
      <main class="main-content">{children}</main>
      {footer}
    </div>
  );
}

function UserProfile({ name }: { name: string }) {
  return (
    <section class="user-profile">
      <h2 class="user-profile title">User Profile</h2>
      <p class="user-profile name">Name: {name}</p>
      <p class="user-profile info">Email: example@example.com</p>
      <p class="user-profile info">Address: 123 Main St, City, Country</p>
      <p class="user-profile info">Phone: 123-456-7890</p>
    </section>
  );
}

function Sidebar({ purchases }: { purchases: Purchase[] }) {
  return (
    <aside class="sidebar">
      <h2 class="purchase title">Recent Purchases</h2>
      <ul class="purchase list">
        {purchases.slice(0, 3).map((p) => (
          <li class="purchase-preview">
            {p.name} - ${p.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function PageContent() {
  return (
    <div class="page-content">
      <h2 class="title h2 mb-4">Welcome to our store</h2>
      <p class="p text mb-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis
        magna id dolor ultricies, eget pretium ligula sodales. Cras sit amet
        turpis nec lacus blandit placerat. Sed vestibulum est sit amet enim
        ultrices rutrum. Vivamus in nulla vel nunc interdum vehicula.
      </p>
      <p class="p text mb-0">
        Pellentesque efficitur tellus id velit vehicula laoreet. Proin et neque
        ac dolor hendrerit elementum. Fusce auctor metus non ligula tincidunt,
        id gravida odio sollicitudin.
      </p>
    </div>
  );
}

function RealWorldPage(name: string, purchases: Purchase[]) {
  const head = Head({ title: "Real World Example" });
  const body = [
    <h2>Purchases</h2>,
    <div class="purchases">
      {purchases.map((p) =>
        Purchase({ name: p.name, price: p.price, quantity: p.quantity })
      )}
    </div>,
    UserProfile({ name }),
    Sidebar({ purchases }),
    PageContent(),
  ];
  return Layout({
    children: Main({ children: body, name }),
    head,
  });
}

export const render = async (
  name: string,
  purchases: Purchase[],
): Promise<string> => renderToString(RealWorldPage(name, purchases));
