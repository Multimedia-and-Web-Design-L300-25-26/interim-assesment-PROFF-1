/*
 * Explore page with searchable, filterable crypto table data from the backend.
 * Supports All assets, Top gainers, and New listings views.
 */
import { useEffect, useMemo, useState } from "react";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import CryptoRow, { type CryptoAsset } from "../components/crypto/CryptoRow";
import { apiFetch } from "../utils/api";

type ApiResult = {
  message: string;
  cryptos: CryptoAsset[];
};

const tabs = ["All assets", "Top gainers", "New listings"] as const;

function Explore() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All assets");
  const [query, setQuery] = useState("");
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAssets() {
      try {
        const data = await apiFetch<ApiResult>("/crypto");
        if (active) {
          setCryptos(data.cryptos);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load assets");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAssets();

    return () => {
      active = false;
    };
  }, []);

  const filteredCryptos = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    let items = [...cryptos];

    if (activeTab === "Top gainers") {
      items = items.filter((item) => item.change24h > 0).sort((a, b) => b.change24h - a.change24h);
    } else if (activeTab === "New listings") {
      items = items.slice().sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    } else {
      items = items.slice().sort((a, b) => b.marketCap - a.marketCap);
    }

    if (!normalizedQuery) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) || item.symbol.toLowerCase().includes(normalizedQuery)
    );
  }, [activeTab, cryptos, query]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Explore crypto</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Crypto market prices</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Search and compare assets with a Coinbase-inspired table view. Each row links to the asset detail page.
          </p>
        </div>

        <label className="w-full max-w-md">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search by name or symbol"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0052ff]"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-[#0052ff] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-[#0052ff]/30 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <Card className="mt-8 overflow-hidden border border-slate-200">
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
              {filteredCryptos.map((crypto) => (
                <CryptoRow key={crypto._id} crypto={crypto} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Explore;
