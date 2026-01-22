import React from 'react'
import AvailableFieldList from './AvailableFieldList'
import ViewFieldList from './ViewFieldList'
function CustomField() {
  return (
    <>
    <div className='max-w-8xl mx-auto'>
      <div className='grid md:grid-cols-4'>
      <AvailableFieldList/>
        <div className='col-span-3'>
          <ViewFieldList/>
        </div>
      </div>
    </div>
    </>
  )
}

export default CustomField