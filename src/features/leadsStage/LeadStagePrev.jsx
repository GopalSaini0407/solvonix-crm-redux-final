import React from 'react'

function LeadStagePrev({stages}) {
  return (
<>
<div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-3">Pipeline Preview</h4>
          <div className="flex flex-wrap gap-2">
            {stages
              .filter(stage => stage.is_active === 1)
              .map((stage, index, activeStages) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border shadow-sm"
                    style={{ borderLeftColor: stage.color_code, borderLeftWidth: '4px' }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: stage.color_code }}
                    ></div>
                    <span className="text-sm font-medium">{stage.stage_name}</span>
                    <span className="text-xs text-gray-500">({stage.priority})</span>
                  </div>
                  {index < activeStages.length - 1 && (
                    <div className="text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
   </>
  )
}

export default LeadStagePrev