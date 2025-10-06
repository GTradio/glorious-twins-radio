import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          About us
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Images Column - Layered on Desktop, Single on Mobile */}
          <div className="relative">
            {/* Mobile: Show only first image */}
            <div className="md:hidden relative h-64 w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/about.png"
                alt="Radio station lights"
                fill
                className="object-cover"
              />
            </div>

            {/* Desktop: Layered images */}
            <div className="hidden md:block relative h-[400px]">
              {/* Back Image */}
              <div className="absolute top-0 left-0 w-[85%] h-[280px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/about.png"
                  alt="Radio station lights"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Front Image - Positioned to bottom-right */}
              <div className="absolute bottom-0 right-0 w-[85%] h-[280px] rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800">
                <Image
                  src="/about2.png"
                  alt="Studio equipment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="text-white">
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-6">
              Welcome to Glorious Twins Radio - Giving Solutions, Touching lives
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              At Glorious Twins Radio, we believe radio is more than just music.
              It's connection, culture, and community. We are your trusted
              companion for entertainment, news, inspiration, and real
              conversations that matter.
            </p>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Broadcasting from the heart of Ibadan, we bring together a vibrant
              mix of music, talk shows, news updates, lifestyle programs,
              interviews, and live listener interactions. Whether you're tuning
              in from your car, your workplace, or your mobile device, we're
              always just a click or frequency away.
            </p>

            <h4 className="text-lg font-bold text-emerald-400 mb-4">
              What We Offer
            </h4>

            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>
                  The Best Music Across Genres From timeless classics to the
                  latest hits.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>
                  Fresh Voices & Engaging Personalities Hosts who feel like
                  friends.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>
                  Reliable News & Real Conversations Keeping you informed and
                  involved.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>24/7 Live Streaming Anytime. Anywhere. Any device.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
