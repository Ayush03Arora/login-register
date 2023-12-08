// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import TablePage from './components/TablePage';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [token, setToken] = useState('');

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const loggedIn = !!token;

  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">Login and Register</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
          {loggedIn && <Nav.Link as={Link} to="/table">Table</Nav.Link>}
        </Nav>
        {loggedIn && <Button variant="outline-info" onClick={handleLogout}>Logout</Button>}
      </Navbar>

      <Container className="mt-3">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
          <Route
            path="/table"
            element={loggedIn ? <TablePage token={token} /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
