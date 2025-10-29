export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
        <a href="/OS3-Synergy-default-dashboard/" className="text-blue-600 hover:underline">
          Return to Dashboard
        </a>
      </div>
    </div>
  )
}