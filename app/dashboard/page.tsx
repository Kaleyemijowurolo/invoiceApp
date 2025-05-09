"use client";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log(session, "session");
  return (
    <div>
      Dasbaord
      <button onClick={() => signOut()}> SignOut</button>
      {session?.user?.name && (
        <div>
          <h1>Hello {session.user.name}</h1>
          <p>Email: {session.user.email}</p>
        </div>
      )}
    </div>
  );
}
