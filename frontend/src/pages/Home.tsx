/*
 * Coinbase-style landing page with hero, market cards, and crypto table preview.
 * Pulls gainers, new listings, and market data from the backend API.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import CryptoCard from "../components/crypto/CryptoCard";
import CryptoRow, { type CryptoAsset } from "../components/crypto/CryptoRow";
import { apiFetch } from "../utils/api";

type ApiResult = {
  message: string;
  cryptos: CryptoAsset[];
};

const learnLinks = [
  {
    title: "USDC: The digital dollar for the global crypto economy",
    href: "/learn",
  },
  {
    title: "Can crypto really replace your bank account?",
    href: "/learn",
  },
  {
    title: "When is the best time to invest in crypto?",
    href: "/learn",
  },
];

function Home() {
  const [gainers, setGainers] = useState<CryptoAsset[]>([]);
  const [newListings, setNewListings] = useState<CryptoAsset[]>([]);
  const [marketRows, setMarketRows] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      try {
        const [gainersData, newData, marketData] = await Promise.all([
          apiFetch<ApiResult>("/crypto/gainers"),
          apiFetch<ApiResult>("/crypto/new"),
          apiFetch<ApiResult>("/crypto"),
        ]);

        if (!active) {
          return;
        }

        setGainers(gainersData.cryptos.slice(0, 6));
        setNewListings(newData.cryptos.slice(0, 6));
        setMarketRows(marketData.cryptos.slice(0, 10));
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load homepage data");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#0a0b0d] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,82,255,0.35),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(0,168,107,0.18),_transparent_25%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">Coinbase clone</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              The future of finance is here.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Trade crypto and more on a platform you can trust. Explore top gainers, new listings, and market
              prices in a Coinbase-inspired experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/signup" variant="primary" size="lg">
                Get started
              </Button>
              <Button as={Link} to="/learn" variant="outline" size="lg" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Learn more
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-400">Stocks and prediction markets are not available in every region.</p>
          </div>

          <Card className="relative overflow-hidden border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Live preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Explore crypto like Bitcoin, Ethereum, and Dogecoin.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {gainers.slice(0, 3).map((crypto) => (
                  <div key={crypto._id} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{crypto.symbol}</p>
                    <p className="mt-2 text-lg font-semibold">{crypto.name}</p>
                    <p className="mt-2 text-sm text-emerald-300">+{crypto.change24h.toFixed(2)}%</p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl bg-white p-4 text-slate-900">
                <p className="text-sm font-semibold text-slate-500">Search assets</p>
                <div className="mt-3 flex items-center justify-between rounded-full border border-slate-200 px-4 py-3">
                  <span className="text-sm text-slate-500">Bitcoin, Ethereum, Solana...</span>
                  <span className="rounded-full bg-[#0052ff] px-3 py-1 text-xs font-semibold text-white">Go</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Top gainers</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Fast-moving assets on the market right now</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              The homepage highlights the coins with the strongest 24h momentum so the layout feels closer to the
              original Coinbase landing page.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {gainers.map((crypto) => (
              <CryptoCard key={crypto._id} crypto={crypto} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">New listings</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Fresh assets added to Coinbase-style markets</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Newly listed cryptos appear here with their latest pricing and 24 hour change.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {newListings.map((crypto) => (
                <CryptoCard key={crypto._id} crypto={crypto} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Market table</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Crypto market preview</h2>
          </div>
          <Button as={Link} to="/explore" variant="outline" size="sm">
            View all assets
          </Button>
        </div>

        {error ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <Card className="mt-6 overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Rank</th>
                  <th className="px-4 py-4">Asset</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">24h change</th>
                  <th className="px-4 py-4">Market cap</th>
                </tr>
              </thead>
              <tbody>
                {marketRows.map((crypto) => (
                  <CryptoRow key={crypto._id} crypto={crypto} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="bg-[#0a0b0d] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">Learn</p>
            <h2 className="mt-3 text-3xl font-semibold">New to crypto? Learn some crypto basics.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Beginner guides, practical tips, and market updates for first-timers and experienced investors.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {learnLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-[#0052ff]/40 hover:bg-white/10"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Read more</p>
                <p className="mt-3 text-lg font-semibold leading-7">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
