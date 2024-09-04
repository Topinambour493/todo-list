import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import TaskManager from "./Components/taskManager/taskManager";
import Login from "./Components/login/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/tasklist" element={<TaskManager />} />
      </Routes>
    </BrowserRouter>
  );
}

