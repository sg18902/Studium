import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Button, List, ListItem, IconButton } from '@mui/material';
import TimetableModal from './TimetableModal';
import EditTimetableModal from './EditTimetableModal';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const getRandomLightColor = () => {
    const getRandomValue = () => Math.floor(Math.random() * 256);
    const r = getRandomValue();
    const g = getRandomValue();
    const b = getRandomValue();
    return `rgb(${r}, ${g}, ${b})`;
};

const generateColorMap = (subjects) => {
    const colorMap = {};
    subjects.forEach(subject => {
        colorMap[subject] = getRandomLightColor();
    });
    return colorMap;
};

const ClassroomViewTeachers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classroom, setClassroom] = useState(null);
    const [timetable, setTimetable] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const classroomid = localStorage.getItem('classroom') || '';
    const [editModalOpen, setEditModalOpen] = useState(false);


    const fetchClassroom = async () => {
        if (classroomid === 'null') {
            setClassroom(null);
            return;
        }
        try {
            const response = await axios.get(`/studium/classrooms/get_classroom_by_id/${classroomid}`);
            setClassroom(response.data[0]);
        } catch (error) {
            console.error('Error fetching classroom:', error);
        }
    };

    useEffect(() => {
        
        fetchClassroom();
    }, [classroomid]);



    const fetchTimetable = async () => {
        if (classroomid === 'null') return;
        try {
            const response = await axios.get(`/studium/timetables/${classroomid}`);
            setTimetable(response.data || []); // Ensure timetable is an array
        } catch (error) {
            console.error('Error fetching timetable:', error);
        }
    };
    useEffect(() => {
        
        fetchTimetable();
    }, [classroomid]);

    // Extract subjects from timetable data
    const subjects = [...new Set(timetable.flatMap(item => item.schedule.map(s => s.subject)))];
    const days = [...new Set(timetable.flatMap(item => item.schedule.map(s => s.day)))];
    const colorMap = generateColorMap(subjects);

    const handleEditOpen = () => {
        // Ensure timetable is not null or undefined before opening the modal
        if (Array.isArray(timetable)) {
            setEditModalOpen(true);
        } else {
            console.error('Timetable data is invalid');
        }
    };

    const handleEditClose = () => {
        fetchTimetable();
        fetchClassroom();

        setEditModalOpen(false);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                {classroomid !== 'null' && timetable?.length < 1 && (
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: '25px',
                            backgroundColor: '#87CEFA',
                            color: 'black',
                            '&:hover': {
                                color: 'white',
                            },
                        }}
                        onClick={() => setModalOpen(true)}
                    >
                        Create Timetable
                    </Button>
                )};

            </Box>

            <TimetableModal open={modalOpen} onClose={() => setModalOpen(false)} classroom={classroom} />

            <Box sx={{ mt: 3 }}>
                <Card sx={{ background: '#F0F8FF' }}>
                    <CardContent>
                        {classroom ? (
                            <>
                                <Typography variant="h6" component="div" gutterBottom>
                                    <strong>Classroom:</strong> {classroom.name || 'N/A'}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Schedule:</strong>
                                    {classroom.schedule && classroom.schedule.length > 0 ? (
                                        <List>
                                            {classroom.schedule.map(s => (
                                                <ListItem key={s._id}>
                                                    {s.day}: {s.startTime} - {s.endTime}
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        'No schedule available'
                                    )}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Teacher:</strong> {classroom.teacher ? `${classroom.teacher.name} (${classroom.teacher.email})` : 'No teacher assigned'}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Students:</strong>
                                    <List>
                                        {classroom.students && classroom.students.length > 0 ? (
                                            classroom.students.map(student => (
                                                <ListItem key={student._id}>
                                                    {student.name} ({student.email})
                                                </ListItem>
                                            ))
                                        ) : (
                                            <ListItem>No students assigned</ListItem>
                                        )}
                                    </List>
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body1">
                                No class assigned yet
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ mt: 3, background: '#F0F8FF' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Timetable
                            </Typography>
                            {classroomid !== 'null' && (
                                <Box sx={{ flexGrow: 1 }} /> // This box will take up the remaining space
                            )}
                            {classroomid !== 'null' && (
                                <IconButton sx={{ '&:hover': { color: 'blue' } }} onClick={handleEditOpen}>
                                    <DriveFileRenameOutlineIcon />
                                </IconButton>
                            )}
                            <EditTimetableModal
                                open={editModalOpen}
                                onClose={handleEditClose}
                                classroom={classroom}
                                timetable={Array.isArray(timetable) ? timetable : []} // Ensure timetable is a valid array
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {days && days.map(day => (
                                <Card key={day} sx={{ mb: 2, p: 2, background: '#FFFFFF' }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {day}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {timetable
                                                .flatMap(item => item.schedule)
                                                .filter(session => session.day === day)
                                                .map((session, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            backgroundColor: colorMap[session.subject],
                                                            padding: '20px',
                                                            borderRadius: '4px',
                                                            color: 'black',
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                            <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                                                {session.subject.toUpperCase()}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                                                                {session.startTime} - {session.endTime}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ClassroomViewTeachers;
