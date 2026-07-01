import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Evita que Next.js infiera la raíz del workspace subiendo hasta
  // C:\Users\LENOVO (hay un package-lock.json ahí por un tema no relacionado).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
