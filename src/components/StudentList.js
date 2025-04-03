import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Image } from 'react-bootstrap';

const StudentList = ({ refreshTrigger }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSharesModal, setShowSharesModal] = useState(false);
  const [showDecryptedModal, setShowDecryptedModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [decryptedImage, setDecryptedImage] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/students/');
      setStudents(response.data);
      setError('');
    } catch (err) {
      // Only show error if it's not a connection issue
      if (err.response) {
        setError('Failed to fetch students');
      } else {
        setError('Cannot connect to server. Is the backend running?');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger]);

  const handleViewQR = (student) => {
    setSelectedStudent(student);
    setShowQRModal(true);
  };

  const handleViewShares = (student) => {
    setSelectedStudent(student);
    setShowSharesModal(true);
  };

  const handleDecrypt = async (student) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/students/${student.id}/decrypt/`,
        { responseType: 'blob' }
      );
      
      const imageUrl = URL.createObjectURL(response.data);
      setDecryptedImage(imageUrl);
      setSelectedStudent(student);
      setShowDecryptedModal(true);
    } catch (err) {
      console.error('Failed to decrypt QR code', err);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-4">
      <h2>Student List</h2>
      
      {students.length === 0 ? (
        <p>No students added yet.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Roll Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.class_name}</td>
                <td>{student.roll_number}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleViewQR(student)}
                  >
                    View QR
                  </Button>
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleViewShares(student)}
                  >
                    View Shares
                  </Button>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => handleDecrypt(student)}
                  >
                    Decrypt
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code for {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedStudent && (
            <Image 
              src={`http://localhost:8000/media/${selectedStudent.qr_code}`} 
              alt="QR Code" 
              fluid 
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Shares Modal */}
      <Modal show={showSharesModal} onHide={() => setShowSharesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Visual Cryptography Shares for {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div className="d-flex justify-content-between">
              <div className="text-center">
                <h5>Share 1</h5>
                <Image 
                  src={`http://localhost:8000/media/${selectedStudent.share1}`} 
                  alt="Share 1" 
                  fluid 
                />
              </div>
              <div className="text-center">
                <h5>Share 2</h5>
                <Image 
                  src={`http://localhost:8000/media/${selectedStudent.share2}`} 
                  alt="Share 2" 
                  fluid 
                />
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Decrypted QR Modal */}
      <Modal show={showDecryptedModal} onHide={() => setShowDecryptedModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Decrypted QR for {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {decryptedImage && (
            <Image 
              src={decryptedImage} 
              alt="Decrypted QR Code" 
              fluid 
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentList;