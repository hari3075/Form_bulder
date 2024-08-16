import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewForm.css';

function ViewFormPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [submittedForms, setSubmittedForms] = useState([]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/form-view/${formId}`);
        setForm(response.data);
      } catch (err) {
        console.error('Error fetching form data:', err.response ? err.response.data : err.message);
        setError('Error fetching the form data.');
      }
    };

    if (formId) {
      fetchFormData();
    }
  }, [formId]);

  const handleChange = (index, event) => {
    const { value } = event.target;
    const updatedFields = form.fields.map((field, idx) =>
      idx === index ? { ...field, value } : field
    );
    setForm({ ...form, fields: updatedFields });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Form submitted:', form);
    setSubmittedForms([...submittedForms, form]);

    alert('Please check the console for the submitted form data.');
    navigate(`/view-form/${formId}`);
  };

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className='view_page'>
      <h1>{form.title}</h1>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field, index) => (
          <div key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <label style={{ flex: '1' }}>
              {field.title}:
            </label>
            <input
              type={field.type}
              name="value"
              placeholder={field.placeholder}
              value={field.value || ''}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
        ))}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default ViewFormPage;
