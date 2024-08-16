const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fields: [
        {
            title: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            placeholder: String,
            options: [String] 
        }
    ]
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
