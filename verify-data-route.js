import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "hotels.json")

console.log("Checking file:", filePath)

try {
  // Check if file exists
  if (fs.existsSync(filePath)) {
    console.log("File exists")

    // Read file contents
    const fileContents = fs.readFileSync(filePath, "utf8")
    console.log("File contents (first 100 characters):", fileContents.substring(0, 100))

    // Try parsing the JSON
    const hotels = JSON.parse(fileContents)
    console.log("Successfully parsed JSON. Number of hotels:", hotels.length)
  } else {
    console.error("File does not exist")
  }
} catch (error) {
 
}

