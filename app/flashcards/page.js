//Page of regenerated/saved flashcards from the firebase database

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
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;

      try {
        setLoading(true);
        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const flashcardSetsData = userDocSnap.data().flashcardSets || []; // Get flashcard sets from user data
          console.log("Flashcard sets data:", flashcardSetsData);

          // Convert the object to an array of set names
          const flashcardSetsArray = Object.values(flashcardSetsData).map(
            (set) => set.name
          );
          console.log("Flashcard sets names:", flashcardSetsArray);

          setFlashcardSets(flashcardSetsArray); // Update state with the array of set names
        } else {
          console.log("No user document found."); // Log if user document does not exist
        }
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        setError(
          "Failed to fetch flashcard sets. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && isSignedIn) {
      getFlashcardSets();
    }
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    async function getFlashcardsForSet() {
      if (!selectedSet) return;

      try {
        setLoading(true);
        const docRef = doc(db, "flashcardSets", selectedSet);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const flashcardsData = docSnap.data().flashcards || [];
          if (Array.isArray(flashcardsData)) {
            setFlashcards(flashcardsData);
          } else {
            console.warn(
              "Expected flashcards field to be an array:",
              flashcardsData
            );

          }
        } else {
          console.warn("No document found for set:", selectedSet);
        }
      } catch (error) {
        console.error("Error fetching flashcards for set:", error);
        setError(
          "Failed to fetch flashcards. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    getFlashcardsForSet();
  }, [selectedSet]);

  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSetClick = (setName) => {
    setSelectedSet(setName);
  };

  const handleBackClick = () => {
    setSelectedSet(null);
    setFlashcards([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        backgroundImage: 'url(background.jpg)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: 4,
      }}
    >
      <AppBar
        position="static"
        sx={{ backgroundColor: '#6A1B9A', boxShadow: 'none' }} // Updated to match purple theme
      >
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

      {selectedSet ? (
        <>
          <Button
            onClick={handleBackClick}
            variant="outlined"
            sx={{
              mt: 4,
              color: '#6A1B9A', // Matching purple color
              borderColor: '#6A1B9A',
              backgroundColor: 'white',
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
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
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
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        transition: '0.6s',
                        transformStyle: 'preserve-3d',
                        transform: flipped[index]
                          ? 'rotateY(180deg)'
                          : 'rotateY(0deg)',
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
                          flexDirection: 'column',
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
                          flexDirection: 'column',
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
              <Typography
                variant="h6"
                sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
              >
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
                <Card
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
                  <CardActionArea onClick={() => handleSetClick(setName)}>
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
            <Typography
              variant="h6"
              sx={{ mt: 4, color: 'white', display: 'flex', justifyContent: 'center',  padding: '30px',
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
              No flashcard sets found. Create a new flashcard set.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}
