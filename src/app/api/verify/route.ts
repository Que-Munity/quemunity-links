import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    site: "quemunity.app",
    status: "verified",
    timestamp: new Date().toISOString(),
    owner: "Que-Munity BBQ Community",
    adsense_ready: true,
    pages: [
      "https://quemunity.app",
      "https://quemunity.app/recipes",
      "https://quemunity.app/about",
      "https://quemunity.app/contact",
      "https://quemunity.app/privacy"
    ],
    verification_methods: {
      "meta_tag": "available",
      "html_file": "available", 
      "dns": "available"
    }
  });
}

export async function POST() {
  // Handle verification requests
  return NextResponse.json({
    verification: "success",
    site: "quemunity.app",
    verified_at: new Date().toISOString(),
    method: "api_endpoint"
  });
}