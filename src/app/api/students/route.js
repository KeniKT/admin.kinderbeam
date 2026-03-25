// ---------------------------------------------------------------
// src/app/api/students/route.js  →  route: /api/students
// Server-side proxy — forwards request to backend to avoid CORS.
// ---------------------------------------------------------------

export async function GET(request) {
  const token = request.headers.get("Authorization");

  const response = await fetch("https://api-kinderbeam.onrender.com/api/students/", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": token,
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}