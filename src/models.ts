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
  onEdit: (taskId: TaskId) => void
}