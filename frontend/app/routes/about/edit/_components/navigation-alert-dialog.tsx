import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";

interface NavigationAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStay: () => void;
  onLeave: () => void;
}

export const NavigationAlertDialog: FC<NavigationAlertDialogProps> = ({
  open,
  onOpenChange,
  onStay,
  onLeave,
}) => {
  return (
    <Dialog 
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Are you sure you want to leave this page?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onStay}
          >
            Stay
          </Button>
          <Button 
            variant="destructive" 
            onClick={onLeave}
          >
            Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
