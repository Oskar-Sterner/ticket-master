import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { TicketCard } from "@/components/ui/TicketCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useUser, useUpdateUser } from "@/hooks/useUsers";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { AssigneeAvatar } from "@/components/ui/TicketCard";

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const userId = typeof id === "string" ? id : "";

  const { data: user, isLoading } = useUser(userId);
  const { data: session } = useSession();
  const updateUser = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const isCurrentUser = session?.user?.id === userId;

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const updatePromise = updateUser.mutateAsync({
      id: userId,
      data: formData,
    });

    toast.promise(updatePromise, {
      loading: "Saving changes...",
      success: () => {
        setIsEditing(false);
        return "Profile updated successfully!";
      },
      error: (err: Error) => `Error: ${err.message}`,
    });
  };

  const title = isLoading
    ? "Loading User..."
    : `TicketMaster - ${user?.name ?? "User"}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div
        className={cn(
          "flex flex-col flex-grow w-full p-8 rounded-3xl",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "shadow-xl"
        )}
      >
        {isLoading && <div>Loading...</div>}

        {!isLoading && user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => router.push("/users")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
            >
              <ArrowLeftIcon />
              Back to All Users
            </button>

            <div className="flex items-center gap-6 mb-12">
              <AssigneeAvatar name={user.name} />
              <div className="flex-grow">
                {isEditing ? (
                  <form
                    onSubmit={handleSave}
                    className="flex gap-4 items-center"
                  >
                    <Input
                      variant="glass"
                      className="text-5xl h-auto p-0 border-none !bg-transparent font-bold"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      variant="glass"
                      className="text-lg h-auto p-0 border-none !bg-transparent text-white/60"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <Button type="submit" disabled={updateUser.isPending}>
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="glass"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <>
                    <h1 className="text-5xl font-bold text-white">
                      {user.name}
                    </h1>
                    <p className="text-lg text-white/60">{user.email}</p>
                  </>
                )}
              </div>
              {isCurrentUser && !isEditing && (
                <Button
                  variant="glass"
                  size="icon"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil2Icon />
                </Button>
              )}
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">
                Projects Involved In
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {user.projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onOpen={() => router.push(`/projects/${project._id}`)}
                    layoutId={`card-${project._id}`}
                  />
                ))}
              </div>
              {user.projects.length === 0 && (
                <p className="text-white/50">
                  User is not involved in any projects.
                </p>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                Assigned Tickets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {user.tickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    onOpen={() => router.push(`/tickets/${ticket._id}`)}
                    layoutId={`card-${ticket._id}`}
                  />
                ))}
              </div>
              {user.tickets.length === 0 && (
                <p className="text-white/50">
                  No tickets assigned to this user.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
