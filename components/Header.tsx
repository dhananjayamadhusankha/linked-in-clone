import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Briefcase,
  HomeIcon,
  MessageSquare,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function Header() {
  return (
    <div className="flex p-5 max-w-6xl mx-auto items-center">
      <Link href="/">
        <Image
          src="https://links.papareact.com/b3z"
          alt="logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
      </Link>

      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md mx-2 max-w-96">
          <SearchIcon className="text-gray-600 h-4" />
          <input
            className="flex-1 outline-none bg-transparent"
            type="text"
            placeholder="Search"
          />
        </form>
      </div>

      <div className="flex items-center space-x-4 px-6">
        <Link href="/" className="icon items-center">
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>

        <Link href="/" className="icon hidden md:flex">
          <UserIcon className="h-5" />
          <p>Network</p>
        </Link>

        <Link href="/" className="icon hidden md:flex">
          <Briefcase className="h-5" />
          <p>Jobs</p>
        </Link>
        <Link href="/" className="icon">
          <MessageSquare className="h-5" />
          <p>Messaging</p>
        </Link>

        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant={"secondary"}>
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
