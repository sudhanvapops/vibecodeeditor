"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    GitForkIcon,
    Copy
} from "lucide-react";

type AddRepoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string, cloneLink: string }) => void;
}

const AddRepoModal = ({ isOpen, onClose, onSubmit }: AddRepoModalProps) => {

    const handleClone = () => { }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                // open is fasle meaning wants to close then do below
                if (!open) {
                    onClose()
                }
            }}
        >
            <form onSubmit={handleClone}>
                <DialogContent className="sm:max-w-sm">

                    <DialogHeader>
                        <DialogTitle
                            className="text-xl font-bold text-[#9b63ff] flex items-center gap-2"
                        >
                            <GitForkIcon />
                            GitHub Rep Link
                        </DialogTitle>
                        <DialogDescription>
                            clone your public repo directly
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" type="text" name="name" placeholder="Eg: test project" />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Repo Link</Label>
                            <FieldDescription>Only Public Repo</FieldDescription>
                            <Input id="username-1" type="url" name="cloneLink" placeholder="Eg: https://github.com/" />
                        </Field>
                    </FieldGroup>


                    <DialogFooter>

                        {/* Close Button */}
                        <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline">Cancel</Button>
                        </DialogClose>

                        {/* Clone Button */}
                        <Button className="cursor-pointer hover:bg-[#9b63ff] bg-[#8746f9] text-white" type="submit">
                            <Copy />
                            Clone
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default AddRepoModal
