import Credentials from "next-auth/providers/credentials";

import NextAuth, { Session, User } from "next-auth";
import { db } from "../prisma";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Ethereum",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.walletAddress) {
          throw new Error("No wallet address provided");
        }
        const walletAddress = credentials.walletAddress as string;

        // 查找或创建用户 profile
        const profile = await db.profile.upsert({
          where: {
            walletAddress: walletAddress.toLowerCase(),
          },
          update: {
            updatedAt: new Date(),
          },
          create: {
            walletAddress: walletAddress.toLowerCase(),
          },
        });

        if (!profile) {
          throw new Error("Profile not found");
        }

        // 返回用户信息给 session
        return {
          id: profile.id,
          walletAddress: profile.walletAddress,
        };
      },
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      // 将用户信息添加到 session 中
      return {
        ...session,
        expires: session.expires,
        user: {
          ...session.user,
          id: token.sub ?? "",
          walletAddress: token.walletAddress ?? "",
        },
      };
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.walletAddress = user.walletAddress;
      }
      return token;
    },
  },
  pages: {
    signIn: "/", // 自定义登录页面路径
  },
  session: {
    strategy: "jwt",
  },
});
