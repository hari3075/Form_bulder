import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormList.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function FormListPage() {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/forms');
        setForms(response.data);
      } catch (err) {
        console.error('Error fetching forms:', err.response ? err.response.data : err.message);
        setError('Error fetching forms.');
      }
    };

    fetchForms();
  }, []);

  const handleView = (formId) => {
    navigate(`/view-form/${formId}`);
  };

  const handleEdit = (formId) => {
    navigate(`/edit-form/${formId}`);
  };

  const handleDelete = async (formId) => {
    const confirmation = window.confirm('Are you sure you want to delete this form?');
    if (confirmation) {
      try {
        await axios.delete(`http://localhost:5000/api/form/${formId}`);
        setForms(forms.filter(form => form._id !== formId));
      } catch (err) {
        console.error('Error deleting form:', err.response ? err.response.data : err.message);
        setError('Error deleting the form.');
      }
    }
  };

  const handleCreate = () => {
    navigate('/create-form');
  };

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!forms.length) {
    return (
      <div className='container'>
        <h2>No Forms Available</h2>
        <button onClick={handleCreate}>Create Form</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to forms.com</h1>
      <button onClick={handleCreate} style={{ marginBottom: '20px' }}>Create Form</button>
      {forms.map((form) => (
        <div key={form._id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', display: 'flex', alignItems: 'center' }}>
          <h2 style={{ flex: 1 }}>{form.title}</h2>
          <i className="fas fa-eye" onClick={() => handleView(form._id)} style={{ cursor: 'pointer', marginRight: '10px' }} title="View"></i>
          <i className="fas fa-edit" onClick={() => handleEdit(form._id)} style={{ cursor: 'pointer', marginRight: '10px' }} title="Edit"></i>
          <i className="fas fa-trash-alt" onClick={() => handleDelete(form._id)} style={{ cursor: 'pointer' }} title="Delete"></i>
        </div>
      ))}
    </div>
  );
}

export default FormListPage;
