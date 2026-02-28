export default ({ bgTiles }: { bgTiles: string }) => (
  <header
    className="bg-primary bg-angled-gradient from-header-from to-header-to relative h-2.5 overflow-hidden shadow-inner md:-mb-60 md:h-80 dark:opacity-90 dark:contrast-125 dark:saturate-50 print:hidden"
    aria-hidden="true"
  >
    <img
      src={bgTiles}
      alt=""
      fetchPriority="high"
      className="absolute inset-0 size-full object-cover object-center"
    />
  </header>
);
