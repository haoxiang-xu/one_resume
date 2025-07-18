import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 40, // Page margin
    fontFamily: "Helvetica", // Use built-in font
    fontSize: 10, // Base font size for body text
    color: "#000",
  },
  header: {
    marginBottom: 10, // Space after the name header
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  columns: {
    flexDirection: "row",
  },
  leftColumn: {
    width: "35%",
    paddingRight: 15, // Gap between left and right columns
  },
  rightColumn: {
    width: "65%",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  // Contact details styles
  contactText: {
    marginBottom: 4, // Small spacing between contact detail lines
  },
  contactLink: {
    color: "#000",
    textDecoration: "none",
    marginBottom: 4,
  },
  // Education section styles
  educationEntry: {
    marginBottom: 8,
  },
  degree: {
    fontWeight: "bold",
  },
  school: {
    // (inherits base fontSize 10)
  },
  eduDate: {
    // (inherits base fontSize 10)
  },
  // Summary section style
  summaryText: {
    marginBottom: 10,
  },
  // Skills section style
  skillText: {
    marginBottom: 4,
  },
  // Experience section styles
  experienceItem: {
    marginBottom: 12, // Space after each experience entry
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  company: {
    fontWeight: "bold",
  },
  role: {
    // normal weight
  },
  date: {
    // right-aligned date uses normal weight
  },
  // Bullet list styles for experience details
  bulletList: {
    marginTop: 2,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  bulletSymbol: {
    fontWeight: "bold",
    width: 10, // Fixed width for bullet symbol to indent text
  },
  bulletContent: {
    flex: 1, // Allow bullet text to wrap within remaining width
  },
  experienceHeaderContent: {
    flex: 1,
  },
});

// Resume component definition
const Resume = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Name header */}
      <View style={styles.header}>
        <Text style={styles.name}>HAOXIANG XU</Text>
      </View>
      {/* Two-column layout */}
      <View style={styles.columns}>
        {/* Left Column: Details and Education */}
        <View style={styles.leftColumn}>
          {/* Contact Details (Details section) */}
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.contactText}>604-724-7048</Text>
          <Link
            style={styles.contactLink}
            src="mailto:haoxiangxu1998@gmail.com"
          >
            <Text>haoxiangxu1998@gmail.com</Text>
          </Link>
          <Link style={styles.contactLink} src="https://github.com/haoxiang-xu">
            <Text>github.com/haoxiang-xu</Text>
          </Link>
          <Link
            style={styles.contactLink}
            src="https://www.linkedin.com/in/haoxiang-xu-580b15277"
          >
            <Text>linkedin.com/in/haoxiang-xu-580b15277</Text>
          </Link>

          {/* Education Section */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
            Education
          </Text>
          {/* Master's Degree */}
          <View style={styles.educationEntry}>
            <Text style={styles.degree}>Master of Data Science</Text>
            <Text style={styles.school}>University of British Columbia</Text>
            <Text style={styles.eduDate}>Sep 2024 - Jun 2025</Text>
          </View>
          {/* Bachelor's Degree */}
          <View style={styles.educationEntry}>
            <Text style={styles.degree}>Bachelor of Applied Science:</Text>
            <Text style={styles.degree}>Computer Science</Text>
            <Text style={styles.school}>University of British Columbia</Text>
            <Text style={styles.eduDate}>Sep 2020 - Nov 2023</Text>
            <Text style={styles.eduDate}>GPA 3.96/4.33</Text>
          </View>
        </View>
        {/* Right Column: Summary, Skills, and Experience */}
        <View style={styles.rightColumn}>
          {/* Summary Section */}
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            Aspiring Data Scientist, Machine Learning Engineer with a strong
            software engineering background. Passionate about building
            data-driven solutions, optimizing AI models, and deploying scalable
            ML systems to drive real-world impact.
          </Text>

          {/* Skills Section */}
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skillText}>
            Data Analysis & Visualization: SQL, Python, R, Power BI/Tableau
          </Text>
          <Text style={styles.skillText}>
            Machine Learning: Torch, TensorFlow, Huggingface, scikit-learn
          </Text>
          <Text style={styles.skillText}>
            MLOps & Workflow Automation: Airflow, Dagster, MLflow, Kubeflow
          </Text>
          <Text style={styles.skillText}>
            Cloud Services: AWS, Azure, Google Cloud, Docker
          </Text>

          {/* Experience Section */}
          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>
            Experience
          </Text>

          {/* Experience 1 */}
          <View style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              {/* Company and Role (left) */}
              <View style={styles.experienceHeaderContent}>
                <Text>
                  <Text style={styles.company}>
                    Shanghai Mengou Technology Co., Ltd
                  </Text>
                  <Text style={styles.role}>
                    {" | Machine Learning Engineer (Startup Environment)"}
                  </Text>
                </Text>
              </View>
              {/* Date (right) */}
              <Text style={styles.date}>Mar 2024 – Aug 2024</Text>
            </View>
            {/* Bullet points for Experience 1 */}
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletContent}>
                  Fine-tuned and deployed LLMs for NLP-based customer service
                  solutions in retail.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletContent}>
                  Implemented RESTful APIs for model inference, integrating
                  directly with client applications.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletContent}>
                  Worked with large-scale structured and unstructured data,
                  performing feature engineering and embeddings to enhance NLP
                  model understanding.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletContent}>
                  Built a risk mitigation pipeline to detect and reduce
                  AI-generated errors.
                </Text>
              </View>
            </View>
          </View>

          {/* Experience 2 */}
          <View style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <View style={styles.experienceHeaderContent}>
                <Text>
                  <Text style={styles.company}>UBC Capstone Project</Text>
                  <Text style={styles.role}>{" | Backend Developer"}</Text>
                </Text>
              </View>
              <Text style={styles.date}>Apr 2023 – Sep 2023</Text>
            </View>
            {/* Bullet points for Experience 2 */}
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletContent}>
                  Designed and developed a SQL database with 20+ relational
                  tables on AWS, ensuring efficient data storage and retrieval
                  for a university assignment management system.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletContent}>
                  Deployed a RESTful API using Express.js (Node.js) with an MVC
                  architecture, handling authentication, file uploads, grading
                  workflows, and assignment submissions.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletContent}>
                  Led backend infrastructure deployment, containerizing the
                  entire system with Docker for streamlined delivery.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default function DownloadButton() {
  return (
    <PDFDownloadLink
      document={<Resume />}
      fileName="haoxiang_xu_resume.pdf"
      style={{
        padding: "8px 16px",
        background: "#1976d2",
        color: "#fff",
        borderRadius: 4,
        textDecoration: "none",
        fontFamily: "Helvetica",
      }}
    >
      {({ loading, error }) =>
        loading ? "Generating…" : error ? "Error" : "Download PDF"
      }
    </PDFDownloadLink>
  );
}
