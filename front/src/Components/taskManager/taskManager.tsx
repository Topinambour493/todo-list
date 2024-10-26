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
  let [itemIdDragged, setItemIdDragged] = useState("")


  function resetNewTask() {
    setNameNewTask("")
  }

  async function createNewTask(e: React.SyntheticEvent) {
    e.preventDefault()
    let newTask = {"name": nameNewTask, "status": statusNewTask}
    await addTask(newTask)
    await filterTask(statusFilter)

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
    await filterTask(statusFilter)
  }

  const onTaskEdit = async (task: TaskId) => {
    const response = await fetch('http://localhost:3001/tasks/' + task._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    if (response.ok) {
      await filterTask(statusFilter)
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
      if (response.ok) {
        let tasksNonFiltered = await response.json()
        if (statusFilter === "tout")
          setTasks(tasksNonFiltered)
        else
          setTasks(tasksNonFiltered.filter((task: Task) => task.status === statusFilter))
      } else {
        alert('Failed to get tasks');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const onDragStart = (event: any) => {
    setItemIdDragged(event.currentTarget.parentElement.id);

    const dragPreview = event.currentTarget.parentElement;

    event.target.parentElement.style.opacity = 0.5;
    // Utilisation de setDragImage pour définir l'image flottante
    event.dataTransfer.setDragImage(dragPreview, 50, 25);

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    event.dataTransfer.setData("text/html", '');
  }

  const onDrop = async (e: any) => {
    let previousPriority  = e.currentTarget?.getElementsByClassName("moveTaskCard")[0].dataset.position
    let nextPriority = e.currentTarget.nextElementSibling?.getElementsByClassName("moveTaskCard")[0].dataset.position

    console.log(previousPriority, nextPriority)
    try {
      const response = await fetch('http://localhost:3001/tasks/' + itemIdDragged + "/changePriority", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({priorityTaskPrevious: previousPriority, priorityTaskNext: nextPriority}),
      });
      if (response.ok) {
        await filterTask(statusFilter)
      }
    } catch (error) {
      console.error('Error:', error);
    }

  }

  async function changePriorityTask(task: TaskId, priorityTask1: string, priorityTask2: string) {
    try {
      const response = await fetch('http://localhost:3001/tasks' + task._id + "/changePriority", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({priorityTask1: priorityTask1, priorityTask2: priorityTask2}),
        })
      ;


      if (response.ok) {
        await filterTask(statusFilter)
        resetNewTask()
      } else {
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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


      if (response.ok) {
        await filterTask(statusFilter)
        resetNewTask()
      } else {
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    filterTask(statusFilter).then()
  }, [statusFilter])

  return (
    <div id={"taskManager"}>
      <button onClick={() => navigate('/')}>Déconnexion</button>
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
          <>
            {task.priority}
            <TaskCard key={index} _id={task._id} onDelete={onTaskDelete} onEdit={onTaskEdit} status={task.status}
                      name={task.name}
                      priority={task.priority}
                      onDragStart={onDragStart}
                      onDrop={onDrop}
            />
          </>

        ))}
      </div>
    </div>
  )
    ;
}

export default TaskManager;