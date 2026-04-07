// ---------------------------------------------------------------
// src/app/api/users/[user_id]/route.js  →  route: /api/users/:user_id
// Server-side proxy for single user operations — avoids CORS.
// ---------------------------------------------------------------

export async function GET(request, { params }) {
  const token = request.headers.get("Authorization");
  const { user_id } = await params;

  const response = await fetch(`https://api-kinderbeam.onrender.com/api/users/${user_id}/`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": token,
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function PATCH(request, { params }) {
  const token = request.headers.get("Authorization");
  const { user_id } = await params;
  const body = await request.json();

  const response = await fetch(`https://api-kinderbeam.onrender.com/api/users/${user_id}/`, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function DELETE(request, { params }) {
  const token = request.headers.get("Authorization");
  const { user_id } = await params;

  const response = await fetch(`https://api-kinderbeam.onrender.com/api/users/${user_id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": token,
    },
  });

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const data = await response.json();
  return Response.json(data, { status: response.status });
}