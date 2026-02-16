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

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { TemplateSchema, repoSchema, RepoFormData } from "@/lib/repo_schema"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



type AddRepoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string, cloneLink: string }) => void;
}


const AddRepoModal = ({ isOpen, onClose, onSubmit }: AddRepoModalProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control
    } = useForm<RepoFormData>({
        resolver: zodResolver(repoSchema),
    });

    const handleSubmitRepo = (data: RepoFormData) => {
        console.log(`Clone Repo Data: `, data)
        onSubmit(data)
        reset()
        onClose()
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                // open is fasle meaning wants to close then do below
                if (!open) {
                    onClose()
                    reset()
                }
            }}
        >
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={(e) => { handleSubmit(handleSubmitRepo)(e) }}>
                    <DialogHeader className="py-4">
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
                            <Input {...register("name")} placeholder="Eg: test project" />
                            {errors.name && (
                                <FieldDescription className="text-red-500 text-sm">
                                    {errors.name.message}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <Label>Templates:</Label>
                            < Controller
                                control={control}
                                name="templates"
                                render={
                                    ({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Template" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        TemplateSchema.options.map((template) => (
                                                            <SelectItem key={template} value={template}>{template}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )
                                }
                            />
                            {errors.templates && (
                                <FieldDescription className="text-red-500 text-sm">
                                    {errors.templates.message}
                                </FieldDescription>
                            )}

                        </Field>

                        <Field>
                            <Label htmlFor="username-1">Repo Link</Label>
                            <FieldDescription>Only Public Repo</FieldDescription>
                            <Input {...register("cloneLink")} type="url" placeholder="Eg: https://github.com/" />
                            {errors.cloneLink && (
                                <FieldDescription className="text-red-500 text-sm">
                                    {errors.cloneLink.message}
                                </FieldDescription>
                            )}
                        </Field>
                    </FieldGroup>


                    <DialogFooter className="py-4">

                        {/* Close Button */}
                        <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline">Cancel</Button>
                        </DialogClose>

                        {/* Clone Button */}
                        <Button className="cursor-pointer hover:bg-[#9b63ff] bg-[#8746f9] text-white" type="submit" disabled={isSubmitting}>
                            <Copy />
                            Clone
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}

export default AddRepoModal
