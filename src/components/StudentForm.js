import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const StudentForm = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    class_name: '',
    roll_number: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleChange = (e) => {
    if (!mounted) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Student name is required');
      return false;
    }
    if (!formData.class_name.trim()) {
      setError('Class name is required');
      return false;
    }
    if (!formData.roll_number.trim()) {
      setError('Roll number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mounted) return;
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to add student:', formData);
      
      const response = await axios.post('http://127.0.0.1:8000/api/students/', formData);
      
      console.log('Server response:', response.data);
      
      if (response.status === 201) {
        setSuccess('Student added successfully!');
        setFormData({ name: '', class_name: '', roll_number: '' });
        if (onStudentAdded) onStudentAdded();
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           'Failed to add student. Please try again.';
        setError(errorMessage);
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        // Something else went wrong
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-4 border rounded">
      <h2>Add New Student</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Student Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Class</Form.Label>
          <Form.Control 
            type="text" 
            name="class_name" 
            value={formData.class_name} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Roll Number</Form.Label>
          <Form.Control 
            type="text" 
            name="roll_number" 
            value={formData.roll_number} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </Form.Group>
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading}
          className="w-100"
        >
          {loading ? 'Adding...' : 'Add Student'}
        </Button>
      </Form>
    </div>
  );
};

export default StudentForm;