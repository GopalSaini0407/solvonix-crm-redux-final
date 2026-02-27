import React from 'react'
import {availableFieldData} from './availableFieldData'
import { useModal } from '../../context/ModalContext';
import CustomFieldForm from './CustomFieldForm';
import {
    Plus
  } from "lucide-react";

function AvailableFieldList({ moduleName }) {

const {openModal,closeModal}=useModal();


  return (
    <div className="col-span-1">
        <h1 className="text-xl font-bold mb-4">Available Fields</h1>
        <div className="border border-gray-400 rounded p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">Add your field to the form</p>
          <div className="space-y-2">
            {availableFieldData.map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between bg-white p-2 rounded shadow-sm border border-gray-300"
              >
                <div>
                  <div className="font-medium">{f.key}</div>
                  <div className="text-xs text-gray-500">{f.field_type}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-700"
                    // title="Add field"
                    // onClick={() => handleAdd(f)}
                    onClick={()=>openModal({
                        title:"add field",
                        size:"lg",
                        content:<CustomFieldForm fieldData={f}  moduleName={moduleName} closeModal={closeModal}/>
                    })}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default AvailableFieldList