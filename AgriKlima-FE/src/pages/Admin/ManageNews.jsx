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
            setNews(response.data || []); // Ensure `news` is always an array
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
        { name: 'title', label: 'Title', required: true },
        { name: 'author', label: 'Author', required: true },
        { name: 'imageUrl', label: 'Image URL', required: true },
        { name: 'content', label: 'Content', required: true, multiline: true, rows: 6 },
    ];

    const columns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'title', headerName: 'Title', width: 350 },
        { field: 'author', headerName: 'Author', width: 200 },
        {
  field: "publicationDate",
  headerName: "Publication Date",
  width: 200,
  valueGetter: (params) => {
    const date = params.row?.publicationDate;
    return date ? new Date(date).toLocaleDateString() : "No date";
  },
},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button size="small" onClick={() => handleOpenEditModal(params.row)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Manage News</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'var(--primary-green)' }} onClick={handleOpenAddModal}>
                    Add New Article
                </Button>
            </Box>
            <Paper sx={{ height: '70vh', width: '100%' }}>
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