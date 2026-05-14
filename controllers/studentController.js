// Student Controller
// Handles requests for the student portal (view-only)

const Award = require('../models/Award');
const Student = require('../models/Student');

exports.getStudentPortal = async (req, res) => {
    try {
        // Fetch all awards with student details populated
        const awards = await Award.find()
            .populate('student')
            .sort({ issuedDate: -1 });

        // Get unique classes and sections for filter dropdowns
        const students = await Student.find().distinct('class');
        const sections = await Student.find().distinct('section');

        res.render('student/portal', {
            title: 'Student Awards Records',
            awards: awards,
            classes: students,
            sections: sections,
            searchQuery: '',
            filterClass: '',
            filterSection: '',
        });
    } catch (error) {
        console.error('Error in getStudentPortal:', error);
        req.flash('error', 'Error loading student portal');
        res.status(500).render('error', { error: error.message });
    }
};

// Search and filter awards
exports.searchAwards = async (req, res) => {
    try {
        const { search, class: filterClass, section: filterSection } = req.query;

        // Build search query
        let query = {};

        if (search) {
            // Search across multiple fields
            const searchRegex = new RegExp(search, 'i'); // Case-insensitive
            query = {
                $or: [
                    { 'student.name': searchRegex },
                    { 'student.class': searchRegex },
                    { 'student.rollNumber': searchRegex },
                    { 'student.section': searchRegex },
                    { awardName: searchRegex },
                    { issuedBy: searchRegex },
                ],
            };
        }

        // Apply additional filters
        if (filterClass) {
            query['student.class'] = filterClass;
        }

        if (filterSection) {
            query['student.section'] = filterSection;
        }

        // Execute query with populated student data
        const awards = await Award.find(query)
            .populate('student')
            .sort({ issuedDate: -1 });

        // Get unique classes and sections for filter dropdowns
        const students = await Student.find().distinct('class');
        const sections = await Student.find().distinct('section');

        res.render('student/portal', {
            title: 'Student Awards Records',
            awards: awards,
            classes: students,
            sections: sections,
            searchQuery: search || '',
            filterClass: filterClass || '',
            filterSection: filterSection || '',
        });
    } catch (error) {
        console.error('Error in searchAwards:', error);
        req.flash('error', 'Error searching awards');
        res.status(500).render('error', { error: error.message });
    }
};
