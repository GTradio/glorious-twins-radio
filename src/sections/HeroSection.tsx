interface HeroSectionProps {
  onListenLive: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onListenLive }) => {
  return (
    <div className="relative min-h-screen flex bg-[url('/studio-bg.jpg')] bg-gray-900 dark:bg-black bg-cover bg-center items-center justify-center  overflow-hidden">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
            Welcome to{" "}
            <span className="text-emerald-400 inline-block">
              GloriousTwins Radio
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tune in to the heartbeat of Ibadan — your ultimate source for
            uplifting music, inspiring voices, and unforgettable moments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              type="button"
              onClick={onListenLive}
              className="w-full cursor-pointer sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform"
            >
              Download App
            </button>
            <button
              type="button"
              onClick={onListenLive}
              className="w-full sm:w-auto cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform"
            >
              Tune In
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Ambient light effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default HeroSection;
