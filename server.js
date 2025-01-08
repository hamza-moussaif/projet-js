const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session'); // Import express-session
const app = express();
const port = 3000;

// Middleware setup
app.use(session({
    secret: 'votre_secret_de_session', // Change this secret for a real one
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use 'true' if using HTTPS
}));

app.use(express.json()); // Middleware for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// File paths for data
const usersFilePath = path.join(__dirname, 'users.json');
const carsFilePath = path.join(__dirname, 'cars.json');
const bookingFilePath = path.join(__dirname, 'booking.json');

// ----------------- Routes for User Authentication -----------------

// POST route for sign-up
app.post('/signup', (req, res) => {
    const { email, password, role } = req.body;
    const newUser = { email, password, role };

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            // If file doesn't exist, create it with the new user
            const users = [newUser];
            return fs.writeFile(usersFilePath, JSON.stringify(users), 'utf-8', (writeErr) => {
                if (writeErr) return res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier' });
                return res.status(201).json({ message: 'Utilisateur inscrit avec succès ! Vous pouvez maintenant vous connecter.' });
            });
        }

        if (err) return res.status(500).json({ message: 'Erreur lors de la lecture du fichier' });

        let users = [];
        try { users = JSON.parse(data); } catch (parseErr) { return res.status(500).json({ message: 'Erreur lors du parsing du JSON' }); }

        if (users.find(user => user.email === email)) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users), 'utf-8', (writeErr) => {
            if (writeErr) return res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier' });
            return res.status(201).json({ message: 'Utilisateur inscrit avec succès ! Vous pouvez maintenant vous connecter.' });
        });
    });
});

// POST route for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la lecture du fichier' });

        let users = [];
        try { users = JSON.parse(data); } catch (parseErr) { return res.status(500).json({ message: 'Erreur lors du parsing du JSON' }); }

        const user = users.find(user => user.email === username);
        if (!user || user.password !== password) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

        req.session.user = { email: user.email, role: user.role };
        res.status(200).json({ message: 'Connexion réussie !' });
    });
});

// POST route for logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
});

// GET route to fetch current user info
app.get('/current-user', (req, res) => {
    if (req.session.user) return res.json(req.session.user);
    res.status(404).json({ message: 'Utilisateur non connecté' });
});

// ------------------ Routes for Cars ----------------------------

// GET route for fetching cars data
app.get('/cars', (req, res) => {
    fs.readFile(carsFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la lecture du fichier des voitures' });
        res.json(JSON.parse(data));
    });
});

// POST route to add a new car
app.post('/cars', (req, res) => {
    const newCar = req.body;

    fs.readFile(carsFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la lecture du fichier' });

        let cars = [];
        try { cars = JSON.parse(data); } catch (parseErr) { return res.status(500).json({ message: 'Erreur lors du parsing du JSON' }); }

        cars.push(newCar);
        fs.writeFile(carsFilePath, JSON.stringify(cars), 'utf-8', (writeErr) => {
            if (writeErr) return res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier' });
            res.status(201).json({ message: 'Voiture ajoutée avec succès !' });
        });
    });
});

// DELETE route to delete a car by ID
app.delete('/cars/:id', (req, res) => {
    const carId = parseInt(req.params.id);

    fs.readFile(carsFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la lecture du fichier' });

        let cars = [];
        try { cars = JSON.parse(data); } catch (parseErr) { return res.status(500).json({ message: 'Erreur lors du parsing du JSON' }); }

        cars = cars.filter((car) => car.id !== carId);
        fs.writeFile(carsFilePath, JSON.stringify(cars), 'utf-8', (writeErr) => {
            if (writeErr) return res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier' });
            res.status(200).json({ message: 'Voiture supprimée avec succès !' });
        });
    });
});

// ------------------- Routes for Booking ----------------------------

// GET route to fetch bookings
app.get('/booking', (req, res) => {
    fs.readFile(bookingFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading booking file:', err);
            return res.status(500).json({ message: 'Erreur interne du serveur. Impossible de lire les données de réservation.' });
        }

        try {
            const bookings = JSON.parse(data);
            res.json(bookings); // Send bookings as JSON
        } catch (parseError) {
            console.error('Error parsing booking data:', parseError);
            return res.status(500).json({ message: 'Erreur lors du parsing des données de réservation.' });
        }
    });
});

// POST route to add a new booking
app.post('/booking', (req, res) => {
    const newBooking = req.body;

    fs.readFile(bookingFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la lecture du fichier des réservations' });

        let bookings = JSON.parse(data);
        bookings.push(newBooking);

        fs.writeFile(bookingFilePath, JSON.stringify(bookings, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ message: 'Erreur lors de l\'ajout de la réservation' });
            res.status(201).json(newBooking);
        });
    });
});

// DELETE route to delete a booking by ID
app.delete('/booking/:id', (req, res) => {
    const bookingId = parseInt(req.params.id);

    fs.readFile(bookingFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la lecture des réservations' });

        let bookings = JSON.parse(data);
        bookings = bookings.filter(booking => booking.id !== bookingId);

        fs.writeFile(bookingFilePath, JSON.stringify(bookings, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ message: 'Erreur lors de la suppression de la réservation' });
            res.status(204).send();
        });
    });
});

// ------------------ Routes for Static Pages ------------------------

// Serve the Admin page
app.get('/Admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Admin.html'));
});

// Serve the Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Le serveur fonctionne sur http://localhost:${port}`);
});
