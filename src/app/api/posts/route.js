// ---------------------------------------------------------------
// src/app/api/posts/route.js  →  route: /api/posts
// Server-side proxy — GET all posts.
// ---------------------------------------------------------------

export async function GET(request) {
  const token = request.headers.get("Authorization");

  const response = await fetch("https://api-kinderbeam.onrender.com/api/posts/", {
    method: "GET",
    headers: { "Accept": "application/json", "Authorization": token },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}