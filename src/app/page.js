'use client';

import { useState } from 'react';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleStudentAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="container py-5">
      <h1 className="text-center mb-4">Student QR System</h1>
      <div className="row">
        <div className="col-md-4">
          <StudentForm onStudentAdded={handleStudentAdded} />
        </div>
        <div className="col-md-8">
          <StudentList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </main>
  );
}