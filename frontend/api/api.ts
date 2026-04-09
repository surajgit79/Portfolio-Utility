// FOR NEW CODE

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// export async function getTeachers() {
//   const res = await fetch(`${BASE_URL}/teachers`);
//   if (!res.ok) throw new Error('Failed to fetch teachers');
//   return res.json();
// }

// export async function getTeacher(id: string) {
//   const res = await fetch(`${BASE_URL}/teachers/${id}`);
//   if (!res.ok) throw new Error('Failed to fetch teacher');
//   return res.json();
// }

// export async function createTeacher(payload: unknown) {
//   const res = await fetch(`${BASE_URL}/teachers`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload)
//   });
//   if (!res.ok) throw new Error('Failed to create teacher');
//   return res.json();
// }