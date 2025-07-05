import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-purple-600">404</h1>
        <p class="text-xl text-gray-600 mt-4">Sacred path not found</p>
        <p class="text-gray-500 mt-2">The path "{url.pathname}" does not exist in this realm.</p>
        <a 
          href="/" 
          class="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Return to Sacred Home
        </a>
      </div>
    </div>
  );
}