export default function RtssHeroTitle() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-40 flex h-0 justify-center">
      <h1 className="mt-5 flex w-[calc(100vw-2rem)] max-w-full flex-col items-center text-center text-[min(clamp(3rem,17vw,5.25rem),calc((100vw-2rem)/7.2))] leading-[0.86] font-black tracking-normal text-foreground uppercase lg:mt-8 lg:block lg:text-[min(clamp(5rem,8.5vw,8rem),calc((100vw-2rem)/12.2))] lg:leading-none lg:whitespace-nowrap">
        <span className="block lg:inline">Road to</span>{' '}
        <span className="block lg:inline">Beyond</span>
      </h1>
    </div>
  );
}
