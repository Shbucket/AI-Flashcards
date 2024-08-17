"use client";

import {
  AppBar,
  Container,
  Typography,
  Toolbar,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link component
export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (user) {
      try {
        const response = await fetch("/api/createUserDocument/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (response.ok) {
          // Redirect the user to the next screen only if the document creation or verification is successful
          router.push("/generate");
        } else {
          console.error("Failed to create or verify user document");
          alert("Failed to create or verify your account. Please try again later.");
        }
      } catch (error) {
        console.error("Error in handleGetStarted:", error);
        alert("An error occurred. Please try again later.");
      }
    } else {
      console.error("No user found");
      alert("You must be logged in to proceed. Please sign in.");
      // Optionally redirect to login
      router.push("/sign-in");
    }
  };
  const handleFlashcards = () => {
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6">
              Flashcard SaaS
            </Typography>
          </Link>
        </Box>
        <Box>
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
        </Box>
      </Toolbar>
    </AppBar>

      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        {user && (
          <Box sx={{ my: 4 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
              onClick={handleGetStarted}
            >
              Generate
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleFlashcards}
            >
              Flashcards
            </Button>
          </Box>
        )}
      </Box>

      {/* Remove the Features and Pricing sections for signed-in users */}
      {!user && (
        <>
          <Box sx={{ my: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Features
            </Typography>
            <Grid container spacing={4}>
              {/* Feature items */}
            </Grid>
          </Box>

        </>
      )}
    </Container>
  );
}