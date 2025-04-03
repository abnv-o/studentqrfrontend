import { useState } from 'react';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check this line in your handleSubmit function:
        // Try this instead if the above doesn't work
const response = await axios.get('http://127.0.0.1:8000/api/students/');
      setSuccess('Student added successfully!');
      setFormData({ name: '', class_name: '', roll_number: '' });
      if (onStudentAdded) onStudentAdded(response.data);
    } catch (err) {
      setError('Failed to add student. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          />
        </Form.Group>
        
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Student'}
        </Button>
      </Form>
    </div>
  );
};

export default StudentForm;