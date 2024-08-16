import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormCreationPage from './components/FormCreationPage';
import FormListPage from './components/FormLists';
import EditForm from './components/EditForm';
import ViewFormPage from './components/ViewFormPage';
import { useState } from 'react';
import './App.css'; 

function App() {
  const [forms, setForms] = useState([]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/create-form" element={<FormCreationPage forms={forms} setForms={setForms} />} />
          <Route path="/" element={<FormListPage forms={forms} setForms={setForms} />} />
          <Route path="/edit-form/:id" element={<EditForm />} />
          <Route path="/view-form/:formId" element={<ViewFormPage forms={forms} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
