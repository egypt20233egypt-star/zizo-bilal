const mongoose = require('mongoose');

/**
 * LessonHistory Model
 * Stores historical versions of lessons for version control and rollback
 */
const LessonHistorySchema = new mongoose.Schema({
    // Reference to the original lesson
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true,
        index: true
    },

    // Version number (1, 2, 3...)
    version: {
        type: Number,
        required: true
    },

    // Complete snapshot of the lesson at this version
    // Using Mixed to store any structure without validation
    data: mongoose.Schema.Types.Mixed,

    // Import source that created this version
    source: {
        type: String,
        enum: ['internal-ai', 'external-json', 'text-paste', 'manual', 'initial', 'copy'],
        default: 'manual'
    },

    // When this version was archived
    archivedAt: {
        type: Date,
        default: Date.now
    },

    // Optional note about what changed
    changeNote: String

}, {
    strict: false, // Accept any additional fields
    timestamps: true
});

// Compound index for efficient queries
LessonHistorySchema.index({ lessonId: 1, version: -1 });

// Static method to get all versions for a lesson
LessonHistorySchema.statics.getVersions = function (lessonId) {
    return this.find({ lessonId })
        .sort({ version: -1 })
        .select('version source archivedAt changeNote')
        .lean();
};

// Static method to get a specific version
LessonHistorySchema.statics.getVersion = function (lessonId, version) {
    return this.findOne({ lessonId, version }).lean();
};

// Static method to save a new version
LessonHistorySchema.statics.saveVersion = async function (lessonId, data, source = 'manual', note = '') {
    // Get current max version
    const lastVersion = await this.findOne({ lessonId })
        .sort({ version: -1 })
        .select('version');

    const newVersion = (lastVersion?.version || 0) + 1;

    return this.create({
        lessonId,
        version: newVersion,
        data,
        source,
        changeNote: note
    });
};

module.exports = mongoose.model('LessonHistory', LessonHistorySchema);
