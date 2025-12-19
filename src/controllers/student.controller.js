const Task = require('../models/Task')

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ student: req.user.id })
      .populate('group', 'name')
    
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.submitTask = async (req, res) => {
  try {
    const { taskId, link } = req.body
    
    const task = await Task.findOneAndUpdate(
      { _id: taskId, student: req.user.id },
      { link, status: 'submitted' },
      { new: true }
    )
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}