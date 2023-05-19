const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const moment = require("moment");

module.exports = {
  writerOpts: {
    finalizeContext: (context) => {
      let date = new Date();
      if (context.hash) {
        const result = execSync(
          "git show -s --format=%ci " + context.hash
        ).toString();

        date = new Date(result).toString();
      }
      context.date = moment(date).format("ddd, DD MMM YYYY HH:mm:ss ZZ");

      if (context.version === "0.0.0-development") {
        context.version = readFileSync(".VERSION", "utf-8").trim();
      }
      return context;
    },
    mainTemplate: `{{> header}}


{{#each commitGroups}}
{{#each commits}}
{{> commit root=@root}}
{{/each}}
{{/each}}

{{> footer}}

`,
    headerPartial: `tsp-web ({{version}}) xenial; urgency=medium`,
    commitPartial: `  * {{header}}
`,
    footerPartial: `-- {{packageData.author.name}} <{{packageData.author.email}}>  {{date}}
`,
  },
};
