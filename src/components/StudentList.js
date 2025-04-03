import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Image, Alert, Spinner } from 'react-bootstrap';

const StudentList = ({ refreshTrigger }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSharesModal, setShowSharesModal] = useState(false);
  const [showDecryptedModal, setShowDecryptedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [decryptedImage, setDecryptedImage] = useState('');
  const [loadingQR, setLoadingQR] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    fetchStudents();
  }, [refreshTrigger]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching students from server...');
      const response = await axios.get('http://localhost:8000/api/students/');
      console.log('Received students data:', response.data);
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           'Failed to fetch students';
        setError(errorMessage);
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        // Something else went wrong
        setError('An unexpected error occurred while fetching students.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewQR = async (student) => {
    setSelectedStudent(student);
    setLoadingQR(true);
    try {
      console.log('Student data:', student);
      
      // First try to get the student details to see the QR code structure
      const studentResponse = await axios.get(
        `http://localhost:8000/api/students/${student.id}/`
      );
      
      console.log('Student details response:', studentResponse.data);
      
      // Check if QR code exists in the student data
      if (studentResponse.data.qr_code) {
        let qrUrl;
        try {
          // Try to parse the QR code URL
          const qrCodeUrl = new URL(studentResponse.data.qr_code);
          qrUrl = qrCodeUrl.toString();
        } catch (urlError) {
          // If it's not a valid URL, assume it's a path
          qrUrl = `http://localhost:8000${studentResponse.data.qr_code}`;
        }
          
        console.log('Fetching QR code from:', qrUrl);
        
        const qrResponse = await axios.get(qrUrl, { 
          responseType: 'blob',
          validateStatus: function (status) {
            return status >= 200 && status < 300; // Accept only success status codes
          }
        });
        
        console.log('QR code fetched successfully');
        
        // Create a blob URL for the QR code
        const qrBlobUrl = URL.createObjectURL(qrResponse.data);
        setSelectedStudent(prev => ({
          ...prev,
          qr_code: qrBlobUrl
        }));
        
        setShowQRModal(true);
      } else {
        // If no QR code in student data, try generating one
        try {
          console.log('No QR code found, trying to generate one');
          const generateResponse = await axios.post(
            `http://localhost:8000/api/students/${student.id}/generate-qr/`
          );
          
          console.log('QR generation response:', generateResponse.data);
          
          if (generateResponse.data.qr_code) {
            let qrUrl;
            try {
              // Try to parse the QR code URL
              const qrCodeUrl = new URL(generateResponse.data.qr_code);
              qrUrl = qrCodeUrl.toString();
            } catch (urlError) {
              // If it's not a valid URL, assume it's a path
              qrUrl = `http://localhost:8000${generateResponse.data.qr_code}`;
            }
              
            const qrResponse = await axios.get(qrUrl, { 
              responseType: 'blob',
              validateStatus: function (status) {
                return status >= 200 && status < 300; // Accept only success status codes
              }
            });
            
            const qrBlobUrl = URL.createObjectURL(qrResponse.data);
            
            setSelectedStudent(prev => ({
              ...prev,
              qr_code: qrBlobUrl
            }));
            
            setShowQRModal(true);
          } else {
            setError('Failed to generate QR code for this student.');
          }
        } catch (generateErr) {
          console.error('Error generating QR code:', generateErr);
          if (generateErr.response?.status === 404) {
            setError('Student not found or QR code generation failed.');
          } else if (generateErr.response?.status === 403) {
            setError('You do not have permission to generate QR code.');
          } else {
            setError('Failed to generate QR code. Please try again later.');
          }
        }
      }
    } catch (err) {
      console.error('Error in handleViewQR:', err);
      if (err.response?.status === 404) {
        setError('Student not found or QR code not available.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view this QR code.');
      } else if (err.message?.includes('Invalid URL')) {
        setError('Invalid QR code URL format.');
      } else {
        setError('Failed to fetch QR code. Please try again later.');
      }
    } finally {
      setLoadingQR(false);
    }
  };

  const handleViewShares = async (student) => {
    setSelectedStudent(student);
    setLoadingQR(true);
    try {
      console.log('Fetching shares for student:', student.id);
      const response = await axios.get(
        `http://localhost:8000/api/students/${student.id}/shares/`
      );
      
      console.log('Shares response:', response.data);
      
      // Update the selected student with the shares data
      setSelectedStudent(prev => ({
        ...prev,
        shares: response.data
      }));
      
      setShowSharesModal(true);
    } catch (err) {
      console.error('Error fetching shares:', err);
      if (err.response?.status === 404) {
        setError('Shares not found for this student.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view shares.');
      } else {
        setError('Failed to fetch shares. Please try again.');
      }
    } finally {
      setLoadingQR(false);
    }
  };

  const handleDecrypt = async (student) => {
    setLoadingQR(true);
    try {
      console.log('Decrypting QR code for student:', student.id);
      const response = await axios.get(
        `http://localhost:8000/api/students/${student.id}/decrypt/`,
        { responseType: 'blob' }
      );
      
      const imageUrl = URL.createObjectURL(response.data);
      setDecryptedImage(imageUrl);
      setSelectedStudent(student);
      setShowDecryptedModal(true);
      console.log('QR code decrypted successfully');
    } catch (err) {
      console.error('Error decrypting QR code:', err);
      setError('Failed to decrypt QR code. Please try again.');
    } finally {
      setLoadingQR(false);
    }
  };

  const handleDelete = async (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      console.log('Deleting student:', selectedStudent.id);
      await axios.delete(`http://localhost:8000/api/students/${selectedStudent.id}/`);
      console.log('Student deleted successfully');
      
      // Refresh the student list
      fetchStudents();
      
      // Close the modal
      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      if (err.response?.status === 404) {
        setError('Student not found.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to delete this student.');
      } else {
        setError('Failed to delete student. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during initial client-side render
  if (!isClient) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      <h2>Student List</h2>
      
      {students.length === 0 ? (
        <Alert variant="info">No students added yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
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
                    disabled={loadingQR}
                  >
                    {loadingQR ? 'Loading...' : 'View QR'}
                  </Button>
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleViewShares(student)}
                    disabled={loadingQR}
                  >
                    {loadingQR ? 'Loading...' : 'View Shares'}
                  </Button>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    className="me-2"
                    onClick={() => handleDecrypt(student)}
                    disabled={loadingQR}
                  >
                    {loadingQR ? 'Loading...' : 'Decrypt'}
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(student)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* QR Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code for {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingQR ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : selectedStudent?.qr_code ? (
            <div className="text-center">
              <Image 
                src={selectedStudent.qr_code} 
                fluid 
                alt={`QR Code for ${selectedStudent.name}`}
                style={{ maxWidth: '300px', margin: '0 auto' }}
              />
            </div>
          ) : (
            <Alert variant="warning">
              QR code not available for this student.
            </Alert>
          )}
        </Modal.Body>
      </Modal>

      {/* Shares Modal */}
      <Modal show={showSharesModal} onHide={() => setShowSharesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Shares for {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingQR ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : selectedStudent?.shares ? (
            <div>
              {Array.isArray(selectedStudent.shares) ? (
                <div className="row">
                  {selectedStudent.shares.map((share, index) => {
                    console.log('Processing share:', share);
                    const imageUrl = share.image_url || share.url || share.path;
                    console.log('Image URL for share:', imageUrl);
                    
                    return (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-header">
                            Share {index + 1}
                          </div>
                          <div className="card-body">
                            {imageUrl ? (
                              <div className="text-center">
                                <Image 
                                  src={imageUrl.startsWith('http') 
                                    ? imageUrl 
                                    : `http://localhost:8000${imageUrl}`}
                                  fluid 
                                  alt={`Share ${index + 1}`}
                                  className="mb-2"
                                  style={{ maxWidth: '100%', height: 'auto' }}
                                  onError={(e) => {
                                    console.error('Error loading image:', e);
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="alert alert-warning">Failed to load image</div>';
                                  }}
                                />
                              </div>
                            ) : (
                              <Alert variant="warning">No image available for this share</Alert>
                            )}
                            {share.data && (
                              <pre className="mt-2">
                                {JSON.stringify(share.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : typeof selectedStudent.shares === 'object' ? (
                <div className="row">
                  {Object.entries(selectedStudent.shares).map(([key, value], index) => {
                    console.log('Processing share object:', key, value);
                    const imageUrl = typeof value === 'string' ? value : value?.url || value?.path;
                    console.log('Image URL for share object:', imageUrl);
                    
                    return (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-header">
                            {key}
                          </div>
                          <div className="card-body">
                            {typeof value === 'string' && (value.startsWith('/') || value.startsWith('http')) ? (
                              <div className="text-center">
                                <Image 
                                  src={value.startsWith('http') ? value : `http://localhost:8000${value}`}
                                  fluid 
                                  alt={key}
                                  className="mb-2"
                                  style={{ maxWidth: '100%', height: 'auto' }}
                                  onError={(e) => {
                                    console.error('Error loading image:', e);
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="alert alert-warning">Failed to load image</div>';
                                  }}
                                />
                              </div>
                            ) : (
                              <pre>{JSON.stringify(value, null, 2)}</pre>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Alert variant="info">
                  No shares available for this student.
                </Alert>
              )}
            </div>
          ) : (
            <Alert variant="warning">
              No shares data available.
            </Alert>
          )}
        </Modal.Body>
      </Modal>

      {/* Decrypted Modal */}
      <Modal show={showDecryptedModal} onHide={() => setShowDecryptedModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Decrypted QR Code for {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingQR ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Image src={decryptedImage} fluid />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentList;