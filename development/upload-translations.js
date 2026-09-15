import {
  transifexApi,
  ORGANIZATION_NAME,
  PROJECT_NAME,
  RUNTIME_RESOURCE,
  METADATA_RESOURCE,
} from "./transifex-common.js";
import Builder from "./builder.js";

const getResourceId = (resource) =>
  `o:${ORGANIZATION_NAME}:p:${PROJECT_NAME}:r:${resource}`;

const uploadStrings = async (resource, strings) => {
  const upload = () =>
    transifexApi.ResourceStringsAsyncUpload.upload({
      resource: {
        data: {
          id: getResourceId(resource),
          type: "resources",
        },
      },
      content: JSON.stringify(strings),
    });

  try {
    await upload();
  } catch (error) {
    const status =
      error.statusCode ?? error.response?.statusCode ?? error.response?.status;
    if (status !== 404) throw error;

    console.log(`Resource ${resource} does not exist. Creating it...`);
    await transifexApi.Resource.create({
      attributes: {
        slug: resource,
        name: resource,
      },
      relationships: {
        i18n_format: {
          data: {
            id: "STRUCTURED_JSON",
            type: "i18n_formats",
          },
        },
        project: {
          data: {
            id: `o:${ORGANIZATION_NAME}:p:${PROJECT_NAME}`,
            type: "projects",
          },
        },
      },
    });
    await upload();
  }
};

const validateStrings = (resource, strings) => {
  const entries = Object.entries(strings || {});
  if (entries.length === 0) {
    throw new Error(`No strings were generated for ${resource}.`);
  }

  for (const [key, value] of entries) {
    if (
      !value ||
      typeof value.string !== "string" ||
      value.string.length === 0
    ) {
      throw new Error(`Invalid string ${key} in ${resource}.`);
    }
    if (
      value.developer_comment !== undefined &&
      typeof value.developer_comment !== "string"
    ) {
      throw new Error(`Invalid developer comment for ${key} in ${resource}.`);
    }
  }
};

const run = async () => {
  console.log("Building...");
  const builder = new Builder();
  const build = await builder.build();

  console.log("Generating strings...");
  const l10n = build.generateL10N();
  const runtimeStrings = l10n["extension-runtime"];
  const metadataStrings = l10n["extension-metadata"];
  validateStrings(RUNTIME_RESOURCE, runtimeStrings);
  validateStrings(METADATA_RESOURCE, metadataStrings);

  console.log("Uploading runtime strings...");
  await uploadStrings(RUNTIME_RESOURCE, runtimeStrings);

  console.log("Uploading metadata strings...");
  await uploadStrings(METADATA_RESOURCE, metadataStrings);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
