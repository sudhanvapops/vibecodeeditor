"use client"

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { TemplateFileTree } from '@/modules/playground/components/playgroundExplorer'
import { usePlayground } from '@/modules/playground/hooks/usePlayground'
import { Separator } from '@radix-ui/react-separator'
import { useParams } from 'next/navigation'
import React from 'react'

const MainPlaygroudPage = () => {

  const { id } = useParams<{ id: string }>()
  const { error, isLoading, playgroundData, templateData, saveTemplateData } = usePlayground(id)


  const activeFile = "sample.txt"

  const wrappedHandleAddFile = ()=>{}
  const wrappedHandleAddFolder = ()=>{}
  const wrappedHandleDeleteFile = ()=>{}
  const wrappedHandleDeleteFolder = ()=>{}
  const wrappedHandleRenameFile = ()=>{}
  const wrappedHandleRenameFolder = ()=>{}


  return (
    <TooltipProvider>
      <>
        <TemplateFileTree 
          data={templateData}
          onFileSelect={()=>{}}
          selectedFile={activeFile}
          title="File Explorer"
          onAddFile = {wrappedHandleAddFile}
          onAddFolder = {wrappedHandleAddFolder}
          onDeleteFile = {wrappedHandleDeleteFile}
          onDeleteFolder = {wrappedHandleDeleteFolder}
          onRenameFile = {wrappedHandleRenameFile}
          onRenameFolder = {wrappedHandleRenameFolder}
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
