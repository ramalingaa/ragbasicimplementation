import argparse
from dataclasses import dataclass
from langchain.vectorstores.chroma import Chroma
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_openai import AzureOpenAIEmbeddings
import os

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

os.environ["AZURE_OPENAI_API_KEY"] = "3a83ac58c3d9478bb64d17fd38342938"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://mockman-feedback.openai.azure.com/"

# embeddings = AzureOpenAIEmbeddings(
#     azure_deployment="embeddings_model",
#     openai_api_version="2023-07-01-preview",
# )
def replace_file_content(file_path, new_content):
    with open(file_path, 'w') as file:
        file.write(new_content)
# def main():
#     # Create CLI.
#     # parser = argparse.ArgumentParser()
#     # parser.add_argument("query_text", type=str, help="The query text.")
#     # args = parser.parse_args()
#     # query_text = 'For the userinput with id input, it should accept only numbers and when user enters non-numeric value it should return an error message as "Please enter a valid number". This error message should be displayed right under the input box. The error message should be displayed in red color. Return the whole code with changes with file type. example //html file content <div></div>'
#     query_text = input("Please enter your query text: ")
#     # Prepare the DB.
#     embedding_function = AzureOpenAIEmbeddings(
#     azure_deployment="embeddings_model",
#     openai_api_version="2023-07-01-preview",
#     )
#     db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

#     # Search the DB.
#     results = db.similarity_search_with_relevance_scores(query_text, k=3)
#     print(f"Found {(results)} results.")
#     if len(results) == 0 or results[0][1] < 0.5:
#         print(f"Unable to find matching results.")
#         return

#     context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
#     prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
#     prompt = prompt_template.format(context=context_text, question=query_text)
#     print(prompt)    
#     model = AzureChatOpenAI(
#      azure_deployment="mockman-interviewdata",
#      openai_api_version="2023-07-01-preview",
#     )
#     response_text = model.predict(prompt)

#     sources = [doc.metadata.get("source", None) for doc, _score in results]
#     formatted_response = f"Response: {response_text}\nSources: {sources}"
#     replace_file_content('./data/Notes.jsx', response_text)
#     print(formatted_response)

def process_query(query_text):
    # Prepare the DB.
    embedding_function = AzureOpenAIEmbeddings(
        azure_deployment="embeddings_model",
        openai_api_version="2023-07-01-preview",
    )
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.similarity_search_with_relevance_scores(query_text, k=3)
    print(f"Found {len(results)} results.")
    if len(results) == 0 or results[0][1] < 0.2:
        print("Unable to find matching results.")
        return

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    print(prompt)
    
    model = AzureChatOpenAI(
        azure_deployment="mockman-interviewdata",
        openai_api_version="2023-07-01-preview",
    )
    response_text = model.predict(prompt)

    sources = [doc.metadata.get("source", None) for doc, _score in results]
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    replace_file_content('./data/Notes.jsx', response_text)
    print(formatted_response)

def main():
    while True:
        # Prompt the user for input
        query_text = input("Please enter your query text (or type 'exit' to quit): ")
        
        if query_text.lower() == 'exit':
            print("Exiting the program.")
            break
        
        # Process the query
        process_query(query_text)

if __name__ == "__main__":
    main()