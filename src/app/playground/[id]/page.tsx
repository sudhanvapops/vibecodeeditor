"use client"

import { usePlayground } from '@/modules/playground/hooks/usePlayground'
import { useParams } from 'next/navigation'
import React from 'react'

const MainPlaygroudPage = () => {

  const { id } = useParams<{ id: string }>()
  const {error,isLoading,playgroundData,templateData,saveTemplateData} = usePlayground(id)

  console.log(`Template data: `,templateData);
  console.log(`playgroundData: `,playgroundData);
  

  return (
    <div>
      Params: {id}
    </div>
  )
}

export default MainPlaygroudPage
