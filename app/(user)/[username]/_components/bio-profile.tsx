"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { client } from "@/lib/auth/client";
import { Component } from "@/lib/types";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Loader2, PencilRuler, TextQuote } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XTextarea } from "@/components/ui/x-textarea";
import { MAX_BIO_LENGTH, MIN_BIO_LENGTH } from "@/lib/consts";

type TextProfileProps = {
  user: User;
  isOwner: boolean;
  editMode?: boolean;
}

const BlankText = (): ReactElement => (
  <div
    className={cn(
      "bg-[#F9FAFB] dark:bg-[#1A1A1A]",
      "border-4 border-[#e4e8ec] dark:border-[#252323]",
      "rounded-lg shadow-lg p-4",
      "flex items-center justify-center"
    )}
  >
    <TextQuote className="h-16 w-16" strokeWidth={2} />
  </div>
)

export const BioProfile: Component<TextProfileProps> = ({ user, isOwner, editMode }) => {
  const [isHover, setIsHover] = useState(false);
  const [newText, setNewText] = useState<string | null>(null);
  const [tempText, setTempText] = useState(user.bio || "");

  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const t = useTranslations("TextProfileDialog");
  const errors = useTranslations("Errors");

  const handleUpdate = async () => {
    if (updating) {
      toast.error(t("UpdateError"));
      return;
    }

    if (
      tempText.length < MIN_BIO_LENGTH
      || tempText.length > MAX_BIO_LENGTH
    ) {
      toast.error(
        errors("ErrorLength", {
          field: t("Field"),
          min: MIN_BIO_LENGTH,
          max: MAX_BIO_LENGTH
        })
      );
      return;
    }

    if (tempText === user.bio) {
      toast.error(errors("ErrorSame"));
      return;
    }

    try {
      setUpdating(true);
      await client.updateUser({
        // @ts-ignore
        bio: tempText
      });

      setNewText(tempText);
      toast.success(t("UpdateSuccess"));
      setIsOpen(false);
    } catch (error) {
      toast.error(t("UpdateError"));
    } finally {
      setUpdating(false);
      setIsOpen(false);
    }
  };

  if (!isOwner || !editMode) return (
    <p className="text-gray-400 mt-0.5 break-words">{user.bio}</p>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger disabled={!isOwner} className="flex shrink-0">
        <div
          className="relative mt-0.5"
          onMouseEnter={() => setIsHover(true)} 
          onMouseLeave={() => setIsHover(false)}
        >
          <div>
            {newText ?? user.bio ? (
              <p className={cn(
                "text-left text-gray-400 break-all", {
                  "py-1.5 px-1.5": isHover,
                }
              )}>{newText ?? user.bio}</p>
            ) : <BlankText />}
          </div>

          {isOwner && isHover && (
            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center cursor-pointer">
              <div className="flex items-center justify-center">
                <PencilRuler size={24} color="white" />
              </div>
            </div>
          )}
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="leading-4">{t("Title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("Description")}</AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col gap-4">
          <XTextarea
            onChange={(e: string) => setTempText(e)}
            placeholder={t("Placeholder")}
            defaultValue={tempText}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={updating}>
            {t("Close")}
          </AlertDialogCancel>

          <Button onClick={handleUpdate} disabled={
            updating
            || tempText === user.bio
            || tempText.length < MIN_BIO_LENGTH
            || tempText.length > MAX_BIO_LENGTH
          }>
            {updating && <Loader2 className="animate-spin mr-2" />}
            {updating ? t("Updating") : t("Update")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};