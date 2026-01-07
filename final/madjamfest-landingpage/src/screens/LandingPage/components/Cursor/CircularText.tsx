import { CircularCharacter } from "./CircularCharacter";
import {
  CIRCLE_CENTER_X,
  CIRCLE_CENTER_Y,
  CIRCLE_RADIUS,
  TARGET_TEXT_LENGTH,
} from "./constants";

export function CircularText({ text }: { text: string }) {
  // Repeat the text to fill the circle
  const normalizedText = text.toUpperCase();
  const repetitions = Math.ceil(TARGET_TEXT_LENGTH / (normalizedText.length + 1));
  const fullText = Array(repetitions).fill(normalizedText).join(" ");

  // Calculate angle between each character
  const totalChars = fullText.length;
  const angleStep = 360 / totalChars;

  return (
    <div className="absolute contents" data-name="Circular Text">
      {fullText.split("").map((char, index) => {
        // Calculate position on circle (starting from top, going clockwise)
        const angle = 180 + index * angleStep;
        const radian = (angle * Math.PI) / 180;

        // Position on circle
        const x = CIRCLE_CENTER_X + CIRCLE_RADIUS * Math.cos(radian);
        const y = CIRCLE_CENTER_Y + CIRCLE_RADIUS * Math.sin(radian);

        // Character dimensions
        const charWidth =
          char === " " ? 2 : char === "I" || char === "i" ? 3.717 : 4.646;
        const charHeight = char === " " ? 33.454 : 6.505;

        // Calculate positioning
        const top = y - charHeight / 2;
        const left = x - charWidth / 2;
        const right = 207 - (left + charWidth);
        const bottom = 199 - (top + charHeight);

        // Rotate character to follow circle curve
        const rotation = angle + 90;

        return (
          <div
            key={`${char}-${index}`}
            className="absolute flex items-center justify-center"
            style={{
              inset: `${top}px ${right}px ${bottom}px ${left}px`,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center",
            }}
          >
            {char === " " ? (
              <div className="flex-none h-40 w-px" />
            ) : (
              <CircularCharacter char={char} />
            )}
          </div>
        );
      })}
    </div>
  );
}
