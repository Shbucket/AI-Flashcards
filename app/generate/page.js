//page for generating flashcards and saving them

"use client";

import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  DialogTitle,
  DialogContentText,
} from '@mui/material';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { setDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Generate() {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  const createUserDocument = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, { flashcardSets: [] });
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }
    if (!user) {
      alert('You must be logged in to save flashcards.');
      return;
    }

    const userId = user.id;

    try {
      await createUserDocument(userId);

      const setDocRef = doc(db, 'flashcardSets', setName);
      await setDoc(setDocRef, { flashcards, userId });

      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      await batch.commit();

      alert('Flashcards saved successfully!');
      handleCloseDialog();
      router.push('/flashcards');
      setSetName('');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

  return (
    <Container
      maxWidth="md"
      disableGutters
      sx={{
        backgroundImage: 'url(background.jpg)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: '#fff', // White text for dark backgrounds
        padding: 4,
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6">AI Flashcards</Typography>
            </Link>
          </Box>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-in">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom
                  sx={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
        >
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          InputLabelProps={{
            sx: {
              fontSize: [22, "!important"],
              fontWeight: 'bold', // Make the label bold
              color: 'gray', // Make the label gray
            },
          }}
          sx={{   
            mb: 2, 
            backgroundColor: '#fff', 
            borderRadius: 1 ,
            animation: 'fadeInUp 0.6s ease-out forwards',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
          }}
        />
        <Button
          variant="contained"
          color="secondary" // Use the same purple color
          onClick={handleSubmit}
          fullWidth
          sx={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
        >
          Generate Flashcards
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom
                  sx={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
          >
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: '#fff', borderRadius: 2,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                 }}>
                  <CardContent>
                    <Typography variant="h6">Front:</Typography>
                    <Typography>{flashcard.front}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Back:
                    </Typography>
                    <Typography>{flashcard.back}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle
                  sx={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
        >Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText
                  sx={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
          >Please enter a name for your flashcard set.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
