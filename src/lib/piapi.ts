import { ImageToVideoRequest, KlingApiResponse, VirtualTryOnRequest } from "@/types/piapi";

export async function imageToVideo(
  request: ImageToVideoRequest
): Promise<KlingApiResponse> {
  const apiKey = process.env.PIAPI_API_KEY;
  const apiUrl = process.env.PIAPI_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("PIAPI_API_KEY or PIAPI_API_URL is not defined in the environment variables.");
  }

  const response = await fetch(`${apiUrl}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(request),
  });
  
  return response.json();
}
  
export async function virtualTryOn(
  request: VirtualTryOnRequest
): Promise<KlingApiResponse> {
  const apiKey = process.env.PIAPI_API_KEY;
  const apiUrl = process.env.PIAPI_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("PIAPI_API_KEY or PIAPI_API_URL is not defined in the environment variables.");
  }

  const response = await fetch(`${apiUrl}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(request),
  });
  
  return response.json();
}