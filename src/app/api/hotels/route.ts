import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), "data")
    const filePath = path.join(jsonDirectory, "hotels.json")

    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false)

    if (!fileExists) {
      console.error("hotels.json file not found")
      return NextResponse.json({ error: "Hotels data not available" }, { status: 404 })
    }

    const fileContents = await fs.readFile(filePath, "utf8")
    const hotels = JSON.parse(fileContents)

    return NextResponse.json(hotels)
  } catch (error) {
    console.error("Error reading or parsing hotels data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

