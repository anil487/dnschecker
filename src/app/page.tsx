import DnsLookup from "./componenets/dns-lookup"
import { CheckCircleIcon } from "lucide-react"

const DNS_RECORDS = [
  {
    parameters: "A (Address) Record",
    purpose: "Maps a domain name to an IPv4 address (e.g., example.com → 192.168.1.1).",
  },
  {
    parameters: "AAAA Record",
    purpose: "Maps a domain name to an IPv6 address.",
  },
  {
    parameters: "CNAME (Canonical Name) Record",
    purpose: "Creates an alias for a domain (e.g., www.example.com → example.com).",
  },
  {
    parameters: "MX (Mail Exchange) Record",
    purpose: "Defines the mail servers responsible for email delivery.",
  },
  {
    parameters: "TXT (Text) Record",
    purpose: "Stores text information, often used for security purposes (e.g., SPF, DKIM, DMARC).",
  },
  {
    parameters: "NS (Name Server) Record",
    purpose: "Specifies the authoritative name servers for a domain.",
  },
  {
    parameters: "SOA (Start of Authority) Record",
    purpose:
      "Provides administrative details about the domain, including primary DNS server and serial number for updates.",
  },
]

export default function DnsLookupPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <DnsLookup />

      <div className="max-w-3xl mx-auto mt-10 space-y-8">
        <section>
          <h2 className="font-bold text-3xl mb-4">What is DNS?</h2>
          <p className="text-base text-gray-700">
            DNS (Domain Name System) is a decentralized system that translates human-readable domain names (e.g.,
            example.com) into IP addresses (e.g., 192.168.1.1) that computers use to identify each other on networks,
            including the internet.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-3xl mb-4">Why Do We Need DNS?</h2>
          <ul className="space-y-2">
            {[
              {
                title: "Simplifies Access",
                description: "Users don't have to remember complex numerical IP addresses.",
              },
              {
                title: "Efficient and Scalable",
                description: "It distributes domain resolution tasks across a global network of servers.",
              },
              {
                title: "Supports Website Redirection",
                description: "Allows websites to change IP addresses without affecting users.",
              },
              {
                title: "Enhances Security",
                description:
                  "Helps manage domain-based security features like SSL certificates and email authentication.",
              },
            ].map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircleIcon className="text-violet-500 w-5 h-5 flex-shrink-0 mt-1" />
                <span>
                  <strong>{item.title}:</strong> {item.description}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-3xl mb-4">Common DNS Record Types</h2>
          <ul className="space-y-2">
            {DNS_RECORDS.map((record, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircleIcon className="text-violet-500 w-5 h-5 flex-shrink-0 mt-1" />
                <span>
                  <strong>{record.parameters}:</strong> {record.purpose}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

