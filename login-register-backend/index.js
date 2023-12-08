import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/RegisterLoginDb")
  .then(() => console.log("Mongo connected"))
  .catch(err => {
    console.log("Mongo connection error");
    console.log(err);
  });

const User = mongoose.model('User', {
  name: String,
  dateOfBirth: Date,
  email: String,
  password: String,
  // Add other user fields as needed
});

export function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.post('/register', async (req, res) => {
  const { name, dateOfBirth, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new User instance with all fields
  const user = new User({
    name: name,
    dateOfBirth: dateOfBirth,
    email: email,
    password: hashedPassword,
  });

  try {
    // Save the user to the database
    await user.save();

    // Create a JWT token for the user
    const token = jwt.sign({ username: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user information
    res.json({ token, user });
  } catch (error) {
    // Handle registration error
    console.error(error);
    res.status(500).send('Error registering user.');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create a JWT token for the user
      const token = jwt.sign({ username: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with the token and user information
      res.json({ token, user });
    } else {
      res.status(401).send('Invalid login credentials.');
    }
  } catch (error) {
    res.status(500).send('Error during login.');
  }
});

app.get('/table', authenticateToken, (req, res) => {
  try {
    // Static table data
    const staticTableData = [
        { id: 1, name: 'John Doe', dateOfBirth: '1990-01-15', email: 'john@example.com', city: 'New York' },
        { id: 2, name: 'Jane Smith', dateOfBirth: '1985-05-22', email: 'jane@example.com', city: 'San Francisco' },
        { id: 3, name: 'Ayush Arora', dateOfBirth: '2000-08-26', email: 'ayush@example.com', city: 'San Francisco' },
        { id: 4, name: 'Avnit Anand', dateOfBirth: '2001-09-25', email: 'avnit@example.com', city: 'San Francisco' },
        { id: 5, name: 'Kailash Kumar', dateOfBirth: '2001-07-22', email: 'kailash@example.com', city: 'San Francisco' },
        { id: 6, name: 'Aniket Yadav', dateOfBirth: '2001-05-22', email: 'aniket@example.com', city: 'San Francisco' },
        // Add more data as needed
      ];
      

    // Send the static table data as a response
    res.json(staticTableData);
  } catch (error) {
    console.error('Error fetching static table data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
