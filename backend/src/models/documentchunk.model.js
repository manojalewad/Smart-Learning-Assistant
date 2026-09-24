import mongoose, { Schema } from "mongoose";

const documentchunkschema = new Schema({
    documentid: {
        type: Schema.Types.ObjectId,
        ref: "Documents",
        required: true,
        index: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    pagenumber: {
        type: Number,
        default: 0
    },
    chunkindex: {
        type: Number,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    }
}, { timestamps: true });

documentchunkschema.index({ documentid: 1, chunkindex: 1 }, { unique: true });

documentchunkschema.index({ userid: 1, documentid: 1 });

const DocumentChunks = mongoose.model("DocumentChunks", documentchunkschema);

export default DocumentChunks;
