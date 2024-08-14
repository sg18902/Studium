# Full-Stack Classroom Management System

## Overview

This is a full-stack classroom management system that allows Principals, Teachers, and Students to manage classrooms, timetables, and user accounts. The application provides a dashboard for different user roles with scoped functionality and features.

## Tech Stack

### Frontend
- **React.js**: Frontend framework for building the user interface.
- **Material-UI**: UI component library for React.
- **Vite**: Development server and build tool.

### Backend
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user and classroom data.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **bcryptjs**: Library for hashing passwords.
- **dotenv**: Module to load environment variables from a `.env` file.

## Languages
- **JavaScript**: Primary language for both frontend and backend development.

## Features

### Principal
- **Create Classrooms**: Add new classrooms with details such as name, start time, end time, and session days.
- **Assign Teachers**: Assign teachers to specific classrooms.
- **Assign Students**: Assign students to teachers.
- **View and Manage Users**: See lists of teachers and students, and perform CRUD operations.

### Teacher
- **View Students**: See the list of students assigned to their classroom.
- **Create Timetable**: Define periods for subjects within the classroom's allowed time range.

### Student
- **View Classmates**: See other students in their classroom.
- **View Timetable**: View the timetable for their classroom.

## Modules

### Frontend
- **Dashboard**: Dynamic view based on user role (Principal, Teacher, Student).
- **User Management**: Forms for creating and updating user details.
- **Classroom Management**: Interfaces for creating and managing classrooms and timetables.

### Backend
- **User Routes**: CRUD operations for user management (`/users`).
- **Classroom Routes**: CRUD operations for classroom management (`/classrooms`).
- **Timetable Routes**: Operations for managing timetables (`/timetables`).
- **Authentication**: Secure login/signup process for users.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
