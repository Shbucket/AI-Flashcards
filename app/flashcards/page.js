"use client";

import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, collection, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]); // Flashcard sets
  const [selectedSet, setSelectedSet] = useState(null); // Currently selected set
  const [flashcards, setFlashcards] = useState([]); // Flashcards in the selected set
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  // Fetches the user's flashcard sets
  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;

      try {
        setLoading(true);
        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const flashcardSetsData = userDocSnap.data().flashcardSets || [];
          console.log("Flashcard sets data:", flashcardSetsData);

          // Convert the object to an array of set names
          const flashcardSetsArray = Object.values(flashcardSetsData).map(set => set.name);
          console.log("Flashcard sets names:", flashcardSetsArray);

          setFlashcardSets(flashcardSetsArray);
        } else {
          console.log('No user document found.');
        }
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        setError("Failed to fetch flashcard sets. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && isSignedIn) {
      getFlashcardSets();
    }
  }, [user, isLoaded, isSignedIn]);

  // Fetches flashcards for a selected set
  useEffect(() => {
    async function getFlashcardsForSet() {
      if (!selectedSet) return;

      try {
        setLoading(true);
        const docRef = doc(db, "flashcardSets", selectedSet);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const flashcardsData = docSnap.data().flashcards || [];
          console.log("Flashcards data for set:", selectedSet, flashcardsData);

          // Ensure flashcardsData is an array
          if (Array.isArray(flashcardsData)) {
            setFlashcards(flashcardsData);
          } else {
            console.warn("Expected flashcards field to be an array:", flashcardsData);
          }
        } else {
          console.warn("No document found for set:", selectedSet);
        }
      } catch (error) {
        console.error("Error fetching flashcards for set:", error);
        setError("Failed to fetch flashcards. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    getFlashcardsForSet();
  }, [selectedSet]);

  // Toggles the flip state of a flashcard when its clicked
  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the flip state for the specific card index
    }));
  };

  const handleSetClick = (setName) => {
    setSelectedSet(setName);
  };

  const handleBackClick = () => {
    setSelectedSet(null);
    setFlashcards([]); // Clear flashcards when going back to the list
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }} href='/generate'>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-in">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
            <Button color="inherit" href="/generate">Create</Button>
          </SignedIn>
        </Toolbar>
      </AppBar>

      {selectedSet ? (
        <>
          <Button onClick={handleBackClick} variant="outlined" color="primary" sx={{ mt: 4 }}>
            Back to Sets
          </Button>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.length > 0 ? (
              flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => handleCardClick(index)}
                    sx={{
                      position: 'relative',
                      perspective: '1000px',
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        transition: '0.6s',
                        transformStyle: 'preserve-3d',
                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                No flashcards found in this set.
              </Typography>
            )}
          </Grid>
        </>
      ) : (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcardSets.length > 0 ? (
            flashcardSets.map((setName) => (
              <Grid item xs={12} sm={6} md={4} key={setName}>
                <Card>
                  <CardActionArea onClick={() => setSelectedSet(setName)}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {setName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              No flashcard sets found. Create a new flashcard set.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}