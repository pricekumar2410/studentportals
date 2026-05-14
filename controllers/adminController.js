// Admin Controller
// Handles CRUD operations for students and awards

const Student = require('../models/Student');
const Award = require('../models/Award');

// ===== STUDENT CRUD OPERATIONS =====

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        res.render('admin/students', {
            title: 'Manage Students',
            students: students,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error'),
        });
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        req.flash('error', 'Error loading students');
        res.redirect('/admin');
    }
};

// Show add student form
exports.showAddStudentForm = (req, res) => {
    try {
        res.render('admin/add-student', {
            title: 'Add New Student',
            student: {},
        });
    } catch (error) {
        console.error('Error in showAddStudentForm:', error);
        res.status(500).render('error', { error: error.message });
    }
};

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const { name, class: studentClass, rollNumber, section } = req.body;

        // Validation
        if (!name || !studentClass || !rollNumber || !section) {
            req.flash('error', 'All fields are required');
            return res.redirect('/admin/students/new');
        }

        // Check if roll number already exists
        const existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            req.flash('error', 'Roll number already exists');
            return res.redirect('/admin/students/new');
        }

        const newStudent = new Student({
            name,
            class: studentClass,
            rollNumber,
            section,
        });

        await newStudent.save();
        req.flash('success', `Student "${name}" added successfully`);
        res.redirect('/admin/students');
    } catch (error) {
        console.error('Error in createStudent:', error);
        req.flash('error', error.message || 'Error creating student');
        res.redirect('/admin/students/new');
    }
};

// Show edit student form
exports.showEditStudentForm = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            req.flash('error', 'Student not found');
            return res.redirect('/admin/students');
        }
        res.render('admin/edit-student', {
            title: 'Edit Student',
            student: student,
        });
    } catch (error) {
        console.error('Error in showEditStudentForm:', error);
        req.flash('error', 'Error loading student');
        res.redirect('/admin/students');
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    try {
        const { name, class: studentClass, rollNumber, section } = req.body;

        // Validation
        if (!name || !studentClass || !rollNumber || !section) {
            req.flash('error', 'All fields are required');
            return res.redirect(`/admin/students/${req.params.id}/edit`);
        }

        // Check if another student has the same roll number
        const existingStudent = await Student.findOne({
            rollNumber,
            _id: { $ne: req.params.id },
        });

        if (existingStudent) {
            req.flash('error', 'Roll number already exists for another student');
            return res.redirect(`/admin/students/${req.params.id}/edit`);
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name,
                class: studentClass,
                rollNumber,
                section,
            },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            req.flash('error', 'Student not found');
            return res.redirect('/admin/students');
        }

        req.flash('success', `Student "${name}" updated successfully`);
        res.redirect('/admin/students');
    } catch (error) {
        console.error('Error in updateStudent:', error);
        req.flash('error', error.message || 'Error updating student');
        res.redirect(`/admin/students/${req.params.id}/edit`);
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            req.flash('error', 'Student not found');
            return res.redirect('/admin/students');
        }

        const studentName = student.name;

        // Delete all awards associated with this student
        await Award.deleteMany({ student: req.params.id });

        await Student.findByIdAndDelete(req.params.id);

        req.flash('success', `Student "${studentName}" deleted successfully`);
        res.redirect('/admin/students');
    } catch (error) {
        console.error('Error in deleteStudent:', error);
        req.flash('error', 'Error deleting student');
        res.redirect('/admin/students');
    }
};

// ===== AWARD CRUD OPERATIONS =====

// Get all awards
exports.getAllAwards = async (req, res) => {
    try {
        const awards = await Award.find()
            .populate('student')
            .sort({ issuedDate: -1 });

        const students = await Student.find().select('_id name');

        res.render('admin/awards', {
            title: 'Manage Awards',
            awards: awards,
            students: students,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error'),
        });
    } catch (error) {
        console.error('Error in getAllAwards:', error);
        req.flash('error', 'Error loading awards');
        res.redirect('/admin');
    }
};

