import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export interface PreviewData {
  title: string;
  description: string;
  content: string;
}

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  previewData: PreviewData | null;
}

export const PreviewDialog: FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  isLoading,
  previewData,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription>
            Preview of how your About page will look
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : previewData ? (
          <div className="mt-4">
            <h1 className="text-3xl font-bold mb-2">{previewData.title}</h1>
            <p className="text-gray-600 mb-6">{previewData.description}</p>
            
            <Separator className="my-4" />
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewData.content }}
            />
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            No preview data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};