import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-primary-dark to-slate-900 text-white py-20 md:py-32">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>New Season Essentials • Up to 50% Off</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Discover Your Style, Elevate Your World.
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            Explore thousands of curated premium products across fashion,
            electronics, home essentials, and lifestyle brands with fast,
            hassle-free delivery.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary-light transition-all duration-200 flex items-center gap-2 group"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#categories"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/20 transition-all duration-200"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
