import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import { API_URL } from '../constants';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GraphicArea from './GraphicArea';
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#ffffff',
    border: '2px solid',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

const isDate = (value) => {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && value.includes('-');
};

const formatValue = (value) => {
    if (typeof value === 'boolean') {
        return value.toString();
    }
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return value.toString();
};

const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

const extractAttributeName = (key) => {
    return key.split('.').pop();
};

const AdminArea = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerOptions, setDrawerOptions] = useState([
        { text: 'Pattern', value: 'patterns' },
        { text: 'Articoli-GDPR', value: 'articoli-gdprs' },
        { text: 'OWASP', value: 'owasps' },
        { text: 'CWE', value: 'cwes' },
        { text: 'Strategy', value: 'strategies' },
        { text: 'PBD', value: 'pbds' },
        { text: 'User', value: 'users' },
        { text: 'MVC', value: 'mvcs' },
        { text: 'ISO', value: 'isos' },
        { text: 'Notifica', value: 'notificas' },
        { text: 'Ricerca', value: 'singola-ricercas' },
    ]);
    const [selectedButtonValue, setSelectedButtonValue] = useState('users');
    const [selectedRow, setSelectedRow] = useState(null);
    const [editableRow, setEditableRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [dataReceived, setDataReceived] = useState(null);
    const [errorData, setErrorData] = useState(null);
    const [updatedData, setUpdatedData] = useState([]);
    const [filteredOption, setFilteredOption] = useState([]);
    const [dataInsertRow, setDataInsertRow] = useState([]);
    const [insertModalOpen, setInsertModalOpen] = useState(false);
    const [newRowData, setNewRowData] = useState({});
    const [showChart, setShowChart] = useState(false);
    const insertNewRow = () => {
        if (dataReceived && dataReceived[0]) {
            const fields = getField(dataReceived[0].attributes || {});
            setNewRowData(fields);
            setInsertModalOpen(true);
        } else {
            console.error('Data not received or empty');
        }
    };

    const getField = (attributes) => {
        const { createdAt, updatedAt, publishedAt, provider,confirmed, blocked, id, ...res } = attributes;
        console.log(res)
        return res;
    };

    const handleNewRowChange = (key, value) => {
        setNewRowData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const addRow = async () => {
        console.log(newRowData)
        const response = await fetch(`${API_URL}/${selectedButtonValue}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: newRowData }),
        });

        if (response.ok) {
            handleInsertModalClose();
            fetchData();
        } else {
            console.error('Error adding row');
        }
    };

    useEffect(() => {
        if (selectedButtonValue) fetchData();
    }, [selectedButtonValue]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/${selectedButtonValue}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataReceived(selectedButtonValue === 'users' ? data : data.data);
            setErrorData(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorData(error.message || 'Error fetching data');
            setDataReceived(null);
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);
        setEditableRow(selectedButtonValue === 'users' ? { ...row } : { ...row.attributes });
        setIsEditing(false);
    };

    const handleClose = () => {
        setSelectedRow(null);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (key, value) => {
        setEditableRow((prev) => ({
            ...prev,
            [key]: value,
        }));
        setUpdatedData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const rowId = selectedRow.id;
        const response = await fetch(`${API_URL}/${selectedButtonValue}/${rowId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ data: editableRow }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('Field updated Successfully');
    };

    const handleDelete = async () => {
        const confirmation = window.confirm('Are you sure you want to delete this record?');
        if (!confirmation) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${selectedButtonValue}/${selectedRow.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchData();
            setSelectedRow(null);
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const chart = ()=>{
        setShowChart(true);
    }
    const actions = [
        { icon: <AddIcon />, name: `Insert new Row in ${selectedButtonValue}`, action: insertNewRow },
        { icon: <ShowChartIcon />, name: `View Chart`, action: chart},
    ];
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button
                sx={{ position: 'absolute', top: '15px', left: '10px',border:'1px continue' ,zIndex: 100 }}
                onClick={toggleDrawer(true)}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '24px' }}>
                    <Box sx={{ width: '30px', height: '3px', backgroundColor: 'white' }} />
                    <Box sx={{ width: '30px', height: '3px', backgroundColor: 'white' }} />
                    <Box sx={{ width: '30px', height: '3px', backgroundColor: 'white' }} />
                </Box>
            </Button>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{ color: '#ffffff' }}
                
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                    
                >
                    <List>
                        {drawerOptions.map((option) => (
                            <ListItem
                                button
                                key={option.value}
                                onClick={() => {
                                    setSelectedButtonValue(option.value);
                                    setFilteredOption(option.text);
                                    setDrawerOpen(false);
                                }}
                                
                            >
                                <ListItemText primary={option.text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>

            <Box sx={{ paddingTop: '30vh', display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                    minWidth: 800,
                    minHeight: 280,
                    backgroundColor: '#1b1724',
                    margin: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0px 0px 15px #00000',
                    borderRadius: '10px',
                    maxHeight: 400,
                }}>
                    <TableContainer component={Paper} sx={{ height: 400 }}>
                        <Table sx={{ minWidth: '70vh' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {dataReceived && dataReceived[0] && Object.keys(flattenObject(dataReceived[0])).map((column) => (
                                        <TableCell key={column} sx={{ color: '#000000' }}>{column}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody> 
                                {dataReceived && dataReceived.map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        onClick={() => handleRowClick(row)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {Object.keys(flattenObject(row)).map((column, columnIndex) => (
                                            <TableCell key={columnIndex}>
                                                {formatValue(flattenObject(row)[column])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Modal
                    open={!!selectedRow}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Details
                        </Typography>
                        {editableRow && (
                            <Box sx={{ mt: 2 }}>
                                {Object.keys(editableRow).map((column) => (
                                    <div key={column} style={{ marginBottom: '1rem' }}>
                                        <strong>{column}: </strong>
                                        {isEditing ? (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                value={editableRow[column]}
                                                onChange={(e) => handleInputChange(column, e.target.value)}
                                                sx={{ mt: 1 }}
                                            />
                                        ) : (
                                            formatValue(editableRow[column])
                                        )}
                                    </div>
                                ))}
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleEditToggle}>
                                {isEditing ? 'Done' : 'Edit'}
                            </Button>
                            {!isEditing && (
                                <Button variant="contained" color="success" onClick={handleUpdate} sx={{ ml: 2 }}>
                                    Update
                                </Button>
                            )}
                            <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <Modal
                    open={insertModalOpen}
                    onClose={handleInsertModalClose}
                    aria-labelledby="modal-insert-title"
                    aria-describedby="modal-insert-description"
                >
                    <Box sx={modalStyle}>
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                            onClick={handleInsertModalClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography id="modal-insert-title" variant="h4" component="h2">
                            Insert New Row
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {Object.keys(newRowData).map((column) => (
                                <div key={column} style={{ marginBottom: '1rem' }}>
                                    <TextField
                                        label={column}
                                        variant="outlined"
                                        fullWidth
                                        value={newRowData[column] || ''}
                                        onChange={(e) => handleNewRowChange(column, e.target.value)}
                                        sx={{ mt: 1 }}
                                    />
                                </div>
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="contained" color="primary" onClick={addRow}>
                                Add Row
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            {
                showChart &&<> <GraphicArea/></>
            }
            <SpeedDial
                ariaLabel="SpeedDial actions"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.action}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
};

export default AdminArea;
