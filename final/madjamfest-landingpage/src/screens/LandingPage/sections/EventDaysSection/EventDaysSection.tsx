import { ArrowUpRight } from "lucide-react";
import { eventDays } from "../../../../assets/data/eventDay";
import { useState } from "react";
import fest1 from "../../../../assets/img/fest/fest-1.png";
import fest2 from "../../../../assets/img/fest/fest-2.png";
import fest3 from "../../../../assets/img/fest/fest-3.png";
import EventDayDialog from "./components/EventDayDialog";


const festImages = [fest1, fest2, fest3];

export const EventDaysSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
    <section className="flex flex-col w-full relative overflow-visible">
      {eventDays.map((event, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => {
            setSelectedIndex(index);
            setIsDialogOpen(true);
          }}
          className="relative w-full h-80 border-b border-border flex items-center justify-between px-12 cursor-pointer group overflow-visible"
        >
          {/* Content */}
          <div className="tracking-tighterflex items-center justify-center font-montreal-bold font-black text-foreground text-9xl leading-tight whitespace-nowrap">
            {event.day}
          </div>

          <div className="flex flex-col items-end gap-10">
            <div className="font-montreal font-normal text-primary text-2xl whitespace-nowrap">
              {event.date}
            </div>

            <div className="size-[4rem] rounded-full border-2 border-foreground flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <ArrowUpRight className="size-28 text-foreground" strokeWidth={1} />
            </div>
          </div>

          {/* Hover Image - Positioned to the right outside */}
          <div
            className="absolute z-50 right-96 top-0 h-full w-[600px] transition-all duration-500 pointer-events-none"
            style={{
              opacity: hoveredIndex === index ? 1 : 0,
              transform: hoveredIndex === index ? 'translateX(0)' : 'translateX(50px)',
            }}
          >
            <img
              src={festImages[index % festImages.length]}
              alt={`Event ${event.day}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </section>
    <EventDayDialog 
      selectedIndex={selectedIndex}
      eventDays={eventDays}
      isOpen={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    />
    </>
  );
};
