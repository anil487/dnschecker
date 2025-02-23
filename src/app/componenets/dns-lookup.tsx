"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RotateCcw } from "lucide-react"

type DnsRecord = {
  address?: string
  ttl?: number
  exchange?: string
  priority?: number
  nameserver?: string
  hostmaster?: string
}

type DnsResponse = {
  query: string
  records: {
    A: DnsRecord[]
    CNAME: DnsRecord[]
    MX: DnsRecord[]
    NS: DnsRecord[]
    SOA: DnsRecord[]
    TXT: string[]
  }
}

export default function DnsLookup() {
  const [hostname, setHostname] = useState("")
  const [data, setData] = useState<DnsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(`/api/dns-lookup?domain=${hostname}`)
      if (!res.ok) throw new Error("Failed to fetch DNS data")

      const rawData = await res.json()

      const formattedData: DnsResponse = {
        query: hostname,
        records: {
          A: rawData.A.map((ip: string) => ({ address: ip })),
          CNAME: rawData.CNAME.length===0 ? [] : [{ address: rawData.CNAME  }],
          MX: rawData.MX.map((record: { exchange: string; priority: number }) => ({
            exchange: record.exchange,
            priority: record.priority,
          })),
          NS: rawData.NS.map((ns: string) => ({ nameserver: ns })),
          SOA: rawData.SOA ? [{ nameserver: rawData.SOA.nsname, hostmaster: rawData.SOA.hostmaster }] : [],
          TXT: rawData.TXT.flat(),
        },
      }

      setData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setHostname("")
    setData(null)
    setError(null)
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">DNS Lookup Tool</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            placeholder="Enter domain name"
            className="flex-grow"
          />
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-700 flex-grow sm:flex-grow-0" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Lookup"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="flex-grow sm:flex-grow-0"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {data && (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className=" text-base md:text-xl font-semibold mb-2">Results for: {data.query}</h2>
          <Tabs defaultValue="A">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
              <TabsTrigger value="A">A</TabsTrigger>
              <TabsTrigger value="CNAME">CNAME</TabsTrigger>
              <TabsTrigger value="MX">MX</TabsTrigger>
              <TabsTrigger value="NS">NS</TabsTrigger>
              <TabsTrigger value="SOA">SOA</TabsTrigger>
              <TabsTrigger value="TXT">TXT</TabsTrigger>
            </TabsList>
            <TabsContent value="A">
              <RecordList records={data.records.A} type="A" />
            </TabsContent>
            <TabsContent value="CNAME">
              <RecordList records={data.records.CNAME} type="CNAME" />
            </TabsContent>
            <TabsContent value="MX">
              <RecordList records={data.records.MX} type="MX" />
            </TabsContent>
            <TabsContent value="NS">
              <RecordList records={data.records.NS} type="NS" />
            </TabsContent>
            <TabsContent value="SOA">
              <RecordList records={data.records.SOA} type="SOA" />
            </TabsContent>
            <TabsContent value="TXT">
              <TxtRecordList records={data.records.TXT} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

function RecordList({ records, type }: { records: DnsRecord[]; type: string }) {
  if (records.length === 0) {
    return <p>No {type} records found.</p>
  }

  return (
    <ul className="space-y-2">
      {records.map((record, index) => (
        <li key={index} className="bg-gray-50 p-2 rounded">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {record.address && (
              <div>
                <span className="font-semibold">Address:</span> {record.address}
              </div>
            )}
            {record.exchange && (
              <div>
                <span className="font-semibold">Exchange:</span> {record.exchange}
              </div>
            )}
            {record.priority !== undefined && (
              <div>
                <span className="font-semibold">Priority:</span> {record.priority}
              </div>
            )}
            {record.nameserver && (
              <div>
                <span className="font-semibold">Nameserver:</span> {record.nameserver}
              </div>
            )}
            {record.hostmaster && (
              <div>
                <span className="font-semibold">Hostmaster:</span> {record.hostmaster}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

function TxtRecordList({ records }: { records: string[] }) {
  return records.length ? (
    <ul className="space-y-2">
      {records.map((record, index) => (
        <li key={index} className="bg-gray-50 p-2 rounded break-words">
          {record}
        </li>
      ))}
    </ul>
  ) : (
    <p>No TXT records found.</p>
  )
}

