"use client"

import type React from "react"

import { useState } from "react"
import { compareTexts } from "@/lib/plagiarism-checker"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import ResultDisplay from "@/components/result-display"
import AlgorithmExplanation from "@/components/algorithm-explanation"

export default function PlagiarismChecker() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [algorithm, setAlgorithm] = useState("rabin-karp")
  const [results, setResults] = useState<{
    matches: { text: string; indices: [number, number][] }[]
    similarityScore: number
    processTime: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompare = async () => {
    if (!text1 || !text2) return

    setIsLoading(true)
    try {
      const startTime = performance.now()
      const comparisonResults = await compareTexts(text1, text2, algorithm)
      const endTime = performance.now()

      setResults({
        ...comparisonResults,
        processTime: endTime - startTime,
      })
    } catch (error) {
      console.error("Error comparing texts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (textSetter: (text: string) => void) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        textSetter(event.target.result as string)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Plagiarism Checker</CardTitle>
          <CardDescription>
            Compare two texts to find similarities using advanced string matching algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Text Input</TabsTrigger>
              <TabsTrigger value="about">About Algorithms</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="text1">Document 1</Label>
                  <Textarea
                    id="text1"
                    placeholder="Paste or type the first document here"
                    className="min-h-[200px]"
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("file1")?.click()}>
                      Upload File
                    </Button>
                    <input
                      id="file1"
                      type="file"
                      accept=".txt"
                      className="hidden"
                      onChange={handleFileUpload(setText1)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => setText1("")}>
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text2">Document 2</Label>
                  <Textarea
                    id="text2"
                    placeholder="Paste or type the second document here"
                    className="min-h-[200px]"
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("file2")?.click()}>
                      Upload File
                    </Button>
                    <input
                      id="file2"
                      type="file"
                      accept=".txt"
                      className="hidden"
                      onChange={handleFileUpload(setText2)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => setText2("")}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Algorithm Selection</Label>
                <RadioGroup
                  defaultValue="rabin-karp"
                  className="flex flex-col space-y-1"
                  value={algorithm}
                  onValueChange={setAlgorithm}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rabin-karp" id="rabin-karp" />
                    <Label htmlFor="rabin-karp" className="font-medium">
                      Rabin-Karp (Hashing)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kmp" id="kmp" />
                    <Label htmlFor="kmp" className="font-medium">
                      KMP (Knuth-Morris-Pratt)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button className="w-full" onClick={handleCompare} disabled={!text1 || !text2 || isLoading}>
                {isLoading ? "Comparing..." : "Compare Documents"}
              </Button>
            </TabsContent>

            <TabsContent value="about">
              <AlgorithmExplanation />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {results && (
        <ResultDisplay
          text1={text1}
          text2={text2}
          matches={results.matches}
          similarityScore={results.similarityScore}
          processTime={results.processTime}
          algorithm={algorithm}
        />
      )}
    </div>
  )
}
