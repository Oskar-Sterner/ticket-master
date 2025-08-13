import { Ticket } from "@/types";
import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUpdateTicket, useDeleteTicket } from "@/hooks/useTickets";
import toast from "react-hot-toast";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./TextArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { AssigneeAvatar, getPriorityColor } from "./TicketCard";
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/router";

interface OpenTicketPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

export const OpenTicketPanel = ({ ticket, onClose }: OpenTicketPanelProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    ...ticket,
    userId: ticket.userId || "",
  });

  const { data: users, isLoading: usersLoading } = useUsers();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();

  const shouldShowDetailedViewButton = router.pathname !== "/tickets/[id]";

  useEffect(() => {
    setFormData({ ...ticket, userId: ticket.userId || "" });
  }, [ticket]);

  const handleNavigateToDetailedView = () => {
    router.push(`/tickets/${ticket._id}`);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const { title, description, userId, status, priority } = formData;

    const updatePromise = updateTicket.mutateAsync({
      id: ticket._id!,
      data: {
        title,
        description,
        status,
        priority,
        userId: userId === "UNASSIGNED" ? undefined : userId,
      },
    });

    toast.promise(updatePromise, {
      loading: "Saving changes...",
      success: () => {
        onClose();
        return "Ticket updated successfully!";
      },
      error: (err: Error) => `Error: ${err.message}`,
    });
  };

  const handleDelete = () => {
    const deletePromise = deleteTicket.mutateAsync(ticket._id!);
    toast.promise(deletePromise, {
      loading: "Deleting ticket...",
      success: () => {
        onClose();
        return "Ticket deleted successfully.";
      },
      error: (err: Error) => `Error: ${err.message}`,
    });
  };

  const assigneeName = ticket.user?.name ?? "Unassigned";

  return (
    <>
      <div className="flex flex-col gap-8 h-full overflow-x-hidden">
        <div className="flex justify-between items-start gap-4">
          <motion.h2
            layoutId={`title-${ticket._id}`}
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
              ticket.title
            )}
          </motion.h2>
          <div
            className={cn(
              "mt-1 flex-shrink-0 px-3 py-1.5 text-sm font-bold rounded-full",
              isEditing
                ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200"
            )}
          >
            {isEditing ? "EDIT MODE" : ticket.status.toUpperCase()}
          </div>
        </div>

        <motion.p
          layoutId={`description-${ticket._id}`}
          className="text-lg text-zinc-600 dark:text-zinc-400"
        >
          {isEditing ? (
            <Textarea
              variant="glass"
              className="text-lg p-0 border-none !bg-transparent"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          ) : (
            ticket.description
          )}
        </motion.p>

        <div className="mt-auto border-t border-gray-200/80 dark:border-zinc-700/50 pt-6 ">
          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    Assignee
                  </label>
                  <Select
                    value={formData.userId}
                    onValueChange={(userId) =>
                      setFormData({ ...formData, userId })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          usersLoading ? "Loading..." : "Select user"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                      {users?.map((u) => (
                        <SelectItem key={u._id} value={u._id!}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    Priority
                  </label>
                  <Select
                    value={formData.priority}
                    onValueChange={(priority: Ticket["priority"]) =>
                      setFormData({ ...formData, priority })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(status: Ticket["status"]) =>
                      setFormData({ ...formData, status })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="glass" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTicket.isPending}>
                  {updateTicket.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-gray-400 dark:text-gray-500">
                    Assignee
                  </p>
                  <div className="flex items-center gap-2">
                    <AssigneeAvatar name={assigneeName} />
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {assigneeName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-400 dark:text-gray-500">
                    Priority
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        getPriorityColor(ticket.priority)
                      )}
                    />
                    <span className="font-semibold capitalize text-zinc-900 dark:text-white">
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {shouldShowDetailedViewButton && (
                  <Button
                    variant="default"
                    onClick={handleNavigateToDetailedView}
                  >
                    To Ticket
                  </Button>
                )}
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
          )}
        </div>
      </div>
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
                Delete Ticket?
              </h3>
              <p className="text-zinc-400 mb-6">
                This action cannot be undone.
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
                  disabled={deleteTicket.isPending}
                >
                  {deleteTicket.isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
