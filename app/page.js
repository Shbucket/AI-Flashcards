"use client";

import {
  AppBar,
  Container,
  Typography,
  Toolbar,
  Grid,
  Button,
  Box,
  Paper,
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
          alert(
            "Failed to create or verify your account. Please try again later."
          );
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
  const handleFlashcards = async () => {
    if (user) {
      try {
        const response = await fetch("/api/createUserDocument/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (response.ok) {
          // Redirect the user to the next screen only if the document creation or verification is successful
          router.push("/flashcards");
        } else {
          console.error("Failed to create or verify user document");
          alert(
            "Failed to create or verify your account. Please try again later."
          );
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

  return (
    <Container
      maxWidth="100vw"
      sx={{ backgroundColor: "#9395D3", minHeight: "100vh", py: 4 }}
    >
      <Head>
        <title>StudyWise</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: "#B3B7EE", borderRadius:"8px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#FFF" }}
              >
                StudyWise
              </Typography>
            </Link>
          </Box>
          <Box>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: "center", my: 4, fontWeight: "bold", color: "#000807" }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to StudyWise
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
          <Box sx={{ my: 4 }}>
            <Button
              variant="contained"
              sx={{ mt: 2, mr: 2, backgroundColor:"#000807",
                '&:hover':{
                  backgroundColor:"#A2A3BB",
                  color:'black'
                } }}
              onClick={handleGetStarted}
            >
              Generate
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor:"#000807",
                '&:hover':{
                  backgroundColor:"#A2A3BB",
                  color:'black'
                }
              }}
              onClick={handleFlashcards}
            >
              Flashcards
            </Button>
          </Box>
      </Box>

      {/* Remove the Features and Pricing sections for signed-in users */}
      {!user && (
        <>
          <Box sx={{ my: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "#000807",
                fontWeight: "bold",
              }}
            >
              Features
            </Typography>
            <Grid container spacing={4}>
              {/* Feature items */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "#FBF9FF",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="h6" component="h3" gutterBottom>
                    Generative AI Flashcards
                  </Typography>
                  <Typography>
                    Automatically generate flashcards based on any topic you
                    provide. This feature uses Llama 3.1 to understand your
                    input and create meaningful flashcards.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "#FBF9FF",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="h6" component="h3" gutterBottom>
                    Create 10 Flashcards per Topic
                  </Typography>
                  <Typography>
                    Once you provide a topic, the AI will generate 10
                    high-quality flashcards that you can use to study and master
                    the subject matter more efficiently.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "#FBF9FF",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="h6" component="h3" gutterBottom>
                    Powered by Llama 3.1
                  </Typography>
                  <Typography>
                    Our system is built using the latest Llama 3.1 AI model,
                    ensuring that the flashcards are accurate and provide
                    detailed information for in-depth learning.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
}
