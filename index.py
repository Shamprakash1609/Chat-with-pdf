'''
1. Loading
2. Splitting
3. Storage
4. Retrival
5. Generation
'''
# Before executing 
# pip install pypdf
# pip install faiss-cpu
# pip install langchain

# 1 & 2
from langchain.document_loaders import PyPDFLoader

loader = PyPDFLoader("finance-bill-2023-highlights.pdf")
pages_content = loader.load_and_split()
print(len(pages_content),pages_content)

# 3 FAISS - Facebook AI similarity search
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(pages_content,embeddings) # preforming Similarity search 

# Saving 
db.save_local("faiss_index") # Save the DB locally

# load
new_db = FAISS.load_local("faiss_index",embeddings) # Loading locally saved DB

#4
query = "are there any tax deduction for online gaming"
#docs = new_db.similarity_search(query)
#print(docs)

#5
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
llm = ChatOpenAI()

qa_chain = RetrievalQA.from_chain_type(llm,retriever = new_db.as_retriever())
#res = qa_chain({"query": "is there any tax deduction for online gaming"})
#print(res)

def ask(user_query):
    res = qa_chain({"query":user_query})
    return res["result"]




