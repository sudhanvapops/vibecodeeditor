"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"
import AddRepoModal from "./addRepoModal"
import { useState } from "react"
import { RepoFormData } from "@/lib/repo_schema"
import { toast } from "sonner"

const AddRepo = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleSubmit = async (data: RepoFormData) => {
    try {
      // call server action here
      setIsModalOpen(false)
    } catch (error) {
      toast.error("Failed to clone repo");
      console.error("Error in handleSubmit addRepo.tsx ", error)
    }
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#9b63ff] hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(155,99,255,0.2)]"
      >

        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#f9f7ff] group-hover:border-[#9b63ff] group-hover:text-[#9b63ff] transition-colors duration-300"
            size={"icon"}
          >
            <ArrowDown size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
          </Button>


          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#c5a6fb]">Clone Github Repository</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Work with your repositories in our editor</p>
          </div>
        </div>


        <div className="relative overflow-hidden">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <AddRepoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleSubmit}
      />
    </>
  )
}

export default AddRepo


