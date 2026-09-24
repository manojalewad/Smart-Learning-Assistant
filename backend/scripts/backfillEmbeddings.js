import "dotenv/config";
import mongoose from "mongoose";
import Documents from "../src/models/document.model.js";
import DocumentChunks from "../src/models/documentchunk.model.js";
import { generateDocumentEmbeddings } from "../src/utils/geminiservices.js";

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI (or MONGO_URI) is not set");

await mongoose.connect(MONGODB_URI);

try {
    const documents = await Documents.find({ status: "ready" }).select("_id userid chunks");
    let processed = 0;

    for (const document of documents) {
        if (!document.chunks?.length) continue;

        await DocumentChunks.deleteMany({ documentid: document._id });
        const embeddings = await generateDocumentEmbeddings(
            document.chunks.map(chunk => chunk.content)
        );

        const rows = document.chunks.map((chunk, index) => ({
            documentid: document._id,
            userid: document.userid,
            content: chunk.content,
            pagenumber: chunk.pagenumber || chunk.pageNumber || 0,
            chunkindex: chunk.chunkindex,
            embedding: embeddings[index]
        }));

        await DocumentChunks.insertMany(rows);
        processed++;
        console.log(`Backfilled ${processed}/${documents.length}: ${document._id}`);
    }

    console.log(`Finished. Processed ${processed} ready documents.`);
} finally {
    await mongoose.disconnect();
}
