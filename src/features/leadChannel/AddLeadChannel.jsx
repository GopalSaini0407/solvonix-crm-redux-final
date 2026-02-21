import React from 'react'

function AddLeadChannel() {
  return (
    <div className='add-lead-channel'>
        <form>
            <div>
            <label htmlFor="name">Source Name</label>
            <input type="text" name='name' placeholder='enter Source name' />
            </div>
            <div>
                <input type="checkbox" name='active' />
                <label htmlFor="active">Active</label>
            </div>
            <button className='btn px-3 py-2'>add source</button>
        </form>
    </div>
  )
}

export default AddLeadChannel