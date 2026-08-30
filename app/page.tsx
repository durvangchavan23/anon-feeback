"use client";
import { Navbar, Footer, Container } from "./comp/index";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const { data: session } = useSession();
  const messages = [
    {
      id: 1,
      name: "Rahul",
      message: "What is your favorite hobby?",
      date: "1 day ago",
    },
    {
      id: 2,
      name: "Sneha",
      message: "Where do you see yourself in five years?",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "Priya",
      message: "What is your dream travel destination?",
      date: "1 month ago",
    },
  ];
  const router = useRouter();

  return (
    <div className="bg-slate-700">
      <div className="w-full min-h-screen">
        <Navbar />
        <Container>
          <div className="w-full flex flex-col items-center mt-20 space-y-9">
            <div className="space-y-3 flex flex-col items-center">
              <h1 className="text-center font-bold text-2xl text-white sm:text-4xl">
                Dive into the world of Anonymous Feeback
              </h1>
              <p className="text-white text-center sm:text-xl">
                Anon Feedback - Where your identity remans a secret.
              </p>
              {session && (
                <Button
                  className={
                    "px-8 py-5 cursor-pointer bg-white hover:bg-gray-200 text-slate-600 text-sm sm:text-lg"
                  }
                  onClick={() => router.replace("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
            <div>
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
                className="w-full max-w-lg mt-10"
              >
                <CarouselContent>
                  {messages?.map((message) => (
                    <CarouselItem key={message.id}>
                      <div className="">
                        <Card>
                          <CardContent className="bg-white flex flex-col">
                            <h1 className=" font-bold text-lg sm:text-xl">
                              Message from {message.name}
                            </h1>
                            <div>
                              <p className="mt-2 text-sm">{message.message}</p>
                              <p className="mt-1 text-gray-500">
                                {message.date}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
