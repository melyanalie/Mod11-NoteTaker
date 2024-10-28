const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dbFilePath = path.join(__dirname, '../db/db.json');

// Get all notes
router.get('/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading notes' });
        res.json(JSON.parse(data));
    });
});

// Add a new note
router.post('/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = { id: uuidv4(), title, text };

    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading notes' });
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
            if (err) return res.status(500).json({ error: 'Error saving note' });
            res.json(newNote);
        });
    });
});

// Delete a note
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading notes' });
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
            if (err) return res.status(500).json({ error: 'Error deleting note' });
            res.json({ success: true });
        });
    });
});

module.exports = router;
