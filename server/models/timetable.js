const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  subject: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const TimetableSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  schedule: [ScheduleSchema] // Embedded array of schedules
});

// Ensure the end time is greater than the start time
TimetableSchema.path('schedule').validate(function (schedules) {
  return schedules.every(schedule => schedule.endTime > schedule.startTime);
}, 'End time must be greater than start time.');

module.exports = mongoose.model('Timetable', TimetableSchema);
