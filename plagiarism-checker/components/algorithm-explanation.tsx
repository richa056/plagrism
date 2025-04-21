import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AlgorithmExplanation() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">String Matching Algorithms</h2>
        <p className="text-muted-foreground">Learn about the algorithms used in this plagiarism checker</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="rabin-karp">
          <AccordionTrigger>Rabin-Karp Algorithm (Hashing)</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <p>
              The Rabin-Karp algorithm is a string-searching algorithm that uses hashing to find patterns in strings.
            </p>

            <h4 className="font-medium mt-2">How it works:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li>Calculate a hash value for the pattern</li>
              <li>Calculate hash values for all possible substrings of the text with the same length as the pattern</li>
              <li>Compare the hash values - if they match, compare the actual substrings</li>
              <li>Use a rolling hash function to efficiently calculate hash values for subsequent substrings</li>
            </ol>

            <h4 className="font-medium mt-2">Time Complexity:</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Average case: O(n + m) where n is the length of the text and m is the length of the pattern</li>
              <li>Worst case: O(n*m) - occurs when there are many hash collisions</li>
            </ul>

            <h4 className="font-medium mt-2">Advantages:</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Efficient for multiple pattern searching</li>
              <li>Good for plagiarism detection where we need to find matching segments</li>
              <li>Can handle large texts efficiently</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="kmp">
          <AccordionTrigger>KMP (Knuth-Morris-Pratt) Algorithm</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <p>
              The KMP algorithm is an efficient string-matching algorithm that uses information about the pattern itself
              to minimize comparisons.
            </p>

            <h4 className="font-medium mt-2">How it works:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li>Preprocess the pattern to build a "partial match" table (also called "failure function")</li>
              <li>Use this table to skip characters that we know will not match</li>
              <li>Avoid backtracking in the main text, making it more efficient</li>
            </ol>

            <h4 className="font-medium mt-2">Time Complexity:</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Preprocessing: O(m) where m is the length of the pattern</li>
              <li>Matching: O(n) where n is the length of the text</li>
              <li>Overall: O(n + m)</li>
            </ul>

            <h4 className="font-medium mt-2">Advantages:</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Never needs to backtrack in the main text</li>
              <li>Guaranteed linear time performance</li>
              <li>Particularly efficient when the pattern has repeating subpatterns</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="educational">
          <AccordionTrigger>Educational Value</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <p>This plagiarism checker demonstrates several important computer science concepts:</p>

            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>
                <span className="font-medium">String Matching:</span> Fundamental algorithms for finding patterns in
                text
              </li>
              <li>
                <span className="font-medium">Hashing:</span> Using hash functions to quickly compare large amounts of
                data
              </li>
              <li>
                <span className="font-medium">Algorithm Efficiency:</span> Comparing different approaches to solve the
                same problem
              </li>
              <li>
                <span className="font-medium">Text Processing:</span> Techniques for analyzing and comparing documents
              </li>
              <li>
                <span className="font-medium">Data Structures:</span> Using arrays and tables to optimize algorithms
              </li>
            </ul>

            <p className="mt-2">These concepts are essential in various fields including:</p>

            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Academic integrity systems</li>
              <li>Code similarity detection</li>
              <li>Bioinformatics (DNA sequence matching)</li>
              <li>Information retrieval systems</li>
              <li>Natural language processing</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
