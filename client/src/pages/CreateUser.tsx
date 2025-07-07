import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  name: z.string().min(1, "* Name is required."),
  email: z.string().email("* Invalid email address."),
});

type UserFormData = z.infer<typeof userSchema>;

export default function CreateUser() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.post("http://localhost:3000/users", data);
      setSuccessMessage("User created successfully!");
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || "API error.");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ padding: "2rem", maxWidth: "400px" }}>
        <h1>Create User</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Name: </label>
            <input {...register("name")} placeholder="Name" />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email: </label>
            <input {...register("email")} placeholder="Email" />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>
        )}
      </div>
    </div>
  );
}
