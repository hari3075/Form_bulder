const express = require('express');
const router = express.Router();
const Form = require('../models/Form');


router.post('/form', async (req, res) => { 
    try {
        const { title, fields } = req.body;
        if (!title || !fields) {
            return res.status(400).json({ message: 'Title and fields are required' });
        }
        const form = new Form({ title, fields });
        await form.save();
        res.status(201).json(form);
    } catch (error) {
        res.status(500).json({ message: 'Error creating form', error });
    }
});
router.get('/forms', async (req, res) => {
    try {
        const forms = await Form.find(); 
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving forms', error });
    }
});

router.get('/form-view/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving form', error });
    }
});


router.put('/form-edit/:id', async (req, res) => {
    try {
        const { title, fields } = req.body;
        const form = await Form.findByIdAndUpdate(req.params.id, { title, fields }, { new: true });
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: 'Error updating form', error });
    }
});


router.delete('/form/:id', async (req, res) => {
    try {
        const result = await Form.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting form', error });
    }
});

module.exports = router;
