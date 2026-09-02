import streamlit as st
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Page Configuration
st.set_page_config(
    page_title="AI Resume Screening System",
    page_icon="💼",
    layout="wide"
)

# Dark Theme
st.markdown("""
<style>
.stApp {
    background: linear-gradient(to right, #141E30, #243B55);
}

h1, h2, h3, p, label {
    color: white !important;
}
</style>
""", unsafe_allow_html=True)

# Sidebar
st.sidebar.title("📊 Dashboard")
st.sidebar.info("""
AI Resume Screening System

✔ PDF Resume Upload
✔ Match Score
✔ Skill Gap Analysis
✔ Recommendations
✔ Resume Summary
""")

# Title
st.markdown(
    "<h1 style='text-align:center;'>💼 AI-Powered Resume Screening System</h1>",
    unsafe_allow_html=True
)

st.write("Compare resume skills with job requirements using AI")

# Candidate Details
name = st.text_input("👤 Candidate Name")

role = st.selectbox(
    "🎯 Select Target Role",
    ["AI Engineer", "Data Analyst", "Java Developer", "Web Developer"]
)

# PDF Upload
uploaded_file = st.file_uploader(
    "📄 Upload Resume (PDF)",
    type=["pdf"]
)

resume = ""

if uploaded_file is not None:
    pdf_reader = PyPDF2.PdfReader(uploaded_file)

    for page in pdf_reader.pages:
        text = page.extract_text()
        if text:
            resume += text + " "

    st.subheader("📄 Resume Text Extracted")
    st.text_area("Extracted Resume", resume[:1000], height=200)

else:
    resume = st.text_area("📄 Enter Resume Skills")

job = st.text_area("📌 Enter Job Skills")

# Analyze Button
if st.button("🔍 Analyze Resume"):

    if resume and job:

        resume_words = set(resume.lower().split())
        job_words = set(job.lower().split())

        matched = resume_words.intersection(job_words)
        missing = job_words - resume_words

        vectorizer = TfidfVectorizer()
        matrix = vectorizer.fit_transform([resume, job])

        score = cosine_similarity(matrix[0], matrix[1])

        percentage = round(score[0][0] * 100, 2)

        # Report Card
        st.subheader("📄 Candidate Report Card")
        st.write("👤 Candidate Name:", name)
        st.write("🎯 Target Role:", role)
        st.write("📊 Match Score:", f"{percentage}%")

        # Score
        st.success(f"🎯 Match Score: {percentage}%")
        st.progress(int(percentage))

        # Status
        if percentage >= 80:
            st.success("🏆 Status: Highly Recommended")
        elif percentage >= 60:
            st.warning("👍 Status: Recommended")
        else:
            st.error("📚 Status: Needs Improvement")

        # Statistics
        st.subheader("📈 Analysis Statistics")

        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric("Match Score", f"{percentage}%")

        with col2:
            st.metric("Matched Skills", len(matched))

        with col3:
            st.metric("Missing Skills", len(missing))

        # Skills
        st.subheader("✅ Matched Skills")
        st.write(list(matched))

        st.subheader("❌ Missing Skills")
        st.write(list(missing))

        # Recommendations
        if missing:
            st.subheader("📚 Recommended Skills to Learn")

            for skill in missing:
                st.write(f"👉 Learn: {skill}")

        # Summary
        st.subheader("📋 Resume Analysis Summary")

        if percentage >= 75:
            st.write(
                f"{name}, your resume is a strong match for the selected role ({role})."
            )
            st.balloons()

        elif percentage >= 50:
            st.write(
                f"{name}, your resume is a moderate match. Improve the missing skills for the role ({role})."
            )

        else:
            st.write(
                f"{name}, your resume needs significant improvement for the role ({role})."
            )

    else:
        st.warning("⚠ Please enter Resume and Job Skills")

# Footer
st.markdown("---")
st.markdown(
    "<center><b>🚀 Developed by Prabavathi</b></center>",
    unsafe_allow_html=True
)