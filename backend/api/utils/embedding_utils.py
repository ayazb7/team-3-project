import json
import MySQLdb.cursors
from utils.courses_routes_utils import get_public_courses
from openai import OpenAI
import app



client = OpenAI()

def embed_courses():
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    courses = get_public_courses()
    course_names_and_descriptions = [course["name"] + " " + course["description"] for course in courses]
    response = client.embeddings.create(
            model="text-embedding-3-small",
            input=course_names_and_descriptions
            )

    embeddings = [data.embedding for data in response.data]

    prepared_records = []
    for i in range(len(courses)):
        prepared_records.append((courses[i]["id"], course_names_and_descriptions[i], json.dumps(embeddings[i])))

    cursor.execute("TRUNCATE TABLE course_embedding")
    cursor.executemany("INSERT INTO course_embedding (course_id, embed_text, embedding) values (%s, %s, %s)", prepared_records)

    app.mysql.connection.commit()


    
    


    

def embed_course(course: str):
    pass


def get_embedding(text: str):
    pass

def get_course_from_embedding(text: str):
    pass