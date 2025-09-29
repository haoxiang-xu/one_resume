db = db.getSiblingDB("one_resume_db");

db.createCollection("user_auth");
db.createCollection("user_info");
db.createCollection("user_events");

if (!db.getUser("admin_0001")) {
  db.createUser({
    user: "admin_0001",
    pwd: "WNB231_M2B3J1_0AN2KS_2NDI34_9X1MDO_O27CBS_0H6C4J_P4NG7S_PNGH76_0M1FTB_IBRVFD_PZQAS3_H767FV",
    roles: [{ role: "readWrite", db: "one_resume_db" }]
  });
}
