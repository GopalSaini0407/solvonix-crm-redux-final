import React from 'react'
import AvailableFieldList from './AvailableFieldList'
import ViewFieldList from './ViewFieldList'

function CustomField({ FieldType }) {
  console.log(FieldType)

  const isLeads = FieldType === "leads"
  const moduleName = isLeads ? "Leads" : "Contacts"

  return (
    <div className="max-w-8xl mx-auto">
      <div className="grid md:grid-cols-4">
        
        {/* Left side list */}
        <AvailableFieldList moduleName={moduleName} />

        {/* Right side list */}
        <div className="col-span-3">
          <ViewFieldList moduleName={moduleName} />
        </div>

      </div>
    </div>
  )
}

export default CustomField