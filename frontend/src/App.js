import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, FormGroup, FormControlLabel, Checkbox, Chip, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';
import './App.css';

// Configure axios with proper error handling to prevent continuous refreshing
// Use the exact backend URL from environment variables
const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';
axios.defaults.baseURL = apiUrl;
console.log('Using API URL:', apiUrl); // Debug log to verify the URL

// Add CORS headers to requests
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = false;

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    // Prevents throwing unhandled promise rejection errors that can cause refreshes
    return Promise.resolve({ data: error.response?.data || {} });
  }
);

function App() {
  // State for dishes, people, selections and result
  const [dishes, setDishes] = useState([{ dish: '', price: '' }]);
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [selections, setSelections] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  // Load data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const dishesResponse = await axios.get('/api/dishes');
        const peopleResponse = await axios.get('/api/people');
        const selectionsResponse = await axios.get('/api/selections');
        
        // Set dishes (make sure there's at least one empty dish input if none found)
        const loadedDishes = dishesResponse.data;
        setDishes(loadedDishes.length > 0 ? loadedDishes : [{ dish: '', price: '' }]);
        
        // Set people
        setPeople(peopleResponse.data);
        
        // Set selections
        setSelections(selectionsResponse.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle dish input changes
  const handleDishChange = (index, field, value) => {
    const newDishes = [...dishes];
    newDishes[index][field] = value;
    setDishes(newDishes);
    
    // Save to backend (debounced to prevent too many requests)
    const saveTimeout = setTimeout(() => {
      axios.post('/api/dishes', newDishes)
        .catch(error => console.error('Error saving dishes:', error));
    }, 500);
    
    return () => clearTimeout(saveTimeout);
  };

  // Add a new dish
  const addDish = () => {
    const newDishes = [...dishes, { dish: '', price: '' }];
    setDishes(newDishes);
    
    // Save to backend
    axios.post('/api/dishes', newDishes)
      .catch(error => console.error('Error saving dishes:', error));
  };

  // Remove a dish
  const removeDish = (index) => {
    const newDishes = [...dishes];
    newDishes.splice(index, 1);
    setDishes(newDishes);
    
    // Also update selections
    const newSelections = { ...selections };
    delete newSelections[index];
    setSelections(newSelections);
    
    // Save to backend
    axios.post('/api/dishes', newDishes)
      .catch(error => console.error('Error saving dishes:', error));
    axios.post('/api/selections', newSelections)
      .catch(error => console.error('Error saving selections:', error));
  };

  // Add a new person
  const addPerson = () => {
    if (newPerson.trim() !== '') {
      const newPeople = [...people, newPerson];
      setPeople(newPeople);
      setNewPerson('');
      
      // Save to backend
      axios.post('/api/people', newPeople)
        .catch(error => console.error('Error saving people:', error));
    }
  };

  // Remove a person
  const removePerson = (personToRemove) => {
    const newPeople = people.filter(person => person !== personToRemove);
    setPeople(newPeople);
    
    // Also update selections
    const newSelections = { ...selections };
    Object.keys(newSelections).forEach(dishId => {
      newSelections[dishId] = newSelections[dishId].filter(person => person !== personToRemove);
    });
    setSelections(newSelections);
    
    // Save to backend
    axios.post('/api/people', newPeople)
      .catch(error => console.error('Error saving people:', error));
    axios.post('/api/selections', newSelections)
      .catch(error => console.error('Error saving selections:', error));
  };

  // Handle selection changes
  const handleSelectionChange = (dishId, person, isChecked) => {
    const newSelections = { ...selections };
    
    if (!newSelections[dishId]) {
      newSelections[dishId] = [];
    }
    
    if (isChecked) {
      newSelections[dishId].push(person);
    } else {
      newSelections[dishId] = newSelections[dishId].filter(p => p !== person);
    }
    
    setSelections(newSelections);
    
    // Save selections to backend
    axios.post('/api/selections', newSelections)
      .catch(error => console.error('Error saving selections:', error));
  };

  // Calculate the split
  const calculateSplit = async () => {
    try {
      // Filter out empty dishes
      const validDishes = dishes.filter(dish => dish.dish.trim() !== '' && dish.price.trim() !== '');
      
      // Send data to backend
      await axios.post('/api/dishes', validDishes);
      await axios.post('/api/people', people);
      
      const response = await axios.post('/api/calculate', selections);
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating split:', error);
    }
  };
  
  // Reset all data
  const handleReset = async () => {
    try {
      await axios.post('/api/reset');
      setDishes([{ dish: '', price: '' }]);
      setPeople([]);
      setSelections({});
      setResult(null);
      setResetDialogOpen(false);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };
  
  // Open reset confirmation dialog
  const openResetDialog = () => {
    setResetDialogOpen(true);
  };
  
  // Close reset dialog without resetting
  const closeResetDialog = () => {
    setResetDialogOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Add an image above the title */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img
            src="/dessert.jpeg"
            alt="Burma Restaurant Dessert"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Smart Bill Splitter
        </Typography>
        
        {/* Dishes section */}
        <Box sx={{ mb: 5, mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>1. Enter Dishes</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Dish Name</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell width="10%"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dishes.map((dish, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={dish.dish}
                        onChange={(e) => handleDishChange(index, 'dish', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        value={dish.price}
                        onChange={(e) => handleDishChange(index, 'price', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeDish(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addDish}
            sx={{ mt: 2 }}
          >
            Add Dish
          </Button>
        </Box>
        
        {/* People section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>2. Who's Splitting the Bill?</Typography>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Person Name"
              value={newPerson}
              onChange={(e) => setNewPerson(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
            />
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={addPerson}
              sx={{ ml: 2 }}
            >
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {people.map((person, index) => (
              <Chip
                key={index}
                label={person}
                onDelete={() => removePerson(person)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
        
        {/* Selections section */}
        {dishes.some(dish => dish.dish.trim() !== '') && people.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>3. Who Had What?</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Dish</strong></TableCell>
                    <TableCell><strong>Price</strong></TableCell>
                    <TableCell><strong>Consumers</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dishes.map((dish, index) => (
                    dish.dish.trim() !== '' && (
                      <TableRow key={index}>
                        <TableCell>{dish.dish}</TableCell>
                        <TableCell>${dish.price}</TableCell>
                        <TableCell>
                          <FormGroup row>
                            {people.map((person, pidx) => (
                              <FormControlLabel
                                key={pidx}
                                control={
                                  <Checkbox
                                    checked={selections[index]?.includes(person) || false}
                                    onChange={(e) => handleSelectionChange(index, person, e.target.checked)}
                                  />
                                }
                                label={person}
                              />
                            ))}
                          </FormGroup>
                        </TableCell>
                      </TableRow>
                    )
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        {/* Calculate and Reset buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<CalculateIcon />}
            onClick={calculateSplit}
            sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
          >
            Calculate Split
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<RestartAltIcon />}
            onClick={openResetDialog}
            sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
          >
            Reset All
          </Button>
        </Box>
        
        {/* Results section */}
        {result && (
          <Box sx={{ mt: 4, bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: '#1976d2' }}>
              Bill Split Result
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Person</strong></TableCell>
                    <TableCell align="right"><strong>Amount to Pay</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(result).map(([person, amount], index) => (
                    <TableRow key={index}>
                      <TableCell>{person}</TableCell>
                      <TableCell align="right">${amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}>
              Everyone paying these amounts covers the bill exactly.
            </Typography>
          </Box>
        )}
      </Paper>
      <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
        Made with ❤️ by Siddharth
      </Typography>
      
      {/* Reset confirmation dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={closeResetDialog}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">{"Reset all data?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            This will clear all dishes, people, and selections. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResetDialog} color="primary">Cancel</Button>
          <Button onClick={handleReset} color="error" variant="contained" autoFocus>
            Reset Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
