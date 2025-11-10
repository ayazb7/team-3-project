import json
import MySQLdb.cursors
from utils.courses_routes_utils import get_public_courses
from openai import OpenAI
import app
import numpy as np
from utils.embeddings_utils import cosine_similarity
import json



client = OpenAI()

def embed_all_courses():
    """
    Function to embed ALL courses present. Ideally only used once.
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("TRUNCATE TABLE course_embedding")
    app.mysql.connection.commit()

    courses = get_public_courses()
    print("embedding")
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
    

def get_courses_from_embedding(text = None, embedding = None, ids: list[int] = None, n=3):
    """
    Get relevant courses from embedding
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    embedded_text = get_embedding(text) if text  else ""



    # Get all courses from the embedding database the the user hasn't completed
    query = "SELECT ce.course_id, ce.embedding from course_embedding ce left join user_course_progress up on ce.course_id = up.course_id"
    values = []
    if ids:
        placeholders = ["%s" for c in ids]
        placeholders = ",".join(placeholders)

        query += f" WHERE ce.course_id NOT IN ({placeholders}) and up.progress_percentage < 100 or up.course_id is NULL" 
        values += ids
    
    print(query, values, ids)
    cursor.execute(query, values)
    embedded_courses = cursor.fetchall()
    

    if len(embedded_courses) < 1:
        return "No similar courses found", 404

    similarities = []

    for obj in embedded_courses:
        cid = obj["course_id"]
        emb_json = obj["embedding"]
        emb = np.array(json.loads(emb_json))

        if embedding is not None and embedding.all():
            embedded_text = embedding

        similarity = cosine_similarity(embedded_text, emb)
        similarities.append((cid, similarity))

    similarities.sort(key=lambda x: x[1], reverse=True)

    # Only get top n
    similarities = similarities[:n]
    # extract ids after sorting
    course_ids = []
    for id, _ in similarities: 
            course_ids.append(id)


    # if len(course_ids) < 1:
    #     return jsonfiy("Could not find similar courses"), 404

    placeholders = ",".join(["%s"] * len(course_ids))
    
    query_values = course_ids + course_ids
    cursor.execute(f"SELECT * from courses where id in ({placeholders}) order by field(id, {placeholders}) ", query_values)

    courses = cursor.fetchall()
    return courses, 200

def get_recommended_courses_based_on_user_details(user_id):

    # Get courses that the user has progress in 
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute("SELECT course_id FROM user_course_progress WHERE user_id = %s", user_id)

    enrolled_courses_ids = cursor.fetchall()

    if len(enrolled_courses_ids) < 1:
        return "Can not recommend courses as user is not enrolled in any courses", 404


    # Get embedding of the courses
    placeholders = []
    course_ids = []


    for course in enrolled_courses_ids:
        placeholders.append("%s")
        course_ids.append(course["course_id"])


    placeholders = ",".join(placeholders)
    cursor.execute(f"SELECT embedding FROM course_embedding WHERE course_id IN ({placeholders})", course_ids)

    # Combine embedding wth average
    embeddings = cursor.fetchall()
    np_embeddings = [np.array(json.loads(e["embedding"])) for e in embeddings]


    combined_embeddings = np.mean(np_embeddings, axis=0)


    data, code = get_courses_from_embedding(embedding=combined_embeddings, ids = course_ids)
    return data, code