import { Ticket } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TicketCardProps {
  ticket: Ticket;
  onOpen: (ticket: Ticket) => void;
  layoutId: string;
}

export const getPriorityColor = (priority: Ticket["priority"]) => {
  switch (priority) {
    case "low":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "high":
      return "bg-orange-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const AssigneeAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 dark:border-zinc-900/50">
      {initials}
    </div>
  );
};

const TicketCard = ({ ticket, onOpen, layoutId }: TicketCardProps) => {
  const assigneeName = ticket.user?.name ?? "Unassigned";

  return (
    <motion.div
      layoutId={layoutId}
      onClick={() => onOpen(ticket)}
      className={cn(
        "relative w-[300px] h-[320px] flex flex-col p-6 rounded-xl",
        "bg-white/50 dark:bg-zinc-800/50",
        "backdrop-blur-xl border border-white/20 dark:border-zinc-700/50",
        "shadow-lg dark:shadow-zinc-950/20 transition-all duration-200 ease-in-out",
        "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              getPriorityColor(ticket.priority)
            )}
          />
          <span className="text-sm font-semibold capitalize text-gray-600 dark:text-gray-300">
            {ticket.priority}
          </span>
        </div>
        <div
          className={cn(
            "px-2.5 py-1 text-xs font-bold rounded-full",
            "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200"
          )}
        >
          {ticket.status.toUpperCase()}
        </div>
      </div>
      <motion.h3
        layoutId={`title-${ticket._id}`}
        className={cn(
          "text-xl font-bold leading-tight",
          "text-zinc-900 dark:text-white"
        )}
      >
        {ticket.title}
      </motion.h3>
      <motion.p
        layoutId={`description-${ticket._id}`}
        className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4"
      >
        {ticket.description}
      </motion.p>
      <div className="mt-auto pt-4 border-t border-gray-200/80 dark:border-zinc-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AssigneeAvatar name={assigneeName} />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Assigned to
            </p>
            <p className="font-semibold text-sm text-zinc-900 dark:text-white">
              {assigneeName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Updated</p>
          <p className="text-xs font-medium text-zinc-900 dark:text-white">
            {new Date(ticket.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export { TicketCard };
