import React, { useCallback, useState, useContext } from "react";
import { DragDropContext, Draggable, DragStart, DragUpdate, Droppable, DropResult } from "react-beautiful-dnd";

import './DnDWrapper.css'
import TaskList from "./TaskList";


const DATA = [
  {
    id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
    name: "Walmart",
    items: [
      { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "3% Milk" },
      { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Butter" },
    ],
    tint: 1,
  },
  {
    id: "487f68b4-1746-438c-920e-d67b7df46247",
    name: "Indigo",
    items: [
      {
        id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae",
        name: "Designing Data Intensive Applications",
      },
      { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Atomic Habits" },
    ],
    tint: 2,
  },
  {
    id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
    name: "Lowes",
    items: [
      { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Workbench" },
      { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Hammer" },
    ],
    tint: 3,
  },
];




function DndWrapper() {
  const [transition, setTransition] = useState(false);

  const queryAttr = "data-rbd-drag-handle-draggable-id";
  const [stores, setStores] = useState(DATA)
  const [placeholderProps, setPlaceholderProps] = useState({} as any);
  const [taskPlaceholderProps, setTaskPlaceholderProps] = useState({} as any);

  


  const handleDragStart = (start: DragStart) => {
    if(!start.source){
      return;
    }

    setTransition(true)

    const {draggableId, source} = start

		const draggedDOM = getDraggedDom(draggableId)

		if (!draggedDOM) {
			return;
		}
		const { clientHeight, clientWidth } = draggedDOM;

    const clientX = parseFloat(window.getComputedStyle(draggedDOM.parentNode as HTMLElement).paddingTop) + [...draggedDOM.parentNode!.children]
			.slice(0, source.index)
			.reduce((total, curr) => {
				const style = window.getComputedStyle(curr);
				const marginRight = parseFloat(style.marginRight);
				return total + curr.clientWidth + marginRight;
			}, 0);
    
    setPlaceholderProps({
			clientHeight,
			clientWidth,
      clientY: parseFloat(window.getComputedStyle(draggedDOM.parentNode as HTMLElement).paddingLeft),
      clientX
		});
  }


  const handleDragDrop = (result: DropResult) => {
    const {source, destination, type, draggableId} = result    

    
    
    
    if (!destination) return
    
    setTransition(false)

    if (source.droppableId === destination.droppableId && source.index === destination.index) return
    

    if (type === 'group') {
      let storesCopy = [...stores]
      const [item] = storesCopy.splice(result.source.index, 1)
      storesCopy.splice(result.destination!.index, 0, item)

      return setStores(storesCopy)
    }


    const storesCopy = [...stores]
    const sourceColumn = storesCopy.findIndex(elem => elem.id === source.droppableId)
    const destColumn = storesCopy.findIndex(elem => elem.id === destination.droppableId)
    const [item] = storesCopy[sourceColumn].items.splice(result.source.index, 1)
    storesCopy[destColumn].items.splice(result.destination!.index, 0, item)
    setStores(storesCopy)
  }


  const handleDragUpdate = (update: DragUpdate) => {
    if(!update.destination){
      return;
    }

    const {draggableId, destination, type} = update

    const draggedDOM = getDraggedDom(draggableId)

		if (!draggedDOM) {
			return;
		}
		const { clientHeight, clientWidth } = draggedDOM;

    if (type === 'group') {
      const clientX = parseFloat(window.getComputedStyle(draggedDOM.parentNode as HTMLElement).paddingTop) + [...draggedDOM.parentNode!.children]
        .slice(0, destination.index)
        .reduce((total, curr) => {
          const style = window.getComputedStyle(curr);
          const marginRight = parseFloat(style.marginRight);
          const marginLeft = parseFloat(style.marginLeft);
          return total + curr.clientWidth + marginRight + marginLeft;
        }, 0);
      
      return setPlaceholderProps({
        clientHeight,
        clientWidth,
        clientY: parseFloat(window.getComputedStyle(draggedDOM.parentNode as HTMLElement).paddingTop),
        clientX
      });    
    }

    const clientX = parseFloat(window.getComputedStyle(draggedDOM.parentNode as HTMLElement).paddingTop) + [...draggedDOM.parentNode!.children]
      .slice(0, destination.index)
      .reduce((total, curr) => {
        const style = window.getComputedStyle(curr);
        const marginRight = parseFloat(style.marginRight);
        const marginLeft = parseFloat(style.marginLeft);
        return total + curr.clientWidth + marginRight + marginLeft;
      }, 0);
    
    setTaskPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY: parseFloat(window.getComputedStyle(draggedDOM.parentNode as HTMLElement).top),
      clientX
    });
    console.log(taskPlaceholderProps);
  }

  const getDraggedDom = (draggableId: any) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector<HTMLElement>(domQuery);

    return draggedDOM;
  };


  const getStyle = (isDragging: any, draggableStyle: any) => {
    if (isDragging && draggableStyle.transform !== null){
      draggableStyle.transform += " rotate(3deg)";
    }

    return {
      ...draggableStyle,
      transitionDuration: transition
    };
  };



  return (
    <DragDropContext
      onDragStart={handleDragStart} 
      onDragEnd={handleDragDrop}
      onDragUpdate={handleDragUpdate}
    >
      <div className="DnDWrapper-container">
          <Droppable droppableId="ROOT" type="group" direction="horizontal">
            {(provided, snapshot) => (
              <section className="task-lists-container" {...provided.droppableProps} ref={provided.innerRef}>
                {stores.map((store, index) => (
                  <Draggable
                    draggableId={store.id} 
                    key={store.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div 
                        className={`task-list-wrapper ${transition ? 'transition-zero' : ''}`}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        style={getStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <TaskList {...store} taskPlaceholderProps={taskPlaceholderProps} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {snapshot.isDraggingOver && (
                  <div
                    className="placeholder"
                    style={{
                      position: 'absolute',
                      zIndex: 0,
                      top: placeholderProps.clientY,
                      left: placeholderProps.clientX,
                      height: placeholderProps.clientHeight,
                      background: 'rgba(0, 0, 0, 0.2)',
                      width: placeholderProps.clientWidth,
                      borderRadius: '12px'
                    }}
                  />
                )}
              </section>
            )}
          </Droppable>
      </div>
    </DragDropContext>
  );
}

export default DndWrapper;