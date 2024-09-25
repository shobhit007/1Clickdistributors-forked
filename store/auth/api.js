export const validateToken = async (token) => {
  try {
    let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/validateToken`;
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
