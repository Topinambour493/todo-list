const express = require('express');
const router = express.Router();
const  taskController = require('../controllers/taskController');

router.post('',  taskController.addTask);
router.get('',  taskController.getTasks);
router.get('/:id',  taskController.getTaskById);
router.put('/:id',  taskController.modifyTask);
router.put('/:id/changePriority', taskController.changePriority);
router.delete('/:id',  taskController.deleteTask);

module.exports = router;