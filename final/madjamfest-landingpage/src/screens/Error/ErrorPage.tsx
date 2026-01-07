import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <div className="relative px-3 flex min-h-screen flex-col items-start justify-center bg-black text-white overflow-hidden">
      <div className="flex gap-8 items-center justify-center">
        <img src="/logo.svg" alt="MAD Jam Fest" className="mb-10 h-24 w-auto" />
        <h1 className="mb-6 text-center text-[clamp(3rem,8vw,6rem)] font-black tracking-tight">
          404 NOT FOUND
        </h1>
      </div>

      <div className="group flex items-center"></div>
      {/* Button */}
      <Link
        to="/"
        className="
          flex items-center
          h-13 p-2
          px-5
          rounded-full
          bg-black/40
          backdrop-blur-md
          text-white
          border border-white
          transition
          group-hover:bg-black/60
        "
      >
        Retroceder para <span className="ml-2 underline">página principal</span>
      </Link>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 bg-[url('/grain.png')]"
      />
    </div>
  );
};