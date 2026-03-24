// src/app/api/users/[user_id]/route.js
export async function GET(request, { params }) {
  const { user_id } = await params;
  const token = request.headers.get("Authorization");

  const response = await fetch(`https://api-kinderbeam.onrender.com/api/users/${user_id}/`, {
    headers: { "Accept": "application/json", "Authorization": token },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function PATCH(request, { params }) {
  const { user_id } = await params;
  const token = request.headers.get("Authorization");
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
  const { user_id } = await params;
  const token = request.headers.get("Authorization");

  const response = await fetch(`https://api-kinderbeam.onrender.com/api/users/${user_id}/`, {
    method: "DELETE",
    headers: { "Authorization": token },
  });

  if (response.status === 204) return new Response(null, { status: 204 });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
