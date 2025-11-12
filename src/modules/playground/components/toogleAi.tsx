"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  FileText,
  Loader2,
  Power,
  PowerOff,
  CircleOff,
} from "lucide-react";
import { } from "lucide-react"

import React from "react";
import { cn } from "@/lib/utils";
import { AIChatSidePanel } from "@/modules/ai-chat/components/ai-chat-sidebar-panel";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useModelStore } from "../store/modelStore";


interface ToggleAIProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;

  suggestionLoading: boolean;
  loadingProgress?: number;
  activeFeature?: string;
}


const ToggleAI = ({
  isEnabled,
  onToggle,

  suggestionLoading,
  loadingProgress = 0,
  activeFeature,
}: ToggleAIProps) => {

  const { setModel, allModels, modelSelected } = useModelStore()

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [open, setOpen] = useState(false)

  // Using call back to prevent un  necssary re rednders of the functions
  const handleToggle = useCallback(() => {
    onToggle(!isEnabled)
  }, [onToggle, isEnabled])

  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false)
  }, [])

  const modelSelect = useCallback((value: string) => {
    setModel(allModels.find((s) => s.value === value) ??  null)
    setOpen(false);
  }, [modelSelected,allModels,setModel,setOpen])


  return (
    <>
      <DropdownMenu>

        {/* Trigger */}
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant={isEnabled ? "default" : "outline"}
            className={cn(
              "relative gap-2 h-8 px-3 text-sm font-medium transition-all duration-200",
              isEnabled
                ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 dark:border-zinc-200"
                : "bg-background hover:bg-accent text-foreground border-border",
              suggestionLoading && "opacity-75"
            )}
            onClick={(e) => e.preventDefault()}
          >

            {suggestionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bot className="h-4 w-4" />
            )}

            <span>AI</span>

            {isEnabled ? (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            ) : (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>
        </DropdownMenuTrigger>


        <DropdownMenuContent align="end" className="w-72">

          {/* Ai Assistant */}
          <DropdownMenuLabel className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                isEnabled
                  ? "bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-200"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isEnabled ? "Active" : "Inactive"}
            </Badge>
          </DropdownMenuLabel>

          {/* Progress bar for loading or not loading */}
          {suggestionLoading && activeFeature && (
            <div className="px-3 pb-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{activeFeature}</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                <Progress
                  value={loadingProgress}
                  className="h-1.5"
                />
              </div>
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Select Model */}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between w-full px-3 py-2.5 cursor-pointer rounded-md hover:bg-accent transition-all">
                  <div className="flex items-center gap-3">
                    {modelSelected ? (
                      <modelSelected.icon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <CircleOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="text-sm font-medium">
                        {modelSelected ? modelSelected.label : "Select Model"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Choose an AI model
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-[200px]"
              side="left"
              align="start"
              sideOffset={12}
            >
              <Command>
                <CommandInput placeholder="Search models..." />
                <CommandList>
                  <CommandEmpty>No models found.</CommandEmpty>
                  <CommandGroup>
                    {allModels.map((model) => (
                      <CommandItem
                        key={model.value}
                        value={model.value}
                        onSelect={modelSelect}
                      >
                        <model.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {model.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* On off Ai Button */}
          <DropdownMenuItem
            onClick={handleToggle}
            className="py-2.5 cursor-pointer"
          >

            <div className="flex items-center justify-between w-full">

              <div className="flex items-center gap-3">
                {isEnabled ? (
                  <Power className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <PowerOff className="h-4 w-4 text-muted-foreground" />
                )}

                <div>
                  <div className="text-sm font-medium">
                    {isEnabled ? "Disable" : "Enable"} AI
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Toggle AI assistance
                  </div>
                </div>
              </div>

              <div className={cn(
                "w-8 h-4 rounded-full border transition-all duration-200 relative",
                isEnabled
                  ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50"
                  : "bg-muted border-border"
              )}>
                <div className={cn(
                  "w-3 h-3 rounded-full bg-background transition-all duration-200 absolute top-0.5",
                  isEnabled ? "left-4" : "left-0.5"
                )} />
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Open Chat */}
          <DropdownMenuItem
            onClick={handleOpenChat}
            className="py-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-3 w-full">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Open Chat</div>
                <div className="text-xs text-muted-foreground">
                  Chat with AI assistant
                </div>
              </div>
            </div>
          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>


      <AIChatSidePanel
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />

    </>
  );
};

export default ToggleAI;

