import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";



const loader = new DirectoryLoader(
  "./data",
  {
    ".js": (path) => new TextLoader(path, "text"),
    ".html": (path) => new TextLoader(path, 'text'),
    ".css": (path) => new TextLoader(path, "text"),
  }
);
const docs = await loader.load();


const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 50,
  chunkOverlap: 1,
});
const docOutput = await splitter.createDocuments([
  new Document({ pageContent: docs }),
]);
// console.log(docs[0].metadata );
console.log(docs);
