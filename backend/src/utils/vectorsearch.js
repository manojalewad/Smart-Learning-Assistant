import mongoose from "mongoose";
import DocumentChunks from "../models/documentchunk.model.js";
import { generateQueryEmbedding } from "./geminiservices.js";

const VECTOR_INDEX_NAME = process.env.VECTOR_SEARCH_INDEX_NAME || "chunk_vector_index";

/**
 * Retrieve the most semantically relevant chunks for a question.
 * MongoDB Vector Search performs the nearest-neighbour search over the
 * chunk embeddings and filters results to the current user/document.
 */
export const findRelevantChunksByVector = async ({ documentid, userid, query, limit = 5 }) => {
    if (!documentid || !userid || !query?.trim()) return [];

    const queryEmbedding = await generateQueryEmbedding(query.trim());

    const results = await DocumentChunks.aggregate([
        {
            $vectorSearch: {
                index: VECTOR_INDEX_NAME,
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: Math.max(limit * 10, 50),
                limit,
                filter: {
                    $and: [
                        { documentid: new mongoose.Types.ObjectId(documentid) },
                        { userid: new mongoose.Types.ObjectId(userid) }
                    ]
                }
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                chunkindex: 1,
                pagenumber: 1,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ]);

    return results;
};
