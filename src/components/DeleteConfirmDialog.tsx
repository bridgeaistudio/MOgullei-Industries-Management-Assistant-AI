'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Lock, Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  critical?: boolean;
  onConfirm: (password?: string) => Promise<{ error?: string } | void>;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  critical = false,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setError('');
    if (critical && !password) {
      setError('Password is required for this action.');
      return;
    }

    startTransition(async () => {
      const result = await onConfirm(critical ? password : undefined);
      if (result?.error) {
        setError(result.error);
      } else {
        setPassword('');
        setError('');
        onOpenChange(false);
      }
    });
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setPassword('');
      setError('');
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              critical
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-600'
            }`}>
              {critical ? <Lock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-stone-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        {critical && (
          <div className="space-y-3 py-2">
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-700 font-medium">
                This is a critical operation. Enter your password to confirm.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="h-10"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
