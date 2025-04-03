'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, Container, Alert, Spinner } from 'react-bootstrap';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    try {
      setLoading(true);
      setError(null);
      setScanResult(decodedText);

      // Assuming the QR code contains a student ID or URL
      const response = await fetch(`http://localhost:8000/api/students/${decodedText}/`);
      if (!response.ok) {
        throw new Error('Student not found');
      }
      const data = await response.json();
      setStudentData(data);
    } catch (err) {
      setError(err.message);
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  const onScanFailure = (error) => {
    console.warn(`QR Code scanning failed: ${error}`);
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Student QR Scanner</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card className="mb-4">
            <Card.Body>
              <div id="reader"></div>
            </Card.Body>
          </Card>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {studentData && (
            <Card>
              <Card.Header>
                <h3>Student Details</h3>
              </Card.Header>
              <Card.Body>
                <p><strong>Name:</strong> {studentData.name}</p>
                <p><strong>ID:</strong> {studentData.id}</p>
                <p><strong>Email:</strong> {studentData.email}</p>
                <p><strong>Phone:</strong> {studentData.phone}</p>
                {studentData.shares && studentData.shares.length > 0 && (
                  <div>
                    <h4>Shares</h4>
                    <div className="row">
                      {studentData.shares.map((share, index) => (
                        <div key={index} className="col-md-4 mb-3">
                          <img
                            src={share.image_url || share.url || share.path}
                            alt={`Share ${index + 1}`}
                            className="img-fluid"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.png';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
} 