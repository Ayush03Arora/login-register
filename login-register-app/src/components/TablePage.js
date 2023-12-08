// src/components/TablePage.js
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';


const TablePage = ({ token }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/table', {
          headers: {
            Authorization: token,
          },
        });
        setTableData(response.data);
      } catch (error) {
        console.error('Error fetching table data:', error.message);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <Button variant="primary" type="button">
        Fetch Table Data
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            {/* You may choose not to display the password in the frontend */}
            {/* <th>Password</th> */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.dateOfBirth}</td>
              <td>{row.email}</td>
              {/* You may choose not to display the password in the frontend */}
              {/* <td>{row.password}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablePage;
