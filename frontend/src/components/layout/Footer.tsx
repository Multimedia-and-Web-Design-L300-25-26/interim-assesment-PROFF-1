/*
 * Multi-column Coinbase-style footer used across the public pages.
 * Mirrors the broader company, learn, and support link structure from Coinbase.
 */
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Blog", "Security"],
  },
  {
    title: "Products",
    links: ["Explore", "Advanced trade", "Coinbase One", "Wallet", "Base App"],
  },
  {
    title: "Learn",
    links: ["Crypto basics", "Tips and tutorials", "Market stats", "DeFi", "Glossary"],
  },
  {
    title: "Support",
    links: ["Help center", "Fees", "Tax forms", "Privacy", "Cookie policy"],
  },
];

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-[#0052ff]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0052ff] text-sm font-bold text-white">
                C
              </span>
              Coinbase
            </Link>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              The trusted platform for buying, selling, and managing crypto. Built for learning and practice.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
              <span>English</span>
              <span>USD</span>
              <span>Global</span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">{column.title}</p>
              <ul className="space-y-3 text-sm text-slate-600">
                {column.links.map((item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-slate-900">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Coinbase clone. All rights reserved.</span>
          <span>Built with React, Tailwind CSS, and a Node.js backend.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
