import HotelFilter from "./components/hotel-filter"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Discover Your Perfect Stay</h1>
      <HotelFilter />
    </main>
  )
}

