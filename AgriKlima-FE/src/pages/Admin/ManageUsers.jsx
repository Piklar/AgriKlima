// src/pages/Admin/ManageUsers.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Tooltip, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';

// --- Make sure to import your API and AuthContext ---
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth(); // We need the token for API calls

    const fetchUsers = useCallback(async () => {
        if (!token) return; // Don't fetch if not logged in
        setLoading(true);
        try {
            // --- THIS IS THE FIX ---
            // Call the actual API function to get all users
            const response = await api.getAllUsers();
            
            // Your backend sends { users: [...] }, so we access the nested array
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            } else {
                setUsers([]); // Handle cases where the response is unexpected
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            Swal.fire('Error', 'Could not fetch users from the server.', 'error');
        } finally {
            setLoading(false);
        }
    }, [token]); // Add token as a dependency

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- FUNCTION TO HANDLE THE ADMIN TOGGLE ---
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
                    // Note: Your current API only supports setting as admin (PATCH /:id/setAsAdmin)
                    // To demote, you would need a new backend endpoint (e.g., PATCH /:id/removeAdmin)
                    // For now, we only implement the promotion.
                    if (newIsAdmin) {
                        await api.setAsAdmin(id); // Your api.js needs this function
                        Swal.fire('Success!', 'User has been promoted to Admin.', 'success');
                        fetchUsers(); // Refresh the grid
                    } else {
                        // Placeholder for demotion logic
                        Swal.fire('Info', 'Demoting users is not yet supported in the backend.', 'info');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Could not update user role.', 'error');
                }
            }
        });
    };

    const columns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
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
                    getRowId={(row) => row._id} // Important: Tell DataGrid to use `_id`
                />
            </Paper>
        </Box>
    );
};

export default ManageUsers;