import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from '@/modules/dashboard/actions'
import AddNewButton from '@/modules/dashboard/components/addNewButton'
import AddRepo from '@/modules/dashboard/components/addRepo'
import EmptyState from '@/modules/dashboard/components/emptyState'
import ProjectTable from '@/modules/dashboard/components/projectTable'
import React from 'react'

const DashBoard = async () => {

  const playgrounds = await getAllPlaygroundForUser()

  return (
    <div className='flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
        <AddNewButton />
        <AddRepo />
      </div>

      <div className='mt-10 flex flex-col justify-center items-center w-full'>
        {
          playgrounds && playgrounds.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectTable
              projects = {playgrounds || []}
              // ! Can be Improved
              onDeleteProject={deleteProjectById}
              onUpdateProject={editProjectById}
              onDuplicateProject={duplicateProjectById}
            />
          )
        }
      </div>

    </div>

  )
}

export default DashBoard