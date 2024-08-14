const express = require('express');
const router = express.Router();
const Timetable = require('../models/timetable');
const Classroom = require('../models/classroom'); // Import Classroom model

// Get timetables for a specific classroom
router.get('/:classroomId', async (req, res) => {
  const { classroomId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const timetables = await Timetable.find({ classroom: classroomId }).populate('classroom');
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new timetable
router.post('/create_time_table', async (req, res) => {
  const { classroom,  schedule } = req.body;

  try {
    // Validate the classroom exists
    const classroomExists = await Classroom.findById(classroom);

    if (!classroomExists) {
      return res.status(400).json({ message: 'Classroom not found' });
    }

    // Validate the schedule
    for (let entry of schedule) {
      const { day, startTime, endTime } = entry;

      if (endTime <= startTime) {
        return res.status(400).json({ message: `End time must be greater than start time for ${subject} on ${day}` });
      }

      const classroomDay = classroomExists.schedule.find(d => d.day === day);

      if (!classroomDay) {
        return res.status(400).json({ message: `Schedule for ${day} is out of the classroom's scheduled days.` });
      }

      if (startTime < classroomDay.startTime || endTime > classroomDay.endTime) {
        return res.status(400).json({ message: `Schedule for ${subject} on ${day} is out of the classroom's time range.` });
      }
    }

    // Check for overlapping schedules
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        if (
          schedule[i].day === schedule[j].day &&
          ((schedule[i].startTime < schedule[j].endTime && schedule[i].startTime >= schedule[j].startTime) ||
            (schedule[j].startTime < schedule[i].endTime && schedule[j].startTime >= schedule[i].startTime))
        ) {
          return res.status(400).json({ message: `Schedules for ${schedule[i].subject} and ${schedule[j].subject} on ${schedule[i].day} overlap.` });
        }
      }
    }

    const timetable = new Timetable({ classroom, schedule });
    const newTimetable = await timetable.save();

    res.status(201).json(newTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a timetable by ID
router.put('/update_timetable/:id', async (req, res) => {
  const { id } = req.params;
  const { classroom, schedule } = req.body;

  try {
    // Validate that the timetable exists
    const timetable = await Timetable.findById(id);

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Validate the classroom exists
    const classroomExists = await Classroom.findById(classroom);

    if (!classroomExists) {
      return res.status(400).json({ message: 'Classroom not found' });
    }

    // Validate the schedule
    for (let entry of schedule) {
      const { day, startTime, endTime } = entry;

      if (endTime <= startTime) {
        return res.status(400).json({ message: `End time must be greater than start time for ${entry.subject} on ${day}` });
      }

      const classroomDay = classroomExists.schedule.find(d => d.day === day);

      if (!classroomDay) {
        return res.status(400).json({ message: `Schedule for ${day} is out of the classroom's scheduled days.` });
      }

      if (startTime < classroomDay.startTime || endTime > classroomDay.endTime) {
        return res.status(400).json({ message: `Schedule for ${entry.subject} on ${day} is out of the classroom's time range.` });
      }
    }

    // Check for overlapping schedules
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        if (
          schedule[i].day === schedule[j].day &&
          ((schedule[i].startTime < schedule[j].endTime && schedule[i].startTime >= schedule[j].startTime) ||
            (schedule[j].startTime < schedule[i].endTime && schedule[j].startTime >= schedule[i].startTime))
        ) {
          return res.status(400).json({ message: `Schedules for ${schedule[i].subject} and ${schedule[j].subject} on ${schedule[i].day} overlap.` });
        }
      }
    }

    // Update the timetable
    timetable.classroom = classroom;
    timetable.schedule = schedule;

    const updatedTimetable = await timetable.save();
    res.json(updatedTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;