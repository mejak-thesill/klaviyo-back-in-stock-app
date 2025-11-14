-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" INTEGER,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscribers_prod" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "product_id" VARCHAR(100) NOT NULL,
    "product_url" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "subscribers_prod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bis_signups" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "product_id" VARCHAR(100) NOT NULL,
    "product_url" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "bis_signups_pkey" PRIMARY KEY ("id")
);

