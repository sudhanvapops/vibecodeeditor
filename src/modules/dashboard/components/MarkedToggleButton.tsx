"use client"

import { Button } from "@/components/ui/button"

import { StarIcon, StarOffIcon } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { toggleStarMarked } from "../actions"

interface MarkedToggleButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  markedForRevision: boolean
  id: string
}

export const MarkedToggleButton = ({ markedForRevision, id }: MarkedToggleButtonProps) => {

  const [isMarked, setIsMarked] = useState(markedForRevision)
  const router = useRouter()

  const handleToggle = async () => {

    const newMarkedState = !isMarked
    setIsMarked(newMarkedState)

    try {

      const res = await toggleStarMarked(id, newMarkedState)
      const { success, error, isMarked } = res;

      //    if ismarked true then show marked successfully otherwise show start over
      if (isMarked && !error && success) {
        toast.success("Added to Favorites successfully")
      } else {
        toast.success("Removed from Favorites successfully")
      }

      // Used to refresh when depended on server side components
      router.refresh()

    } catch (error) {
      console.error("Failed to toggle mark for revision:", error)
      setIsMarked(!newMarkedState)
      // Revert state if the update fails
      // You might want to add a toast notification here for the user
    }
  }

  return (
    <Button
      variant="ghost"
      className={`flex items-center justify-start w-full px-2 py-1.5 text-sm rounded-md cursor-pointer`}
      onClick={handleToggle}
    >
      {isMarked ? (
        <StarIcon size={16} className="text-red-500 mr-2" />
      ) : (
        <StarOffIcon size={16} className="text-gray-500 mr-2" />
      )}

      {isMarked ? "Remove Favorite" : "Add to Favorite"}
    </Button>
  )

}

// React DevTools shows anonymous components created with forwardRef as just ForwardRef, which is confusing.
// MarkedToggleButton.displayName = "MarkedToggleButton"
