import {rename} from "node:fs";

export type Task = {
  name: string;
  status: string;
}

export type TaskId = {
  name: string;
  status: string;
  id: string;
}

export type TaskEdit = {
  name: string;
  status: string;
  id: string;
  onDelete: (id: string) => void,
  onEdit: (taskId: TaskId) => void;
  draggable?: boolean;
  onDragStart: (e: any) => void;
  onDragOver: (e: any) => void;
  onDrop: () => void;
  onDragLeave: () => void;
  indexPosition: number;
}

export type InitialDnDState = {
  draggedFrom: number,
  draggedTo: number,
  isDragging: boolean,
  originalOrder: TaskId[],
  updatedOrder: TaskId[]
}