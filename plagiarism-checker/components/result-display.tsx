import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResultDisplayProps {
  text1: string
  text2: string
  matches: { text: string; indices: [number, number][] }[]
  similarityScore: number
  processTime: number
  algorithm: string
}

export default function ResultDisplay({
  text1,
  text2,
  matches,
  similarityScore,
  processTime,
  algorithm,
}: ResultDisplayProps) {
  // Function to highlight matches in text
  const highlightMatches = (text: string, documentIndex: number) => {
    let result = text
    let offset = 0

    // Sort matches by their starting position to ensure proper highlighting
    const sortedMatches = [...matches].sort((a, b) => {
      const aIndex = a.indices[documentIndex][0]
      const bIndex = b.indices[documentIndex][0]
      return aIndex - bIndex
    })

    for (const match of sortedMatches) {
      const [start, end] = match.indices[documentIndex]
      const adjustedStart = start + offset
      const adjustedEnd = end + offset

      // Create highlighted span
      const before = result.substring(0, adjustedStart)
      const highlighted = result.substring(adjustedStart, adjustedEnd)
      const after = result.substring(adjustedEnd)

      result = `${before}<span class="bg-yellow-200 dark:bg-yellow-800">${highlighted}</span>${after}`

      // Adjust offset for added HTML tags
      offset += '<span class="bg-yellow-200 dark:bg-yellow-800">'.length + "</span>".length
    }

    return result
  }

  const getSeverityBadge = (score: number) => {
    if (score < 20) return <Badge className="bg-green-500">Low</Badge>
    if (score < 50) return <Badge className="bg-yellow-500">Medium</Badge>
    return <Badge className="bg-red-500">High</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Plagiarism Analysis Results</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal">Similarity:</span>
            {getSeverityBadge(similarityScore)}
          </div>
        </CardTitle>
        <CardDescription>Using {algorithm === "rabin-karp" ? "Rabin-Karp (Hashing)" : "KMP"} algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Similarity Score</span>
            <span className="font-medium">{similarityScore.toFixed(2)}%</span>
          </div>
          <Progress value={similarityScore} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">Processed in {processTime.toFixed(2)}ms</div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Found {matches.length} matching segments</h3>
          {matches.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
              {matches.map((match, idx) => (
                <div key={idx} className="text-sm p-2 bg-muted rounded">
                  <div className="font-medium mb-1">Match #{idx + 1}</div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded">{match.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="doc1" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="doc1">Document 1</TabsTrigger>
            <TabsTrigger value="doc2">Document 2</TabsTrigger>
          </TabsList>

          <TabsContent value="doc1" className="mt-4">
            <div className="border rounded-md p-4 whitespace-pre-wrap text-sm">
              <div dangerouslySetInnerHTML={{ __html: highlightMatches(text1, 0) }} />
            </div>
          </TabsContent>

          <TabsContent value="doc2" className="mt-4">
            <div className="border rounded-md p-4 whitespace-pre-wrap text-sm">
              <div dangerouslySetInnerHTML={{ __html: highlightMatches(text2, 1) }} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
