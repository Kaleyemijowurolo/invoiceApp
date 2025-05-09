import {
  // Session,
  DefaultUser,
} from "next-auth";

// Extend the default User interface
declare module "next-auth" {
  interface User extends DefaultUser {
    id?: string;
  }
}

declare module "next-auth" {
  interface Session {
    access_token: string;
    // Add other properties as needed
    user: {
      email: string;
      referral_link?: string;
    } & DefaultUser &
      Session["user"];
  }
}
