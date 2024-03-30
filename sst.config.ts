import { SSTConfig } from "sst";
import { Bucket, SolidStartSite } from "sst/constructs";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "sst-solid-pile",
      region: "us-east-1",
    };
  },
  stacks(app) {
    const bucket = new Bucket(app, "public");

    const site = new SolidStartSite(app, "site", {
      bind: [bucket],
    });

    app.stack(API);
  },
} satisfies SSTConfig;
