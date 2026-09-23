import os
import glob
from typing import List, Dict, Any
from backend.app.core.config import settings

class KnowledgeRetriever:
    """
    Lightweight keyword/TF-IDF style local knowledge retriever from Markdown and JSON files.
    Works entirely offline with zero paid API requirement.
    """

    def __init__(self):
        self.documents = []
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        kb_dir = settings.KNOWLEDGE_BASE_DIR
        if not os.path.exists(kb_dir):
            return
            
        md_files = glob.glob(os.path.join(kb_dir, "*.md"))
        for file_path in md_files:
            filename = os.path.basename(file_path)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    self.documents.append({
                        "filename": filename,
                        "title": filename.replace(".md", "").replace("_", " ").title(),
                        "content": content
                    })
            except Exception as e:
                print(f"Error loading {file_path}: {e}")

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        query_tokens = set(query.lower().split())
        scored_docs = []

        for doc in self.documents:
            score = 0
            doc_text = doc["content"].lower()
            for token in query_tokens:
                if len(token) > 2 and token in doc_text:
                    # Title matches weight more
                    if token in doc["title"].lower():
                        score += 3
                    score += doc_text.count(token)
            
            if score > 0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored_docs[:top_k]]

knowledge_retriever = KnowledgeRetriever()
