// src/utils/weatherIcons.js
import React from 'react';
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined';
import CloudOutlined from '@mui/icons-material/CloudOutlined';
import Grain from '@mui/icons-material/Grain';
import ThunderstormOutlined from '@mui/icons-material/ThunderstormOutlined';
import AcUnitOutlined from '@mui/icons-material/AcUnitOutlined';
import Dehaze from '@mui/icons-material/Dehaze';
import WbCloudyOutlined from '@mui/icons-material/WbCloudyOutlined';

export const getWeatherIcon = (iconCode, size = '2.5rem') => {
  if (!iconCode) return <CloudOutlined sx={{ fontSize: size, color: '#90caf9' }} />;
  const code = iconCode.substring(0, 2);
  const commonStyle = { fontSize: size };
  switch (code) {
    case '01': return <WbSunnyOutlined sx={{ ...commonStyle, color: '#ffc107' }} />;
    case '02': return <WbCloudyOutlined sx={{ ...commonStyle, color: '#b0bec5' }} />;
    case '03': case '04': return <CloudOutlined sx={{ ...commonStyle, color: '#90a4ae' }} />;
    case '09': case '10': return <Grain sx={{ ...commonStyle, color: '#64b5f6' }} />;
    case '11': return <ThunderstormOutlined sx={{ ...commonStyle, color: '#7e57c2' }} />;
    case '13': return <AcUnitOutlined sx={{ ...commonStyle, color: '#81d4fa' }} />;
    case '50': return <Dehaze sx={{ ...commonStyle, color: '#b0bec5' }} />;
    default: return <CloudOutlined sx={{ ...commonStyle, color: '#90caf9' }} />;
  }
};