import { create } from "zustand"
import { Bot, XCircle } from "lucide-react"

interface Model {
    value: string
    label: string
    icon: React.ElementType
}

interface ModelState {
    modelSelected: Model | null
    allModels: Model[]
    setModel: (option: Model | null) => void
}

export const useModelStore = create<ModelState>((set) => ({

    modelSelected: null,
    allModels: [
        { value: "code-lamma", label: "Code Lamma", icon: Bot },
        { value: "perplexity", label: "Perplexity", icon: Bot },
        { value: "null", label: "None", icon: XCircle },
    ],

    setModel: (option) => set(() => ({ modelSelected: option })),
}))