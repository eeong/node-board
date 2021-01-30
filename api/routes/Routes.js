const express = require('express');
const router = express.Router();
const taskBuilder = require('../controllers/taskController');
const searchApi = require('../controllers/searchController');

router.get(['/','/search'], searchApi.read_rank);

router.get('/search/:user', searchApi.read_user_num);

router.get('/tasks', taskBuilder.list_all_tasks)

router.post('/tasks', taskBuilder.create_a_task)

router.get('/tasks/:taskId', taskBuilder.read_a_task)

router.put('/tasks/:taskId', taskBuilder.update_a_task)

router.delete('/tasks/:taskId', taskBuilder.delete_a_task)

module.exports = router;