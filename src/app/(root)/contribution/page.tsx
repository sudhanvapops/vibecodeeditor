import { Heart, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import Carousel from "@/modules/contribution/components/Contributions/Carousel/Carousel";

import { getContributionSummary } from "@/modules/contribution/actions/contriButionSummary";



export default async function ContributionPage() {

  const {
    totalAmount,
    totalContributors,
    topContributors
  } = await getContributionSummary();



  const formatCurrency = (amount: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);



  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Section */}
      <header className="relative z-10 text-center pt-16 pb-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <Sparkles className="text-indigo-400" size={16} />
          <span className="text-sm text-indigo-300 font-medium">Community Contributions</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
          Making a Difference
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
          Join our amazing community of contributors who are making an impact every day
        </p>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-500/10">
                <TrendingUp className="text-indigo-400" size={24} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-slate-400">Total Raised</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Users className="text-purple-400" size={24} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-100">{totalContributors}</p>
                <p className="text-sm text-slate-400">Contributors</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap justify-center gap-6">
        <h1 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Top Contributors</h1>
      </div>

      {/* Carousel Section */}
      <section className="relative z-10 py-8">
        <Carousel contributions={topContributors} />
      </section>


      {/* Donate Button */}
      <div className="relative z-10 text-center py-16 px-4">
        <Link href="/contribution/payment">
          <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300 hover:scale-105 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Heart className="relative z-10 group-hover:scale-110 transition-transform" size={24} fill="currentColor" />
            <span className="relative z-10">Donate Now</span>
            <Sparkles className="relative z-10 group-hover:rotate-12 transition-transform" size={20} />
          </button>
        </Link>

        <p className="mt-4 text-slate-400 text-sm">
          Every contribution makes a difference ✨
        </p>
      </div>


      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-500 text-sm border-t border-slate-800/50">
        <p>Thank you for your generosity and support 💙</p>
      </footer>
    </div>
  );
}