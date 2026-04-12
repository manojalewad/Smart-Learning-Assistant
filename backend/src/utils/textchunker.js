/**
 * Chunk text into overlapping pieces for AI processing
 * @param {string} text
 * @param {number} chunkSize - max words per chunk
 * @param {number} overlap - overlapping words between chunks
 * @returns {Array<{content:string, chunkindex:number, pageNumber:number}>}
 */
//need to be larn
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }
    // Clean text
    const cleanedText = text
        .replace(/\r\n/g, "\n")
        .replace(/\s+/g, " ")
        .replace(/\n\n+/g, "\n")
        .replace(/ \n/g, "\n")
        .trim();

    // Split into paragraphs
    const paragraphs = cleanedText
        .split(/\n+/)
        .filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkindex = 0;

    for (const paragraph of paragraphs) {

        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // If paragraph itself is larger than chunk
        if (paragraphWordCount > chunkSize) {

            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join("\n\n"),
                    chunkindex: chunkindex++,
                    pageNumber: 0
                });

                currentChunk = [];
                currentWordCount = 0;
            }

            // Split large paragraph
            if (overlap >= chunkSize) {
            overlap = Math.floor(chunkSize / 2);
            }
            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {

                const chunkWords = paragraphWords.slice(i, i + chunkSize);

                chunks.push({
                    content: chunkWords.join(" "),
                    chunkindex: chunkindex++,
                    pageNumber: 0
                });

                if (i + chunkSize >= paragraphWords.length) break;
            }

            continue;
        }

        // If adding paragraph exceeds chunk size
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {

            chunks.push({
                content: currentChunk.join("\n\n"),
                chunkindex: chunkindex++,
                pageNumber: 0
            });

            // Create overlap
            const prevText = currentChunk.join(" ");
            const prevWords = prevText.split(/\s+/);

            const overlapText = prevWords
                .slice(-Math.min(overlap, prevWords.length))
                .join(" ");

            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;

        } else {

            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;

        }
    }

    // Add last chunk
    if (currentChunk.length > 0) {

        chunks.push({
            content: currentChunk.join("\n\n"),
            chunkindex: chunkindex++,
            pageNumber: 0
        });

    }
    // Fallback: If no chunks created, split by words
    // Fallback: If no chunks created, split by words
    if (chunks.length === 0 && cleanedText.length > 0) {

        const allWords = cleanedText.split(/\s+/);

        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {

            const chunkWords = allWords.slice(i, i + chunkSize);

            chunks.push({
                content: chunkWords.join(' '),
                chunkindex: chunkindex++,
                pageNumber: 0
            });

            if (i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {

    if (!chunks || chunks.length === 0 || !query) {
        return [];
    }

    // Common stop words to exclude
    const stopWords = new Set([
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
        'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it'
    ]);

    // Extract and clean query words
    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    if (queryWords.length === 0) {

        // Return clean chunk objects without mongoose metadata
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkindex: chunk.chunkindex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id
        }));
    }
    const scoredChunks = chunks.map((chunk, index) => {

        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;

        let score = 0;

        // Score each query word
        for (const word of queryWords) {

            // Exact word match (higher score)
            const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
            score += exactMatches * 3;

            // Partial match (lower score)
            const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        // Bonus: Multiple query words found
        const uniqueWordsFound = queryWords.filter(word =>
            content.includes(word)
        ).length;

        if (uniqueWordsFound > 1) {
            score += uniqueWordsFound * 2;
        }

        // Normalize by content length
        const normalizedScore = score / Math.sqrt(contentWords);

        // Small bonus for earlier chunks
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        return {
            content: chunk.content,
            chunkindex: chunk.chunkindex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: uniqueWordsFound
        };
    });
    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => {

            if (b.score !== a.score) {
                return b.score - a.score;
            }

            if (b.matchedWords !== a.matchedWords) {
                return b.matchedWords - a.matchedWords;
            }

            return a.chunkindex - b.chunkindex;
        })
        .slice(0, maxChunks);
};

