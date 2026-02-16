export interface User {
    id: string
    name: string
    email: string
    image: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export interface Project {
    id: string
    title:string
    description: string | null
    template: string
    createdAt: Date
    updatedAt: Date
    userId: string
    user: User
    starMark: { isMarked: boolean}[]
}

export interface Data {
  title: string,
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "OTHER",
  description?: string,
}