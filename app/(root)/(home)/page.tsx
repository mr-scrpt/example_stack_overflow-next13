import { Button } from "@/components/ui/button"
import Link from "next/link"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import Filter from "@/components/shared/Filter"
import { HomePageFilters } from "@/constants/filters"
import HomeFilters from "@/components/home/HomeFilters"
import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action"
import { SearchParamsProps } from "@/types"
import Paginator from "@/components/shared/Paginator"
import type { Metadata } from "next"
import { auth } from "@clerk/nextjs"

export const metadata:Metadata = {
  title: "Home | Dev Overflow",
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const {userId} = auth()

  let result 

  if(searchParams?.filter === "recommended"){
    if(userId){
      result = await getRecommendedQuestions({
        userId,
        page: searchParams.page? +searchParams.page : 1,
        searchQuery: searchParams.q
      })
    }else{
      result = {
        questions : [],
        hasNextPage : false
      }
    }
  }else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    })
  }

  // TODO: Fetch Recommend questions
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[40px] px-4 py-3 !text-light-900">
            Ask question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1" // make sure searchbar width expanded and take place over filter
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="custom-scrollbar mt-10 flex w-full flex-col gap-6 overflow-y-auto">
        {/* looping through questions */}
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upVotes={question.upVotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Paginator
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          hasNextPage={result.hasNextPage}
        />
      </div>
    </>
  )
}
