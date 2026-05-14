// Award Model
const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema(
    {
        awardName: {
            type: String,
            required: [true, 'Award name is required'],
            trim: true,
        },
        issuedDate: {
            type: Date,
            required: [true, 'Issued date is required'],
        },
        issuedBy: {
            type: String,
            required: [true, 'Issued by is required'],
            trim: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student reference is required'],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

module.exports = mongoose.model('Award', awardSchema);
