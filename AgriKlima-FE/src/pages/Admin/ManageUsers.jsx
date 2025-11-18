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
    useMediaQuery,
    Button, // <-- Merged
    Chip // <-- Merged
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import UserDetailModal from '../../components/UserDetailModal'; // <-- Merged

// ✨ SweetAlert2 agricultural-themed styling
const styleSweetAlert = () => {
    const popup = Swal.getPopup();
    if (popup) {
        popup.style.borderRadius = '20px';
        popup.style.padding = '30px';
        popup.style.boxShadow = '0 6px 25px rgba(46, 125, 50, 0.4)';
    }

    const confirmBtn = Swal.getConfirmButton();
    if (confirmBtn) {
        confirmBtn.style.backgroundColor = '#66bb6a';
        confirmBtn.style.color = 'white';
        confirmBtn.style.fontWeight = '600';
        confirmBtn.style.padding = '10px 25px';
        confirmBtn.style.borderRadius = '8px';
        confirmBtn.style.margin = '5px';
        confirmBtn.style.border = 'none';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.style.transition = '0.3s';
        confirmBtn.onmouseover = () => (confirmBtn.style.backgroundColor = '#4caf50');
        confirmBtn.onmouseout = () => (confirmBtn.style.backgroundColor = '#66bb6a');
    }

    const cancelBtn = Swal.getCancelButton();
    if (cancelBtn) {
        cancelBtn.style.backgroundColor = '#ffffff';
        cancelBtn.style.color = '#2e7d32';
        cancelBtn.style.fontWeight = '600';
        cancelBtn.style.padding = '10px 25px';
        cancelBtn.style.borderRadius = '8px';
        cancelBtn.style.margin = '5px';
        cancelBtn.style.border = '1px solid #a5d6a7';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.style.transition = '0.3s';
        cancelBtn.onmouseover = () => (cancelBtn.style.backgroundColor = '#e8f5e9');
        cancelBtn.onmouseout = () => (cancelBtn.style.backgroundColor = '#ffffff');
    }
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const isSmall = useMediaQuery('(max-width:600px)');

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // --- MERGED: State for the detail modal ---
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // 📥 Fetch users
    const fetchUsers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            // NOTE: The backend endpoint called here (api.getAllUsers) must now be configured 
            // to automatically populate the 'userCrops' field (which contains varietyId) for this to work.
            const response = await api.getAllUsers({ search, page, limit: 10 }); 
            // Use nullish coalescing to safely access data
            setUsers(response.data?.users || []);
            setTotalPages(response.data?.totalPages || 0);

        } catch (error) {
            Swal.fire({
                title: '❌ Error',
                text: 'Could not fetch users from the server.',
                icon: 'error',
                background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                color: '#2e7d32',
                didOpen: styleSweetAlert
            });
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

    const handlePageChange = (event, value) => setPage(value);

    // 🔄 Promote/Demote Admin
    const handleSetAdmin = (id, newIsAdmin) => {
        Swal.fire({
            title: `Confirm Role Change`,
            text: `Are you sure you want to ${newIsAdmin ? 'promote' : 'demote'} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, change role!',
            cancelButtonText: 'No, cancel',
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            color: '#2e7d32',
            didOpen: styleSweetAlert
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if (newIsAdmin) {
                        await api.setAsAdmin(id);
                        Swal.fire({
                            title: '🌿 Success!',
                            text: 'User has been promoted to Admin.',
                            icon: 'success',
                            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                            color: '#2e7d32',
                            didOpen: styleSweetAlert
                        });
                        fetchUsers();
                    } else {
                        // Placeholder/simulated logic for demotion based on the initial code
                        Swal.fire({
                            title: 'ℹ️ Info',
                            text: 'Demoting users from admin status is not currently implemented in the API.',
                            icon: 'info',
                            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                            color: '#2e7d32',
                            didOpen: styleSweetAlert
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: '❌ Error',
                        text: 'Could not update user role.',
                        icon: 'error',
                        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                        color: '#2e7d32',
                        didOpen: styleSweetAlert
                    });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Revert the switch state visually if the user cancels promotion
                if (newIsAdmin) {
                    setUsers(prevUsers => prevUsers.map(user => 
                        user._id === id ? { ...user, isAdmin: false } : user
                    ));
                }
            }
        });

        // Optimistically update the state for promotion attempt (will be corrected on failure)
        if (newIsAdmin) {
            setUsers(prevUsers => prevUsers.map(user => 
                user._id === id ? { ...user, isAdmin: true } : user
            ));
        }
    };

    // --- MERGED: Handlers for the detail modal ---
    const handleOpenDetailModal = (userId) => {
        setSelectedUserId(userId);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedUserId(null);
    };


    const columns = [
        {
            field: 'profilePictureUrl',
            headerName: 'Profile',
            width: 80,
            renderCell: (params) => <Avatar src={params.value} sx={{ width: 40, height: 40 }} />,
            sortable: false,
            filterable: false,
        },
        { field: 'firstName', headerName: 'First Name', minWidth: 120, flex: 1 },
        { field: 'lastName', headerName: 'Last Name', minWidth: 120, flex: 1 },
        { field: 'email', headerName: 'Email', minWidth: 150, flex: 1.5 },
        { field: 'location', headerName: 'Municipality', minWidth: 150, flex: 1 },
        
        // --- MERGED: NEW COLUMN - CROPS PLANTED ---
        {
            field: 'userCrops',
            headerName: 'Crops Planted',
            minWidth: 180,
            flex: 1.5,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 0.5 }}>
                    {params.value?.map(userCrop => (
                        <Chip 
                            key={userCrop._id} 
                            // Access the nested parent crop name
                            label={userCrop.varietyId?.parentCrop?.name || 'Unknown'} 
                            size="small" 
                            sx={{height: '24px'}}
                        />
                    ))}
                </Box>
            )
        },
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
        // --- MERGED: ACTIONS COLUMN ---
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    // Open the new detail modal on click
                    onClick={() => handleOpenDetailModal(params.row._id)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
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

            {/* Search */}
            <Paper sx={{ mb: 2, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset to page 1 on new search
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

            {/* Table */}
            <Paper sx={{ height: '70vh', width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                    // Increased row height for chips display
                    rowHeight={isSmall ? 80 : 70} 
                    paginationMode="server"
                    rowCount={totalPages * 10} 
                    hideFooter 
                    sx={{
                        '& .MuiDataGrid-cell': { py: 1 },
                        '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f0f4f0' },
                    }}
                />
            </Paper>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    disabled={loading || totalPages <= 1}
                />
            </Box>

            {/* --- MERGED: Render the new modal --- */}
            <UserDetailModal
                open={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                userId={selectedUserId}
            />
        </Box>
    );
};

export default ManageUsers;