import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

import { API_URL, BASE_URL } from '../constants';

const UserArea = () => {
  const [view, setView] = useState('reset');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(true);

  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchData();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = () => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    setUserInfo({ username, email });
  };

  const handleResetPassword = async (currentPsw, psw, pswConf) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: currentPsw,
          password: psw,
          passwordConfirmation: pswConf,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Password changed successfully:", response.data);
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordInput(false);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'currentPassword') {
      setCurrentPassword(e.target.value);
    } else if (e.target.name === 'newPassword') {
      setNewPassword(e.target.value);
    }
  };

  const handleSubmit = () => {
    handleResetPassword(currentPassword, newPassword, newPassword);
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/graphql`, {
        query: `
          query {
            singolaRicercas {
              data {
                id
                attributes {
                  dataRicerca
                  testoRicerca
                  Username
                }
              }
            }
          }
        `
      });

      const result = response.data.data.singolaRicercas.data;
      const targetUsername = localStorage.getItem('username');
      const filtered = result.filter(item =>
        item.attributes.Username === targetUsername
      );
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error fetching data:', error.response.data);
    }
  };

  const list = () => (
    <Box
      sx={{
        width: 280,
        backgroundColor: '#ffffff',
        position: 'fixed',
        top: 64,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Informazioni Utente
        </Typography>
        <Typography component="p">
          <strong>Username:</strong> {userInfo.username}
        </Typography>
        <Typography component="p">
          <strong>Email:</strong> {email}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => {
            setView('reset');
            setShowPasswordInput(true);
          }}
        >
          <ListItemText primary="Resetta Password" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            setView('viewLog');
            setShowPasswordInput(false);
          }}
        >
          <ListItemText primary="Visualizza Log" />
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: '#f0f0f0',
    }}>
      {drawerOpen && list()}

      <Box sx={{ flex: 1 }}>
        {showPasswordInput && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              borderRadius: '8px',
              width: '320px',
              maxWidth: '90%',
              border: '1px solid #ccc',
              background: '#ffffff',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
              Resetta Password
            </Typography>
            <TextField
              type="password"
              label="Password Attuale"
              variant="outlined"
              name="currentPassword"
              value={currentPassword}
              onChange={handleInputChange}
              sx={{ mb: 2, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ marginRight: '10px' }}>
                    <LockIcon />
                  </Box>
                ),
              }}
            />
            <TextField
              type="password"
              label="Nuova Password"
              variant="outlined"
              name="newPassword"
              value={newPassword}
              onChange={handleInputChange}
              sx={{ mb: 2, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ marginRight: '10px' }}>
                    <LockIcon />
                  </Box>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                width: '100%',
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Invia
            </Button>
          </Box>
        )}

        {view === 'viewLog' && (
          <Box
            sx={{
              mt: '120px',
              width: '80%',
              marginLeft: '30%',
              maxWidth: '800px',
              bgcolor: 'white',
              borderRadius: '8px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: '#999 #f0f0f0',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <Paper sx={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                User's Log
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Data Ricerca</TableCell>
                      <TableCell>Testo Ricerca</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.attributes.Username}</TableCell>
                        <TableCell>{item.attributes.dataRicerca}</TableCell>
                        <TableCell>{item.attributes.testoRicerca}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserArea;
