import { ProjectWithTickets } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { VercelLogoIcon } from "@radix-ui/react-icons";

interface ProjectCardProps {
  project: ProjectWithTickets;
  onOpen: (project: ProjectWithTickets) => void;
  layoutId: string;
}

export const ProjectCard = ({
  project,
  onOpen,
  layoutId,
}: ProjectCardProps) => {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={() => onOpen(project)}
      className={cn(
        "relative w-[300px] h-[350px] flex flex-col p-6 rounded-xl",
        "bg-white/50 dark:bg-zinc-800/50",
        "backdrop-blur-xl border border-white/20 dark:border-zinc-700/50",
        "shadow-lg dark:shadow-zinc-950/20 transition-all duration-200 ease-in-out",
        "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      )}
    >
      <motion.h3
        layoutId={`title-${project._id}`}
        className={cn(
          "text-2xl font-bold leading-tight",
          "text-zinc-900 dark:text-white"
        )}
      >
        {project.title}
      </motion.h3>
      <motion.p
        layoutId={`description-${project._id}`}
        className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-5 flex-grow"
      >
        {project.description?.slice(0, 150) ?? "No description available."}
        {project.description && project.description.length > 150 ? "..." : ""}
      </motion.p>
      <div className="mt-auto pt-4 border-t border-gray-200/80 dark:border-zinc-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VercelLogoIcon className="w-5 h-5 text-white/70" />
          <p className="text-sm text-white">
            <span className="font-bold">{project.tickets?.length ?? 0}</span>{" "}
            tickets
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Updated</p>
          <p className="text-xs font-medium text-zinc-900 dark:text-white">
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
