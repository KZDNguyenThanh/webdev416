import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import {
  createPageAction,
  deletePageAction,
  updatePageAction,
} from "@/app/(admin)/admin/actions";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pages</h1>
        <p className="text-sm text-lightColor mt-1">
          Manage static content pages for storefront.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Page</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createPageAction}
            className="grid grid-cols-1 md:grid-cols-6 gap-3 border p-4 rounded-md"
          >
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="Slug (optional)" />
            <Input
              name="excerpt"
              placeholder="Excerpt"
              className="md:col-span-2"
            />
            <Input
              name="content"
              placeholder="Content"
              className="md:col-span-2"
              required
            />
            <label className="flex items-center gap-2 text-sm">
              <input name="isPublished" type="checkbox" /> Published
            </label>
            <Button type="submit">Create Page</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Page List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pages.map((page) => (
            <form
              key={page.id}
              action={updatePageAction}
              className="grid grid-cols-1 md:grid-cols-6 gap-2 border p-3 rounded-md"
            >
              <input type="hidden" name="id" value={page.id} />
              <Input name="title" defaultValue={page.title} required />
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="isPublished"
                  type="checkbox"
                  defaultChecked={page.isPublished}
                />{" "}
                Published
              </label>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" variant="outline">
                  Update
                </Button>
                <button
                  formAction={deletePageAction}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
