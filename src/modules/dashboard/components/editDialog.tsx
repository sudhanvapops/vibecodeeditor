import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'

type EditDialogProps = {
  editDialogOpen: boolean;
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData: { title: string, description: string };
  setEditData: React.Dispatch<React.SetStateAction<{ title: string, description: string }>>; 
  handleUpdateProject: () => void;
  isLoading: boolean;
}

const EditDialog = ({
    editDialogOpen,
    setEditDialogOpen,
    editData,
    setEditData,
    handleUpdateProject,
    isLoading }: EditDialogProps
) => {
    return (
        <>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Make changes to your project details here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                value={editData.title}
                                onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter project title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editData.description}
                                onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter project description"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleUpdateProject} disabled={isLoading || !editData.title.trim()}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditDialog
