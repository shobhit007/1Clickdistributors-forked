import { formatUnderScoreString } from "@/lib/commonFunctions";
import { panelPermissions } from "@/lib/data/commonData";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EdituserPermissions = ({ refetchUsers, close, currentUser }) => {
  const [permissionsType, setPermissionsType] = useState(null);
  const [userPermissions, setuserPermissions] = useState({});
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setuserPermissions(currentUser?.userPermissions || {});
      setPermissionsType(currentUser?.permissionsType || null);
    } else {
      setuserPermissions({});
    }
  }, [currentUser]);

  const handleChangePermissions = (e) => {
    try {
      const permission = e.target.value;
      const panel = e.target.name;
      const checked = e.target.checked;

      if (checked) {
        setuserPermissions((pre) => ({
          ...pre,
          [panel]: pre?.[panel] ? [...pre?.[panel], permission] : [permission],
        }));
      } else {
        setuserPermissions((pre) => ({
          ...pre,
          [panel]: pre?.[panel]?.filter(
            (prePermission) => prePermission != permission
          ),
        }));
      }
    } catch (error) {}
  };

  const updateUserPermissions = async () => {
    try {
      let body = { permissionsType, email: currentUser.email };

      if (permissionsType == "limited_permissions") {
        body.userPermissions = userPermissions;
      } else {
        body.userPermissions = {};
      }

      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUser`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        toast.success(data.message);
        refetchUsers();
        close();
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong..");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-auto flex flex-col justify-between">
      <div className="w-full h-[90%] overflow-auto flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap items-end">
          <span className="text-slate-600 font-semibold text-xl">
            Permissions type:
          </span>
          <div className="flex gap-4">
            {["limited_permissions", "all_permissions"]?.map((type) => (
              <div className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  checked={permissionsType == type}
                  onChange={(e) => {
                    e.target.checked && setPermissionsType(type);
                  }}
                />
                <span className="text-gray-500 capitalize">
                  {formatUnderScoreString(type)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {permissionsType == "limited_permissions" && (
          <div className="flex flex-col mt-2 w-full gap-4">
            {panelPermissions?.map((item, index) => {
              return (
                <div className="flex flex-col w-full">
                  <p className="text-gray-500 font-semibold capitalize text-lg">
                    {index + 1}. {formatUnderScoreString(item?.panelName)}
                  </p>
                  <div className="flex w-full gap-3 flex-wrap">
                    {item?.permissions?.map((permission) => (
                      <div className="flex gap-1 items-center">
                        <input
                          type="checkbox"
                          checked={userPermissions?.[item.panelName]?.includes(
                            permission
                          )}
                          name={item.panelName}
                          value={permission}
                          onChange={handleChangePermissions}
                        />
                        <span className="text-gray-500 capitalize">
                          {formatUnderScoreString(permission)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-full h-[10%] flex items-end">
        <button
          onClick={updateUserPermissions}
          disabled={loading}
          className={`bg-colorPrimary w-full rounded-md py-1 text-white disabled:bg-colorPrimary/40 ${
            loading ? "animate-pulse" : ""
          }`}
        >
          Update Permissions
        </button>
      </div>
    </div>
  );
};

export default EdituserPermissions;
