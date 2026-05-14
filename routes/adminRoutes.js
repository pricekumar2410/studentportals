// Admin Routes
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ===== DASHBOARD =====
// GET admin dashboard
router.get('/', adminController.getAdminDashboard);

// ===== STUDENT ROUTES =====

// GET all students
router.get('/students', adminController.getAllStudents);

// GET add student form
router.get('/students/new', adminController.showAddStudentForm);

// POST create new student
router.post('/students', adminController.createStudent);

// GET edit student form
router.get('/students/:id/edit', adminController.showEditStudentForm);

// PUT update student (using method-override)
router.put('/students/:id', adminController.updateStudent);

// DELETE student (using method-override)
router.delete('/students/:id', adminController.deleteStudent);

// ===== AWARD ROUTES =====

// GET all awards
router.get('/awards', adminController.getAllAwards);

// GET add award form
router.get('/awards/new', adminController.showAddAwardForm);

// POST create new award
router.post('/awards', adminController.createAward);

// GET edit award form
router.get('/awards/:id/edit', adminController.showEditAwardForm);

// PUT update award (using method-override)
router.put('/awards/:id', adminController.updateAward);

// DELETE award (using method-override)
router.delete('/awards/:id', adminController.deleteAward);

module.exports = router;
