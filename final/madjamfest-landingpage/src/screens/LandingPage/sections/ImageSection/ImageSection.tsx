import img from "../../../../assets/img/fest/bg.png";

export const ImageSection = (): JSX.Element => {
  return (
    <section
      className="relative h-[180vh] mx-3 w-full overflow-hidden bg-black cursor-none"
    >
      <img
        src={img}
        className="absolute inset-0 h-full w-full object-cover cursor-none"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

    </section>
  );
};