import json
import MySQLdb.cursors
from utils.courses_routes_utils import get_public_courses
from openai import OpenAI
import app
import numpy as np
from utils.embeddings_utils import cosine_similarity



client = OpenAI()

def embed_all_courses():
    """
    Function to embed ALL courses present. Ideally only used once.
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("TRUNCATE TABLE course_embedding")
    app.mysql.connection.commit()

    courses = get_public_courses()

    embed_courses(courses)
    

def embed_courses(courses: list[str]):
    """
    Function to embed any number of courses
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    course_names_and_descriptions = [course["name"] + " " + course["description"] for course in courses]
    response = client.embeddings.create(
            model="text-embedding-3-small",
            input=course_names_and_descriptions
            )

    embeddings = [data.embedding for data in response.data]

    prepared_records = []
    for i in range(len(courses)):
        prepared_records.append((courses[i]["id"], course_names_and_descriptions[i], json.dumps(embeddings[i])))

    cursor.executemany("INSERT INTO course_embedding (course_id, embed_text, embedding) values (%s, %s, %s)", prepared_records)

    app.mysql.connection.commit()

    


def get_embedding(text: str):
    """
    Get embedding vectors for a given text
    """
    return client.embeddings.create(input=[text], model="text-embedding-3-small").data[0].embedding
    

def get_courses_from_embedding(text: str, n=3):
    """
    Get relevant courses from embedding
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    embedded_text = get_embedding(text)

    # Get all courses from the embedding database
    cursor.execute("SELECT course_id, embedding from course_embedding")
    embedded_courses = cursor.fetchall()

    similarities = []

    for obj in embedded_courses:
        cid = obj["course_id"]
        emb_json = obj["embedding"]
        emb = np.array(json.loads(emb_json))
        similarity = cosine_similarity(embedded_text, emb)
        similarities.append((cid, similarity))

    similarities.sort(key=lambda x: x[1], reverse=True)

    # extract ids after sorting
    course_ids = []
    for id, _ in similarities:
        course_ids.append(id)

    placeholders = ",".join(["%s"] * len(course_ids))
    
    query_values = course_ids + course_ids + [n]
    cursor.execute(f"SELECT * from courses where id in ({placeholders}) order by field(id, {placeholders}) limit {'%s'}", query_values)

    courses = cursor.fetchall()
    return courses
