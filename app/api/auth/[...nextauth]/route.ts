// Import NextAuth with its type from "next-auth" package
import NextAuth from "next-auth";

// Assuming options is defined with the appropriate type in './options'
import { options } from "./options";

// Declare handler with the type for a NextAuth instance
const handler = NextAuth(options);

// Export the handler for GET and POST HTTP methods
export { handler as GET, handler as POST };
