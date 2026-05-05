/*
 * Asset detail page that loads the selected crypto by symbol from the API.
 * Includes a chart placeholder and buy/sell action buttons for the UI.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import type { CryptoAsset } from "../components/crypto/CryptoRow";
import { apiFetch } from "../utils/api";

type ApiResult = {
  message: string;
  cryptos: CryptoAsset[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function AssetDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAsset() {
      try {
        const data = await apiFetch<ApiResult>("/crypto");
        if (active) {
          setCryptos(data.cryptos);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load asset");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAsset();

    return () => {
      active = false;
    };
  }, []);

  const asset = useMemo(
    () => cryptos.find((item) => item.symbol.toLowerCase() === symbol?.toLowerCase()) ?? null,
    [cryptos, symbol]
  );

  if (loading) {
    return <Spinner />;
  }

  if (!asset) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0052ff]">Asset not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">We could not find that symbol.</h1>
        <button
          type="button"
          onClick={() => navigate("/explore")}
          className="mt-6 rounded-full bg-[#0052ff] px-5 py-3 text-sm font-semibold text-white"
        >
          Back to explore
        </button>
      </div>
    );
  }

  const changeIsPositive = asset.change24h >= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {error ? <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={asset.logo || "https://placehold.co/80x80/0052ff/ffffff?text=C"}
                  alt={asset.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0052ff]">Asset detail</p>
                  <h1 className="mt-1 text-3xl font-semibold text-slate-900">
                    {asset.name} <span className="text-slate-400">({asset.symbol})</span>
                  </h1>
                </div>
              </div>

              <div className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${changeIsPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {changeIsPositive ? "+" : ""}{asset.change24h.toFixed(2)}% 24h
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Price</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(asset.price)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Market cap</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(asset.marketCap)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rank</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">#{asset.rank ?? "-"}</p>
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0052ff]">Chart</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Price movement</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
                  <span key={range} className="rounded-full border border-slate-200 px-3 py-1">
                    {range}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-[#0052ff]/10" />
                <p className="mt-4 text-sm font-semibold text-slate-700">Chart placeholder</p>
                <p className="mt-1 text-sm text-slate-500">A real chart library is not required for this exam build.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Trade {asset.symbol}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Review the current price and place a buy or sell order from this UI. The buttons are intentionally
              presentational only.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="primary" size="lg" className="w-full">
                Buy
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Sell
              </Button>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">About {asset.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {asset.description || `${asset.name} is a market asset shown in the Coinbase clone project.`}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;
