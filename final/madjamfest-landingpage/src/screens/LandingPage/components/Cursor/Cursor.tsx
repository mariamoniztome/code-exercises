import { CircularText } from "./CircularText";
import { CursorBackground } from "./CursorBackground";

type CursorProps = {
  text: string;
};

export default function Cursor({ text }: CursorProps) {
  return (
    <div className="relative size-full" data-name="Cursor">
      <CursorBackground />
      <CircularText text={text} />
    </div>
  );
}
