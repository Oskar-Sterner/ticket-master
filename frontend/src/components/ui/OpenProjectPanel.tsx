import { ProjectWithTickets, Ticket } from "@/types";
import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import toast from "react-hot-toast";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./TextArea";
import { TicketCard } from "./TicketCard";
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

interface OpenProjectPanelProps {
  project: ProjectWithTickets;
  onClose: () => void;
  onOpenTicket: (ticket: Ticket) => void;
}

export const OpenProjectPanel = ({
  project,
  onClose,
  onOpenTicket,
}: OpenProjectPanelProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState(project);

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  useEffect(() => {
    setFormData(project);
  }, [project]);

  const handleNavigateToDetailedView = () => {
    router.push(`/projects/${project._id}`);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const { title, description } = formData;
    const updatePromise = updateProject.mutateAsync({
      id: project._id!,
      data: { title, description },
    });

    toast.promise(updatePromise, {
      loading: "Saving changes...",
      success: () => {
        setIsEditing(false);
        return "Project updated successfully!";
      },
      error: (err: Error) => `Error: ${err.message}`,
    });
  };

  const handleDelete = () => {
    const deletePromise = deleteProject.mutateAsync(project._id!);
    toast.promise(deletePromise, {
      loading: "Deleting project...",
      success: () => {
        onClose();
        return "Project and all its tickets deleted.";
      },
      error: (err: Error) => `Error: ${err.message}`,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-8 h-full overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <motion.h2
            layoutId={`title-${project._id}`}
            className="text-4xl font-bold text-zinc-900 dark:text-white"
          >
            {isEditing ? (
              <Input
                variant="glass"
                className="text-4xl h-auto p-0 border-none !bg-transparent"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            ) : (
              project.title
            )}
          </motion.h2>
          {isEditing && (
            <div
              className={cn(
                "mt-1 flex-shrink-0 px-3 py-1.5 text-sm font-bold rounded-full",
                "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200"
              )}
            >
              EDIT MODE
            </div>
          )}
        </div>

        {/* Description & Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Textarea
              variant="glass"
              className="text-lg p-0 border-none !bg-transparent"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="glass" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProject.isPending}>
                {updateProject.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <motion.p
            layoutId={`description-${project._id}`}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            {project.description}
          </motion.p>
        )}

        {/* Tickets Section and Actions */}
        <div className="mt-auto border-t border-gray-200/80 dark:border-zinc-700/50 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">
              Tickets in this Project
            </h3>
            <div className="flex gap-2">
              <Button variant="default" onClick={handleNavigateToDetailedView}>
                Detailed Mode
              </Button>
              <Button
                variant="glass"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil2Icon />
              </Button>
              <Button
                variant="glass"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="hover:bg-red-500/30 hover:text-red-300"
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-4">
            {project.tickets.length === 0 ? (
              <p className="text-white/50 w-full text-center py-8">
                No tickets found.
              </p>
            ) : (
              project.tickets.map((ticket) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onOpen={onOpenTicket}
                  layoutId={`card-${ticket._id}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="absolute inset-0 grid place-items-center z-[200]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 p-8 rounded-2xl bg-zinc-900 border border-zinc-700 text-center"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Delete Project?
              </h3>
              <p className="text-zinc-400 mb-6">
                This will also delete all associated tickets. This action cannot
                be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="glass"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                  disabled={deleteProject.isPending}
                >
                  {deleteProject.isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
