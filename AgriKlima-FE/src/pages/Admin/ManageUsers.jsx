// src/pages/Admin/ManageUsers.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Switch, Tooltip, Avatar } from '@mui/material'; // Import Avatar
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const fetchUsers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await api.getAllUsers();
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            Swal.fire('Error', 'Could not fetch users from the server.', 'error');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                        // This would require a new backend endpoint to set isAdmin to false
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
              <Avatar 
                src={params.value} 
                sx={{ width: 40, height: 40 }} 
              />
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'isAdmin',
            headerName: 'Admin',
            width: 120,
            renderCell: (params) => (
                <Tooltip title={params.value ? "Admin" : "Regular User"}>
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
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Manage Users</Typography>
            <Paper sx={{ height: '75vh', width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                />
            </Paper>
        </Box>
    );
};

export default ManageUsers;