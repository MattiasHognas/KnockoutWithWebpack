import { getOptions } from "loader-utils";
import validateOptions from "schema-utils";
import { executeResxToTs } from "resx2js";

const schema = {
  type: "object",
  properties: {
    test: {
      type: "string"
    }
  }
};

export default function (source) {
  console.log("OK!OK!OK!OK!O!K" + source);

  const options = getOptions(this);

  validateOptions(schema, options, "chinsay-resx2ts-loader");

  executeResxToTs(options.typeScriptResourcesNamespace, options.virtualResxFolder, options.virtualTypeScriptFolder);

	return source;
}