import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { z } from "zod";
import { toast } from "sonner";

// Define Zod schemas
const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string().url(),
});

const CreateUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  job: z.string().min(1, { message: "Job is required" }),
});

// Define types using Zod schemas
type User = z.infer<typeof UserSchema>;

type LoaderData = {
  users: User[];
  success: boolean;
  error?: string;
};

type ActionData = {
  newUser?: {
    name: string;
    job: string;
    id: string;
    createdAt: string;
  };
  success: boolean;
  message?: string;
  errors?: {
    name?: string;
    job?: string;
    form?: string;
  };
  _form?: {
    message: string;
    type: "error" | "success";
  };
};

export const loader = async () => {
  try {
    const response = await fetch("https://reqres.in/api/users?page=1");
    const data = await response.json();
    return json<LoaderData>({ users: data.data, success: true });
  } catch (error) {
    console.error("Error fetching users:", error);
    return json<LoaderData>({ users: [], success: false, error: "Failed to fetch users" });
  }
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const job = formData.get("job");

  // Validate with Zod
  const validationResult = CreateUserSchema.safeParse({
    name,
    job,
  });

  if (!validationResult.success) {
    // Convert Zod errors to the format we need
    const errors = validationResult.error.errors.reduce(
      (acc, error) => {
        const path = error.path[0] as string;
        acc[path] = error.message;
        return acc;
      },
      {} as Record<string, string>
    );

    return json<ActionData>({ 
      errors, 
      success: false,
      _form: { 
        message: "Please check the form for errors", 
        type: "error" 
      } 
    });
  }

  try {
    const { name, job } = validationResult.data;
    
    const response = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, job }),
    });

    const data = await response.json();
    return json<ActionData>({ 
      newUser: data, 
      success: true, 
      message: `User ${name} created successfully!` 
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return json<ActionData>({ 
      errors: { form: "Failed to create user" }, 
      success: false,
      _form: {
        message: "Failed to create user",
        type: "error"
      }
    });
  }
};

const UserPage = () => {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const fetcher = useFetcher<ActionData>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Handle fetcher data (from fetcher submission)
    if (fetcher.data) {
      if (fetcher.data.success && fetcher.data.newUser) {
        toast.success(fetcher.data.message || "User created successfully!");
        
        // Reset form on successful submission
        if (formRef.current) {
          formRef.current.reset();
        }
      } else if (fetcher.data.errors || fetcher.data._form) {
        toast.error(fetcher.data.errors?.form || fetcher.data._form?.message || "Please check the form for errors");
      }
    }
  }, [fetcher.data]);

  // Also keep the original action data handling for direct form submissions
  useEffect(() => {
    if (actionData?.success && actionData?.newUser) {
      toast.success(actionData.message || "User created successfully!");
    } else if (actionData?.errors) {
      toast.error(actionData.errors.form || actionData._form?.message || "Please check the form for errors");
    }
  }, [actionData]);

  // Handle form submission with fetcher
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Creation Form */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Add a new user to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form 
              method="post" 
              className="space-y-4" 
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter name" 
                  className={fetcher.data?.errors?.name ? "border-red-500" : ""}
                />
                {fetcher.data?.errors?.name && (
                  <p className="text-sm text-red-500">{fetcher.data.errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job">Job</Label>
                <Input 
                  id="job" 
                  name="job" 
                  placeholder="Enter job title"
                  className={fetcher.data?.errors?.job ? "border-red-500" : ""}
                />
                {fetcher.data?.errors?.job && (
                  <p className="text-sm text-red-500">{fetcher.data.errors.job}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={fetcher.state === "submitting"}
              >
                {fetcher.state === "submitting" ? "Creating..." : "Create User"}
              </Button>
            </fetcher.Form>
          </CardContent>
        </Card>
        
        {/* User List */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>Users fetched from ReqRes API</CardDescription>
          </CardHeader>
          <CardContent>
            {loaderData.users.length > 0 ? (
              <div className="space-y-4">
                {loaderData.users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 border rounded-md">
                    <img 
                      src={user.avatar} 
                      alt={`${user.first_name} ${user.last_name}`} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Display newly created user if available */}
      {(fetcher.data?.newUser && fetcher.data.success) && (
        <Card className="mt-6 shadow-md border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle>New User Created</CardTitle>
            <CardDescription>User was successfully added to the system</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{fetcher.data.newUser.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Job</p>
                <p>{fetcher.data.newUser.job}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p>{fetcher.data.newUser.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p>{new Date(fetcher.data.newUser.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserPage;
