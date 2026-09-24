import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
const INDEX_NAME = process.env.VECTOR_SEARCH_INDEX_NAME || "chunk_vector_index";

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI (or MONGO_URI) is not set");
}

await mongoose.connect(MONGODB_URI);

try {
    const collection = mongoose.connection.db.collection("documentchunks");

    const existing = await collection.listSearchIndexes(INDEX_NAME).toArray();
    if (existing.length > 0) {
        console.log(`Vector index '${INDEX_NAME}' already exists.`);
        process.exit(0);
    }

    const result = await collection.createSearchIndex({
        name: INDEX_NAME,
        type: "vectorSearch",
        definition: {
            fields: [
                {
                    type: "vector",
                    path: "embedding",
                    numDimensions: 768,
                    similarity: "cosine"
                },
                {
                    type: "filter",
                    path: "documentid"
                },
                {
                    type: "filter",
                    path: "userid"
                }
            ]
        }
    });

    console.log(`Created vector index: ${result}`);
    console.log("Wait until the index status becomes READY before testing chat.");
} finally {
    await mongoose.disconnect();
}
