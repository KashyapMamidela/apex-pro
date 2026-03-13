import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ApexPro Fitness — AI-Powered Training',
  description: 'Personalized AI workout and diet plans. Track progress. Build community.',
  openGraph: {
    images: ['/og-image.png'],
    siteName: 'ApexPro Fitness'
  },
  twitter: {
    card: 'summary_large_image'
  }
}

export default function sitemap() {
  return [
    {
      url: 'https://apexpro.fitness',
      lastModified: new Date(),
    },
    {
      url: 'https://apexpro.fitness/login',
      lastModified: new Date(),
    },
    {
      url: 'https://apexpro.fitness/signup',
      lastModified: new Date(),
    }
  ]
}
