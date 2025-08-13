import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "./Input";
import { Textarea } from "./TextArea";
import { Button } from "./Button";
import { useCreateProject, useProjects } from "@/hooks/useProjects";
import { useCreateTicket } from "@/hooks/useTickets";
import toast from "react-hot-toast";
import { CreateTicketRequest } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { useUsers } from "@/hooks/useUsers";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateModal = ({ isOpen, onClose }: CreateModalProps) => {
  const [activeTab, setActiveTab] = useState<"project" | "ticket">("project");

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: users, isLoading: usersLoading } = useUsers();
  const createProject = useCreateProject();
  const createTicket = useCreateTicket();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    let submissionPromise;

    if (activeTab === "project") {
      const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      };
      if (!data.title || !data.description) {
        toast.error("Title and description are required.");
        return;
      }
      submissionPromise = createProject.mutateAsync(data);
    } else {
      const data: CreateTicketRequest = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as
          | "low"
          | "medium"
          | "high"
          | "critical",
        projectId: formData.get("projectId") as string,
      };

      const userId = formData.get("userId") as string;
      if (userId) {
        data.userId = userId;
      }

      if (!data.title || !data.description || !data.projectId) {
        toast.error("Title, description, and project are required.");
        return;
      }
      submissionPromise = createTicket.mutateAsync(data);
    }

    toast.promise(submissionPromise, {
      loading: `Creating ${activeTab}...`,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      success: (_data) => {
        onClose();
        return `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } created successfully!`;
      },
      error: (err: Error) => `Error: ${err.message || "Something went wrong."}`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 grid place-items-center z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm h-full w-full z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={cn(
              "w-full max-w-2xl flex flex-col bg-white/50 dark:bg-zinc-800/50",
              "backdrop-blur-xl border border-white/20 dark:border-zinc-700/50",
              "rounded-3xl shadow-xl p-8 relative z-[100]"
            )}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
              onClick={onClose}
            >
              <Cross1Icon />
            </button>

            <div className="mb-6 flex p-1 rounded-full bg-black/20 self-start">
              <button
                onClick={() => setActiveTab("project")}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full transition-colors",
                  activeTab === "project"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                )}
              >
                Create Project
              </button>
              <button
                onClick={() => setActiveTab("ticket")}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full transition-colors",
                  activeTab === "ticket"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                )}
              >
                Create Ticket
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-white mb-2">
                {activeTab === "project" ? "New Project" : "New Ticket"}
              </h2>
              <Input
                variant="glass"
                name="title"
                placeholder="Title"
                required
              />
              <Textarea
                variant="glass"
                name="description"
                placeholder="Description"
                required
              />
              {activeTab === "ticket" && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Select name="priority" required defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select name="projectId" required>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            projectsLoading ? "Loading..." : "Select project"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {projects?.map((p) => (
                          <SelectItem key={p._id} value={p._id!}>
                            {p.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select name="userId">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            usersLoading ? "Loading..." : "Assign to user"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((u) => (
                          <SelectItem key={u._id} value={u._id!}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <Button
                type="submit"
                disabled={createProject.isPending || createTicket.isPending}
              >
                {createProject.isPending || createTicket.isPending
                  ? "Creating..."
                  : "Create"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
