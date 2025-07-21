import math
import collections
import re



def normalize(raw_strings: list[str]):
    # global unformat_len
    # normalize and split words
    normalized_documents = list()
    for string in raw_strings:
        string = string.lower()
        string = re.sub(r"[.,?!;:\"'-[\]{}]", "", string)
        formatted_list = string.split()
        normalized_documents.append(formatted_list)
    
    # print(normalized_documents)
    unformat_len = len(normalized_documents)
    return normalized_documents, unformat_len

def do_vocab_stuff(normalized_documents):
    # Get a list of all words in the documents
    # Store the frequency of all words across all documents
    vocab_set = set()
    vocab_count_global = collections.defaultdict(int)
    for document in normalized_documents:
        for word in document:
            vocab_count_global[word] += 1
            vocab_set.add(word)
    vocab = sorted(list(vocab_set))
    corpus_length = len(vocab)
    return vocab, corpus_length

def TF(normalized_documents):
    # global scores
    # Calculate the Term Frequency, the score of each word in each document
    scores = list()
    for document in normalized_documents:
        vocab_count_local = collections.defaultdict(int)
        for word in document:
            vocab_count_local[word] += 1
        tf = collections.defaultdict(float)
        doc_len = len(document)
        for key, value in vocab_count_local.items():
            tf[key] = value / doc_len
        scores.append(tf)
    return scores

def IDF(normalized_documents):
    # global idf
    # Get the amount of documents each word appears in
    idf = collections.defaultdict(int)
    for document in normalized_documents:
        document = set(document)
        for word in document:
            idf[word] += 1
    return idf

def TF_IDF(unformat_len, normalized_documents, scores, corpus_length, idf, vocab):
    # Calculate TF * IDF
    all_document_scores = list()
    document_score = list()
    for d_idx, document in enumerate(normalized_documents):
        document_score.clear()
        for idx in range(corpus_length):
            vocab_idx = vocab[idx]
            document_score.append(scores[d_idx][vocab_idx] * math.log10((1 + unformat_len)/(1 + idf[vocab_idx])))
        all_document_scores.append(document_score.copy())

    print(all_document_scores)
    print("\n")

def do_the_TF_IDF(raw_strings: list[str]):
    normalized_documents, unformat_len = normalize(raw_strings)
    vocab, corpus_length = do_vocab_stuff(normalized_documents)
    scores = TF(normalized_documents)
    idf = IDF(normalized_documents)
    TF_IDF(unformat_len, normalized_documents, scores, corpus_length, idf, vocab)


# index()
if __name__ == "__main__":
    raw_strings: list[str] = [ "A fish. died today", "A A cow didn't die today" ]
    do_the_TF_IDF(raw_strings)

