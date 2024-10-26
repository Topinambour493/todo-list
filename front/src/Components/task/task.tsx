import React, {useState} from 'react';
import {TaskEdit} from "../../models";
import "./task.css"
import edition from "../../images/edit.png"
import valid from "../../images/valid.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faXmark, faPenToSquare, faCheck} from "@fortawesome/free-solid-svg-icons";



const TaskCard: React.FC<TaskEdit> = ({name = "", status = "a faire", _id, onDelete, onEdit, onDragStart, draggable, onDrop, priority}) => {

  let [editName, setEditName] = useState(name)
  let [editStatus, setEditStatus] = useState(status)
  let [edit, setEdit] = useState(false)


  function changeEdit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (edit ){
      onEdit({name:editName, status:editStatus, _id:e.currentTarget.parentElement!.id, priority: priority})
      resetEdit()
    }
    setEdit(!edit)
  }

  function dragOver(event: React.DragEvent<HTMLDivElement>){
    event.preventDefault();
  }

  function dragEnd(event: React.DragEvent<HTMLDivElement>){
    event.currentTarget.style.opacity=""
  }
  function resetEdit(){
    setEditName(name)
    setEditStatus(status)
  }

  return (
    <div className={"taskCard"} id={_id} onDrop={onDrop} onDragOver={(e: React.DragEvent<HTMLDivElement>)=>dragOver(e)} onDragEnd={(e: React.DragEvent<HTMLDivElement>)=> dragEnd(e)}>
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
        let a = e.currentTarget.parentElement
        onDelete(_id);
      }}><FontAwesomeIcon icon={faXmark}/>
      </button>
      <button className={"editTaskCard"} onClick={(e)=>changeEdit(e)}>
        <FontAwesomeIcon icon={edit ? faCheck : faPenToSquare}/>
      </button>
      <div className={"moveTaskCard"} data-position={priority} onDragStart={onDragStart} draggable={true}><FontAwesomeIcon icon={faBars}/></div>
    </div>
  )
    ;
};

export default TaskCard;