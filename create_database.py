
# from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import os
import shutil
from langchain.vectorstores.chroma import Chroma
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader






os.environ["AZURE_OPENAI_API_KEY"] = "3a83ac58c3d9478bb64d17fd38342938"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://mockman-feedback.openai.azure.com/"


embeddings = AzureOpenAIEmbeddings(
    azure_deployment="embeddings_model",
    openai_api_version="2023-07-01-preview",
)

CHROMA_PATH = "chroma"

def main():
    generate_data_store()
  
def load_documents():
    print("Loading documents...")
    loader =  DirectoryLoader(
        './data/structured-dashboard-main',
        glob="**/*",
        exclude = ["**/*.png", "**/*.ico", "**/*.ttf"], #exclude files that cannot be loaded as a text
        loader_cls=TextLoader
    )
    document = loader.load()
    # print(document)
    return document

def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    # print(f"chunks {chunks}")

    # print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    # document = chunks[10]
    # print(document.page_content)
    # print(document.metadata)

    return chunks


def save_to_chroma(chunks: list[Document]):
    # Clear out the database first.
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    # Create a new DB from the documents.
    db = Chroma.from_documents(
        chunks, embeddings, persist_directory=CHROMA_PATH
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")


def generate_data_store():
    print("Generating data store...")
    documents = load_documents()
    chunks = split_text(documents)
    save_to_chroma(chunks)

generate_data_store()
# if __name__ == "__main__":
#     main()

