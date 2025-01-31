"use client";

import { Ellipsis, Heart, Loader2, MessageCircle, MessageSquareQuote, Share, Trash } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLike } from "@/lib/actions/likes/likes.hook";
import { useLocale, useTranslations } from "next-intl";
import { Button, buttonVariants } from "./ui/button";
import { Prisma } from "@prisma/client";
import { Component } from "@/lib/types";
import TextFormatter from "./formatter";
import { dayJS } from "@/lib/day-js";
import { ReactElement } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { PostDialog } from "./new-post";
import { Skeleton } from "./ui/skeleton";

export const PostCard: Component<Prisma.PostGetPayload<{
  include: {
    likes: true;
    comments: true;
    parent: {
      select: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            isVerified: true
          }
        },
        content: true
      }
    },
    user: {
      select: {
        name: true;
        username: true;
        image: true;
        isVerified: true;
      }
    }
  }
}> & {
  includeParent?: boolean;
}> = ({
  comments, content, createdAt, id, likes, parent, user, userId, includeParent = true
}): ReactElement => {
  const { isLiked, toggleLike, isLoading, likesCount } = useLike(id, likes.length, userId);

  const lang = useLocale();
  
  const t = useTranslations("Basic");

  return ( 
    <Card key={id}>
      <CardHeader className="-mb-2 flex flex-row justify-between items-center">
        <Link className="flex items-center space-x-4" href={`/${user.username}`}>
          <Avatar>
            <AvatarImage src={user.image ?? ""} alt={user.name ?? "John Doe"} />
            <AvatarFallback>{(user.name ?? "").split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col justify-center gap-0.5">
            <p className="flex items-center gap-1 font-medium">
              {user.name}
              {/* {author.isVerified && <Verified />} */}
            </p>
            <span className="-mt-1 font-normal text-gray-500">
              {user.username}
              &nbsp;&bull;&nbsp;
              {dayJS(createdAt).year === dayJS().year
                ? dayJS(createdAt).locale(lang).format(`MMM D [${t("at")}] ${lang == "fr" ? "HH:mm" : "h:mm a"}`)
                : dayJS(createdAt).locale(lang).format(`MMM D, YYYY [${t("at")}] ${lang == "fr" ? "HH:mm" : "h:mm a"}`)
              }
            </span>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"} className="rounded-full">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Trash className="h-4 w-4" />
              Delete this post
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Share className="h-4 w-4" />
              Share this post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="-mt-2">
        <TextFormatter text={content} />

        {includeParent && parent && (
          <div className="mt-3 p-4 bg-[#e9eaeb] dark:bg-[#1d1d1d] border rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300 border p-0.5 text-xs">
                En réponse à
                <Link href={`/${parent.user.username}`} className="flex items-center gap-1 hover:underline">
                  <Avatar className="w-3 h-3">
                    <AvatarImage src={parent.user.image ?? ""} alt={parent.user.name ?? "John Doe"} />
                    <AvatarFallback>{(parent.user.name ?? "").split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>

                  {parent.user.name}
                </Link>
              </span>
            </div>

            <div className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-3">
              <TextFormatter text={parent.content} />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between w-full -mt-3">
        <div className="flex items-center space-x-1.5">
          <Link
            href={`/${user.username}/${id}`}
            className={cn("transition-colors", buttonVariants({
              variant: "ghost",
              size: "sm"
            }), {
              "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-500 hover:dark:text-blue-300": comments.length > 0,
              "hover:bg-neutral-100 dark:hover:bg-neutral-900": comments.length === 0
            })}
          >
            <MessageCircle className="h-4 w-4" />
            {comments.length}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className={cn("transition-colors", {
              "hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 hover:dark:text-red-300": isLiked,
              "hover:bg-neutral-100 dark:hover:bg-neutral-900": !isLiked
            })}
            disabled={isLoading}
            onClick={() => toggleLike()}
          >
            {isLoading
              ? <Loader2 className="animate-spin h-4 w-4" />
              : <Heart className={cn("h-4 w-4", {
                  "fill-red-500 text-red-500": isLiked
                })} />
            }

            {likesCount}
          </Button>

          <PostDialog parentId={id}>
            <Button variant="ghost" size="sm">
              <MessageSquareQuote className="h-4 w-4" />
            </Button>
          </PostDialog>
        </div>

        <div className="space-x-1.5">
          {/* <Button
            variant="ghost"
            size="sm"
            className={cn("transition-colors", {
              "hover:bg-blue-50 dark:hover:bg-blue-900/30": isBookmarked,
              "hover:bg-neutral-100 dark:hover:bg-neutral-900": !isBookmarked
            })}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className={cn("h-4 w-4", {
              "fill-blue-500 text-blue-500": isBookmarked
            })} />
          </Button> */}
        </div>
      </CardFooter>
    </Card>
  )
}

export const PostCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="-mb-2 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>

      <CardContent className="-mt-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <div className="mt-3">
          <div className="space-y-2">
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between w-full -mt-3">
        <div className="flex items-center space-x-1.5">
          <Button variant="ghost" size="sm" disabled>
            <MessageCircle className="h-4 w-4" />
            <Skeleton className="h-4 w-4 ml-1" />
          </Button>

          <Button variant="ghost" size="sm" disabled>
            <Heart className="h-4 w-4" />
            <Skeleton className="h-4 w-4 ml-1" />
          </Button>

          <Button variant="ghost" size="sm" disabled>
            <MessageSquareQuote className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-1.5">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
};