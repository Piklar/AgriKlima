// src/pages/Admin/ManageUsers.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  Tooltip,
  Avatar,
  TextField,
  InputAdornment,
  Pagination,
  useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const isSmall = useMediaQuery('(max-width:600px)');

  // --- NEW STATE for search and pagination ---
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await api.getAllUsers({ search, page, limit: 10 });
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } else {
        setUsers([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Swal.fire('Error', 'Could not fetch users from the server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, search, page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers();
    }, 500); // debounce
    return () => clearTimeout(handler);
  }, [fetchUsers]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSetAdmin = async (id, newIsAdmin) => {
    Swal.fire({
      title: `Confirm Role Change`,
      text: `Are you sure you want to ${newIsAdmin ? 'promote' : 'demote'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change role!',
      cancelButtonText: 'No, cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (newIsAdmin) {
            await api.setAsAdmin(id);
            Swal.fire('Success!', 'User has been promoted to Admin.', 'success');
            fetchUsers();
          } else {
            Swal.fire('Info', 'Demoting users from admin status is not yet supported.', 'info');
          }
        } catch (error) {
          Swal.fire('Error', 'Could not update user role.', 'error');
        }
      }
    });
  };

  const columns = [
    {
      field: 'profilePictureUrl',
      headerName: 'Profile',
      width: 80,
      renderCell: (params) => (
        <Avatar src={params.value} sx={{ width: 40, height: 40 }} />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'firstName', headerName: 'First Name', minWidth: 120, flex: 1 },
    { field: 'lastName', headerName: 'Last Name', minWidth: 120, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 150, flex: 1 },
    {
      field: 'isAdmin',
      headerName: 'Admin',
      width: 120,
      renderCell: (params) => (
        <Tooltip title={params.value ? 'Admin' : 'Regular User'}>
          <Switch
            checked={params.value}
            onChange={(e) => handleSetAdmin(params.row._id, e.target.checked)}
            color="primary"
          />
        </Tooltip>
      )
    },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          textAlign: isSmall ? 'center' : 'left'
        }}
      >
        Manage Users
      </Typography>

      {/* --- NEW SEARCH BAR --- */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          rowHeight={isSmall ? 60 : 70}
          paginationMode="server"
          rowCount={totalPages * 10}
          hideFooter
        />
      </Paper>

      {/* --- NEW PAGINATION CONTROLS --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ManageUsers;
