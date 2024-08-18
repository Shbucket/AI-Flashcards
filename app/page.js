//Home Page
"use client";


import React from 'react';
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
    <Container maxWidth="100vw" disableGutters sx={{
      backgroundImage: 'url(/background.jpg)', // Use your uploaded image path here
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#fff', // White text for dark backgrounds
    }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
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

      <Box sx={{ textAlign: 'center', my: 4, py: 10 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold',
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
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ maxWidth: '600px', margin: '0 auto',
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
          The easiest way to create flashcards from your text.
        </Typography>
        {user && (
          <Box sx={{ my: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, mr: 2, 
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
              onClick={handleGetStarted}
            >
              Generate
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2, color: '#fff', borderColor: '#fff',
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
              onClick={handleFlashcards}
            >
              Flashcards
            </Button>
          </Box>
        )}
      </Box>

      {!user && (
        <Box sx={{ py: 6, backgroundColor: 'rgba(0, 0, 0, 0.6)', textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom
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
            Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" gutterBottom
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
                Generative AI Flashcards
              </Typography>
              <Typography
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
                Automatically generate flashcards based on any topic you provide. 
                This feature uses Llama 3.1 to understand your input and create meaningful flashcards.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" gutterBottom
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
                Create 10 Flashcards per Topic
              </Typography>
              <Typography
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
                Once you provide a topic, the AI will generate 10 high-quality flashcards that you can use 
                to study and master the subject matter more efficiently.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" gutterBottom
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
                Powered by Llama 3.1
              </Typography>
              <Typography
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
                Our system is built using the latest Llama 3.1 AI model, ensuring that the flashcards are accurate 
                and provide detailed information for in-depth learning.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}