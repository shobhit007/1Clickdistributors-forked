import moment from "moment";
import { panelRoles } from "./data/commonData";

export const formatUnderScoreString = (string) => {
  if (!string) return null;

  return string?.split("_")?.join(" ");
};

export const convertTimeStamp = (time) => {
  if (!time?._seconds) {
    return null;
  }

  let dt = new Date(time._seconds * 1000);

  return moment(dt).format("DD-MM-YYYY hh:mm A");
};

// return subordinate and senior designations
export const compareDesignations = (dept, designation) => {
  let findDept = panelRoles.find((item) => item.department == dept);

  if (findDept) {
    let allRoles = findDept.hierarchy;

    let desgIndex = allRoles.findIndex((item) => item == designation);

    if (desgIndex != -1) {
      const superior = allRoles.slice(0, desgIndex);
      const subordinate = allRoles.slice(desgIndex + 1);
      return { superior, subordinate };
    } else {
      return { superior: [], subordinate: [] };
    }
  } else {
    return { superior: [], subordinate: [] };
  }
};


