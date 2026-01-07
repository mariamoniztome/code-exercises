/**
 * A single character in the circular text
 */
export function CircularCharacter({ char }: { char: string }) {
  return (
    <div className="flex-none h-3">
      <div className="flex flex-col font-normal justify-end leading-0 not-italic relative size-full text-black text-[10px] text-center">
        <p className="leading-normal">{char}</p>
      </div>
    </div>
  );
}
