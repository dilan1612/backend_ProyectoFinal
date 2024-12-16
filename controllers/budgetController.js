const Budget = require('../models/Budget');

// Create a new budget
const createBudget = async (req, res) => {
  try {
    const newBudget = new Budget(req.body);
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all budgets
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a budget
const updateBudget = async (req, res) => {
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
