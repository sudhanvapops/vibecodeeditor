import { z } from "zod"

export const TemplateSchema = z.enum(
    [
        "REACT",
        "NEXTJS",
        "EXPRESS",
        "VUE",
        "HONO",
        "ANGULAR",
        "OTHER"
    ],{
        message: "Template is required"
    }
)

export const repoSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(3, "Name must be at least 3 charcharacters"),

    cloneLink: z
        .string()
        .min(1, "Repo link is required")
        .refine(
            (value) => {
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            },
            {
                message: "Must be a valid URL",
            }
        )
        .refine(
            (url) => /^https:\/\/github\.com\/[^\/]+\/[^\/]+/.test(url),
            {
                message: "Must be a valid GitHub repository URL",
            }
        ),

    templates: TemplateSchema
})

export type RepoFormData = z.infer<typeof repoSchema>