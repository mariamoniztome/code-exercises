import { navigationLinks } from "../../../../assets/data/links";
import img from "../../../../assets/img/fest/fest-4.png";

export const NavigationLinksSection = (): JSX.Element => {
  const handleLinkClick = (link: typeof navigationLinks[0]) => {
    if (link.type === 'pdf') {
      // Open PDF in new tab
      window.open(link.url, '_blank');
    } else if (link.type === 'external') {
      // Open external link in new tab
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="programa" className="relative w-full flex flex-col items-center">
      <div className="relative w-full h-screen">
        <div className="relative w-full h-full">
          <img
            className="h-full object-cover"
            alt="Background workspace"
              src={img}
            />
          <div className="absolute top-0 left-0 w-full h-full bg-background/30" />
        </div>

        <nav className="absolute top-24 left-0 flex flex-col items-start pl-12">
          {navigationLinks.map((link, index) => (
            <div
              key={index}
              className="relative w-full max-w-screen-xl h-36 flex items-center justify-start"
            >
              <button 
                onClick={() => handleLinkClick(link)}
                className={`${link.className} text-9xl cursor-pointer hover:underline transition-all duration-300`}
              >
                {link.text}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
};
