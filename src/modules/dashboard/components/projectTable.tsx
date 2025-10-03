"use client"

import Image from "next/image"
import { format } from "date-fns"
import type { Project } from "../types"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"



import { Button } from "@/components/ui/button"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MoreHorizontal, Edit3, Trash2, ExternalLink, Copy, Download, Eye } from "lucide-react"

import { toast } from "sonner"
import { MarkedToggleButton } from "./MarkedToggleButton"
import EditDialog from "./editDialog"

interface DuplicatedPlayground {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
}

interface ProjectTableProps {
  projects: Project[]
  onUpdateProject?: (id: string, data: { title: string; description: string }) => Promise<void>
  onDeleteProject?: (id: string) => Promise<void>
  onDuplicateProject?: (id: string) => Promise<DuplicatedPlayground | undefined>
  onMarkasFavorite?: (id: string) => Promise<void>
}

interface EditProjectData {
  title: string
  description: string
}

export default function ProjectTable({
  projects,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
}: ProjectTableProps) {

  const router = useRouter() 

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editData, setEditData] = useState<EditProjectData>({ title: "", description: "" })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditClick = (project: Project) => {
    setSelectedProject(project)
    setEditData({
      title: project.title,
      description: project.description || ""
    })
    setEditDialogOpen(true)
  }

  const handleUpdateProject = async () => {
    // ! didnt understood
    if (!selectedProject || !onUpdateProject) return;

    setIsLoading(true)

    try {
      await onUpdateProject(selectedProject.id, editData)
      setEditDialogOpen(false)
      toast.success("Project Upadted Successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update project")
      console.error(`Error Updating Project handleUpdateProject: ${error}`)
    } finally {
      setIsLoading(false)
    }

  }

  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return

    setIsLoading(true)
    try {
      await onDuplicateProject(project.id)
      toast.success("Project Duplicated SUccessfully")
      router.refresh() 
    } catch (error) {
      toast.error("Failed to Duplicate Project")
      console.error("Error Duplicating Project handleDuplicateProject", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = async (project: Project) => {
    setSelectedProject(project)
    setDeleteDialogOpen(true)
  }

  const handleDeleteProject = async () => {
    // If you dont have any selected project or OnUpdateProject 
    if (!selectedProject || !onDeleteProject) return

    setIsLoading(true)

    try {
      await onDeleteProject(selectedProject.id)
      setDeleteDialogOpen(false)
      setSelectedProject(null)
      toast.success("Project deleted successfully")
      router.refresh() 
    } catch (error) {
      toast.error("Failed to delete project")
      console.error(`Error deleting Project handleDeleteProject: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyProjectUrl = (projectId: string) => {
    const url = `${window.location.origin}/playgroud/${projectId}`
    navigator.clipboard.writeText(url)
    toast.success("Project Url Copied")
  }


  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>

                {/* Project Name */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">

                    <Link
                      href={`/playground/${project.id}`}
                      target="_blank" // Open in new page
                      rel="noopener noreferrer"  // for security purpose
                      className="hover:underline"
                    >
                      <span className="font-semibold">{project.title}</span>
                    </Link>

                    <span className="text-sm text-gray-500 line-clamp-1">{project.description}</span>
                  </div>
                </TableCell>

                {/* Template */}
                <TableCell>
                  <Badge variant="outline" className="bg-[#9b63ff15] text-[#9b63ff] border-[#9b63ff]">
                    {project.template}
                  </Badge>
                </TableCell>

                {/* Created At */}
                <TableCell>{format(new Date(project.createdAt), "MMM d, yyyy")}</TableCell>

                {/* Which User  */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={project.user.image || "/placeholder.svg"}
                        alt={project.user.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm">{project.user.name}</span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only" >Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">

                      {/* Mark as Fav  */}
                      <DropdownMenuItem asChild>
                        <MarkedToggleButton markedForRevision={project.starMark[0]?.isMarked ?? false} id={project.id} />
                      </DropdownMenuItem>

                      {/* Open Project */}
                      <DropdownMenuItem asChild>
                        <Link href={`playground/${project.id}`} className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Open Project
                        </Link>
                      </DropdownMenuItem>

                      {/* Open In New Tab */}
                      <DropdownMenuItem asChild>
                        <Link href={`playground/${project.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Link>
                      </DropdownMenuItem>


                      <DropdownMenuSeparator />
                      {/* CRUD Starts Here */}

                      {/* EDIT Project */}
                      <DropdownMenuItem onClick={() => handleEditClick(project)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>

                      {/* DUPLICATE PROJECT */}
                      <DropdownMenuItem onClick={() => handleDuplicateProject(project)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>

                      {/* COPY URL */}
                      <DropdownMenuItem onClick={() => copyProjectUrl(project.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>


                      <DropdownMenuSeparator />

                      {/* DELETE Project */}
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(project)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      {/* Edit Project Dialog */}
      <EditDialog
        {...{
          editDialogOpen,
          setEditDialogOpen,
          editData,
          setEditData,
          handleUpdateProject,
          isLoading,
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone. All files and
              data associated with this project will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}


