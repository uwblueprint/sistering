import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";

import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import schema from "./graphql";

const prisma = new PrismaClient();

const CORS_ALLOW_LIST = ["http://localhost:3000"];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const app = express();
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
});

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { origin: CORS_ALLOW_LIST, credentials: true },
});

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});

async function main() {
  await prisma.$connect();
  console.log("Successfully connected to DB using Prisma!");
}

main()
  .catch((e) => {
    // e should be a PrismaClientInitializationError if connection fails
    console.error("Error connecting to DB using Prisma!");
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

app.listen({ port: 5000 }, () => {
  /* eslint-disable-next-line no-console */
  console.info("Server is listening on port 5000!");
});
