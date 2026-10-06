export const CSE_LABS_URL = "https://richardtshotheli.github.io/richard-tshotheli-portfolio/labs";

export function loginLink(number?: string) {
  const url = new URL(CSE_LABS_URL);
  const clean = number?.trim();
  if (clean) url.searchParams.set("number", clean);
  return url.toString();
}
