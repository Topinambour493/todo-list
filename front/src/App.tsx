import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import TaskManager from "./Components/taskManager/taskManager";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskManager />} />
      </Routes>
    </BrowserRouter>
  );
}

