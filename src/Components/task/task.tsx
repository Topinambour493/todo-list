import React, {useState} from 'react';
import {TaskEdit} from "../../models";
import "./task.css"
import edition from "../../images/edit.png"
import valid from "../../images/valid.png"

const TaskCard: React.FC<TaskEdit> = ({name = "", status = "a faire", id, onDelete, onEdit}) => {

  let [editName, setEditName] = useState(name)
  let [editStatus, setEditStatus] = useState(status)
  let [edit, setEdit] = useState(false)

  function changeEdit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (edit ){
      onEdit({name:editName, status:editStatus, id:e.currentTarget.parentElement!.id})
      resetEdit()
    }
    setEdit(!edit)
  }

  function resetEdit(){
    setEditName(name)
    setEditStatus(status)
  }

  return (
    <div className={"taskCard"} id={id}>
      {edit ? (
        <div className={"editTaskCard"}>
          <input className={"nameTaskCard"} onChange={(e) => setEditName(e.target.value)} value={editName}></input>
          <select className={`${status} statusTaskCard`} onChange={(e) => {setEditStatus(e.target.value); e.currentTarget.className = e.target.value}}
                  value={editStatus}>
            <option className="faire" value="a faire">a faire</option>
            <option className="cours" value="en cours">en cours</option>
            <option className="fait" value="fait">fait</option>
          </select>
        </div>
      ) : (
        <div>
          <div className={"nameTaskCard"}>{name}</div>
          <div className={`${status} statusTaskCard`}>{status}</div>
        </div>
      )}
      <button className={"deleteTaskCard"} onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onDelete(e.currentTarget.parentElement!.id);
      }}>x
      </button>
      <button className={"editTaskCard"} onClick={(e)=>changeEdit(e)}>

        <img src={edit ? valid : edition}/>
      </button>
    </div>
  )
    ;
};

export default TaskCard;