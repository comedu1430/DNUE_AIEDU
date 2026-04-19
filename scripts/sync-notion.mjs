import { loadEnvFile, normalizeNotionId, queryAllDatabase, readCheckbox, readNumber, readText, splitList, writeJson } from "./notion-utils.mjs";

loadEnvFile();

const studentsDatabaseId = process.env.NOTION_STUDENTS_DATABASE_ID
  ? normalizeNotionId(process.env.NOTION_STUDENTS_DATABASE_ID)
  : "";
const publicationsDatabaseId = process.env.NOTION_PUBLICATIONS_DATABASE_ID
  ? normalizeNotionId(process.env.NOTION_PUBLICATIONS_DATABASE_ID)
  : "";

if (!process.env.NOTION_TOKEN || !studentsDatabaseId || !publicationsDatabaseId) {
  console.log("Notion sync skipped: NOTION_TOKEN, NOTION_STUDENTS_DATABASE_ID, or NOTION_PUBLICATIONS_DATABASE_ID is missing.");
  process.exit(0);
}

const byOrderThenName = (a, b) => (a.order ?? 9999) - (b.order ?? 9999) || String(a.name || a.title || "").localeCompare(String(b.name || b.title || ""));

function normalizeStudent(page) {
  const name = readText(page, "Name");
  const cohort = readNumber(page, "Cohort", new Date().getFullYear());

  return {
    name,
    koName: readText(page, "Korean Name"),
    year: String(cohort),
    lab: readText(page, "Lab EN"),
    koLab: readText(page, "Lab KO"),
    advisor: readText(page, "Advisor"),
    email: readText(page, "Email"),
    keywords: splitList(readText(page, "Research Keywords EN")),
    koKeywords: splitList(readText(page, "Research Keywords KO")),
    education: splitList(readText(page, "Education EN")),
    koEducation: splitList(readText(page, "Education KO")),
    researchInterests: splitList(readText(page, "Research Interests EN")),
    koResearchInterests: splitList(readText(page, "Research Interests KO")),
    activities: splitList(readText(page, "Academic Activities EN")),
    koActivities: splitList(readText(page, "Academic Activities KO")),
    presentedPapers: splitList(readText(page, "Presented Papers EN")),
    koPresentedPapers: splitList(readText(page, "Presented Papers KO")),
    slug: readText(page, "CV Slug"),
    order: readNumber(page, "Order", 9999),
    visible: readCheckbox(page, "Visible", true),
  };
}

function normalizePublication(page) {
  const title = readText(page, "Title EN");

  return {
    year: String(readNumber(page, "Year", new Date().getFullYear())),
    type: readText(page, "Type") || "Korean Journal",
    title,
    koTitle: readText(page, "Title KO"),
    authors: readText(page, "Authors EN"),
    koAuthors: readText(page, "Authors KO"),
    venue: readText(page, "Venue EN"),
    koVenue: readText(page, "Venue KO"),
    doi: readText(page, "DOI"),
    url: readText(page, "URL"),
    order: readNumber(page, "Order", 9999),
    visible: readCheckbox(page, "Visible", true),
  };
}

try {
  const [studentPages, publicationPages] = await Promise.all([
    queryAllDatabase(studentsDatabaseId),
    queryAllDatabase(publicationsDatabaseId),
  ]);

  const students = studentPages
    .map(normalizeStudent)
    .filter((student) => student.visible && student.name)
    .sort(byOrderThenName);

  const publications = publicationPages
    .map(normalizePublication)
    .filter((publication) => publication.visible && publication.title)
    .sort((a, b) => Number(b.year) - Number(a.year) || byOrderThenName(a, b));

  writeJson("src/data/notionStudents.json", students);
  writeJson("src/data/notionPublications.json", publications);

  console.log(`Synced ${students.length} PhD students and ${publications.length} publications from Notion.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
