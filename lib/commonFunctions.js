import moment from "moment";
import { panelRoles } from "./data/commonData";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

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

export const uploadFile = async ({ file, path }) => {
  return new Promise((resolve, reject) => {
    try {
      // Reference to Firebase storage
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      console.log("Uploading file...");

      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log("Progress:", progress);
        },
        (error) => {
          // Handle upload errors
          reject({ success: false, error: error.message });
        },
        async () => {
          try {
            // Get the download URL after upload completes
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at:", downloadURL);
            resolve({ success: true, downloadURL });
          } catch (error) {
            reject({ success: false, error: error.message });
          }
        }
      );
    } catch (error) {
      // General error handling
      reject({ success: false, error: error.message });
    }
  });
};
