import json
from utils.courses_routes_utils import get_public_courses
from openai import OpenAI
import app
import numpy as np
from utils.embeddings_utils import cosine_similarity
import json

COUNT_EMBEDDINGS_QUERY = "SELECT COUNT(*) as count FROM course_embedding"

client = OpenAI()

def ensure_courses_embedded():
    """
    Check if courses are embedded, and if not, embed them automatically.
    This is called on app startup to ensure embeddings are ready.
    """
    cursor = app.mysql.connection.cursor()
    cursor.execute(COUNT_EMBEDDINGS_QUERY)
    result = cursor.fetchone()
    embedding_count = result['count'] if result else 0
    
    cursor.execute("SELECT COUNT(*) as count FROM courses")
    result = cursor.fetchone()
    course_count = result['count'] if result else 0
    
    print(f"Found {embedding_count} embeddings and {course_count} courses")
    
    if course_count > 0 and embedding_count != course_count:
        print(f"Embedding {course_count} courses (found {embedding_count} existing embeddings)...")
        embed_all_courses()
    else:
        print("Courses already embedded, skipping embedding initialization")


def embed_all_courses():
    """
    Function to embed ALL courses present. Ideally only used once.
    """
    cursor = app.mysql.connection.cursor()
    cursor.execute("TRUNCATE TABLE course_embedding")
    app.mysql.connection.commit()

    courses = get_public_courses()
    print("embedding")
    embed_courses(courses)
    

def embed_courses(courses: list[str]):
    """
    Function to embed any number of courses
    """
    cursor = app.mysql.connection.cursor()
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
    try:
        cursor = app.mysql.connection.cursor()
        
        # First check if embeddings exist
        cursor.execute(COUNT_EMBEDDINGS_QUERY)
        result = cursor.fetchone()
        if not result or result['count'] == 0:
            cursor.close()
            return {"error": "Embeddings are being initialized. Please try again in a moment."}, 503
        
        embedded_text = get_embedding(text) if text else ""

        # Get all courses from the embedding database
        query = "SELECT ce.course_id, ce.embedding FROM course_embedding ce"
        values = []
        if ids:
            placeholders = ["%s" for _ in ids]
            placeholders = ",".join(placeholders)
            query += f" WHERE ce.course_id NOT IN ({placeholders})" 
            values += ids
        
        print(query, values, ids)
        cursor.execute(query, values)
        embedded_courses = cursor.fetchall()
        

        if len(embedded_courses) < 1:
            cursor.close()
            return {"error": "No similar courses found"}, 404

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

        print(course_ids)

        placeholders = ",".join(["%s"] * len(course_ids))
        
        query_values = course_ids + course_ids
        cursor.execute(f"SELECT * from courses where id in ({placeholders}) order by field(id, {placeholders}) ", query_values)

        courses = cursor.fetchall()
        cursor.close()
        return courses, 200
    except Exception as e:
        print(f"Error in get_courses_from_embedding: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        return {"error": "Failed to search courses. Please try again."}, 500

def get_recommended_courses_based_on_user_details(user_id):
    """
    Get recommended courses based on user's enrolled courses
    """
    try:
        print(user_id)
        cursor = app.mysql.connection.cursor()

        cursor.execute(COUNT_EMBEDDINGS_QUERY)
        result = cursor.fetchone()
        if not result or result['count'] == 0:
            cursor.close()
            return {"error": "Embeddings are being initialized. Please try again in a moment."}, 503

        cursor.execute("SELECT course_id FROM user_course_progress WHERE user_id = %s", (user_id,))
        enrolled_courses_ids = cursor.fetchall()

        if len(enrolled_courses_ids) < 1:
            cursor.close()
            return {"error": "Enroll in courses to get personalized recommendations"}, 404

        # Get embedding of the courses
        placeholders = []
        course_ids = []

        for course in enrolled_courses_ids:
            placeholders.append("%s")
            course_ids.append(course["course_id"])

        placeholders = ",".join(placeholders)
        cursor.execute(f"SELECT embedding FROM course_embedding WHERE course_id IN ({placeholders})", course_ids)

        embeddings = cursor.fetchall()
        
        if not embeddings:
            cursor.close()
            return {"error": "Unable to generate recommendations at this time"}, 404
        
        np_embeddings = [np.array(json.loads(e["embedding"])) for e in embeddings]
        combined_embeddings = np.mean(np_embeddings, axis=0)

        cursor.close()
        
        data, code = get_courses_from_embedding(embedding=combined_embeddings, ids=course_ids)
        return data, code
    except Exception as e:
        print(f"Error in get_recommended_courses_based_on_user_details: {str(e)}")
        if 'cursor' in locals():
            cursor.close()
        return {"error": "Failed to get recommendations. Please try again."}, 500