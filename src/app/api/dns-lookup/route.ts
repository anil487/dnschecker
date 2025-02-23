import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns/promises";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
        return NextResponse.json({ error: "Domain parameter is required" }, { status: 400 });
    }

    const recordTypes = ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA"] as const;

    // Define a flexible type for results
    const results: Record<string, string | object | object[]> = {};

    for (const record of recordTypes) {
        try {
            const answers = await resolveDns(domain, record);
            results[record] = answers;
        } catch {
            results[record] = "No record found";
        }
    }

    return NextResponse.json(results, { status: 200 });
}

// Function to handle different record types properly
async function resolveDns(domain: string, recordType: string) {
    switch (recordType) {
        case "A":
        case "AAAA":
        case "CNAME":
        case "NS":
            return await dns.resolve(domain, recordType); // Returns string[]
        case "MX":
            return await dns.resolveMx(domain); // Returns { exchange: string, priority: number }[]
        case "TXT":
            return await dns.resolveTxt(domain); // Returns string[][]
        case "SOA":
            return await dns.resolveSoa(domain); // Returns a single object of type SoaRecord
        default:
            return "Unsupported record type";
    }
}
