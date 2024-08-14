'use client'

import { Box, Button, Stack, TextField,Typography } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your personal mental health assistant",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return  // Prevent sending empty messages
  
    const newMessage = message.trim()
    setMessage('')  // Clear the input field
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: newMessage },  // Add the user's message
      { role: 'assistant', content: '' },  // Placeholder for the assistant's response
    ])

  
    try {

      const response = await fetch('/api', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: newMessage }]),
      })
  
      if (!response.ok) {
        alert(newMessage)
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
  
        const text = decoder.decode(value, { stream: true })
        result += text
  
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1]
          const otherMessages = prevMessages.slice(0, -1)
          return [
            ...otherMessages,
            { ...lastMessage, content: result },  // Update the assistant's message
          ]
       })
      }
    } catch (error) {
      alert(error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: "I'm sorry, but I encountered an error. Please try again later.",
        },
      ])
    }
  }
  
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        border="1px solid #ccc"
        borderRadius="12px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        bgcolor="white"
        p={3}
        spacing={3}
      >
        <Typography
          variant="h5"
          component="div"
          align="center"
          color="green"
          gutterBottom
        >
          YOURS TRULY
        </Typography>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          padding={1}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? '#1976d2' // primary.main
                    : '#dc004e' // secondary.main
                }
                color="white"
                borderRadius="12px"
                p={2}
                maxWidth="80%"
                boxShadow="0 2px 6px rgba(0, 0, 0, 0.15)"
                fontSize="0.9rem"
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Type your message..."
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{
              boxShadow: "0 3px 5px rgba(0, 0, 0, 0.15)",
              padding: "8px 16px",
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
  
  


}
