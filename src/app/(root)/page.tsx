import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EncryptedText } from "@/components/ui/encrypted-text";
import { NoiseBackground } from "@/components/ui/noise-background";

export default function Home() {

    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <div className=" z-20 flex flex-col items-center justify-start min-h-screen py-2 mt-10">

                <div className="flex flex-col justify-center items-center my-5">
                    <Image src={"/hero.svg"} alt="Hero-Section" height={500} width={500} />
                    <h1 className="z-20 text-6xl mt-5 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#9b63ff] via-[#b084ff] to-[#d1b3ff] dark:from-[#8855e6] dark:via-[#a274ff] dark:to-[#c2a1ff] tracking-tight leading-[1.3]"
                    >
                        <EncryptedText text="Vibe Code With Intelligence" revealDelayMs={50} />
                    </h1>
                </div>


                <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400 px-5 py-5 max-w-2xl">
                    VibeCode Editor is a powerful and intelligent code editor that enhances
                    your coding experience with advanced features and seamless integration.
                    It is designed to help you write, debug, and optimize your code
                    efficiently.
                </p>

                <div className="flex justify-center">
                    <NoiseBackground
                        containerClassName="mb-4 w-fit rounded-full p-[6px]"
                        gradientColors={[
                            "rgb(155, 99, 255)",   // brand purple
                            "rgb(120, 80, 255)",   // darker variation
                            "rgb(180, 140, 255)",  // lighter variation
                        ]}
                    >
                        <Link href="/dashboard">
                            <Button
                                variant="brand"
                                size="lg"
                                className="cursor-pointer rounded-full flex items-center gap-2 font-bold"
                            >
                                Get Started
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </NoiseBackground>
                </div>

            </div>
        </BackgroundLines>
    );
}
