// src/components/ChatbotOverlay.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import * as api from '../services/api';

const ChatbotOverlay = ({ open, onClose }) => {
    // State now follows the Gemini API format: { role: 'user'/'model', parts: [{ text: '...' }] }
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: 'Hello! I am KlimaBot. How can I help you with your farming needs today?' }] }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Effect to auto-scroll to the newest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessageText = inputValue;
        const newUserMessage = { role: 'user', parts: [{ text: userMessageText }] };

        // Add user's message to UI and clear input field
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        // --- THE CONVERSATION HISTORY FIX ---
        // We prepare the history by taking the current message list.
        // We slice(1) to remove the initial "Hello!" message from the context, keeping it clean.
        const chatHistory = messages.slice(1).map(msg => ({
            role: msg.role,
            parts: msg.parts,
        }));

        try {
            const response = await api.sendMessageToBot({
                message: userMessageText,
                history: chatHistory
            });

            const botMessage = { role: 'model', parts: [{ text: response.data.response }] };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            const errorMessageText = error.response?.data?.error || 'Sorry, I am having trouble connecting. Please try again later.';
            const errorMessage = { role: 'model', parts: [{ text: errorMessageText }] };
            setMessages(prev => [...prev, errorMessage]);
            console.error("Chatbot API error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: { xs: 16, md: 100 },
                right: { xs: 16, md: 40 },
                width: '90%',
                maxWidth: '400px',
                height: '60vh',
                maxHeight: '600px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 1300
            }}
        >
            <Box sx={{ p: 2, bgcolor: 'var(--primary-green)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon /> KlimaBot
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f9fafb' }}>
                {messages.map((msg, index) => (
                    <Box key={index} sx={{ mb: 2, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <Paper
                            elevation={1}
                            sx={{
                                p: 1.5,
                                borderRadius: '16px',
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.200',
                                color: msg.role === 'user' ? 'white' : 'black',
                                maxWidth: '80%',
                                whiteSpace: 'pre-wrap' // Ensures proper line breaks from AI
                            }}
                        >
                            {msg.parts[0].text}
                        </Paper>
                    </Box>
                ))}
                {isLoading && <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}><CircularProgress size={24} /></Box>}
                <div ref={messagesEndRef} />
            </Box>

            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} sx={{ p: 1, display: 'flex', gap: 1, borderTop: '1px solid #eee' }}>
                <TextField fullWidth variant="outlined" size="small" placeholder="Ask about crops, pests..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={isLoading}>Send</Button>
            </Box>
        </Paper>
    );
};

export default ChatbotOverlay;