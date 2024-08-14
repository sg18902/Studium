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

const StudentTimeTableView = () => {
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
            const response = await axios.get(`https://studium-cyan.vercel.app/studium/classrooms/get_classroom_by_id/${classroomid}`);
            setClassroom(response.data[0]);
        } catch (error) {
            console.error('Error fetching classroom:', error);
        }
    };

    useEffect(() => {
        
        fetchClassroom();
    }, [classroomid]);


    const fetchTimetable = async () => {
        console.log(classroomid)
        if (classroomid === 'null') return;
        try {
            const response = await axios.get(`https://studium-cyan.vercel.app/studium/timetables/${classroomid}`);
            console.log(response.data);
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
        setEditModalOpen(false);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            
            <Box sx={{ mt: 3 }}>

                <Card sx={{ mt: 3, background: '#F0F8FF' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Timetable
                            </Typography>
                           
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

export default StudentTimeTableView;
