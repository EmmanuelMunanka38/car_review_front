import type { Review } from "@/lib/types"

interface HeroProps {
  reviews: Review[]
}

export function Hero({}: HeroProps) {
  // The hero video is purely decorative. Do not display any car-specific data here.
  return (
    <section className="relative h-[800px] w-full overflow-hidden flex items-end bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/Unleash%20the%20Future%20with%20BYD%20Seal%20(2160p_25fps_AV1-128kbit_AAC).mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="relative z-10 w-full px-6 md:px-12 max-w-[1280px] mx-auto pb-16">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-archivo font-extrabold text-white mb-6 leading-[0.9] tracking-tighter uppercase">
            FUTURE  <br /> AUTOMOTIVE
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-lg mb-8 font-inter">
            Where technical precision meets elite automotive journalism. Explore the engineering, the icons, and the future of high-performance machines.
          </p>
        </div>
      </div>
    </section>
  )
}
