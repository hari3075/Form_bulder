import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './FormCreationPage.css';

function FormPage() {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const navigate = useNavigate();

  const addField = () => {
    if (fields.length < 10) {
      setFields([
        ...fields,
        {
          fieldName: '',
          fieldType: 'text',
          placeholder: '',
          options: [],
          dateValue: null,
          timeValue: ''
        }
      ]);
    } else {
      alert('Maximum 10 fields allowed');
    }
  };

  const updateField = (index, key, value) => {
    const updatedFields = fields.map((field, idx) =>
      idx === index ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].fieldName || !fields[i].fieldType) {
        alert('All fields must have a title and type');
        return;
      }
    }

    try {
      const newForm = {
        title: formName,
        fields: fields.map(field => ({
          title: field.fieldName,
          type: field.fieldType,
          placeholder: field.placeholder,
          options: field.options,
          dateValue: field.dateValue,
          timeValue: field.timeValue
        }))
      };
      const response = await axios.post('http://localhost:5000/api/form', newForm);
     window.alert('form was succesfully created')
      setSubmittedForms([...submittedForms, response.data]);
      setFormName('');
      setFields([]);
      navigate('/'); 
    } catch (error) {
      console.error('Error creating form:', error.response ? error.response.data : error.message);
      alert('Failed to create form. Please try again.');
    }
  };

  return (
    <>
      <h1>Create a new Form</h1>
      <div className='container'>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: '20px' }}>
            <h2>Form Preview</h2>
            <form>
              <h2>{formName}</h2>
              {fields.map((field, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <label style={{ flex: 1 }}>{field.fieldName}</label>
                  {field.fieldType === 'date' ? (
                    <DatePicker
                      selected={field.dateValue}
                      onChange={(date) => updateField(index, 'dateValue', date)}
                      placeholderText={field.placeholder}
                      disabled
                    />
                  ) : field.fieldType === 'time' ? (
                    <TimePicker
                      value={field.timeValue}
                      onChange={(time) => updateField(index, 'timeValue', time)}
                      disabled
                    />
                  ) : (
                    <input
                      type={field.fieldType}
                      placeholder={field.placeholder}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginRight: '10px' }}
                      disabled
                    />
                  )}
                  <button type="button" onClick={() => updateField(index, 'fieldName', '')} style={{ marginRight: '5px' }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button type="button" onClick={() => setFields(fields.filter((_, idx) => idx !== index))}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </form>
          </div>

          <div className='sub-section'>
            <h2>Create Form</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Form Name:</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {formName && (
                <>
                  <h2>Fields</h2>
                  {fields.map((field, index) => (
                    <div key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                      <label style={{ flex: 1 }}>Field Title:</label>
                      <input
                        type="text"
                        value={field.fieldName}
                        onChange={(e) => updateField(index, 'fieldName', e.target.value)}
                        placeholder="Enter field title"
                        required
                        style={{ marginRight: '10px' }}
                      />

                      <label style={{ flex: 1 }}>Field Type:</label>
                      <select
                        value={field.fieldType}
                        onChange={(e) => updateField(index, 'fieldType', e.target.value)}
                        style={{ marginRight: '10px' }}
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

                      <label style={{ flex: 1 }}>Placeholder:</label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                        placeholder="Enter placeholder"
                        style={{ marginRight: '10px' }}
                      />

                      {(field.fieldType === 'radio' || field.fieldType === 'checkbox') && (
                        <div style={{ flex: 1 }}>
                          <label>Options:</label>
                          <input
                            type="text"
                            value={field.options.join(', ')}
                            onChange={(e) => updateField(index, 'options', e.target.value.split(', '))}
                            placeholder="Enter options separated by commas"
                            style={{ marginRight: '10px' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <button type="button"className='addbtn' onClick={addField}>Add Field</button>
                </>
              )}
<div>
<button type="submit" className='subbtn'>Save Form</button>
</div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormPage;
