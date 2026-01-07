import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../../../components/ui/dialog";

type ProgramItem = {
  time: string;
  title: string;
  location: string;
  description: string;
};

type DaysDialogBlackProps = {
  date?: string;
  program?: ProgramItem[];
  selectedIndex?: number | null;
  eventDays?: Array<{ day: string; date: string }>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function DaysDialogBlack({
  date,
  program,
  selectedIndex,
  eventDays,
  isOpen,
  onOpenChange,
}: DaysDialogBlackProps) {
  const selectedDate =
    selectedIndex !== null && selectedIndex !== undefined && eventDays
      ? eventDays[selectedIndex]?.date
      : date;

  const selectedProgram = program || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="hidden" />
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[1400px] w-full h-[900px]">
        <div className="bg-black overflow-clip relative rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] w-full h-full">
          <div className="absolute border-white border-b h-[250px] left-1/2 top-[64px] -translate-x-1/2 w-[1290px]">
            <p className="absolute leading-[198px] text-[220px] tracking-[-5.5px] text-white top-[11px]">
              {selectedDate}
            </p>
          </div>

          <div className="absolute left-[55px] top-[682px] w-[1290px] text-white">
            <p className="text-[30px] font-bold tracking-wide mb-8">PROGRAMA</p>

            <div className="space-y-10">
              {selectedProgram.map((item, index) => (
                <div
                  key={`${item.time}-${index}`}
                  className="border-b border-white pb-6"
                >
                  <p className="font-bold text-[24px] mb-1">{item.time}</p>
                  <p className="text-[24px] font-semibold mb-1">{item.title}</p>
                  <p className="uppercase text-[14px] tracking-wide mb-1">
                    {item.location}
                  </p>
                  <p className="text-[16px] max-w-[420px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}