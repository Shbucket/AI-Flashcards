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
  const [flashcardSets, setFlashcardSets] = useState([]); // State for storing flashcard sets
  const [selectedSet, setSelectedSet] = useState(null); // State for storing the selected flashcard set
  const [flashcards, setFlashcards] = useState([]); // State for storing flashcards of the selected set
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [flipped, setFlipped] = useState({}); // State for tracking flipped flashcards
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  // Fetches the user's flashcard sets from Firestore
  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return; // Exit if user is not available

      try {
        setLoading(true); // Set loading to true while fetching
        const userDocRef = doc(db, "users", user.id); // Reference to the user's document
        const userDocSnap = await getDoc(userDocRef); // Get the document snapshot

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
        setError("Failed to fetch flashcard sets. Please try again later."); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }

    if (isLoaded && isSignedIn) {
      getFlashcardSets(); // Fetch flashcard sets if user is signed in and loaded
    }
  }, [user, isLoaded, isSignedIn]);

  // Fetches flashcards for the selected set
  useEffect(() => {
    async function getFlashcardsForSet() {
      if (!selectedSet) return; // Exit if no set is selected

      try {
        setLoading(true); // Set loading to true while fetching
        const docRef = doc(db, "flashcardSets", selectedSet); // Reference to the flashcard set document
        const docSnap = await getDoc(docRef); // Get the document snapshot

        if (docSnap.exists()) {
          const flashcardsData = docSnap.data().flashcards || []; // Get flashcards from the document
          console.log("Flashcards data for set:", selectedSet, flashcardsData);

          // Ensure flashcardsData is an array
          if (Array.isArray(flashcardsData)) {
            setFlashcards(flashcardsData); // Update state with the flashcards
          } else {
            console.warn(
              "Expected flashcards field to be an array:",
              flashcardsData
            ); // Warn if data is not an array
          }
        } else {
          console.warn("No document found for set:", selectedSet); // Warn if document does not exist
        }
      } catch (error) {
        console.error("Error fetching flashcards for set:", error);
        setError("Failed to fetch flashcards. Please try again later."); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }

    getFlashcardsForSet(); // Fetch flashcards when a set is selected
  }, [selectedSet]);

  // Toggles the flip state of a flashcard when clicked
  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the flip state for the specific card index
    }));
  };

  // Handles the click on a flashcard set to select it
  const handleSetClick = (setName) => {
    setSelectedSet(setName); // Set the selected set name
  };

  // Handles the back button click to go back to the list of flashcard sets
  const handleBackClick = () => {
    setSelectedSet(null); // Clear the selected set
    setFlashcards([]); // Clear the flashcards
  };

  // Display loading or error messages

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container maxWidth="100vw"
    sx={{ backgroundColor: "#9395D3", minHeight: "100vh", py: 4 }}>
      <AppBar position="static"  sx={{ backgroundColor: "#B3B7EE", borderRadius:"8px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF" }}>
                StudyWise
              </Typography>
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
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 2, backgroundColor:"#000807",
              '&:hover':{
                backgroundColor:"#A2A3BB",
                color:'black'
              } }}
          >
            Back to Sets
          </Button>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.length > 0 ? (
              flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => handleCardClick(index)} // Use index as the identifier for the card
                    sx={{
                      p: 3,
                    backgroundColor: "#FBF9FF",
                    borderRadius: "12px",
                      position: "relative",
                      perspective: "1000px",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                       
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        transition: "0.6s",
                        transformStyle: "preserve-3d",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)", // Rotate card based on flip state
                      }}
                    >
                      <Box
                        sx={{
                        
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "white",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.front} {/* Front side of the flashcard */}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p:1,
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)", // Rotate to back side of the card
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "white",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.back} {/* Back side of the flashcard */}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="h6"
                sx={{ mt: 4, display: "flex", justifyContent: "center" }}
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
                <Card sx={{borderRadius:"12px"}}>
                  <CardActionArea onClick={() => handleSetClick(setName)}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {setName} {/* Display the name of the flashcard set */}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ mt: 4, display: "flex", justifyContent: "center" }}
            >
              No flashcard sets found. Create a new flashcard set.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}
