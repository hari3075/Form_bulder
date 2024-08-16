import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import './FormCreationPage.css';

function EditForm() {
  const { id } = useParams(); 
  const [formTitle, setFormTitle] = useState('');
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/form-view/${id}`);
          const data = response.data;

          setFormTitle(data.title || '');
          setFields(data.fields.map(field => ({
            title: field.title || '',
            type: field.type || 'text',
            placeholder: field.placeholder || '',
            options: field.options || [],
            dateValue: field.dateValue || null,
            timeValue: field.timeValue || '',
            value: field.value || ''
          })));
        } catch (error) {
          console.error('Error fetching form data:', error);
        }
      }
    };

    fetchForm();
  }, [id]);

  const updateField = (index, key, value) => {
    const updatedFields = fields.map((field, idx) =>
      idx === index ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        title: '',
        type: 'text',
        placeholder: '',
        options: [],
        dateValue: null,
        timeValue: '',
        value: ''
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formTitle) {
      alert('Form title is required');
      return;
    }

    try {
      const formData = { title: formTitle, fields };

      if (id) {
        await axios.put(`http://localhost:5000/api/form-edit/${id}`, formData);
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error updating form:', error.response ? error.response.data : error.message);
      alert('Failed to update form. Please try again.');
    }
  };

  return (
    <>
      <h1>Edit Form</h1>
      <div className='container'>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: '20px' }}>
            <h2>Form Preview</h2>
            <form>
              <h2>{formTitle}</h2>
              {fields.map((field, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <label style={{ flex: 1 }}>{field.title}</label>
                  {field.type === 'date' ? (
                    <DatePicker
                      selected={field.dateValue}
                      onChange={(date) => updateField(index, 'dateValue', date)}
                      placeholderText={field.placeholder}
                      disabled
                    />
                  ) : field.type === 'time' ? (
                    <TimePicker
                      value={field.timeValue}
                      onChange={(time) => updateField(index, 'timeValue', time)}
                      disabled
                    />
                  ) : field.type === 'radio' || field.type === 'checkbox' ? (
                    field.options.map((option, i) => (
                      <div key={i} style={{ marginRight: '10px' }}>
                        <input type={field.type} disabled /> {option}
                      </div>
                    ))
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value || ''}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginRight: '10px' }}
                      disabled
                    />
                  )}
                </div>
              ))}
            </form>
          </div>

          <div className='sub-section'>
            <h2>Update Form</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Form Title:</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="Enter form title"
                />
              </div>

              {formTitle && (
                <>
                  <h2>Fields</h2>
                  {fields.map((field, index) => (
                    <div key={index} style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <label>Field Title:</label>
                          <input
                            type="text"
                            value={field.title}
                            onChange={(e) => updateField(index, 'title', e.target.value)}
                            required
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <label>Field Type:</label>
                          <select
                            value={field.type}
                            onChange={(e) => updateField(index, 'type', e.target.value)}
                            style={{ width: '100%' }}
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="password">Password</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                            <option value="time">Time</option>
                          </select>
                        </div>

                        <div style={{ flex: 1 }}>
                          <label>Placeholder:</label>
                          <input
                            type="text"
                            value={field.placeholder}
                            onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                            placeholder="Enter placeholder"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      {(field.type === 'radio' || field.type === 'checkbox') && (
                        <div style={{ marginBottom: '10px' }}>
                          <label>Options:</label>
                          <input
                            type="text"
                            value={field.options.join(', ')}
                            onChange={(e) => updateField(index, 'options', e.target.value.split(', '))}
                            placeholder="Enter options separated by commas"
                            style={{ width: '100%' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button type="button" className='addbtn' onClick={addField}>Add Field</button>
                </>
              )}

          <div>
          <button type="submit" className='subbtn'>Update Form</button>
          </div>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditForm;
