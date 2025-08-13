import { UserWithDetails } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AssigneeAvatar } from "./TicketCard";
import { EnvelopeClosedIcon, VercelLogoIcon } from "@radix-ui/react-icons";

interface UserCardProps {
  user: UserWithDetails;
  onOpen: (user: UserWithDetails) => void;
  layoutId: string;
}

export const UserCard = ({ user, onOpen, layoutId }: UserCardProps) => {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={() => onOpen(user)}
      className={cn(
        "relative w-[300px] h-[350px] flex flex-col p-6 rounded-xl",
        "bg-white/50 dark:bg-zinc-800/50",
        "backdrop-blur-xl border border-white/20 dark:border-zinc-700/50",
        "shadow-lg dark:shadow-zinc-950/20 transition-all duration-200 ease-in-out",
        "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      )}
    >
      <div className="flex flex-col items-center text-center">
        <AssigneeAvatar name={user.name} />
        <motion.h3
          layoutId={`user-name-${user._id}`}
          className="mt-4 text-2xl font-bold text-white"
        >
          {user.name}
        </motion.h3>
        <motion.p
          layoutId={`user-email-${user._id}`}
          className="text-sm text-white/60"
        >
          {user.email}
        </motion.p>
      </div>

      <div className="mt-8 flex-grow space-y-4">
        <div className="flex items-center gap-3">
          <VercelLogoIcon className="w-5 h-5 text-white/70" />
          <p className="text-white">
            Involved in{" "}
            <span className="font-bold">{user.projects?.length ?? 0}</span>{" "}
            projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <EnvelopeClosedIcon className="w-5 h-5 text-white/70" />
          <p className="text-white">
            Assigned{" "}
            <span className="font-bold">{user.tickets?.length ?? 0}</span>{" "}
            tickets
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-700/50 text-center">
        <p className="text-xs text-white/50">
          Joined on {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};
