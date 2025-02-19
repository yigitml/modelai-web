import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Privacy Policy | ModelAI',
  description: 'Privacy policy and data protection information for ModelAI users.',
}

export default function PrivacyPolicy() {
  const privacyHtmlPath = path.join(process.cwd(), 'src/app/(public)/legal/privacy/privacy.html')
  const privacyContent = fs.readFileSync(privacyHtmlPath, 'utf-8')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white text-black">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert:prose-light"
        dangerouslySetInnerHTML={{ __html: privacyContent }} 
      />
    </div>
  )
}
