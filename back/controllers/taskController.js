const Task = require('../models/taskModel');

exports.addTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    task.priority = await getBiggerPriority() + 1;
    await task.save();
    res.status(201).json({message: 'Utilisateur ajouté avec succès', task});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

async function getBiggerPriority() {
  let task = await Task.findOne().sort({priority: -1})
  return task ? task.priority : 0;
}

async function getSmallerPriority(){
  let task = await Task.findOne().sort({priority: 1})
  return task ? task.priority : 0;
}

function getNewPriority(priorityTask1, priorityTask2){

  return (priorityTask1 + priorityTask2) / 2
}

exports.changePriority = async (req, res) => {
  let priority;
  let priorityTaskPrevious = req.body.priorityTaskPrevious
  let priorityTaskNext = req.body.priorityTaskNext
  if (priorityTaskPrevious){
    priorityTaskPrevious = parseFloat(priorityTaskPrevious)
  }
  if (priorityTaskNext){
    priorityTaskNext = parseFloat(priorityTaskNext)
  }
  if (priorityTaskPrevious === await getSmallerPriority()) {
    priority = priorityTaskPrevious - 1
  } else if (priorityTaskPrevious && priorityTaskNext) {
      priority = getNewPriority(priorityTaskPrevious, priorityTaskNext)
  } else if  (priorityTaskPrevious){
    priority = priorityTaskPrevious + 1
  } else {
    priority = priorityTaskNext - 1
  }
  try {
    const task =  await Task.findByIdAndUpdate(req.params.id, {priority: priority}, {new: true});
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({message: "task not found"})
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

// Récupérer tous les utilisateurs
exports.getTasks = async (req, res) => {
  let tasks;
  try {
    const searchQuery = req.query.search || '';
    const regex = new RegExp(searchQuery, 'i');
    tasks = await Task.find({name:  { $regex: regex }}).sort({priority: 1});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//Récuperer un task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({message: "task not found"})
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};


exports.modifyTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log(task)
    if (task) {
      res.status(200).json(task);
    } else {
      console.log("coucou")
      res.status(404).json({message: "task not found"})
    }
  } catch (error) {
    console.log({error: error.message})
    res.status(400).json({error: error.message});
  }
};

// Delete un task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.status(204).json();
    } else {
      res.status(404).json({message: "task not found"})
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};