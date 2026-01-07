import { Star } from "lucide-react";

const marqueeItems = Array(15).fill({
  text: "ESCOLA SUPERIOR DE MEDIA ARTES E DESIGN",
});

export const AnnouncementMarqueeSection = (): JSX.Element => {
  return (
    <section className="w-full flex flex-col gap-1">
      <div className="w-full flex items-center bg-primary overflow-hidden py-24">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, index) => (
            <div
              key={`marquee-1-${index}`}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div className="font-montreal-bold font-bold text-background text-xl tracking-wider">
                {item.text}
              </div>
              <Star className="w-3 h-3 fill-background text-background" />
            </div>
          ))}
          {marqueeItems.map((item, index) => (
            <div
              key={`marquee-1-duplicate-${index}`}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div className="font-montreal-bold font-bold text-background text-xl tracking-wider">
                {item.text}
              </div>
              <Star className="w-3 h-3 fill-background text-background" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex items-center bg-secondary overflow-hidden py-24 rotate-[3.48deg]">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, index) => (
            <div
              key={`marquee-2-${index}`}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div className="font-montreal-bold font-bold text-background text-xl tracking-wider">
                {item.text}
              </div>
              <Star className="w-3 h-3 fill-background text-background -rotate-[3.48deg]" />
            </div>
          ))}
          {marqueeItems.map((item, index) => (
            <div
              key={`marquee-2-duplicate-${index}`}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div className="font-montreal-bold font-bold text-background text-xl tracking-wider">
                {item.text}
              </div>
              <Star className="w-3 h-3 fill-background text-background -rotate-[3.48deg]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
