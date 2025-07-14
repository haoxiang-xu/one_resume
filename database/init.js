db = db.getSiblingDB("one_resume_db");

db.createCollection("user_auth");
db.createCollection("user_info");
db.createCollection("user_events");
