import React from "react";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import {
  SignIn,
  SignInButton,
  SignedOut,
  SignedIn,
  UserButton,
  ClerkProvider,
} from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Container maxWidth="100vw" sx={{ backgroundColor: "#9395D3", minHeight: "100vh", py: 4 }} >
      <AppBar position="static" sx={{  backgroundColor: "#B3B7EE", borderRadius:"8px" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1,fontWeight:"bold" }}>
          StudyWise
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", my: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#FFF" }}>
          Sign In
        </Typography>
        <SignedOut>
          <SignIn />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Box>
    </Container>
  );
}
