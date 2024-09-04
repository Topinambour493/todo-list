import React, {ChangeEvent, useEffect, useState} from 'react';
import TaskCard from "../task/task";
import {InitialDnDState, Task, TaskId} from "../../models";
import "./taskManager.css"
import {useNavigate} from "react-router-dom";


const initialDnDState: InitialDnDState = {
  draggedFrom: 0,
  draggedTo: 0,
  isDragging: false,
  originalOrder: [],
  updatedOrder: []
}

const TaskManager = () => {
  let navigate = useNavigate()
  let [nameNewTask, setNameNewTask] = useState<string>("")
  let [statusNewTask, setStatusNewTask] = useState<string>("a faire")
  let [statusFilter, setStatusFilter] = useState<string>("tout")
  let [tasks, setTasks] = useState<TaskId[]>([])
  let [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);


  function resetNewTask() {
    setNameNewTask("")
  }

  function createNewTask(e: React.SyntheticEvent) {
    e.preventDefault()
    let newTask = {"name": nameNewTask, "status": statusNewTask}
    addTask(newTask)
    filterTask(statusFilter)

    resetNewTask()
  }


  function changeStatus(e: ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value)
    e.currentTarget.className = e.target.value
  }


  const onTaskDelete = async (id: string) => {
    const response = await fetch('http://localhost:3001/tasks/' + id, {
      method: 'DELETE',
    })
    console.log('AAAAh', response);
    filterTask(statusFilter)
  }

  const onTaskEdit = async (task: TaskId) => {
    const response = await fetch('http://localhost:3001/tasks/' + task.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    if (response.ok) {
      console.log('AAAAh', response);
      filterTask(statusFilter)
    } else {
      alert('Failed to get tasks');
    }
  }
  async function filterTask(statusFilter: string = "tout") {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
      if (response.ok) {
        let tasksNonFiltered = await response.json()
        if (statusFilter === "tout")
          setTasks(tasksNonFiltered)
        else
          setTasks(tasksNonFiltered.filter((task: Task) => task.status === statusFilter))
        console.log(tasks)
      } else {
        alert('Failed to get tasks');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const onDragStart = (event: any) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: tasks
    });

    const dragPreview = event.currentTarget.parentElement;


    // Utilisation de setDragImage pour définir l'image flottante
    event.dataTransfer.setDragImage(dragPreview, 50, 25);

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    event.dataTransfer.setData("text/html", '');
  }

  // onDragOver fires when an element being dragged
  // enters a droppable area.
  // In this case, any of the items on the list
  const onDragOver = (event: any) => {

    // in order for the onDrop
    // event to fire, we have
    // to cancel out this one
    event.preventDefault();

    let newTasks: TaskId[] = dragAndDrop.originalOrder;

    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom;

    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newTasks[draggedFrom];
    const remainingItems = newTasks.filter((item, index) => index !== draggedFrom);

    newTasks = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo)
    ];

    if (draggedTo !== dragAndDrop.draggedTo){
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newTasks,
        draggedTo: draggedTo
      })
    }

  }

  const onDrop = () => {

    setTasks(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: 0,
      draggedTo: 0,
      isDragging: false
    });
  }

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: 0
    });

  }

  async function addTask(newTask: Task) {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      console.log(response);

      if (response.ok) {
        resetNewTask()
      } else {
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    filterTask(statusFilter)
  }, [statusFilter])

  return (
    <div id={"taskManager"}>
      <button onClick={()=>navigate('/')}>Déconnexion</button>
      <form onSubmit={createNewTask}>
        <label>Nom de la nouvelle tache: </label>
        <input type={"text"} onChange={(e: ChangeEvent<HTMLInputElement>) => setNameNewTask(e.target.value)}
               value={nameNewTask}></input>
        <label>Status: </label>
        <select name="statusTask"
                id="statusTask-select"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setStatusNewTask(e.target.value);
                  e.currentTarget.className = e.target.value
                }}>
          <option className="faire" value="a faire">a faire</option>
          <option className="cours" value="en cours">en cours</option>
          <option className="fait" value="fait">fait</option>
        </select>
        <button>Créer</button>
      </form>
      <select name="statusFilterTask"
              id="statusFilterTask-select" onChange={(e) => {
        changeStatus(e)
      }}>
        <option className="tout" value="tout">tout</option>
        <option className="faire" value="a faire">a faire</option>
        <option className="cours" value="en cours">en cours</option>
        <option className="fait" value="fait">fait</option>
      </select>
      <div id={"tasksCard"}>
        {tasks.map((task: TaskId, index) => (
          <TaskCard key={index} id={task.id} onDelete={onTaskDelete} onEdit={onTaskEdit} status={task.status}
                    name={task.name}
                    indexPosition={index}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onDragLeave={onDragLeave}
            />
            ))}
          </div>
          </div>
          )
          ;
        }

        export default TaskManager;