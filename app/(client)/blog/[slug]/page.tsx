import { notFound } from "next/navigation";

const SingleBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  await params;
  return notFound();
};

export default SingleBlogPage;
