import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  Form,
  useNavigation,
  MetaFunction,
  useFetcher,
  useBlocker,
} from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  getAboutDetails,
  updateAboutDetails,
} from "../_services/about.service";
import TipTapEditor from "@/components/TipTapEditor";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UrlUtil from "@/lib/urls";
import { PreviewDialog, type PreviewData } from "./_components/preview-dialog";
import { NavigationAlertDialog } from "./_components/navigation-alert-dialog";

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
  const actionType = formData.get("actionType");
  
  // Extract form data
  const formValues = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    content: formData.get("content") as string,
  };
  
  if (actionType === "preview") {
    return json({
      preview: formValues,
      error: null,
      fields: null,
    });
  }
  
  // Regular save action
  const aboutId = formData.get("aboutId") as string;

  try {
    await updateAboutDetails(parseInt(aboutId), formValues);
    return redirect(UrlUtil.buildAboutUrl());
  } catch (error) {
    console.error("Error updating about data:", error);
    return json({
      preview: null,
      error: "Failed to update about page data",
      fields: formValues,
    });
  }
};

const AboutAdmin = () => {
  const { about, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Track form changes
  const [formChanged, setFormChanged] = useState(false);
  const [editorContent, setEditorContent] = useState(about.content || "");
  
  // Initialize fetcher for preview functionality
  const previewFetcher = useFetcher<typeof action>();
  const isPreviewLoading = previewFetcher.state !== "idle";
  const previewData = previewFetcher.data?.preview as PreviewData | null;
  
  // State for dialog open/close
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Set up blocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      formChanged && currentLocation.pathname !== nextLocation.pathname
  );

  // Handle form changes
  const handleFormChange = () => {
    setFormChanged(true);
  };

  // Handle editor content changes
  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    setFormChanged(true);
  };

  // Reset form changed state after successful submission
  useEffect(() => {
    if (navigation.state === "idle" && !actionData?.error) {
      setFormChanged(false);
    }
  }, [navigation.state, actionData]);

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

          <Form method="post" className="space-y-6" onChange={handleFormChange}>
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
                  onChange={handleEditorChange}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <div className="space-x-2">
                <Button type="submit" disabled={isSubmitting} className="w-32">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="secondary" 
                  disabled={isPreviewLoading}
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("title", document.querySelector<HTMLInputElement>("[name='title']")?.value || "");
                    formData.append("description", document.querySelector<HTMLTextAreaElement>("[name='description']")?.value || "");
                    formData.append("content", editorContent);
                    formData.append("actionType", "preview");
                    
                    previewFetcher.submit(formData, { method: "post" });
                    
                    // Open the dialog when we start fetching the preview
                    setPreviewDialogOpen(true);
                  }}
                  className="w-32"
                >
                  {isPreviewLoading ? "Loading..." : "Preview"}
                </Button>
              </div>

              <Button variant="outline" className="w-32" asChild>
                <a href="/about">Cancel</a>
              </Button>
            </div>
          </Form>
          
          {/* Preview Dialog */}
          <PreviewDialog
            open={previewDialogOpen}
            onOpenChange={setPreviewDialogOpen}
            isLoading={isPreviewLoading}
            previewData={previewData}
          />

          {/* Navigation blocker dialog */}
          <NavigationAlertDialog 
            open={blocker?.state === "blocked" || false}
            onOpenChange={(open) => {
              if (!open && blocker?.state === "blocked") {
                blocker.reset?.();
              }
            }}
            onStay={() => blocker?.reset?.()}
            onLeave={() => blocker?.proceed?.()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutAdmin;
