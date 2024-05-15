

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const port = 3020;

const users = [
    { id: 1, email: 'admin', password: 'admin' },
    { id: 2, email: 'user2', password: 'password2' }
];




mongoose.connect('mongodb+srv://xxxdenisxxx333xxx:Den29082002@cluster0.0ii8gnn.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Підключено до MongoDB'))
    .catch(err => console.error('Помилка підключення до MongoDB:', err));

const deputiesSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    image: String,
    instagram: String,
    facebook: String,
    telegram: String,
    schedule: String,
    phone_number: String,
    email: String,
    address: String,
    area: String,

});

const noteSchema = new mongoose.Schema({
    date: String,
    time: String,
    surname: String,
    firstName: String,
    patronymic: String,
    email: String,
    phoneNumber: String,
    deputy_id: { type: mongoose.Types.ObjectId, ref: 'Deputies' }

});
const Deputies = mongoose.model('deputies', deputiesSchema);

const Note = mongoose.model('noteshm', noteSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:5173', 'https://studyitstep.netlify.app', 'http://192.168.0.105:5173'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true
}


app.use(
    cors(corsOptions)
);

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Проверка наличия пользователя в базе данных
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        res.json({ success: true, message: 'Аутентификация успешна', user: { email: user.email } });
    } else {
        res.status(401).json({ success: false, message: 'Неверные учетные данные' });
    }
});
//create
app.post('/createSecurityItems', async (req, res) => {
    try {
        const newItem = await Deputies.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Помилка при створенні елемента:', error);
        res.status(500).send('Помилка сервера');
    }
});

app.post('/createNoteItems', async (req, res) => {

    try {
        const deputy = await Deputies.findById(req.body.deputy_id);
        if (!deputy) {
            throw new Error('Deputy not found')
        }
        const newItemNote = await Note.create({ ...req.body, deputy_id: deputy });
        res.status(201).json(newItemNote);
    } catch (error) {
        console.error('Помилка при створенні елемента:', error);
        res.status(500).send('Помилка сервера');
    }
});
//read - site reading also
app.get('/securityItems', async (req, res) => {
    try {
        const deputiesItems = await Deputies.find({});
        res.json(deputiesItems);
    } catch (error) {
        console.error('Помилка при отриманні даних з бази даних:', error);
        res.status(500).send('Помилка сервера');
    }
});

app.get('/noteItems', async (req, res) => {
    try {
        const noteItems = await Note.find({});
        res.json(noteItems);
    } catch (error) {
        console.error('Помилка при отриманні даних з бази даних:', error);
        res.status(500).send('Помилка сервера');
    }
});

app.get('/securityItems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const onedeputies = await Deputies.findById(id);
        res.json(onedeputies);
    } catch (error) {
        console.error('Помилка при отриманні даних з бази даних:', error);
        res.status(500).send('Помилка сервера');
    }
});

app.get('/noteItems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const onenote = await Note.find({ deputy_id: id });
        res.json(onenote);
    } catch (error) {
        console.error('Помилка при отриманні даних з бази даних:', error);
        res.status(500).send('Помилка сервера');
    }
});

//update
app.put('/updateSecurityItems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await Deputies.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        console.error('Помилка при оновленні елемента:', error);
        res.status(500).send('Помилка сервера');
    }
});

app.put('/updateNoteItems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItemNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedItemNote);
    } catch (error) {
        console.error('Помилка при оновленні елемента:', error);
        res.status(500).send('Помилка сервера');
    }
});

//delete
app.delete('/deleteSecurityItems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Deputies.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error('Помилка при видаленні елемента:', error);
        res.status(500).send('Помилка сервера');
    }
});

app.delete('/deleteNoteItems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Note.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error('Помилка при видаленні елемента:', error);
        res.status(500).send('Помилка сервера');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущено на порті ${port}`);
});

