import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  Form,
  useNavigation,
  MetaFunction,
} from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  getAboutDetails,
  updateAboutDetails,
} from "../_services/about.service";
import TipTapEditor from "../../../components/TipTapEditor";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import UrlUtil from "../../../lib/urls";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin | About Page" },
    {
      name: "description",
      content: "Admin interface for managing the About page content",
    },
  ];
};

// Loader function to fetch the current about page data
export const loader = async () => {
  try {
    // Use the service to get about details
    const aboutData = await getAboutDetails();

    return json({
      about: aboutData,
      error: null,
    });
  } catch (error) {
    console.error("Error fetching about data:", error);
    return json({
      about: {
        id: 0,
        title: "",
        description: "",
        content: "",
        created_at: "",
        updated_at: "",
      },
      error: "Failed to load about page data",
    });
  }
};

// Action function to handle form submission
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const aboutId = formData.get("aboutId") as string;

  try {
    // Use the service to update about details
    await updateAboutDetails(parseInt(aboutId), {
      title,
      description,
      content,
    });

    return redirect(UrlUtil.buildAboutUrl());
  } catch (error) {
    console.error("Error updating about data:", error);
    return json({
      error: "Failed to update about page data",
      fields: { title, description, content },
    });
  }
};

export default function AboutAdmin() {
  const { about, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // We only need state for the editor content since it's not directly bound to a form field
  const [editorContent, setEditorContent] = useState(about.content || "");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit About Page</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {actionData?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {actionData.error}
            </div>
          )}

          <Form method="post" className="space-y-6">
            <Input type="hidden" name="aboutId" value={about.id} />
            <Input type="hidden" name="content" value={editorContent} />

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                defaultValue={about.title || ""}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={about.description || ""}
                rows={4}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiptap-editor">Content</Label>
              <div
                id="tiptap-editor"
                className="border border-input rounded-md overflow-hidden"
              >
                <TipTapEditor
                  content={editorContent}
                  onChange={setEditorContent}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <Button type="submit" disabled={isSubmitting} className="w-32">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>

              <Button variant="outline" className="w-32" asChild>
                <a href="/about">Cancel</a>
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
