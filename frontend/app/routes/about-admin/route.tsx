import { useState, useEffect } from 'react';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useNavigation, MetaFunction } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/node';
import TipTapEditor from '../../components/TipTapEditor';
import axios from 'axios';

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
    // Get CSRF token by making a GET request with credentials
    const response = await axios.get('http://localhost:3001/api/v1/about', {
      withCredentials: true,
    });
    
    // Extract CSRF token from headers
    const csrfToken = response.headers['x-csrf-token'];
    
    return json({
      about: response.data,
      csrfToken,
      error: null
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
    return json({
      about: {
        title: '',
        description: '',
        content: '',
      },
      csrfToken: '',
      error: 'Failed to load about page data'
    });
  }
};

// Action function to handle form submission
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const csrfToken = formData.get('csrfToken') as string;
  const aboutId = formData.get('aboutId') as string;

  try {
    // Update the about page data
    await axios.put(`http://localhost:3001/api/v1/about/${aboutId}`, {
      about: {
        title,
        description,
        content,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      withCredentials: true,
    });

    return redirect('/about');
  } catch (error) {
    console.error('Error updating about data:', error);
    return json({
      error: 'Failed to update about page data',
      fields: { title, description, content },
    });
  }
};

export default function AboutAdmin() {
  const { about, csrfToken, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [title, setTitle] = useState(about.title || '');
  const [description, setDescription] = useState(about.description || '');
  const [editorContent, setEditorContent] = useState(about.content || '');

  useEffect(() => {
    if (about) {
      setTitle(about.title || '');
      setDescription(about.description || '');
      setEditorContent(about.content || '');
    }
  }, [about]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit About Page</h1>
      
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
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="aboutId" value={about.id} />
        <input type="hidden" name="content" value={editorContent} />
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="tiptap-editor" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div id="tiptap-editor">
            <TipTapEditor 
              content={editorContent} 
              onChange={setEditorContent} 
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          
          <a
            href="/about"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </a>
        </div>
      </Form>
    </div>
  );
}
