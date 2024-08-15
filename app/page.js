"use client"

import {
  AppBar,
  Container,
  Typography,
  Toolbar,
  Grid,
  Button,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { ClerkProvider } from "@clerk/clerk-react";


export default function Home() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Container maxWidth="100vw">
        <Head>
          <title>Flashcard Saas</title>
          <meta name="description" content="Create flashcard from your test" />
        </Head>

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
      </Container>
    </ClerkProvider>
  );
}
