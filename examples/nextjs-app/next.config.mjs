/** @type {import('next').NextConfig} */
const nextConfig = {
  // easy-3dkit and the R3F stack ship modern ESM; let Next transpile them so the
  // server build and client bundle both resolve them cleanly.
  transpilePackages: ['easy-3dkit', 'three', '@react-three/fiber', '@react-three/drei'],
}

export default nextConfig
