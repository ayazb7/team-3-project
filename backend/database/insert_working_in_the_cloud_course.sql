-- =============================================================
-- SKYWISE DATABASE - WORKING IN THE CLOUD COURSE
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSE DETAILS - WORKING IN THE CLOUD
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
  5,
  'Working in the Cloud',
  'Master cloud tools like Google Drive and OneDrive to organize, share, and collaborate easily.',
  'Advanced',
  50,
  75,
  'This course helps you understand and use cloud-based tools to save, organize, and share your files securely. You’ll explore how to collaborate with others in real time and keep your documents backed up online.',
  '[
    "Save and organize files using Google Drive or OneDrive",
    "Share documents safely and control access permissions",
    "Collaborate with others in real time",
    "Keep your files secure and backed up"
  ]',
  'https://blacfox.com/wp-content/uploads/2020/05/Cloud.jpg'
);

-- =============================================================
--  COURSE PREREQUISITES
-- =============================================================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id)
VALUES (5, 1);

-- =============================================================
--  COURSE REQUIREMENTS
-- =============================================================
INSERT INTO course_requirements (id, course_id, requirement_text)
VALUES
(10, 5, 'A Google or Microsoft account');

-- =============================================================
--  TUTORIAL 1: GOOGLE DRIVE BASICS
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  8,
  'How to Use Google Drive - Tutorial for Beginners',
  'Learn how to get started with Google Drive: create folders, upload files, organize your documents, and share safely with others. This tutorial also covers real-time collaboration in Docs, managing access permissions, and tips for keeping your files backed up and easy to find across devices.',
  'youtube',
  'https://www.youtube.com/embed/gdrxAoqfvbA?si=PGc0TG08MsFTACqO',
  'Cloud Tools'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (5, 8);

-- =============================================================
--  TUTORIAL 2: MICROSOFT ONEDRIVE BASICS
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  9,
  'Microsoft OneDrive Tutorial: All You Need to Know',
  'Get an overview of OneDrive for storing, organizing, and sharing your files in the cloud. Learn how to sync files to your computer, manage version history, set sharing permissions, and collaborate with Office apps like Word, Excel, and PowerPoint.',
  'youtube',
  'https://www.youtube.com/embed/prA75mu3arc?si=tWCC6CNSr4VCvoSy',
  'Cloud Tools'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (5, 9);
