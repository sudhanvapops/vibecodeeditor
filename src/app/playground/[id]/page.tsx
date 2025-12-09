"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import LoadingStep from '@/modules/playground/components/loader'
import PlaygroundEditor from '@/modules/playground/components/playgroundEditor'
import { TemplateFileTree } from '@/modules/playground/components/playgroundExplorer'
import ToggleAI from '@/modules/playground/components/toogleAi'
import { useAISuggestions } from '@/modules/playground/hooks/useAISuggestion'
import { useFileExplorer } from '@/modules/playground/hooks/useFileExplorer'
import { usePlayground } from '@/modules/playground/hooks/usePlayground'
import { findFilePath } from '@/modules/playground/lib'
import { TemplateFile, TemplateFolder } from '@/modules/playground/lib/pathToJson-util'
import { sortFileExplorer } from '@/modules/playground/lib/sortJson'
import { useRuntime } from '@/modules/runtime/hooks/useRuntime'
import WebContainerPreview from '@/modules/webcontainers/components/webContainerPreview'
import { AlertCircle, Bot, FileText, FolderOpen, Save, Settings, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'



const MainPlaygroudPage = () => {

  const { id } = useParams<{ id: string }>()
  const { error, isLoading, playgroundData, templateData, saveTemplateData } = usePlayground(id)
  const [isPreviewVisible, setisPreviewVisible] = useState(true)

  const aiSuggestions = useAISuggestions()

  const {
    activeFileId,
    closeAllFiles,
    openFile,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
    closeFile,

    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    updateFileContent

  } = useFileExplorer()


  const {
    error: adapterError,
    isLoading: adapterLoading,
    runtime: adapter
  } = useRuntime({
    // ?
    projectId: "",
    type: "wasm"
  })


  const lastSyncedContent = useRef<Map<string, string>>(new Map())


  useEffect(() => {
    setPlaygroundId(id)
  }, [id, setPlaygroundId])


  useEffect(() => {

    if (templateData && !openFiles.length) {
      setTemplateData(sortFileExplorer(templateData))
    }

  }, [templateData, setTemplateData, openFiles.length])


  // Create wrapper functions that pass saveTemplateData
  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        adapter?.writeFile!,
        adapter!,
        saveTemplateData
      );
    },
    [handleAddFile, adapter?.writeFile, adapter, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, adapter!, saveTemplateData);
    },
    [handleAddFolder, adapter!, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFolder, saveTemplateData]
  );


  const activeFile = openFiles.find((file) => file.id === activeFileId)
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges)

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file)
  }


  const handleSave = useCallback(

    async (fileId?: string) => {

      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);

      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return


      try {

        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
          return;
        }

        // TO Make a Deep Copy
        const updatedTemplateData: TemplateFolder = JSON.parse(
          JSON.stringify(latestTemplateData)
        );

        // @ts-ignore
        const updateFileContent = (items: any[]) =>
          // @ts-ignore
          items.map((item) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContent(item.items) };
            } else if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });


        updatedTemplateData.items = updateFileContent(
          updatedTemplateData.items
        );


        // Sync with WebContainer
        if (adapter?.writeFile) {
          await adapter?.writeFile(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
          if (adapter) {
            await adapter?.writeFile(filePath, fileToSave.content);
          }
        }

        const newTemplateData = await saveTemplateData(updatedTemplateData);
        setTemplateData(sortFileExplorer(newTemplateData || updatedTemplateData));


        // Update open files
        const updatedOpenFiles = openFiles.map((file) =>
          file.id === targetFileId
            ? {
              ...file,
              content: fileToSave.content,
              originalContent: fileToSave.content,
              hasUnsavedChanges: false,
            }
            : file
        );
        setOpenFiles(updatedOpenFiles);

        toast.success(
          `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
        );

      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
        throw error;
      }
    }, [
    activeFileId,
    openFiles,
    adapter?.writeFile,
    adapter,
    saveTemplateData,
    setTemplateData,
    setOpenFiles
  ])


  const handleSaveAll = async () => {

    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch (error) {
      toast.error("Failed to save some files");
    }
  };


  // S Key Down Event
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);


  useEffect(() => {
    // What to Write
  }, [isPreviewVisible])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }


  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }


  // No template data
  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-amber-600 mb-2">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }



  return (

    <TooltipProvider>
      <>
        <TemplateFileTree
          data={templateData}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
          title="File Explorer"
          onAddFile={wrappedHandleAddFile}
          onAddFolder={wrappedHandleAddFolder}
          onDeleteFile={wrappedHandleDeleteFile}
          onDeleteFolder={wrappedHandleDeleteFolder}
          onRenameFile={wrappedHandleRenameFile}
          onRenameFolder={wrappedHandleRenameFolder}
        />

        {/* A wrapper that creates the main content area to the right of the sidebar */}
        <SidebarInset>

          <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>

            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />


            {/* Upper Bar */}
            <div className='flex flex-1 items-center gap-2'>

              <div className='flex flex-col flex-1'>
                <h1 className='text-sm font-medium'>
                  {playgroundData?.title || "Code Playground"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {openFiles.length} File(s) Open
                  {hasUnsavedChanges && " • Unsaved changes"}
                </p>
              </div>

              <div className="flex items-center gap-1">

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave()}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save (Ctrl+S)</TooltipContent>
                </Tooltip>


                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveAll()}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                </Tooltip>


                <ToggleAI
                  isEnabled={aiSuggestions.isEnabled}
                  onToggle={aiSuggestions.toggleEnabled}
                  suggestionLoading={aiSuggestions.isLoading}
                />


                <DropdownMenu>

                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">

                    <DropdownMenuItem
                      onClick={() => setisPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => closeAllFiles()}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>


              </div>
            </div>
          </header>


          <div className='h-[calc(100vh-4rem)]'>

            <div className='h-full flex flex-col'>

              <div className='border-b bg-muted/30'>
                <Tabs value={activeFileId || ""} onValueChange={setActiveFileId}>
                  <div className="flex items-center justify-between px-4 py-2">
                    <TabsList className="h-8 bg-transparent p-0">
                      {openFiles.map((file) => (
                        <TabsTrigger
                          key={file.id}
                          value={file.id}
                          className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            <span>
                              {file.filename}.{file.fileExtension}
                            </span>
                            {file.hasUnsavedChanges && (
                              <span className="h-2 w-2 rounded-full bg-orange-500" />
                            )}
                            <span
                              className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                closeFile(file.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {openFiles.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={closeAllFiles}
                        className="h-6 px-2 text-xs cursor-pointer"
                      >
                        Close All
                      </Button>
                    )}
                  </div>
                </Tabs>
              </div>

              <div className='flex-1 flex'>

                <ResizablePanelGroup
                  direction='horizontal'
                  className='h-full'
                >

                  <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                    <div className="h-full w-full transition-all">
                      {openFiles.length > 0 ? (
                        <PlaygroundEditor
                          activeFile={activeFile}
                          content={activeFile?.content || ""}
                          onContentChange={(value) => {
                            activeFileId && updateFileContent(activeFileId, value);
                          }}
                          suggestion={aiSuggestions.suggestion}
                          suggestionLoading={aiSuggestions.isLoading}
                          suggestionPosition={aiSuggestions.position}
                          onAcceptSuggestion={(editor, monaco) =>
                            aiSuggestions.acceptSuggestion(editor, monaco)
                          }
                          onRejectSuggestion={(editor) =>
                            aiSuggestions.rejectSuggestion(editor)
                          }
                          onTriggerSuggestion={(type, editor) =>
                            aiSuggestions.fetchSuggestion(type, editor)
                          }
                        />
                      ) : (
                        <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                          <FileText className="h-16 w-16 text-gray-300" />
                          <div className="text-center">
                            <p className="text-lg font-medium">No files open</p>
                            <p className="text-sm text-gray-500">
                              Select a file from the sidebar to start editing
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ResizablePanel>

                  {/* The Preview stays hidden but mounted */}
                  {isPreviewVisible && <ResizableHandle />}

                  <ResizablePanel
                    defaultSize={isPreviewVisible ? 50 : 0}
                    style={{ display: isPreviewVisible ? "block" : "none" }}
                  >
                    <WebContainerPreview
                      templateData={templateData}
                      instance={adapter}
                      isLoading={adapterLoading}
                      error={adapterError}
                      // serverUrl={serverUrl!}
                      forceResetup={false}
                    />
                  </ResizablePanel>


                </ResizablePanelGroup>

              </div>

            </div>
          </div>

        </SidebarInset>
      </>

    </TooltipProvider>
  )
}

export default MainPlaygroudPage
