const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Email configuratie
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER || 'casaserralarga@outlook.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Database file
const dbFile = path.join(__dirname, 'bookings.json');

// Laad bookings van JSON
function loadBookings() {
    if (fs.existsSync(dbFile)) {
        return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    }
    return [];
}

// Sla bookings op
function saveBookings(bookings) {
    fs.writeFileSync(dbFile, JSON.stringify(bookings, null, 2));
}

// API: Krijg alle boekingen
app.get('/api/bookings', (req, res) => {
    const bookings = loadBookings();
    res.json(bookings);
});

// API: Maak nieuwe boeking
app.post('/api/bookings', async (req, res) => {
    const { guestName, email, checkin, checkout, room, totalPrice } = req.body;
    
    const booking = {
        id: uuidv4(),
        guestName,
        email,
        checkin,
        checkout,
        room,
        totalPrice,
        status: 'Bevestigd',
        createdAt: new Date().toISOString()
    };

    // Stuur bevestigingsmail
    const mailOptions = {
        from: 'casaserralarga@outlook.com',
        to: email,
        subject: 'Boeking Bevestiging - Casa Serralarga',
        html: `
            <h2>Uw boeking is bevestigd!</h2>
            <p>Dank u voor uw boeking bij Casa Serralarga.</p>
            <p><strong>Boeking Details:</strong></p>
            <ul>
                <li>Gastnaam: ${guestName}</li>
                <li>Aankomstdatum: ${checkin}</li>
                <li>Vertrekdatum: ${checkout}</li>
                <li>Kamer: ${room}</li>
                <li>Totaal Bedrag: €${totalPrice.toFixed(2)}</li>
            </ul>
            <p>Wij kijken uit naar uw komst!</p>
            <p>Casa Serralarga Team</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    // Sla boeking op
    const bookings = loadBookings();
    bookings.push(booking);
    saveBookings(bookings);

    res.json({ success: true, booking });
});

// API: Verwijder boeking
app.delete('/api/bookings/:id', (req, res) => {
    let bookings = loadBookings();
    bookings = bookings.filter(b => b.id !== req.params.id);
    saveBookings(bookings);
    res.json({ success: true });
});

// API: Update boeking
app.put('/api/bookings/:id', (req, res) => {
    const bookings = loadBookings();
    const index = bookings.findIndex(b => b.id === req.params.id);
    
    if (index !== -1) {
        bookings[index] = { ...bookings[index], ...req.body };
        saveBookings(bookings);
        res.json({ success: true, booking: bookings[index] });
    } else {
        res.status(404).json({ error: 'Boeking niet gevonden' });
    }
});

app.listen(PORT, () => {
    console.log(`Server draait op port ${PORT}`);
});
