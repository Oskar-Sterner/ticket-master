import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useRouter } from "next/router";
import { ProjectWithTickets } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import Head from "next/head";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProjects = useMemo(
    () =>
      sortedProjects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, sortedProjects]
  );

  const handleNavigate = useCallback(
    (project: ProjectWithTickets) => {
      router.push(`/projects/${project._id}`);
    },
    [router]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const skeletonItems = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`skeleton-${i}`}
          variants={itemVariants}
          className="w-full h-[350px] rounded-xl bg-white/10 animate-pulse"
        />
      )),
    []
  );

  return (
    <>
      <Head>
        <title>TicketMaster - Projects</title>
      </Head>
      <div
        className={cn(
          "flex flex-col flex-grow w-full p-8 rounded-3xl",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "shadow-xl"
        )}
      >
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h2 className="text-4xl font-bold text-white">All Projects</h2>
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <Input
              type="text"
              placeholder="Search projects..."
              variant="glass"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {projectsLoading && skeletonItems}
            {!projectsLoading &&
              filteredProjects.map((project) => (
                <motion.div key={project._id} variants={itemVariants}>
                  <ProjectCard
                    project={project}
                    onOpen={handleNavigate}
                    layoutId={`card-${project._id}`}
                  />
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
        {!projectsLoading && filteredProjects.length === 0 && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-white/50 text-lg">
              {searchQuery
                ? "No projects match your search."
                : "No projects found."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
