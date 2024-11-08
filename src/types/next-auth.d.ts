import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      walletAddress: string;
    };
  }

  interface User {
    id: string;
    walletAddress: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    walletAddress?: string;
  }
}
