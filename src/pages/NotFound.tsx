"use client"
import {useNavigate} from "react-router-dom";

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        We couldn't find the page you were looking for. It might have been moved or deleted.
      </p>

      <div className="mt-8 w-full max-w-md">
        <p className="mb-4 font-medium">What were you looking for?</p>
        <form onSubmit={handleSearch} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">Press enter or click search to look it up on Google</p>
      </div>

      <Button variant="ghost" className="mt-8 bg-primary text-secondary " onClick={() => navigate("/")}>
        Return to Home
      </Button>
    </div>
  )
}

