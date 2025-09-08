"use client"

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { TemplateFileTree } from '@/modules/playground/components/playgroundExplorer'
import { useFileExplorer } from '@/modules/playground/hooks/useFileExplorer'
import { usePlayground } from '@/modules/playground/hooks/usePlayground'
import { TemplateFile } from '@/modules/playground/lib/pathToJson-util'
import { Separator } from '@radix-ui/react-separator'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const MainPlaygroudPage = () => {

  const { id } = useParams<{ id: string }>()
  const { error, isLoading, playgroundData, templateData, saveTemplateData } = usePlayground(id)
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles
  } = useFileExplorer()


  useEffect(()=>{
    setPlaygroundId(id)
  },[id,setPlaygroundId])

  useEffect(() => {
    
    if (templateData && !openFiles.length){
      setTemplateData(templateData)
    }
    
  }, [templateData,setTemplateData,openFiles.length])
  

  const activeFile = openFiles.find((file)=>file.id === activeFileId)
  const hasUnsavedChanges = openFiles.some((file)=>file.hasUnsavedChanges)

  const handleFileSelect = (file:TemplateFile){
    openFile(file)
  }


  const wrappedHandleAddFile = () => { }
  const wrappedHandleAddFolder = () => { }
  const wrappedHandleDeleteFile = () => { }
  const wrappedHandleDeleteFolder = () => { }
  const wrappedHandleRenameFile = () => { }
  const wrappedHandleRenameFolder = () => { }


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
        <SidebarInset>

          <header className='felx h-16 shrink-0 items-center gap-2 border-b px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
          </header>

          <div className='flex felx-1 items-center gap-2'>
            <div className='flex flex-col flex-1'>
              <h1 className='text-sm font-medium'>
                {playgroundData?.title || "Code Playground"}
              </h1>
            </div>
          </div>

        </SidebarInset>
      </>

    </TooltipProvider>
  )
}

export default MainPlaygroudPage
