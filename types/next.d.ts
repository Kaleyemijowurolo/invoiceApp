import "next/server";

declare module "next/server" {
  interface NextRequest {
    user?: {
      id: string; // or any other fields you include in your JWT payload
      // Add other properties that are part of the decoded token if needed
    };
  }
}
