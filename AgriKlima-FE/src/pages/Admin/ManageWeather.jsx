// src/pages/Admin/ManageWeather.jsx

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel, Divider, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Accordion, AccordionSummary, AccordionDetails,
  IconButton, Tooltip
} from '@mui/material';
import {
  TrendingUp, TrendingDown, WbSunny, Cloud, Opacity, Air, Warning, 
  CheckCircle, Thermostat, Edit, Restore, ExpandMore, Add, Delete
} from '@mui/icons-material';
import * as api from '../../services/api';
import Swal from 'sweetalert2';

const LOCATIONS = ['San Fernando', 'Santa Ana', 'Mexico', 'Bacolor', 'Arayat'];

const ManageWeather = () => {
  const [selectedLocation, setSelectedLocation] = useState('San Fernando');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allLocationsData, setAllLocationsData] = useState([]);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [weatherRules, setWeatherRules] = useState(null);
  const [editedRules, setEditedRules] = useState(null);

  useEffect(() => {
    fetchWeatherData();
    fetchAllLocations();
    fetchWeatherRules();
  }, [selectedLocation]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const response = await api.getWeather(selectedLocation);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLocations = async () => {
    try {
      const promises = LOCATIONS.map(loc => api.getWeather(loc));
      const responses = await Promise.all(promises);
      const data = responses.map((res, idx) => ({
        location: LOCATIONS[idx],
        ...res.data
      }));
      setAllLocationsData(data);
    } catch (error) {
      console.error('Failed to fetch all locations:', error);
    }
  };

  const fetchWeatherRules = async () => {
    try {
      const response = await api.getWeatherRules();
      setWeatherRules(response.data);
      setEditedRules(JSON.parse(JSON.stringify(response.data)));
    } catch (error) {
      console.error('Failed to fetch weather rules:', error);
    }
  };

  const handleOpenRulesEditor = () => {
    setEditedRules(JSON.parse(JSON.stringify(weatherRules)));
    setRulesModalOpen(true);
  };

  const handleSaveRules = async () => {
    try {
      await api.updateWeatherRules(editedRules);
      setWeatherRules(editedRules);
      setRulesModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Rules Updated!',
        text: 'Weather recommendation rules have been updated successfully.',
      });
      fetchWeatherData(); // Refresh to apply new rules
    } catch (error) {
      console.error('Failed to update rules:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update weather rules.',
      });
    }
  };

  const handleResetRules = async () => {
    const result = await Swal.fire({
      title: 'Reset to Default?',
      text: 'This will restore all default weather recommendation rules.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset!'
    });

    if (result.isConfirmed) {
      try {
        await api.resetWeatherRules();
        await fetchWeatherRules();
        Swal.fire('Reset!', 'Rules have been reset to default.', 'success');
        fetchWeatherData();
      } catch (error) {
        console.error('Failed to reset rules:', error);
        Swal.fire('Error!', 'Failed to reset rules.', 'error');
      }
    }
  };

  const updateRuleValue = (category, subCategory, field, value) => {
    setEditedRules(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...prev[category][subCategory],
          [field]: value
        }
      }
    }));
  };

  const addRecommendation = (category, subCategory) => {
    setEditedRules(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...prev[category][subCategory],
          recommendations: [...(prev[category][subCategory].recommendations || []), '']
        }
      }
    }));
  };

  const updateRecommendation = (category, subCategory, index, value) => {
    setEditedRules(prev => {
      const newRecs = [...prev[category][subCategory].recommendations];
      newRecs[index] = value;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [subCategory]: {
            ...prev[category][subCategory],
            recommendations: newRecs
          }
        }
      };
    });
  };

  const deleteRecommendation = (category, subCategory, index) => {
    setEditedRules(prev => {
      const newRecs = prev[category][subCategory].recommendations.filter((_, i) => i !== index);
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [subCategory]: {
            ...prev[category][subCategory],
            recommendations: newRecs
          }
        }
      };
    });
  };

  const getFarmingConditionColor = (score) => {
    if (score >= 91) return 'success';
    if (score >= 76) return 'info';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
            ☁️ Weather Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time weather monitoring and farming insights for Pampanga's 3rd District
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={handleResetRules}
            color="warning"
          >
            Reset Rules
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleOpenRulesEditor}
            color="primary"
          >
            Edit Recommendation Rules
          </Button>
        </Box>
      </Box>

      {/* Location Selector */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Location</InputLabel>
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            label="Select Location"
          >
            {LOCATIONS.map((loc) => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {weatherData && (
        <>
          {/* Current Weather Overview */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: 'primary.light', color: 'white', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Thermostat sx={{ mr: 1 }} />
                    <Typography variant="body2">Temperature</Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {weatherData.current.temperature}°
                  </Typography>
                  <Typography variant="caption">
                    Feels like {weatherData.current.feelsLike}°
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Opacity sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">Humidity</Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {weatherData.current.humidity}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {weatherData.current.humidity > 80 ? 'High humidity' : 'Normal'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Air sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body2">Wind Speed</Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {weatherData.current.windSpeed}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    km/h
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                bgcolor: weatherData.farmingAdvice?.score >= 76 ? 'success.light' : 'warning.light',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {weatherData.farmingAdvice?.score >= 76 ? <CheckCircle /> : <Warning />}
                    <Typography variant="body2" sx={{ ml: 1 }}>Farming Score</Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {weatherData.farmingAdvice?.score}/100
                  </Typography>
                  <Typography variant="caption">
                    {weatherData.farmingAdvice?.statusLabel}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Farming Recommendations */}
          {weatherData.farmingAdvice && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="600" color="primary">
                🌾 Current Farming Recommendations for {selectedLocation}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {weatherData.farmingAdvice.warnings?.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <AlertTitle>Warnings</AlertTitle>
                  {weatherData.farmingAdvice.warnings.map((warning, idx) => (
                    <Typography key={idx} variant="body2">• {warning}</Typography>
                  ))}
                </Alert>
              )}

              <Alert severity="info">
                <AlertTitle>Recommendations</AlertTitle>
                {weatherData.farmingAdvice.recommendations.map((rec, idx) => (
                  <Typography key={idx} variant="body2">• {rec}</Typography>
                ))}
              </Alert>
            </Paper>
          )}

          {/* All Locations Comparison */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="600" color="primary">
              📍 All Locations Comparison
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell><strong>Temperature</strong></TableCell>
                    <TableCell><strong>Humidity</strong></TableCell>
                    <TableCell><strong>Wind</strong></TableCell>
                    <TableCell><strong>Condition</strong></TableCell>
                    <TableCell><strong>Farming Score</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allLocationsData.map((loc, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{loc.location}</TableCell>
                      <TableCell>{loc.current?.temperature}°</TableCell>
                      <TableCell>{loc.current?.humidity}%</TableCell>
                      <TableCell>{loc.current?.windSpeed} km/h</TableCell>
                      <TableCell>{loc.current?.condition}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${loc.farmingAdvice?.score}/100`}
                          color={getFarmingConditionColor(loc.farmingAdvice?.score)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Rules Editor Modal */}
      <Dialog 
        open={rulesModalOpen} 
        onClose={() => setRulesModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit color="primary" />
            <Typography variant="h5">Edit Weather Recommendation Rules</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {editedRules && (
            <Box sx={{ mt: 2 }}>
              {/* Temperature Rules */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" color="primary">🌡️ Temperature Rules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(editedRules.temperatureRules || {}).map((key) => (
                    <Box key={key} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Grid container spacing={2}>
                        {editedRules.temperatureRules[key].threshold !== undefined && (
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Threshold (°C)"
                              value={editedRules.temperatureRules[key].threshold}
                              onChange={(e) => updateRuleValue('temperatureRules', key, 'threshold', Number(e.target.value))}
                              size="small"
                            />
                          </Grid>
                        )}
                        {editedRules.temperatureRules[key].minThreshold !== undefined && (
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Min Threshold (°C)"
                              value={editedRules.temperatureRules[key].minThreshold}
                              onChange={(e) => updateRuleValue('temperatureRules', key, 'minThreshold', Number(e.target.value))}
                              size="small"
                            />
                          </Grid>
                        )}
                        {editedRules.temperatureRules[key].maxThreshold !== undefined && (
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Max Threshold (°C)"
                              value={editedRules.temperatureRules[key].maxThreshold}
                              onChange={(e) => updateRuleValue('temperatureRules', key, 'maxThreshold', Number(e.target.value))}
                              size="small"
                            />
                          </Grid>
                        )}
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Score Deduction"
                            value={editedRules.temperatureRules[key].scoreDeduction}
                            onChange={(e) => updateRuleValue('temperatureRules', key, 'scoreDeduction', Number(e.target.value))}
                            size="small"
                          />
                        </Grid>
                        {editedRules.temperatureRules[key].warning && (
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Warning Message"
                              value={editedRules.temperatureRules[key].warning}
                              onChange={(e) => updateRuleValue('temperatureRules', key, 'warning', e.target.value)}
                              size="small"
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant="caption" fontWeight="bold">Recommendations:</Typography>
                          {editedRules.temperatureRules[key].recommendations?.map((rec, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <TextField
                                fullWidth
                                value={rec}
                                onChange={(e) => updateRecommendation('temperatureRules', key, idx, e.target.value)}
                                size="small"
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => deleteRecommendation('temperatureRules', key, idx)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => addRecommendation('temperatureRules', key)}
                            sx={{ mt: 1 }}
                          >
                            Add Recommendation
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>

              {/* Humidity Rules */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" color="primary">💧 Humidity Rules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(editedRules.humidityRules || {}).map((key) => (
                    <Box key={key} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Grid container spacing={2}>
                        {editedRules.humidityRules[key].threshold !== undefined && (
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Threshold (%)"
                              value={editedRules.humidityRules[key].threshold}
                              onChange={(e) => updateRuleValue('humidityRules', key, 'threshold', Number(e.target.value))}
                              size="small"
                            />
                          </Grid>
                        )}
                        {editedRules.humidityRules[key].minThreshold !== undefined && (
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Min Threshold (%)"
                              value={editedRules.humidityRules[key].minThreshold}
                              onChange={(e) => updateRuleValue('humidityRules', key, 'minThreshold', Number(e.target.value))}
                              size="small"
                            />
                          </Grid>
                        )}
                        {editedRules.humidityRules[key].maxThreshold !== undefined && (
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Max Threshold (%)"
                              value={editedRules.humidityRules[key].maxThreshold}
                              onChange={(e) => updateRuleValue('humidityRules', key, 'maxThreshold', Number(e.target.value))}
                              size="small"
                            />
                          </Grid>
                        )}
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Score Deduction"
                            value={editedRules.humidityRules[key].scoreDeduction}
                            onChange={(e) => updateRuleValue('humidityRules', key, 'scoreDeduction', Number(e.target.value))}
                            size="small"
                          />
                        </Grid>
                        {editedRules.humidityRules[key].warning && (
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Warning Message"
                              value={editedRules.humidityRules[key].warning}
                              onChange={(e) => updateRuleValue('humidityRules', key, 'warning', e.target.value)}
                              size="small"
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant="caption" fontWeight="bold">Recommendations:</Typography>
                          {editedRules.humidityRules[key].recommendations?.map((rec, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <TextField
                                fullWidth
                                value={rec}
                                onChange={(e) => updateRecommendation('humidityRules', key, idx, e.target.value)}
                                size="small"
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => deleteRecommendation('humidityRules', key, idx)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => addRecommendation('humidityRules', key)}
                            sx={{ mt: 1 }}
                          >
                            Add Recommendation
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>

              {/* Wind Rules */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" color="primary">💨 Wind Speed Rules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(editedRules.windRules || {}).map((key) => (
                    <Box key={key} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Threshold (km/h)"
                            value={editedRules.windRules[key].threshold}
                            onChange={(e) => updateRuleValue('windRules', key, 'threshold', Number(e.target.value))}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Score Deduction"
                            value={editedRules.windRules[key].scoreDeduction}
                            onChange={(e) => updateRuleValue('windRules', key, 'scoreDeduction', Number(e.target.value))}
                            size="small"
                          />
                        </Grid>
                        {editedRules.windRules[key].warning && (
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Warning Message"
                              value={editedRules.windRules[key].warning}
                              onChange={(e) => updateRuleValue('windRules', key, 'warning', e.target.value)}
                              size="small"
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant="caption" fontWeight="bold">Recommendations:</Typography>
                          {editedRules.windRules[key].recommendations?.map((rec, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <TextField
                                fullWidth
                                value={rec}
                                onChange={(e) => updateRecommendation('windRules', key, idx, e.target.value)}
                                size="small"
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => deleteRecommendation('windRules', key, idx)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => addRecommendation('windRules', key)}
                            sx={{ mt: 1 }}
                          >
                            Add Recommendation
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>

              {/* Precipitation Rules */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" color="primary">🌧️ Precipitation Rules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(editedRules.precipitationRules || {}).map((key) => (
                    <Box key={key} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Threshold (%)"
                            value={editedRules.precipitationRules[key].threshold}
                            onChange={(e) => updateRuleValue('precipitationRules', key, 'threshold', Number(e.target.value))}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Score Deduction"
                            value={editedRules.precipitationRules[key].scoreDeduction}
                            onChange={(e) => updateRuleValue('precipitationRules', key, 'scoreDeduction', Number(e.target.value))}
                            size="small"
                          />
                        </Grid>
                        {editedRules.precipitationRules[key].warning && (
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Warning Message"
                              value={editedRules.precipitationRules[key].warning}
                              onChange={(e) => updateRuleValue('precipitationRules', key, 'warning', e.target.value)}
                              size="small"
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant="caption" fontWeight="bold">Recommendations:</Typography>
                          {editedRules.precipitationRules[key].recommendations?.map((rec, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <TextField
                                fullWidth
                                value={rec}
                                onChange={(e) => updateRecommendation('precipitationRules', key, idx, e.target.value)}
                                size="small"
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => deleteRecommendation('precipitationRules', key, idx)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => addRecommendation('precipitationRules', key)}
                            sx={{ mt: 1 }}
                          >
                            Add Recommendation
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRulesModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRules} variant="contained" color="primary">
            Save Rules
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageWeather;
