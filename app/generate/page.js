//page for generating flashcards and saving them

"use client";

import { useState } from "react";
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
  CircularProgress
} from "@mui/material";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  setDoc,
  collection,
  doc,
  writeBatch,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Generate() {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [numFlashcards, setNumFlashcards] = useState(10);
  const [setName, setSetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }
    setLoading(true); 

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, numFlashcards }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const createUserDocument = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, { flashcardSets: [] });
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }
    
    const userId = user.id;

    try {
      // Ensure the user document exists
      await createUserDocument(userId);

      // Create a document in the flashcardSets collection
      const setDocRef = doc(db, "flashcardSets", setName);
      await setDoc(setDocRef, { flashcards, userId });

      // Update user document with the new flashcard set
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      router.push("/flashcards");
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  return (
    <Container maxWidth="100vw"
    sx={{ backgroundColor: "#9395D3", minHeight: "100vh", py: 4 }}>
      <AppBar position="static" sx={{ backgroundColor: "#B3B7EE", borderRadius:"8px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="h6"  sx={{ fontWeight: "bold", color: "#FFF" }}>StudyWise</Typography>
            </Link>
          </Box>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "000807" }}>
          Generate Flashcards
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }} >
  <TextField
    value={text}
    onChange={(e) => setText(e.target.value)}
    label="What is your desired topic?"
    fullWidth
    multiline
    rows={4}
    variant="filled"
    sx={{ backgroundColor: '#fff', borderRadius: "12px", flex: '0 1 80%',height: '100%'  }} // 80% width
  />
  <TextField
    label="Number of Flashcards"
    type="number"
    value={numFlashcards}
    onChange={(e) => setNumFlashcards(e.target.value)}
    inputProps={{ min: 1, max: 100 }}
    sx={{ backgroundColor: '#fff', borderRadius: "12px", flex: '0 1 20%', height: '100%'  }} // 20% width
    InputLabelProps={{
      style: {
        color: '#000',
        fontSize: '1.6rem',
        fontWeight: 'bold',
      },
    }}
  />
</Box>
        <Button
          variant="contained"
          sx={{ mt: 2, mr: 2, backgroundColor:"#000807", borderRadius:"12px", p:2, fontWeight:"bold",
            '&:hover':{
              backgroundColor:"#A2A3BB",
              color:'black'
            } }}
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Flashcards"}
        </Button>
      </Box>

      {flashcards.length > 0 && ( //creates grid of cards representing the flashcards front & back
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                    p: 3,
                    backgroundColor: "#FBF9FF",
                    borderRadius: "12px",
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

      {flashcards.length > 0 && ( //saves the flashcards
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            sx={{ mt: 2, mr: 2, backgroundColor:"#000807",
              '&:hover':{
                backgroundColor:"#A2A3BB",
                color:'black'
              } }}
          >
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
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
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
