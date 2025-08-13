import { useState, useRef, useEffect, FormEvent, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/router";
import { TicketCard } from "@/components/ui/TicketCard";
import { Ticket } from "@/types";
import { cn } from "@/lib/utils";
import {
  Cross1Icon,
  ArrowLeftIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjects";
import { OpenTicketPanel } from "@/components/ui/OpenTicketPanel";
import Head from "next/head";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import toast from "react-hot-toast";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = typeof id === "string" ? id : "";

  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState(project);

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setActiveTicket(null));

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveTicket(null);
      }
    };
    if (activeTicket) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTicket]);

  const handleOpenTicket = useCallback((ticket: Ticket) => {
    setActiveTicket(ticket);
  }, []);

  const handleBackToProjects = useCallback(() => {
    router.push("/projects");
  }, [router]);

  const handleSave = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!formData) return;
      const { title, description } = formData;
      const updatePromise = updateProject.mutateAsync({
        id: projectId,
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
    },
    [formData, projectId, updateProject]
  );

  const handleDelete = useCallback(() => {
    const deletePromise = deleteProject.mutateAsync(projectId);
    toast.promise(deletePromise, {
      loading: "Deleting project...",
      success: () => {
        router.push("/projects");
        return "Project and all its tickets deleted.";
      },
      error: (err: Error) => `Error: ${err.message}`,
    });
  }, [deleteProject, projectId, router]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setFormData(project);
  }, [project]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleShowDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleTitleChange = useCallback(
    (value: string) => {
      if (formData) {
        setFormData({ ...formData, title: value });
      }
    },
    [formData]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      if (formData) {
        setFormData({ ...formData, description: value });
      }
    },
    [formData]
  );

  const tickets = project?.tickets || [];
  const title = isLoading
    ? "Loading Project..."
    : `TicketMaster - ${project?.title ?? "Project"}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 h-full w-full z-50"
            />
            <motion.div
              ref={ref}
              layoutId={`card-${activeTicket._id}`}
              className={cn(
                "w-full max-w-6xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white/50 dark:bg-zinc-800/50",
                "backdrop-blur-xl border border-white/20 dark:border-zinc-700/50",
                "sm:rounded-3xl overflow-hidden shadow-xl p-8 relative z-[100]"
              )}
            >
              <button
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
                onClick={() => setActiveTicket(null)}
              >
                <Cross1Icon />
              </button>
              <OpenTicketPanel
                ticket={activeTicket}
                onClose={() => setActiveTicket(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 grid place-items-center z-[200]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={handleCancelDelete}
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
                This will also delete all associated tickets. This cannot be
                undone.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="glass" onClick={handleCancelDelete}>
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

      <div
        className={cn(
          "flex flex-col flex-grow w-full p-8 rounded-3xl",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "shadow-xl"
        )}
      >
        {isLoading && (
          <div>
            <div className="h-10 w-1/3 rounded-lg bg-white/10 animate-pulse mb-4" />
            <div className="h-6 w-1/2 rounded-lg bg-white/10 animate-pulse" />
          </div>
        )}

        {!isLoading && project && formData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={handleBackToProjects}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
            >
              <ArrowLeftIcon />
              Back to All Projects
            </button>
            <form onSubmit={handleSave}>
              <div className="flex justify-between items-start gap-4 mb-2">
                {isEditing ? (
                  <Input
                    variant="glass"
                    className="text-5xl h-auto p-0 border-none !bg-transparent font-bold"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                ) : (
                  <h1 className="text-5xl font-bold text-white">
                    {project.title}
                  </h1>
                )}

                <div className="flex gap-2 flex-shrink-0 mt-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="glass"
                        type="button"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateProject.isPending}>
                        {updateProject.isPending ? "Saving..." : "Save"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="glass"
                        size="icon"
                        type="button"
                        onClick={handleStartEdit}
                      >
                        <Pencil2Icon />
                      </Button>
                      <Button
                        variant="glass"
                        size="icon"
                        type="button"
                        onClick={handleShowDeleteConfirm}
                        className="hover:bg-red-500/30 hover:text-red-300"
                      >
                        <TrashIcon />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {isEditing ? (
                <Textarea
                  variant="glass"
                  className="text-lg p-0 border-none !bg-transparent text-white/60 mb-12 max-w-4xl"
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                />
              ) : (
                <p className="text-lg text-white/60 mb-12 max-w-4xl">
                  {project.description}
                </p>
              )}
            </form>

            <h2 className="text-3xl font-bold text-white mb-8">
              Tickets in this project
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tickets.map((ticket) => (
                <motion.div key={ticket._id} variants={itemVariants}>
                  <TicketCard
                    ticket={ticket}
                    onOpen={handleOpenTicket}
                    layoutId={`card-${ticket._id}`}
                  />
                </motion.div>
              ))}
            </motion.div>
            {tickets.length === 0 && (
              <div className="flex-grow flex items-center justify-center p-16 rounded-xl bg-black/20">
                <p className="text-white/50 text-lg">
                  No tickets found for this project.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
