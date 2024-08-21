import React, { useState } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/Loading";
import { ChatData } from "../context/ChatContext";

const Verify = () => {
  const [otp, setOtp] = useState("");

  const { verifyUser, btnLoading } = UserData();
  const { fetchChats } = ChatData();
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    // console.log(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    verifyUser(Number(otp), navigate, fetchChats);
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white p-6 rounded shadow-md w-full md:w-[500px]"
        onSubmit={submitHandler}
      >
        <h2 className="text-2xl mb-4">Verify</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="otp">
            Otp:
          </label>
          <input
            type="number"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            className="border p-2 w-full rounded outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="text-center">
          <button className="bg-black text-white rounded px-4 py-2 hover:bg-gray mt-4">
            {btnLoading ? <LoadingSpinner /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Verify;