// Show add award form
exports.showAddAwardForm = async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        res.render('admin/add-award', {
            title: 'Add New Award',
            award: {},
            students: students,
        });
    } catch (error) {
        console.error('Error in showAddAwardForm:', error);
        res.status(500).render('error', { error: error.message });
    }
};

// Create a new award
exports.createAward = async (req, res) => {
    try {
        const { awardName, issuedDate, issuedBy, student } = req.body;

        // Validation
        if (!awardName || !issuedDate || !issuedBy || !student) {
            req.flash('error', 'All fields are required');
            return res.redirect('/admin/awards/new');
        }

        // Verify student exists
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            req.flash('error', 'Selected student does not exist');
            return res.redirect('/admin/awards/new');
        }

        const newAward = new Award({
            awardName,
            issuedDate: new Date(issuedDate),
            issuedBy,
            student,
        });

        await newAward.save();
        req.flash('success', `Award "${awardName}" added successfully`);
        res.redirect('/admin/awards');
    } catch (error) {
        console.error('Error in createAward:', error);
        req.flash('error', error.message || 'Error creating award');
        res.redirect('/admin/awards/new');
    }
};

// Show edit award form
exports.showEditAwardForm = async (req, res) => {
    try {
        const award = await Award.findById(req.params.id).populate('student');
        const students = await Student.find().sort({ name: 1 });

        if (!award) {
            req.flash('error', 'Award not found');
            return res.redirect('/admin/awards');
        }

        res.render('admin/edit-award', {
            title: 'Edit Award',
            award: award,
            students: students,
        });
    } catch (error) {
        console.error('Error in showEditAwardForm:', error);
        req.flash('error', 'Error loading award');
        res.redirect('/admin/awards');
    }
};

// Update an award
exports.updateAward = async (req, res) => {
    try {
        const { awardName, issuedDate, issuedBy, student } = req.body;

        // Validation
        if (!awardName || !issuedDate || !issuedBy || !student) {
            req.flash('error', 'All fields are required');
            return res.redirect(`/admin/awards/${req.params.id}/edit`);
        }

        // Verify student exists
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            req.flash('error', 'Selected student does not exist');
            return res.redirect(`/admin/awards/${req.params.id}/edit`);
        }

        const updatedAward = await Award.findByIdAndUpdate(
            req.params.id,
            {
                awardName,
                issuedDate: new Date(issuedDate),
                issuedBy,
                student,
            },
            { new: true, runValidators: true }
        ).populate('student');

        if (!updatedAward) {
            req.flash('error', 'Award not found');
            return res.redirect('/admin/awards');
        }

        req.flash('success', `Award "${awardName}" updated successfully`);
        res.redirect('/admin/awards');
    } catch (error) {
        console.error('Error in updateAward:', error);
        req.flash('error', error.message || 'Error updating award');
        res.redirect(`/admin/awards/${req.params.id}/edit`);
    }
};

// Delete an award
exports.deleteAward = async (req, res) => {
    try {
        const award = await Award.findById(req.params.id);
        if (!award) {
            req.flash('error', 'Award not found');
            return res.redirect('/admin/awards');
        }

        const awardName = award.awardName;
        await Award.findByIdAndDelete(req.params.id);

        req.flash('success', `Award "${awardName}" deleted successfully`);
        res.redirect('/admin/awards');
    } catch (error) {
        console.error('Error in deleteAward:', error);
        req.flash('error', 'Error deleting award');
        res.redirect('/admin/awards');
    }
};

// ===== ADMIN DASHBOARD =====

// Show admin dashboard
exports.getAdminDashboard = async (req, res) => {
    try {
        // Get statistics
        const totalStudents = await Student.countDocuments();
        const totalAwards = await Award.countDocuments();
        const recentAwards = await Award.find()
            .populate('student')
            .sort({ issuedDate: -1 })
            .limit(5);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            totalStudents,
            totalAwards,
            recentAwards,
        });
    } catch (error) {
        console.error('Error in getAdminDashboard:', error);
        res.status(500).render('error', { error: error.message });
    }
};
