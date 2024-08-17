import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function POST(req) {
  const { userId } = await req.json(); // Read the request body

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // User document does not exist, create it
      await setDoc(userDocRef, { flashcardSets: [] });
      return new Response(
        JSON.stringify({ message: "User document created" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // User document already exists
      return new Response(
        JSON.stringify({ message: "User document already exists" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error creating user document:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
