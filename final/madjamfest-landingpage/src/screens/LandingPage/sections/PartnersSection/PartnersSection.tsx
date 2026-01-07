import { partnerLogos } from "../../../../assets/data/partnersLogo";

export const PartnersSection = (): JSX.Element => {
  return (
    <section id="contacto" className="relative w-full py-20">
      <div className="w-full px-3 flex flex-col gap-8">
        <h2 className="font-montreal-medium font-medium text-foreground text-3xl">
          Parceiros &amp; Patrocinios
        </h2>

        <div className="grid grid-cols-6 grid-rows-2 gap-8">
          {partnerLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-background/5 rounded-lg hover:bg-background/10 transition-colors duration-300"
            >
              <img
                className={`w-full h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300 ${logo.className}`}
                alt={logo.alt}
                src={logo.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
