import { withPayload } from '@payloadcms/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images served from the CMS to be used by the frontend
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.promedias-liege.be',
      },
    ],
  },
}

export default withPayload(nextConfig)
