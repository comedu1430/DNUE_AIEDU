import { loadEnvFile, normalizeNotionId, notionRequest, requireEnv } from "./notion-utils.mjs";

loadEnvFile();

const token = requireEnv("NOTION_TOKEN");
const parentPageId = normalizeNotionId(requireEnv("NOTION_PARENT_PAGE_ID"));

const titleRichText = (text) => [{ type: "text", text: { content: text } }];
const textProperty = () => ({ rich_text: {} });
const numberProperty = () => ({ number: {} });
const checkboxProperty = () => ({ checkbox: {} });
const urlProperty = () => ({ url: {} });
const emailProperty = () => ({ email: {} });
const selectProperty = (options) => ({ select: { options: options.map((name) => ({ name })) } });

async function createCmsPage() {
  return notionRequest("/pages", {
    method: "POST",
    token,
    body: {
      parent: { page_id: parentPageId },
      properties: {
        title: {
          title: titleRichText("DNUE AI Education Website CMS"),
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: titleRichText("Edit PhD student CVs and publications here. Run the GitHub workflow after editing to update the website."),
          },
        },
      ],
    },
  });
}

async function createStudentsDatabase(parentPageId) {
  return notionRequest("/databases", {
    method: "POST",
    token,
    body: {
      parent: { page_id: parentPageId },
      title: titleRichText("PhD Students CV"),
      properties: {
        Name: { title: {} },
        "Korean Name": textProperty(),
        Cohort: numberProperty(),
        Email: emailProperty(),
        "Lab EN": textProperty(),
        "Lab KO": textProperty(),
        Advisor: textProperty(),
        "Research Keywords EN": textProperty(),
        "Research Keywords KO": textProperty(),
        "Education EN": textProperty(),
        "Education KO": textProperty(),
        "Research Interests EN": textProperty(),
        "Research Interests KO": textProperty(),
        "Academic Activities EN": textProperty(),
        "Academic Activities KO": textProperty(),
        "Presented Papers EN": textProperty(),
        "Presented Papers KO": textProperty(),
        "CV Slug": textProperty(),
        Visible: checkboxProperty(),
        Order: numberProperty(),
      },
    },
  });
}

async function createPublicationsDatabase(parentPageId) {
  return notionRequest("/databases", {
    method: "POST",
    token,
    body: {
      parent: { page_id: parentPageId },
      title: titleRichText("Publications"),
      properties: {
        "Title EN": { title: {} },
        "Title KO": textProperty(),
        Year: numberProperty(),
        Type: selectProperty(["Korean Journal", "International Journal", "Korean Conference", "International Conference", "Prize"]),
        "Authors EN": textProperty(),
        "Authors KO": textProperty(),
        "Venue EN": textProperty(),
        "Venue KO": textProperty(),
        DOI: textProperty(),
        URL: urlProperty(),
        Visible: checkboxProperty(),
        Order: numberProperty(),
      },
    },
  });
}

try {
  const cmsPage = await createCmsPage();
  const studentsDb = await createStudentsDatabase(cmsPage.id);
  const publicationsDb = await createPublicationsDatabase(cmsPage.id);

  console.log("Notion CMS page created:");
  console.log(cmsPage.url);
  console.log("");
  console.log("Add these values to your .env and GitHub Secrets:");
  console.log(`NOTION_STUDENTS_DATABASE_ID=${studentsDb.id}`);
  console.log(`NOTION_PUBLICATIONS_DATABASE_ID=${publicationsDb.id}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
