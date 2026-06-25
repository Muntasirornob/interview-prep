# HTML Resume Generator — Canadian ATS Resume (v3)

## Purpose

Generate a professional Canadian-style resume in HTML from a RewrittenResume JSON payload.

The output must look like a modern software engineering resume used in Canada for:

* Software Engineer
* Backend Engineer
* Full Stack Developer
* Cloud Engineer
* DevOps Engineer
* AI/ML Engineer
* Data Engineer

The design must prioritize:

* ATS compatibility
* Recruiter readability
* Professional appearance
* One-page optimization
* Clear hierarchy
* Print friendliness

---

## CRITICAL RULES

1. Return a complete HTML document beginning with `<!DOCTYPE html>` and ending with `</html>`.

2. Generate all CSS directly inside a `<style>` block.

3. Do not use Tailwind, Bootstrap, Material UI, external frameworks, SVG icons, images, charts, skill bars, progress indicators, or decorative graphics.

4. Do not use tables for layout.

5. Do not use a sidebar.

6. Use a single-column layout.

7. Optimize for one-page resumes whenever possible.

8. Use only professional typography.

9. Use Inter font from Google Fonts.

10. Use a white background.

11. Use subtle borders only.

12. Keep spacing compact and recruiter-friendly.

13. ATS readability is more important than visual creativity.

14. Never include:

    * photo
    * age
    * date of birth
    * marital status
    * religion
    * nationality
    * gender
    * references

15. Use semantic HTML:

    * header
    * section
    * article
    * ul
    * li

16. Never create empty sections.

17. Render only sections containing data.

18. Preserve all factual information from the JSON.

19. Never invent experience, dates, education, certifications, projects, or skills.

20. Rewrite bullet points into strong achievement-focused statements whenever possible.

---

## DESIGN SYSTEM

Use the following visual style:

### Typography

Font:
Inter, sans-serif

Name:

* 32px
* 800 weight

Section headings:

* 14px
* uppercase
* 700 weight
* letter spacing

Body text:

* 14px

Bullet text:

* 13–14px

---

### Colors

Background:
#FFFFFF

Text:
#111827

Secondary Text:
#4B5563

Accent:
#2563EB

Border:
#E5E7EB

---

### Page Container

Max width:
850px

Centered

White background

Padding:
24px

---

### Header Layout

Top section should contain:

Candidate Name

Professional Title

Contact Information

Example:

John Smith
Backend Software Engineer

Calgary, AB | [john@email.com](mailto:john@email.com) | 403-xxx-xxxx
linkedin.com/in/johnsmith | github.com/johnsmith

Contact links must be clickable.

Use horizontal layout when possible.

---

## SECTION ORDER

Always use this order:

1. Professional Summary
2. Technical Skills
3. Professional Experience
4. Projects
5. Education
6. Certifications

---

## PROFESSIONAL SUMMARY

Create a concise Canadian-style summary.

Requirements:

* 3–5 lines
* ATS optimized
* No first-person language
* Focus on experience, technologies, achievements, and specialization

Example style:

Backend Software Engineer with 3+ years of experience building scalable web applications using Python, Django, AWS, and cloud-native technologies. Experienced in API development, database optimization, CI/CD automation, and distributed systems. Proven ability to improve system performance, reliability, and developer productivity through scalable engineering solutions.

---

## TECHNICAL SKILLS

Display as grouped categories.

Categories:

Languages

Frameworks & Libraries

Databases

Cloud & DevOps

AI & Machine Learning

Tools & Platforms

Format:

Languages
Python • JavaScript • TypeScript

Frameworks & Libraries
Django • FastAPI • React • Node.js

Do NOT use pills, tags, badges, or progress bars.

---

## PROFESSIONAL EXPERIENCE

For each role:

Display:

Job Title
Company Name | Location
Date Range

Then achievement bullets.

Bullet requirements:

* Start with strong action verbs
* Emphasize measurable impact
* Focus on achievements
* Avoid "Responsible for"
* Avoid "Worked on"

Example:

• Developed scalable REST APIs supporting over 5 million users nationwide.

• Reduced database response times by 40% through query optimization and indexing strategies.

• Automated deployment pipelines using GitHub Actions and Docker, reducing release effort by 60%.

---

## PROJECTS

Show only if projects exist.

For each project:

Project Name

Technology Stack

Achievement bullets

Include GitHub links when available.

Focus on:

* scalability
* cloud
* AI
* automation
* business value
* performance improvements

---

## EDUCATION

Display:

Degree

Institution

Date Range

Example:

Master of Engineering (Electrical and Computer Engineering)

University of Calgary

2023 – 2025

---

## CERTIFICATIONS

Display only if present.

Example:

AWS Certified Cloud Practitioner
Amazon Web Services

Microsoft Azure Fundamentals
Microsoft

---

## PRINT OPTIMIZATION

Include:

@media print

Requirements:

* white background
* no shadows
* preserve colors
* avoid page breaks inside experience entries
* maintain ATS readability

---

## OUTPUT REQUIREMENT

Return only a complete HTML document.

No markdown.

No explanations.

No code fences.

No additional text.

Only the final HTML.
