const fs = require("fs");
const path = require("path");
const jsonSchemaToTypescript = require("json-schema-to-typescript");

const localesDir = path.join(__dirname, "src", "app", "i18n", "locales");
const typesDir = path.join(__dirname, "src", "types");

// Ensure the types directory exists
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
}

const generateTypes = async () => {
  try {
    const languages = fs.readdirSync(localesDir);

    for (const lang of languages) {
      const translationFilePath = path.join(
        localesDir,
        lang,
        "translation.json"
      );
      if (!fs.existsSync(translationFilePath)) {
        console.error(`Translation file not found for language: ${lang}`);
        continue;
      }

      const schema = JSON.parse(fs.readFileSync(translationFilePath, "utf8"));

      const types = await jsonSchemaToTypescript.compile(
        schema,
        `${lang}Translation`
      );

      fs.writeFileSync(path.join(typesDir, `${lang}Translation.d.ts`), types);
    }

    console.log("Types generated successfully");
  } catch (error) {
    console.error("Error generating types:", error);
  }
};

generateTypes();
