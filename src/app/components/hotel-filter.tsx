"use client"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Star, MapPin, Clock } from "lucide-react"
import Image from "next/image"

type Hotel = {
  hotel_id: number
  hotel_name: string
  city: string
  country: string
  star_rating: number
  rates_from: number
  rates_currency: string
  number_of_reviews: number
  rating_average: number
  photo1: string
  overview: string
  checkin: string
  checkout: string
}

export default function HotelFilter() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [ratingFilter, setRatingFilter] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("price-low-to-high")

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/hotels")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (Array.isArray(data)) {
          setHotels(data)
        } else {
          throw new Error("Invalid data format")
        }
      } catch (e) {
        console.error("Fetching error:", e)
        setError(`Failed to load hotels. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  const filteredHotels = hotels
    .filter(
      (hotel) =>
        hotel.rates_from >= priceRange[0] &&
        hotel.rates_from <= priceRange[1] &&
        (ratingFilter.length === 0 || ratingFilter.includes(Math.floor(hotel.star_rating))) &&
        (hotel.hotel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.country.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low-to-high":
          return a.rates_from - b.rates_from
        case "price-high-to-low":
          return b.rates_from - a.rates_from
        case "rating-high-to-low":
          return b.rating_average - a.rating_average
        case "popularity":
          return b.number_of_reviews - a.number_of_reviews
        default:
          return 0
      }
    })

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <div className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="search" className="text-lg font-semibold mb-2 block">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search hotels, cities, or countries"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-lg font-semibold mb-2 block">Price Range</Label>
          <Slider min={0} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} className="mt-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        <div>
          <Label className="text-lg font-semibold mb-2 block">Star Rating</Label>
          <div className="space-y-2 mt-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={ratingFilter.includes(rating)}
                  onCheckedChange={(checked) => {
                    setRatingFilter(checked ? [...ratingFilter, rating] : ratingFilter.filter((r) => r !== rating))
                  }}
                />
                <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={`filter-star-${rating}-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">& up</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="sort" className="text-lg font-semibold mb-2 block">
            Sort by
          </Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort" className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
              <SelectItem value="rating-high-to-low">Rating: High to Low</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredHotels.map((hotel,index) => (
          <div
            key={`${hotel.hotel_id}-${index}`}
            className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <Image
                  src={hotel.photo1 || "/placeholder.svg"}
                  alt={hotel.hotel_name}
                  width={300}
                  height={200}
                  className="h-48 w-full object-cover md:h-full md:w-48"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{hotel.hotel_name}</h2>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" /> {hotel.city}, {hotel.country}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: hotel.star_rating }).map((_, i) => (
                      <Star key={`${hotel.hotel_id}-star-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-600">${hotel.rates_from}</span>
                    <span className="text-sm text-gray-600 ml-1">per night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{hotel.rating_average.toFixed(1)}</span>
                    <span className="text-sm text-gray-600 ml-1">({hotel.number_of_reviews} reviews)</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 text-sm line-clamp-2">{hotel.overview}</p>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Check-in: {hotel.checkin}</span>
                  <span className="mx-2">|</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Check-out: {hotel.checkout}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

