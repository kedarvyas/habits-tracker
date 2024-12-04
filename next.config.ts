/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Add this line
  images: {
    unoptimized: true  // Add this for static export
  }
}

module.exports = nextConfig