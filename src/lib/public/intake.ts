import { apiUrl } from "../apiBase";

export async function submitContactIntake(body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/api/intake/contact"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitTestimonialIntake(body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/api/intake/testimonial"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}
