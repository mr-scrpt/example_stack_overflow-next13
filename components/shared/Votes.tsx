"use client"

import Image from "next/image"
import React, { useEffect } from "react"
import { formatNumber } from "@/lib/utils"
import {
  downVoteQuestion,
  toggleSaveQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action"
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action"
import { usePathname, useRouter } from "next/navigation"
import { viewQuestion } from "@/lib/actions/interaction.action"
import { toast } from "../ui/use-toast"

interface Props {
  type: string
  itemId: string
  userId: string
  upVotes: number
  downVotes: number
  hasUpVoted: boolean
  hasDownVoted: boolean
  hasSaved?: boolean
}

const Votes = async ({
  itemId,
  userId,
  type,
  upVotes,
  downVotes,
  hasUpVoted,
  hasDownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    })

    return toast({
      title: `Question ${
        hasSaved ? "Saved in" : "Removed from"
      } your collections`,
      variant: `${hasSaved ? "default" : "destructive"}`,
    })
  }

  const handleVote = async (vote: string) => {
    // check if user is logined
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must log in to perform this operation",
      })
    }

    if (vote === "upVote") {
      if (type === "Question") {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        })
      } else if (type === "Answer") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        })
      }

      return toast({
        title: `Upvote ${hasUpVoted ? "Removed" : "Successfully"}`,
        variant: `${hasUpVoted ? "destructive" : "default"}`,
      })
    }

    if (vote === "downVote") {
      if (type === "Question") {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        })
      } else if (type === "Answer") {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        })
      }

      return toast({
        title: `Downvote ${hasDownVoted ? "Removed" : "Successfully"}`,
        variant: `${hasDownVoted ? "destructive" : "default"}`,
      })
    }
  }

  // view interaction
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    })
  }, [itemId, userId, pathname, router])

  return (
    <div className="flex gap-5 ">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5 ">
          <Image
            src={`/assets/icons/${hasUpVoted ? "upvoted" : "upvote"}.svg`}
            alt="upvote icon"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("upVote")}
          />
          <div className="flex-center  background-light700_dark400 p-1 rounded-sm min-w-[18px] ">
            <p className="text-dark400_light900 subtle-medium text-center uppercase">
              {formatNumber(upVotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5 ">
          <Image
            src={`/assets/icons/${hasDownVoted ? "downvoted" : "downvote"}.svg`}
            alt="downvote icon"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("downVote")}
          />
          <div className="flex-center  background-light700_dark400 p-1 rounded-sm min-w-[18px] ">
            <p className="text-dark400_light900 subtle-medium text-center uppercase">
              {formatNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={`/assets/icons/${hasSaved ? "star-filled" : "star-red"}.svg`}
          alt="star icon"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  )
}

export default Votes
