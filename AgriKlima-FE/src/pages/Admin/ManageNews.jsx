// src/pages/Admin/ManageNews.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentNews, setCurrentNews] = useState(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.getNews();
            setNews(response.data || []);
        } catch (error) {
            console.error("Failed to fetch news:", error);
            Swal.fire('Error', 'Could not fetch news from the server.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setCurrentNews(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (newsArticle) => {
        setModalMode('edit');
        setCurrentNews(newsArticle);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentNews(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (modalMode === 'add') {
                await api.addNews(formData);
            } else {
                await api.updateNews(currentNews._id, formData);
            }
            Swal.fire('Success', `News article ${modalMode === 'add' ? 'created' : 'updated'}!`, 'success');
            handleCloseModal();
            fetchNews();
        } catch (error) {
            Swal.fire('Error', `Failed to save the article: ${error.response?.data?.error || ''}`, 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.deleteNews(id);
                    Swal.fire('Deleted!', 'The news article has been deleted.', 'success');
                    fetchNews();
                } catch (error) {
                    Swal.fire('Error', `Failed to delete the article: ${error.response?.data?.error || ''}`, 'error');
                }
            }
        });
    };

    const newsFields = [
        { name: 'title', label: 'Title', required: true, group: 'Article Content' },
        { name: 'author', label: 'Author', required: true, group: 'Article Content' },
        { name: 'imageUrl', label: 'Image URL', required: true, group: 'Article Content' },
        { name: 'content', label: 'Full Article Content', required: true, type: 'textarea', rows: 12, group: 'Article Content' },
        { name: 'summary.keyPoints', label: 'Key Points (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'AI Summary Details' },
        { name: 'summary.quotes', label: 'Notable Quotes (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'AI Summary Details' },
        { name: 'summary.impact', label: 'Expected Impact', type: 'textarea', rows: 4, group: 'AI Summary Details' },
    ];

    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'author', headerName: 'Author', width: 200 },
        {
            field: "publicationDate",
            headerName: "Publication Date",
            width: 200,
            // --- THIS IS THE FIX ---
            valueGetter: (value, row) => new Date(row.publicationDate).toLocaleDateString(),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleOpenEditModal(params.row)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Manage News</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)'} }} 
                    onClick={handleOpenAddModal}
                >
                    Add New Article
                </Button>
            </Box>
            <Paper sx={{ height: '75vh', width: '100%' }}>
                <DataGrid
                    rows={news}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                />
            </Paper>
            <AdminFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialData={currentNews}
                mode={modalMode}
                title={modalMode === 'add' ? 'Add New Article' : 'Edit Article'}
                fields={newsFields}
            />
        </Box>
    );
};

export default ManageNews;