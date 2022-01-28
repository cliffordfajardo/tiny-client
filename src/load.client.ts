import {
  SmolClientExportsMissingOnGlobalError,
  SmolClientLoadBundleError,
} from "./errors";
import { LoadSmolFrontendOptions } from "./types";
import { getSmolFrontendModuleConfig } from "./utils/getSmolFrontendModuleConfig";
import { loadUmdBundle } from "./utils/loadUmdBundle";

export const loadSmolFrontendClient = async <T>({
  name,
  contractVersion,
  smolApiEndpoint,
}: LoadSmolFrontendOptions): Promise<T> => {
  const smolFrontendModuleConfig = await getSmolFrontendModuleConfig(
    name,
    contractVersion,
    smolApiEndpoint
  );

  try {
    await loadUmdBundle(
      `${smolApiEndpoint}/smol/bundle/${smolFrontendModuleConfig.umdBundle}`
    );
  } catch (err) {
    console.error(err);
    throw new SmolClientLoadBundleError(name);
  }

  const smolFrontend = (globalThis as unknown as Record<string, T>)[name];
  if (!smolFrontend) {
    throw new SmolClientExportsMissingOnGlobalError(name);
  }

  return smolFrontend;
};
