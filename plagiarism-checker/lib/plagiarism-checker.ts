// Implementation of Rabin-Karp and KMP algorithms for string matching

// Prime number for hash calculation
const PRIME = 101

/**
 * Rabin-Karp algorithm implementation
 * Uses rolling hash to find matching substrings
 */
function rabinKarp(text1: string, text2: string, minMatchLength = 5) {
  const matches: { text: string; indices: [number, number][] }[] = []

  // Convert texts to lowercase for case-insensitive comparison
  const normalizedText1 = text1.toLowerCase()
  const normalizedText2 = text2.toLowerCase()

  // For each possible substring length, starting from the minimum
  for (
    let windowSize = minMatchLength;
    windowSize <= Math.min(normalizedText1.length, normalizedText2.length);
    windowSize++
  ) {
    // Create hash map for text1
    const hashMap = new Map<number, number[]>()

    // Calculate hash for each substring in text1
    for (let i = 0; i <= normalizedText1.length - windowSize; i++) {
      const substring = normalizedText1.substring(i, i + windowSize)
      const hash = calculateHash(substring)

      if (!hashMap.has(hash)) {
        hashMap.set(hash, [])
      }
      hashMap.get(hash)!.push(i)
    }

    // Check for matches in text2
    for (let i = 0; i <= normalizedText2.length - windowSize; i++) {
      const substring = normalizedText2.substring(i, i + windowSize)
      const hash = calculateHash(substring)

      if (hashMap.has(hash)) {
        // Potential match found, verify to avoid hash collisions
        for (const pos1 of hashMap.get(hash)!) {
          if (normalizedText1.substring(pos1, pos1 + windowSize) === substring) {
            // Avoid overlapping matches
            if (!isOverlapping(matches, [pos1, pos1 + windowSize], [i, i + windowSize])) {
              matches.push({
                text: text1.substring(pos1, pos1 + windowSize),
                indices: [
                  [pos1, pos1 + windowSize],
                  [i, i + windowSize],
                ],
              })
            }
          }
        }
      }
    }
  }

  // Sort matches by length (longest first)
  matches.sort((a, b) => b.text.length - a.text.length)

  // Remove overlapping matches
  const filteredMatches = removeOverlappingMatches(matches)

  return filteredMatches
}

/**
 * KMP (Knuth-Morris-Pratt) algorithm implementation
 */
function kmp(text1: string, text2: string, minMatchLength = 5) {
  const matches: { text: string; indices: [number, number][] }[] = []

  // Convert texts to lowercase for case-insensitive comparison
  const normalizedText1 = text1.toLowerCase()
  const normalizedText2 = text2.toLowerCase()

  // For each possible substring length, starting from the minimum
  for (
    let windowSize = minMatchLength;
    windowSize <= Math.min(normalizedText1.length, normalizedText2.length);
    windowSize++
  ) {
    // Check each substring of text1 in text2 using KMP
    for (let i = 0; i <= normalizedText1.length - windowSize; i++) {
      const pattern = normalizedText1.substring(i, i + windowSize)
      const lps = computeLPSArray(pattern)
      const occurrences = kmpSearch(normalizedText2, pattern, lps)

      for (const j of occurrences) {
        // Avoid overlapping matches
        if (!isOverlapping(matches, [i, i + windowSize], [j, j + windowSize])) {
          matches.push({
            text: text1.substring(i, i + windowSize),
            indices: [
              [i, i + windowSize],
              [j, j + windowSize],
            ],
          })
        }
      }
    }
  }

  // Sort matches by length (longest first)
  matches.sort((a, b) => b.text.length - a.text.length)

  // Remove overlapping matches
  const filteredMatches = removeOverlappingMatches(matches)

  return filteredMatches
}

/**
 * Compute Longest Prefix Suffix (LPS) array for KMP algorithm
 */
function computeLPSArray(pattern: string): number[] {
  const m = pattern.length
  const lps = new Array(m).fill(0)

  let len = 0
  let i = 1

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++
      lps[i] = len
      i++
    } else {
      if (len !== 0) {
        len = lps[len - 1]
      } else {
        lps[i] = 0
        i++
      }
    }
  }

  return lps
}

/**
 * KMP search algorithm
 */
function kmpSearch(text: string, pattern: string, lps: number[]): number[] {
  const n = text.length
  const m = pattern.length
  const occurrences: number[] = []

  let i = 0 // index for text
  let j = 0 // index for pattern

  while (i < n) {
    if (pattern[j] === text[i]) {
      i++
      j++
    }

    if (j === m) {
      occurrences.push(i - j)
      j = lps[j - 1]
    } else if (i < n && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1]
      } else {
        i++
      }
    }
  }

  return occurrences
}

/**
 * Calculate hash value for a string
 */
function calculateHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * PRIME + str.charCodeAt(i)) % Number.MAX_SAFE_INTEGER
  }
  return hash
}

/**
 * Check if two matches overlap
 */
function isOverlapping(
  existingMatches: { text: string; indices: [number, number][] }[],
  range1: [number, number],
  range2: [number, number],
): boolean {
  // Check if this match overlaps with any existing match
  for (const match of existingMatches) {
    const [existingStart1, existingEnd1] = match.indices[0]
    const [existingStart2, existingEnd2] = match.indices[1]

    // Check overlap in text1
    const overlapsInText1 =
      (range1[0] >= existingStart1 && range1[0] < existingEnd1) ||
      (range1[1] > existingStart1 && range1[1] <= existingEnd1) ||
      (existingStart1 >= range1[0] && existingStart1 < range1[1])

    // Check overlap in text2
    const overlapsInText2 =
      (range2[0] >= existingStart2 && range2[0] < existingEnd2) ||
      (range2[1] > existingStart2 && range2[1] <= existingEnd2) ||
      (existingStart2 >= range2[0] && existingStart2 < range2[1])

    if (overlapsInText1 || overlapsInText2) {
      return true
    }
  }

  return false
}

/**
 * Remove overlapping matches, keeping the longest ones
 */
function removeOverlappingMatches(matches: { text: string; indices: [number, number][] }[]) {
  const result: { text: string; indices: [number, number][] }[] = []

  for (const match of matches) {
    if (!isOverlapping(result, match.indices[0], match.indices[1])) {
      result.push(match)
    }
  }

  return result
}

/**
 * Calculate similarity score between two texts based on matching segments
 */
function calculateSimilarityScore(
  text1: string,
  text2: string,
  matches: { text: string; indices: [number, number][] }[],
): number {
  // Calculate total characters matched
  let totalMatchedChars = 0
  for (const match of matches) {
    totalMatchedChars += match.text.length
  }

  // Calculate similarity as percentage of the shorter text that matches
  const shorterLength = Math.min(text1.length, text2.length)
  return shorterLength > 0 ? (totalMatchedChars / shorterLength) * 100 : 0
}

/**
 * Main function to compare two texts
 */
export async function compareTexts(text1: string, text2: string, algorithm = "rabin-karp") {
  // Split texts into lines for better processing
  const lines1 = text1.split("\n")
  const lines2 = text2.split("\n")

  // Join lines with spaces to handle line breaks consistently
  const processedText1 = lines1.join(" ")
  const processedText2 = lines2.join(" ")

  // Use selected algorithm
  let matches
  if (algorithm === "rabin-karp") {
    matches = rabinKarp(processedText1, processedText2)
  } else {
    matches = kmp(processedText1, processedText2)
  }

  // Calculate similarity score
  const similarityScore = calculateSimilarityScore(processedText1, processedText2, matches)

  return {
    matches,
    similarityScore,
  }
}
