"use client"

import { Button } from "@/components/ui/button"

import { StarIcon, StarOffIcon } from "lucide-react"
import type React from "react"
import { toast } from "sonner"

import { toggleStarMarked } from "../actions"

import { useTransition, useOptimistic } from "react"

interface MarkedToggleButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  markedForRevision: boolean
  id: string
}

export const MarkedToggleButton = ({ markedForRevision, id }: MarkedToggleButtonProps) => {

  const [isPending, startTransition] = useTransition()
  const [optimisticMarked, setOptimisticMarked] = useOptimistic(
    markedForRevision,
    (state, newState: boolean) => newState
  )


  const handleToggle = async () => {

    const newMarkedState = !optimisticMarked

    // Update the UI right away so it feels instant, but treat this update as non-blocking, so don’t freeze the UI while doing it.
    startTransition(async () => {

      // Optimistically update the UI immediately
      setOptimisticMarked(newMarkedState)

      try {

        const res = await toggleStarMarked(id, newMarkedState)
        const { success, error, isMarked } = res;

        //    if ismarked true then show marked successfully otherwise show error msg
        if (!success || error) {
          // Revert on error
          setOptimisticMarked(!newMarkedState)
          toast.error("Failed to update favorite")
          return
        }

        // Show success message
        if (isMarked) {
          toast.success("Added to Favorites successfully")
        } else {
          toast.success("Removed from Favorites successfully")
        }

      } catch (error) {
        console.error("Failed to toggle mark for revision:", error)
        setOptimisticMarked(!newMarkedState)
        toast.success("Failed to update favorite")
        // Revert state if the update fails
      }
    })
  }

  return (
    <Button
      variant="ghost"
      className={`flex items-center justify-start w-full px-2 py-1.5 text-sm rounded-md cursor-pointer`}
      onClick={handleToggle}
    >
      {optimisticMarked  ? (
        <StarIcon size={16} className="text-red-500 mr-2" />
      ) : (
        <StarOffIcon size={16} className="text-gray-500 mr-2" />
      )}

      {optimisticMarked  ? "Remove Favorite" : "Add to Favorite"}
    </Button>
  )

}

// React DevTools shows anonymous components created with forwardRef as just ForwardRef, which is confusing.
// MarkedToggleButton.displayName = "MarkedToggleButton"
