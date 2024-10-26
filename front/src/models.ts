import {rename} from "node:fs";

export type Task = {
  name: string;
  status: string;
}

export type TaskId = {
  priority: number;
  name: string;
  status: string;
  _id: string;
}

export type TaskEdit = {
  name: string;
  status: string;
  _id: string;
  onDelete: (id: string) => void,
  onEdit: (taskId: TaskId) => void;
  draggable?: boolean;
  onDragStart: (e: any) => void;
  onDragOver: (e: any) => void;
  onDrop: (e: any) => void;
  onDragLeave: (e: any) => void;
  priority: number;
}

export type InitialDnDState = {
  draggedFrom: number,
  draggedTo: number,
  isDragging: boolean,
  originalOrder: TaskId[],
  updatedOrder: TaskId[]
}