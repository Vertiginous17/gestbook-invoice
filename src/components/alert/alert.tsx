import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { GetClientsProps } from "@/utils/getClients";

type IAlertProps = {
  buttonText: string;
  title: string;
  description: string;
  leftAction: string;
  rightAction: string;
  handleRightClickAction?: (data: Array<GetClientsProps>) => void;
  data: Array<GetClientsProps>;
};
export const Alert = ({
  buttonText,
  title,
  description,
  leftAction,
  rightAction,
  handleRightClickAction,
  data,
}: IAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {buttonText}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{leftAction}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (handleRightClickAction) {
                handleRightClickAction(data);
              }
            }}
          >
            {rightAction}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
