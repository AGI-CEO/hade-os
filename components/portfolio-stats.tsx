"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Home, DollarSign, Loader2 } from "lucide-react";

// Define the type for portfolio stats
type PortfolioStatsType = {
  totalValue: number;
  totalProperties: number;
  monthlyIncome: number;
  annualReturn: number;
  occupancyRate: number;
  equityGrowth: number;
};

// Default/fallback portfolio data
const defaultStats: PortfolioStatsType = {
  totalValue: 0,
  totalProperties: 0,
  monthlyIncome: 0,
  annualReturn: 0,
  occupancyRate: 0,
  equityGrowth: 0,
};

export function PortfolioStats() {
  const [stats, setStats] = useState<PortfolioStatsType>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch portfolio stats
  const fetchPortfolioStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/portfolio/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching portfolio stats:", err);
      setError("Failed to load portfolio statistics");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchPortfolioStats();
  }, []);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchPortfolioStats();
    };

    window.addEventListener("refresh-portfolio-stats", handleRefresh);

    return () => {
      window.removeEventListener("refresh-portfolio-stats", handleRefresh);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="p-6 rounded-lg border border-border bg-card/50"
      >
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <h3 className="text-2xl font-bold text-primary glow-text">
                {formatCurrency(stats.totalValue)}
              </h3>
              <p
                className={`text-sm ${
                  stats.equityGrowth >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.equityGrowth >= 0 ? "+" : ""}
                {formatPercentage(stats.equityGrowth)} in 30 days
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="p-6 rounded-lg border border-border bg-card/50"
      >
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Properties</p>
              <h3 className="text-2xl font-bold text-primary glow-text">
                {stats.totalProperties}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatPercentage(stats.occupancyRate)} occupied
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="p-6 rounded-lg border border-border bg-card/50"
      >
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <h3 className="text-2xl font-bold text-primary glow-text">
                {formatCurrency(stats.monthlyIncome)}
              </h3>
              <p
                className={`text-sm ${
                  stats.annualReturn >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.annualReturn >= 0 ? "+" : ""}
                {formatPercentage(stats.annualReturn)} in 30 days
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
