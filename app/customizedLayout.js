"use client";
import { checkAuthStatus } from "@/store/auth/authReducer";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomizedLayout = ({ children }) => {
  const data = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(checkAuthStatus({ router }));
  }, []);

  if (data.authenticationLoading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default CustomizedLayout;
