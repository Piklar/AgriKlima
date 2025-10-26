// src/utils/weatherIcons.js
import React from 'react';
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined';
import CloudOutlined from '@mui/icons-material/CloudOutlined';
import Grain from '@mui/icons-material/Grain';
import ThunderstormOutlined from '@mui/icons-material/ThunderstormOutlined';
import AcUnitOutlined from '@mui/icons-material/AcUnitOutlined';
import Dehaze from '@mui/icons-material/Dehaze';
import WbCloudyOutlined from '@mui/icons-material/WbCloudyOutlined';

// This utility function maps weather icon codes from the OpenWeatherMap API
// to Material-UI icons with appropriate colors.
export const getWeatherIcon = (iconCode, size = '2.5rem') => {
  if (!iconCode) return <CloudOutlined sx={{ fontSize: size, color: '#90caf9' }} />;
  
  // We only use the first two characters (e.g., '01d' and '01n' are both sunny)
  const code = iconCode.substring(0, 2);
  const commonStyle = { fontSize: size };

  // --- THIS IS THE FIX: Refined colors and icon choices ---
  switch (code) {
    case '01': // Clear Sky
      return <WbSunnyOutlined sx={{ ...commonStyle, color: '#ffc107' }} />;
    case '02': // Few Clouds
      return <WbCloudyOutlined sx={{ ...commonStyle, color: '#b0bec5' }} />;
    case '03': // Scattered Clouds
    case '04': // Broken Clouds / Overcast
      return <CloudOutlined sx={{ ...commonStyle, color: '#90a4ae' }} />;
    case '09': // Shower Rain
    case '10': // Rain
      return <Grain sx={{ ...commonStyle, color: '#64b5f6' }} />;
    case '11': // Thunderstorm
      return <ThunderstormOutlined sx={{ ...commonStyle, color: '#7e57c2' }} />;
    case '13': // Snow
      return <AcUnitOutlined sx={{ ...commonStyle, color: '#81d4fa' }} />;
    case '50': // Mist / Fog
      return <Dehaze sx={{ ...commonStyle, color: '#b0bec5' }} />;
    default: // Default case
      return <CloudOutlined sx={{ ...commonStyle, color: '#90caf9' }} />;
  }
};