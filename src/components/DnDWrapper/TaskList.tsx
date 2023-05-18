import React, {useEffect, useState} from 'react'
import { Draggable, Droppable, DropResult } from 'react-beautiful-dnd';


import './DnDWrapper.css'
import TaskCard from '../DnDWrapper/TaskCard';


const getStyle = (isDragging: any, draggableStyle: any) => {
  if (isDragging && draggableStyle.transform !== null)
    draggableStyle.transform += " rotate(3deg)";
  return { ...draggableStyle };
};




function TaskList({name, items, id}: any, taskPlaceholderProps: any) {
  const [tasks, setTasks] = useState(items)
  
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div className='task-list' {...provided.droppableProps} ref={provided.innerRef}>
          <span className='title'>{name}</span>
          
          <div className='task-list-container'>
            {tasks.map((elem: any, index: any) => (
              <Draggable key={elem.id} draggableId={elem.id} index={index}>
                {(provided) => (
                  <div className='task-container'
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    ref={provided.innerRef}
                  >
                    <TaskCard key={elem.id} item={elem} index={index} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {snapshot.isDraggingOver && (
              <div
                className="placeholder"
                style={{
                  width: 100,
                  height: taskPlaceholderProps.clientHeigth,
                  position: 'absolute',
                  top: taskPlaceholderProps.clientY,
                  left: taskPlaceholderProps.clientX,
                  zIndex: 10,
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px'
                }}
              />
            )}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default TaskList