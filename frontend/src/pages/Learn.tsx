/*
 * Static Coinbase Learn page that mirrors the card-based educational layout.
 * No API calls are used on this page by design.
 */
import { Link } from "react-router-dom";
import Card from "../components/common/Card";

const featuredCards = [
  {
    title: "What is cryptocurrency?",
    description: "Understand the basics of digital assets and how they differ from traditional money.",
    tag: "Beginner's guide",
  },
  {
    title: "How to earn crypto rewards",
    description: "Learn the common ways people earn rewards while holding or using crypto.",
    tag: "Getting started",
  },
  {
    title: "How to add crypto to your Coinbase Wallet",
    description: "See the flow for moving assets into a self-custody wallet.",
    tag: "Getting started",
  },
  {
    title: "Tax forms, explained",
    description: "A practical look at common tax documents and how they connect to crypto reporting.",
    tag: "Your crypto",
  },
  {
    title: "Beginner's guide to dapps",
    description: "A simple introduction to decentralized applications and the problems they solve.",
    tag: "Getting started",
  },
  {
    title: "Everything you need to know about the first-ever U.S. Bitcoin ETF",
    description: "Read a market update about one of the major topics in crypto investing.",
    tag: "Market update",
  },
];

const topicChips = [
  "Bitcoin",
  "Blockchain",
  "Cardano",
  "Crypto wallet",
  "DeFi",
  "Ethereum",
  "Fork",
  "Inflation",
  "Market cap",
  "NFT",
  "Private key",
  "Protocol",
  "Smart contract",
  "Token",
  "Volatility",
];

function Learn() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Learn</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">Crypto questions, answered.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Beginner guides, practical tips, and market updates for first-timers, experienced investors, and everyone
            in between.
          </p>
        </div>

        <Card className="border border-slate-200 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Featured</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">When is the best time to invest in crypto?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Learn more about using dollar-cost averaging to weather price volatility and build a steady investing
            habit.
          </p>
          <Link to="/learn" className="mt-6 inline-flex text-sm font-semibold text-[#0052ff]">
            Read more
          </Link>
        </Card>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap gap-3">
          {topicChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Popular</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Featured learning cards</h2>
          </div>
          <Link to="/learn" className="text-sm font-semibold text-[#0052ff]">
            See more
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredCards.map((card) => (
            <Card key={card.title} className="border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0052ff]">{card.tag}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              <Link to="/learn" className="mt-5 inline-flex text-sm font-semibold text-[#0052ff]">
                Read more
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Learn;
