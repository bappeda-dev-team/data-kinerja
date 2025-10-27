import { redirect } from 'next/navigation';

export default function HomePage() {
return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Selamat Datang di Aplikasi Kami 👋</h1>
      <p className="mt-4 text-gray-600">
        Silakan <a href="/login" className="text-blue-500 underline">login</a> untuk melanjutkan.
      </p>
    </main>
  )
}