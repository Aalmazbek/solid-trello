import React from 'react'


import './DnDWrapper.css'



function TaskCard({item, index}: any) {
    
  return (
    <div className='task'>
      {item.name}
    </div>
  )
}

export default TaskCard