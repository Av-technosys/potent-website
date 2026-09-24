/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import EditCategory from "./editClient";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { category } from "@/db/schema";

interface PageProps {
  params: {
    id: any;
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const categoryInfo = await db
    .select()
    .from(category)
    .where(eq(category.id, id));



  return (
    <>
      <EditCategory categoryInfo={categoryInfo[0]} />
    </>
  );
};

export default Page;
