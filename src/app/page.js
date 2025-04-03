'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleStudentAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleScannerClick = () => {
    router.push('/scanner');
  };

  // Show a simple loading state during initial client-side render
  if (!isClient) {
    return (
      <main className="container py-5">
        <h1 className="text-center mb-4">Student QR System</h1>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center mb-0">Student QR System</h1>
        <Button 
          variant="primary" 
          onClick={handleScannerClick}
          className="d-flex align-items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code-scan" viewBox="0 0 16 16">
            <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 15.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z"/>
            <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z"/>
            <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z"/>
            <path d="M9 2h5v5H9V2Zm1 1h3v3h-3V3Zm1 8h1v1h-1v-1Z"/>
            <path d="M12 9h5v5h-5V9Zm1 1h3v3h-3v-3Z"/>
          </svg>
          Scan QR Code
        </Button>
      </div>
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