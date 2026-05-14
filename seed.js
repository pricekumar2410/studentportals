// Seed Database with Dummy Data
// Run this file once to populate the database with sample data

const mongoose = require('mongoose');
const Student = require('./models/Student');
const Award = require('./models/Award');
const connectDB = require('./config/database');

// Sample students data
const studentsData = [
    { name: 'Rahul Kumar', class: '10-A', rollNumber: '001', section: 'A' },
    { name: 'Priya Singh', class: '10-A', rollNumber: '002', section: 'A' },
    { name: 'Amit Patel', class: '10-B', rollNumber: '003', section: 'B' },
    { name: 'Sneha Sharma', class: '10-B', rollNumber: '004', section: 'B' },
    { name: 'Vikram Reddy', class: '12-A', rollNumber: '005', section: 'A' },
    { name: 'Ananya Desai', class: '12-A', rollNumber: '006', section: 'A' },
    { name: 'Arjun Verma', class: '12-B', rollNumber: '007', section: 'B' },
    { name: 'Isha Kapoor', class: '12-B', rollNumber: '008', section: 'B' },
];

// Sample awards data (will be linked to students)
const awardsData = [
    { awardName: 'Best Academic Performance', issuedDate: '2024-01-15', issuedBy: 'Principal Dr. S. Sharma' },
    { awardName: 'Excellence in Sports', issuedDate: '2024-02-20', issuedBy: 'Sports Director' },
    { awardName: 'Best Science Project', issuedDate: '2024-03-10', issuedBy: 'Science Department' },
    { awardName: 'Outstanding Discipline', issuedDate: '2024-03-25', issuedBy: 'Principal Dr. S. Sharma' },
    { awardName: 'Creative Writing Award', issuedDate: '2024-04-05', issuedBy: 'English Department' },
    { awardName: 'Mathematics Excellence', issuedDate: '2024-04-15', issuedBy: 'Math Department' },
    { awardName: 'Community Service Award', issuedDate: '2024-05-01', issuedBy: 'Principal Dr. S. Sharma' },
    { awardName: 'Tech Innovation Award', issuedDate: '2024-05-20', issuedBy: 'IT Department' },
];

// Seed the database
async function seedDatabase() {
    try {
        // Connect to database
        await connectDB();

        // Clear existing data
        await Student.deleteMany({});
        await Award.deleteMany({});
        console.log('✓ Cleared existing data');

        // Insert students
        const insertedStudents = await Student.insertMany(studentsData);
        console.log(`✓ Inserted ${insertedStudents.length} students`);

        // Insert awards
        const awards = [];
        const numStudents = insertedStudents.length;

        for (let i = 0; i < awardsData.length; i++) {
            // Randomly assign awards to students
            const randomStudent = insertedStudents[i % numStudents];
            awards.push({
                ...awardsData[i],
                student: randomStudent._id,
            });
        }

        await Award.insertMany(awards);
        console.log(`✓ Inserted ${awards.length} awards`);

        console.log(`
╔════════════════════════════════════════╗
║  Database Seeding Complete!           ║
║  Students: ${insertedStudents.length}                      ║
║  Awards: ${awards.length}                        ║
╚════════════════════════════════════════╝
        `);

        process.exit(0);
    } catch (error) {
        console.error('✗ Error seeding database:', error.message);
        process.exit(1);
    }
}

// Run seeding function
seedDatabase();
