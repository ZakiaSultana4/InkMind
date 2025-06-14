"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type UserData = {
  username: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
   const [error, setError] = useState<null | string>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session to load

    if (session) {
      router.push("/"); // redirect logged-in user to home
    }
  }, [session, status, router]);

  const {
    register,
    handleSubmit,
  } = useForm<UserData>();

  const onSubmit = async (data: UserData) => {
      setError(null);
    console.log(data);

    try {
            const response = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response?.status === 201) {
                const result = await response.json();
                console.log("User registered successfully:", result);
                // Redirect to login or home page after successful registration
                router.push("/login");
            }

            if (response?.status === 409) {
                setError("User already exists");
            }
        }  catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        throw new Error(err.message);
      } else {
        console.log("An unexpected error occurred during registration.", error);
      }
    }
  };

  // If session is loading or user is logged in, you can show a loader or empty fragment
  if (status === "loading" || session) {
    return null; // or a spinner/loading component
  }

  return (
    <div className="my-10">
      <h1 className="text-center text-4xl font-bold mb-5">
        Register <span className="text-teal-500">Now</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <Image
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-135.jpg?t=st=1710081713~exp=1710085313~hmac=f637c194f1f143e63a84950cbf978997453777c872adf4aebbbecdaa445601a1&w=740"
            width={500}
            height={200}
            alt="login page"
            className="w-full h-[85%] object-cover"
          />
        </div>

        <div className="w-[80%] mx-auto bg-white p-6 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="User Name"
                className="w-full p-3 border border-gray-300 rounded "
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded "
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded "
                required
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="w-full border border-teal-500 text-teal-500 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-teal-500 hover:text-black"
              >
                Register
              </button>
            </div>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link className="text-teal-500 hover:underline" href="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
