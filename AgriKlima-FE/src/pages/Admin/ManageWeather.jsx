// src/pages/Admin/ManageWeather.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Swal from 'sweetalert2';
import * as api from '../../services/api';

const PAMPANGA_DISTRICT_3_MUNICIPALITIES = [
  'Santa Ana, Pampanga',
  'City of San Fernando, Pampanga',
  'Arayat, Pampanga',
  'Bacolor, Pampanga',
  'Mexico, Pampanga'
];

const ManageWeather = () => {
  const [selectedLocation, setSelectedLocation] = useState('Mexico, Pampanga');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hourlyForecasts, setHourlyForecasts] = useState([
    { time: '06:00', temperature: '', windSpeed: '', condition: '' },
    { time: '12:00', temperature: '', windSpeed: '', condition: '' },
    { time: '18:00', temperature: '', windSpeed: '', condition: '' },
    { time: '00:00', temperature: '', windSpeed: '', condition: '' }
  ]);
  const [dailyForecasts, setDailyForecasts] = useState([
    { day: 'Monday', temperature: '', condition: '' },
    { day: 'Tuesday', temperature: '', condition: '' },
    { day: 'Wednesday', temperature: '', condition: '' },
    { day: 'Thursday', temperature: '', condition: '' },
    { day: 'Friday', temperature: '', condition: '' },
    { day: 'Saturday', temperature: '', condition: '' },
    { day: 'Sunday', temperature: '', condition: '' }
  ]);

  const fetchWeather = useCallback(async (location) => {
    setLoading(true);
    try {
      const response = await api.getWeather(location);
      const data = response.data;

      setWeatherData(data);

      if (data.hourly?.length) setHourlyForecasts(data.hourly);
      if (data.daily?.length) setDailyForecasts(data.daily);
    } catch (error) {
      if (error.response?.status === 404) {
        const defaultData = {
          location,
          current: {
            temperature: '',
            humidity: '',
            visibility: '',
            airPressure: '',
            windSpeed: '',
            condition: ''
          },
          detailed: {
            uvIndex: '',
            airQuality: '',
            sunrise: '',
            sunset: '',
            precipitation: '',
            feelsLike: '',
            moonPhase: ''
          },
          hourly: hourlyForecasts,
          daily: dailyForecasts
        };
        setWeatherData(defaultData);
        Swal.fire('Info', 'No weather data found for this location. You can create a new entry.', 'info');
      } else {
        Swal.fire('Error', 'Could not fetch weather data.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation, fetchWeather]);

  const handleLocationChange = (event) => setSelectedLocation(event.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, key] = name.split('.');
    setWeatherData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleHourlyChange = (index, field, value) => {
    const updated = [...hourlyForecasts];
    updated[index] = { ...updated[index], [field]: value };
    setHourlyForecasts(updated);
  };

  const handleDailyChange = (index, field, value) => {
    const updated = [...dailyForecasts];
    updated[index] = { ...updated[index], [field]: value };
    setDailyForecasts(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...weatherData,
        hourly: hourlyForecasts,
        daily: dailyForecasts,
        lastUpdated: new Date()
      };
      await api.updateWeather(selectedLocation, dataToSave);
      Swal.fire('Success', 'Weather data updated successfully!', 'success');
      fetchWeather(selectedLocation);
    } catch (error) {
      Swal.fire('Error', 'Failed to save weather data.', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!weatherData) {
    return <Typography>Could not load weather data.</Typography>;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Manage Weather Data
        </Typography>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 250 } }}>
          <InputLabel>Select Municipality</InputLabel>
          <Select value={selectedLocation} label="Select Municipality" onChange={handleLocationChange}>
            {PAMPANGA_DISTRICT_3_MUNICIPALITIES.map((municipality) => (
              <MenuItem key={municipality} value={municipality}>
                {municipality}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Form */}
      <Paper component="form" onSubmit={handleSave} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Weather for {selectedLocation}
        </Typography>

        {/* Current Conditions */}
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
          Current Conditions
        </Typography>
        <Grid container spacing={2}>
          {[
            ['Temperature (°C)', 'current.temperature', 'number'],
            ['Humidity (%)', 'current.humidity', 'number'],
            ['Visibility (km)', 'current.visibility', 'number'],
            ['Air Pressure (hPa)', 'current.airPressure', 'number'],
            ['Wind Speed (km/h)', 'current.windSpeed', 'number']
          ].map(([label, name, type]) => (
            <Grid item xs={12} sm={6} md={3} key={name}>
              <TextField fullWidth label={label} name={name} value={weatherData?.[name.split('.')[0]]?.[name.split('.')[1]] || ''} onChange={handleChange} type={type} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Condition" name="current.condition" value={weatherData.current?.condition || ''} onChange={handleChange} select>
              <MenuItem value="Sunny">Sunny</MenuItem>
              <MenuItem value="Cloudy">Cloudy</MenuItem>
              <MenuItem value="Rainy">Rainy</MenuItem>
              <MenuItem value="Partly Cloudy">Partly Cloudy</MenuItem>
              <MenuItem value="Stormy">Stormy</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Detailed Info */}
        <Typography variant="h6" sx={{ mb: 2, mt: 4, color: 'primary.main' }}>
          Detailed Information
        </Typography>
        <Grid container spacing={2}>
          {/* same layout as your original detailed info fields */}
          {/* … keep your existing fields here … */}
        </Grid>

        {/* Hourly Forecast */}
        <Typography variant="h6" sx={{ mb: 2, mt: 4, color: 'primary.main' }}>
          Hourly Forecast
        </Typography>
        <Grid container spacing={2}>
          {hourlyForecasts.map((forecast, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {forecast.time}
                </Typography>
                <TextField fullWidth label="Temp (°C)" size="small" value={forecast.temperature} onChange={(e) => handleHourlyChange(index, 'temperature', e.target.value)} type="number" />
                <TextField fullWidth label="Wind (km/h)" size="small" sx={{ mt: 1 }} value={forecast.windSpeed} onChange={(e) => handleHourlyChange(index, 'windSpeed', e.target.value)} type="number" />
                <TextField fullWidth label="Condition" size="small" sx={{ mt: 1 }} value={forecast.condition} onChange={(e) => handleHourlyChange(index, 'condition', e.target.value)} select>
                  <MenuItem value="Sunny">Sunny</MenuItem>
                  <MenuItem value="Cloudy">Cloudy</MenuItem>
                  <MenuItem value="Rainy">Rainy</MenuItem>
                </TextField>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Daily Forecast */}
        <Typography variant="h6" sx={{ mb: 2, mt: 4, color: 'primary.main' }}>
          7-Day Forecast
        </Typography>
        <Grid container spacing={2}>
          {dailyForecasts.map((forecast, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {forecast.day}
                </Typography>
                <TextField fullWidth label="Temp (°C)" size="small" value={forecast.temperature} onChange={(e) => handleDailyChange(index, 'temperature', e.target.value)} type="number" />
                <TextField fullWidth label="Condition" size="small" sx={{ mt: 1 }} value={forecast.condition} onChange={(e) => handleDailyChange(index, 'condition', e.target.value)} select>
                  <MenuItem value="Sunny">Sunny</MenuItem>
                  <MenuItem value="Cloudy">Cloudy</MenuItem>
                  <MenuItem value="Rainy">Rainy</MenuItem>
                  <MenuItem value="Partly Cloudy">Partly Cloudy</MenuItem>
                </TextField>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button type="submit" variant="contained" size="large" sx={{ bgcolor: 'var(--primary-green)', px: 4 }}>
            Save Weather Data
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManageWeather;
