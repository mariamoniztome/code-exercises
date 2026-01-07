type HeaderProps = {
  onMenuClick: () => void;
  isMenuOpen?: boolean;
};

export const Header = ({ onMenuClick, isMenuOpen = false }: HeaderProps): JSX.Element => {
  return (
    <header className="flex h-36 w-full items-center justify-between bg-background px-3">
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="h-28 w-auto" />

      {/* Date */}
      <div className="text-xl font-normal text-foreground">
        25–27 de fevereiro
      </div>

      {/* Hamburger Menu */}
      <button
        onClick={onMenuClick}
        className="flex flex-col gap-2 p-4 cursor-pointer hover:opacity-70 transition-opacity"
        aria-label="Toggle menu"
      >
        <span
          className={`block h-1 bg-foreground transition-all duration-300 ${
            isMenuOpen ? 'w-12 rotate-45 translate-y-3' : 'w-16'
          }`}
        />
        <span
          className={`block h-1 bg-foreground transition-all duration-300 ${
            isMenuOpen ? 'w-12 opacity-0' : 'w-16'
          }`}
        />
        <span
          className={`block h-1 bg-foreground transition-all duration-300 ${
            isMenuOpen ? 'w-12 -rotate-45 -translate-y-3' : 'w-16'
          }`}
        />
      </button>
    </header>
  );
};
