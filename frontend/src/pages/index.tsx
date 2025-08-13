"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TicketCard } from "@/components/ui/TicketCard";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Ticket, ProjectWithTickets } from "@/types";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { OpenTicketPanel } from "@/components/ui/OpenTicketPanel";
import { OpenProjectPanel } from "@/components/ui/OpenProjectPanel";
import Head from "next/head";

const overviewPanelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

type ExpandedCardType = {
  type: "project" | "ticket";
  data: ProjectWithTickets | Ticket;
};

export default function Home() {
  const [activeCard, setActiveCard] = useState<ExpandedCardType | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isTicket = activeCard?.type === "ticket";
  const isProject = activeCard?.type === "project";

  const { data: projects, isLoading: projectsLoading } = useProjects();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveCard(null);
      }
    }

    if (activeCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCard]);

  useOutsideClick(ref, () => setActiveCard(null));

  const sortedProjects = useMemo(
    () =>
      projects
        ? [...projects].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        : [],
    [projects]
  );

  const recentProjects = useMemo(
    () => sortedProjects.slice(0, 3),
    [sortedProjects]
  );

  const allTickets = useMemo(
    () => (projects ? projects.flatMap((project) => project.tickets) : []),
    [projects]
  );

  const sortedTickets = useMemo(
    () =>
      allTickets.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [allTickets]
  );

  const recentTickets = useMemo(
    () => sortedTickets.slice(0, 8),
    [sortedTickets]
  );

  const handleOpenProject = useCallback((project: ProjectWithTickets) => {
    setActiveCard({ type: "project", data: project });
  }, []);

  const handleOpenTicket = useCallback((ticket: Ticket) => {
    setActiveCard({ type: "ticket", data: ticket });
  }, []);

  const handleCloseCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  return (
    <>
      <Head>
        <title>TicketMaster - Overview</title>
      </Head>
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 grid place-items-center z-[100] bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`card-${activeCard.data._id}`}
              ref={ref}
              className={cn(
                "w-full max-w-6xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white/50 dark:bg-zinc-800/50 overflow-hidden",
                "backdrop-blur-xl border border-white/20 dark:border-zinc-700/50",
                "sm:rounded-3xl overflow-hidden shadow-xl p-8 relative"
              )}
            >
              <button
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
                onClick={handleCloseCard}
              >
                <Cross1Icon />
              </button>

              <div className="flex flex-col h-full overflow-y-auto">
                {isTicket && (
                  <OpenTicketPanel
                    ticket={activeCard.data as Ticket}
                    onClose={handleCloseCard}
                  />
                )}

                {isProject && (
                  <OpenProjectPanel
                    project={activeCard.data as ProjectWithTickets}
                    onClose={handleCloseCard}
                    onOpenTicket={handleOpenTicket}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "flex flex-col flex-grow w-full p-8 rounded-3xl",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "shadow-xl"
        )}
        variants={overviewPanelVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-bold text-white mb-8">Overview</h2>

        <div className="flex flex-col gap-8 flex-grow">
          <div className="w-full">
            <h3 className="text-xl font-semibold text-white/80 mb-4">
              Recently Updated Projects
            </h3>
            <div className="flex flex-row flex-wrap gap-[75px]">
              <AnimatePresence>
                {!projectsLoading &&
                  recentProjects.map((project) => (
                    <motion.div
                      key={project._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ProjectCard
                        project={project}
                        onOpen={handleOpenProject}
                        layoutId={`card-${project._id}`}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
              {!projectsLoading && recentProjects.length === 0 && (
                <div className="w-full flex justify-center items-center py-16">
                  <p className="text-white/50 text-lg">No projects found.</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-semibold text-white/80 mb-4">
              Recently Updated Tickets
            </h3>
            <div className="flex flex-row flex-wrap gap-[75px]">
              <AnimatePresence>
                {!projectsLoading &&
                  recentTickets.map((ticket) => (
                    <motion.div
                      key={ticket._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TicketCard
                        ticket={ticket}
                        onOpen={handleOpenTicket}
                        layoutId={`card-${ticket._id}`}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
              {!projectsLoading && recentTickets.length === 0 && (
                <div className="w-full flex justify-center items-center py-16">
                  <p className="text-white/50 text-lg">No tickets found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
